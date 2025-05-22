import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useNavigation, useActionData, Form, useLoaderData } from "@remix-run/react";
import { json, unstable_parseMultipartFormData, unstable_createMemoryUploadHandler } from "@remix-run/node";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useUserRole } from "~/hooks/useUserRole";
import { cn } from "~/lib/utils";
import { useStore } from "~/store/store";
import type { MarketplaceItem, PurchaseRecord, PurchaseRecordWithBuyerDetails } from "~/types/market";
import { ProductGrid } from "~/components/market/ProductGrid";
import { SearchBar } from "~/components/market/SearchBar";
import { FilterSortPanel } from "~/components/market/FilterSortPanel";
import { ProductDetailModal } from "~/components/market/ProductDetailModal";
import { InventoryTable } from "~/components/market/setup/InventoryTable";
import { AddProductForm } from "~/components/market/setup/AddProductForm";
import { EditProductModal } from "~/components/market/setup/EditProductModal";
import { DeleteConfirmationModal } from "~/components/market/setup/DeleteConfirmationModal";
import { SalesLogTable } from "~/components/market/SalesLogTable";
import { supabase } from "~/lib/supabase"; // Regular client for most operations
import supabaseAdmin from "~/lib/supabase-admin"; // Admin client

const MARKET_IMAGES_BUCKET = 'product-images';
const DEFAULT_PLACEHOLDER_IMAGE_URL = "https://zkpgphfdmdzmmsneuzal.supabase.co/storage/v1/object/public/product-images/placeholder.png";

function mapDbItemToMarketplaceItem(dbItem: any): MarketplaceItem {
  if (!dbItem) return dbItem;
  const { image_url, ...rest } = dbItem;
  return {
    ...rest,
    imageUrl: image_url,
  };
}

function mapDbPurchaseRecordToApp(dbRecord: any): PurchaseRecordWithBuyerDetails | null {
  if (!dbRecord) return null;

  let mappedProfiles: { fullName: string } | null = null;
  // Check if profiles exists and has full_name directly (single object)
  if (dbRecord.profiles && typeof dbRecord.profiles === 'object' && 'full_name' in dbRecord.profiles && !Array.isArray(dbRecord.profiles)) {
    mappedProfiles = { fullName: dbRecord.profiles.full_name };
  } 
  // Check if profiles is an array and the first element has full_name (array of objects)
  else if (Array.isArray(dbRecord.profiles) && dbRecord.profiles.length > 0 && dbRecord.profiles[0] && typeof dbRecord.profiles[0] === 'object' && 'full_name' in dbRecord.profiles[0]) {
    mappedProfiles = { fullName: dbRecord.profiles[0].full_name };
  }
  // If profiles is explicitly null or not in the expected shape, mappedProfiles remains null.

  const {
    item_id,
    item_name_snapshot,
    purchase_date,
    user_id,
    delivery_date,
    total_price, 
    price_per_item_snapshot, 
    quantity,
    profiles, 
    ...rest
  } = dbRecord;

  return {
    ...rest, 
    itemId: item_id,
    itemName: item_name_snapshot,
    price: total_price, 
    pricePerItemSnapshot: price_per_item_snapshot, 
    quantity: quantity,
    purchaseDate: purchase_date,
    userId: user_id,
    deliveryDate: delivery_date,
    profiles: mappedProfiles, 
  };
}


// --- Loader Function ---
export async function loader({ request }: LoaderFunctionArgs) {
  console.log("[Loader - market] Fetching market data...");

  // Fetch marketplace items using regular supabase client (RLS applies if any)
  const { data: marketplaceDbItems, error: itemsError } = await supabase
    .from('marketplace_items')
    .select('*')
    .order('name', { ascending: true });

  if (itemsError) {
    console.error("[Loader - market] Error fetching marketplace items:", itemsError);
  }

  const marketplaceAppItems: MarketplaceItem[] = marketplaceDbItems
    ? marketplaceDbItems.map(mapDbItemToMarketplaceItem)
    : [];

  // Fetch purchase records using supabaseAdmin to bypass RLS for this test
  console.log("[Loader - market] Attempting to fetch purchase records using supabaseAdmin (bypassing RLS)...");
  const { data: purchaseRecordsDb, error: purchasesError } = await supabaseAdmin // USE ADMIN CLIENT
    .from('purchase_records')
    .select(`*`) // Still using simplified query for now
    // .select(`
    //   *,
    //   profiles ( 
    //     full_name
    //   )
    // `)
    .order('purchase_date', { ascending: false });

  if (purchasesError) {
    console.error("[Loader - market] Error fetching purchase records with supabaseAdmin:", purchasesError);
  } else {
    console.log("[Loader - market] Successfully fetched purchase records with supabaseAdmin (raw):", purchaseRecordsDb?.length);
  }
  
  const finalPurchaseRecords: PurchaseRecordWithBuyerDetails[] = (purchaseRecordsDb || [])
    .map(mapDbPurchaseRecordToApp) 
    .filter(Boolean) as PurchaseRecordWithBuyerDetails[];
  
  console.log("[Loader - market] Fetched items:", marketplaceAppItems?.length);
  console.log("[Loader - market] Processed purchase records for app (from admin client):", finalPurchaseRecords?.length);

  return json({
    marketplaceItems: marketplaceAppItems,
    purchaseRecords: finalPurchaseRecords,
  });
}
// --- End Loader Function ---


// --- Action Function ---
export async function action({ request }: ActionFunctionArgs) {
  console.log("[Action - market] Received request");

  let formData: FormData;
  const contentType = request.headers.get("Content-Type");

  if (contentType?.includes("multipart/form-data")) {
    console.log("[Action - market] Parsing as multipart/form-data");
    const uploadHandler = unstable_createMemoryUploadHandler({
      maxPartSize: 5 * 1024 * 1024, 
    });
    formData = await unstable_parseMultipartFormData(request, uploadHandler);
  } else {
    console.log("[Action - market] Parsing as application/x-www-form-urlencoded");
    formData = await request.formData();
  }
  
  const intent = formData.get("intent") as string;

  console.log("[Action - market] Intent:", intent);

  // All actions use supabaseAdmin for database modifications, so this part remains largely unchanged.
  switch (intent) {
    case "addMarketplaceItem": {
      try {
        const name = formData.get("name") as string;
        const description = formData.get("description") as string || "";
        const priceStr = formData.get("price") as string;
        const stockStr = formData.get("stock") as string;
        const isUnlimitedStock = formData.get("isUnlimitedStock") === "on";
        const category = formData.get("category") as string;
        const status = formData.get("status") as 'active' | 'inactive';
        const imageFile = formData.get("productImage") as File | null;

        if (!name || !priceStr || (!stockStr && !isUnlimitedStock) || !category || !status) {
          return json({ success: false, error: "Missing required fields.", intent }, { status: 400 });
        }

        const price = parseFloat(priceStr);
        const stock = isUnlimitedStock ? -1 : parseInt(stockStr, 10);

        if (isNaN(price) || (!isUnlimitedStock && isNaN(stock))) {
          return json({ success: false, error: "Invalid number format for price or stock.", intent }, { status: 400 });
        }

        let uploadedImageUrl = DEFAULT_PLACEHOLDER_IMAGE_URL; 
        if (imageFile && imageFile.size > 0) {
          const fileName = `${Date.now()}-${imageFile.name}`;
          if (!supabaseAdmin || !supabaseAdmin.storage) {
            console.error("[Action - market] supabaseAdmin or supabaseAdmin.storage is undefined before image upload.");
            return json({ success: false, error: "Server configuration error for image upload.", intent }, { status: 500 });
          }
          const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
            .from(MARKET_IMAGES_BUCKET)
            .upload(fileName, imageFile, {
              contentType: imageFile.type,
              upsert: true,
            });

          if (uploadError) {
            console.error("[Action - market] Image upload error:", uploadError);
            return json({ success: false, error: `Image upload failed: ${uploadError.message}`, intent }, { status: 500 });
          }
          if (uploadData?.path) {
             const { data: publicUrlData } = supabaseAdmin.storage.from(MARKET_IMAGES_BUCKET).getPublicUrl(uploadData.path);
             uploadedImageUrl = publicUrlData?.publicUrl || DEFAULT_PLACEHOLDER_IMAGE_URL;
          }
        }

        const newItemDataForDb = {
          name,
          description,
          price,
          stock,
          category,
          status,
          image_url: uploadedImageUrl, 
        };
        
        if (!supabaseAdmin || !supabaseAdmin.from) {
            console.error("[Action - market] supabaseAdmin or supabaseAdmin.from is undefined before DB insert.");
            return json({ success: false, error: "Server configuration error for database operation.", intent }, { status: 500 });
        }
        const { data: insertedDbItem, error: insertError } = await supabaseAdmin
          .from('marketplace_items')
          .insert(newItemDataForDb)
          .select()
          .single();

        if (insertError) {
          console.error("[Action - market] Error inserting item:", insertError);
          if (uploadedImageUrl !== DEFAULT_PLACEHOLDER_IMAGE_URL && imageFile) { 
            const pathToDelete = uploadedImageUrl.substring(uploadedImageUrl.lastIndexOf('/') + 1);
            await supabaseAdmin.storage.from(MARKET_IMAGES_BUCKET).remove([pathToDelete]);
          }
          return json({ success: false, error: `Database insert failed: ${insertError.message}`, intent }, { status: 500 });
        }
        
        const insertedAppItem = mapDbItemToMarketplaceItem(insertedDbItem);
        console.log("[Action - market] Product added successfully:", insertedAppItem);
        return json({ success: true, message: "Product added successfully.", intent, item: insertedAppItem });

      } catch (error: any) {
        console.error("[Action - market] Add item general error:", error);
        if (error.message.includes("supabaseAdmin") || (error.message.includes("undefined") && error.message.includes("storage")) || (error.message.includes("undefined") && error.message.includes("from"))) {
            console.error("[Action - market] Error likely related to supabaseAdmin client being undefined or not fully initialized at the time of use.");
        }
        return json({ success: false, error: error.message || "An unexpected error occurred.", intent }, { status: 500 });
      }
    }
    case "editMarketplaceItem": {
      try {
        const productId = formData.get("productId") as string;
        if (!productId) {
          return json({ success: false, error: "Missing product ID for edit.", intent }, { status: 400 });
        }

        const name = formData.get("name") as string;
        const description = formData.get("description") as string || "";
        const priceStr = formData.get("price") as string;
        const stockStr = formData.get("stock") as string;
        const isUnlimitedStock = formData.get("isUnlimitedStock") === "on";
        const category = formData.get("category") as string;
        const status = formData.get("status") as 'active' | 'inactive';
        const currentImageUrl = formData.get("currentImageUrl") as string || DEFAULT_PLACEHOLDER_IMAGE_URL; 
        const imageFile = formData.get("productImage") as File | null;
        
        if (!name || !priceStr || (!stockStr && !isUnlimitedStock) || !category || !status) {
           return json({ success: false, error: "Missing required fields for edit.", intent }, { status: 400 });
        }

        const price = parseFloat(priceStr);
        const stock = isUnlimitedStock ? -1 : parseInt(stockStr, 10);

        if (isNaN(price) || (!isUnlimitedStock && isNaN(stock))) {
           return json({ success: false, error: "Invalid number format for price or stock.", intent }, { status: 400 });
        }

        let newUploadedImageUrl = currentImageUrl; 
        let oldImageKeyToDelete: string | null = null;

        if (imageFile && imageFile.size > 0) {
          if (!supabaseAdmin || !supabaseAdmin.storage) {
            console.error("[Action - market] supabaseAdmin or supabaseAdmin.storage is undefined before image upload (edit).");
            return json({ success: false, error: "Server configuration error for image upload.", intent }, { status: 500 });
          }
          const fileName = `${Date.now()}-${imageFile.name}`;
          const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
            .from(MARKET_IMAGES_BUCKET)
            .upload(fileName, imageFile, {
              contentType: imageFile.type,
              upsert: true,
            });

          if (uploadError) {
            console.error("[Action - market] Edit - Image upload error:", uploadError);
            return json({ success: false, error: `Image upload failed: ${uploadError.message}`, intent }, { status: 500 });
          }
          if (uploadData?.path) {
            const { data: publicUrlData } = supabaseAdmin.storage.from(MARKET_IMAGES_BUCKET).getPublicUrl(uploadData.path);
            newUploadedImageUrl = publicUrlData?.publicUrl || currentImageUrl; 
            if (currentImageUrl && currentImageUrl !== DEFAULT_PLACEHOLDER_IMAGE_URL && currentImageUrl !== newUploadedImageUrl) {
                oldImageKeyToDelete = currentImageUrl.substring(currentImageUrl.lastIndexOf('/') + 1);
            }
          }
        }

        const updatedProductDataForDb = {
          name,
          description,
          price,
          stock,
          category,
          status,
          image_url: newUploadedImageUrl, 
        };

        if (!supabaseAdmin || !supabaseAdmin.from) {
            console.error("[Action - market] supabaseAdmin or supabaseAdmin.from is undefined before DB update (edit).");
            return json({ success: false, error: "Server configuration error for database operation.", intent }, { status: 500 });
        }
        const { data: updatedDbItem, error: updateError } = await supabaseAdmin
          .from('marketplace_items')
          .update(updatedProductDataForDb)
          .eq('id', productId)
          .select()
          .single();

        if (updateError) {
          console.error("[Action - market] Error updating item:", updateError);
          if (newUploadedImageUrl !== currentImageUrl && imageFile) { 
             const pathToDelete = newUploadedImageUrl.substring(newUploadedImageUrl.lastIndexOf('/') + 1);
             if (newUploadedImageUrl !== DEFAULT_PLACEHOLDER_IMAGE_URL) {
                await supabaseAdmin.storage.from(MARKET_IMAGES_BUCKET).remove([pathToDelete]);
             }
          }
          return json({ success: false, error: `Database update failed: ${updateError.message}`, intent }, { status: 500 });
        }

        if (oldImageKeyToDelete) { 
            const { error: deleteOldImageError } = await supabaseAdmin.storage.from(MARKET_IMAGES_BUCKET).remove([oldImageKeyToDelete]);
            if (deleteOldImageError) {
                console.warn(`[Action - market] Failed to delete old image ${oldImageKeyToDelete}:`, deleteOldImageError.message);
            }
        }
        
        const updatedAppItem = mapDbItemToMarketplaceItem(updatedDbItem);
        console.log("[Action - market] Product updated successfully:", updatedAppItem);
        return json({ success: true, message: `Product ${name} updated successfully.`, intent, item: updatedAppItem });

      } catch (error: any) {
        console.error("[Action - market] Edit item general error:", error);
        if (error.message.includes("supabaseAdmin") || (error.message.includes("undefined") && error.message.includes("storage")) || (error.message.includes("undefined") && error.message.includes("from"))) {
            console.error("[Action - market] Error likely related to supabaseAdmin client being undefined or not fully initialized at the time of use (edit).");
        }
        return json({ success: false, error: error.message || "An unexpected error occurred.", intent }, { status: 500 });
      }
    }
    case "deleteMarketplaceItem": {
      try {
        const productId = formData.get("productId") as string;
        const imageUrlToDelete = formData.get("imageUrl") as string | null; 

        if (!productId) {
          return json({ success: false, error: "Missing product ID for deletion.", intent }, { status: 400 });
        }

        if (!supabaseAdmin || !supabaseAdmin.from || !supabaseAdmin.storage) {
            console.error("[Action - market] supabaseAdmin client is not fully available for delete operation.");
            return json({ success: false, error: "Server configuration error for delete operation.", intent }, { status: 500 });
        }

        const { error: deleteDbError } = await supabaseAdmin
          .from('marketplace_items')
          .delete()
          .match({ id: productId });

        if (deleteDbError) {
          console.error("[Action - market] Error deleting item from DB:", deleteDbError);
          return json({ success: false, error: `Database deletion failed: ${deleteDbError.message}`, intent }, { status: 500 });
        }

        if (imageUrlToDelete && imageUrlToDelete !== DEFAULT_PLACEHOLDER_IMAGE_URL) {
          const imageKey = imageUrlToDelete.substring(imageUrlToDelete.lastIndexOf('/') + 1);
          const { error: deleteStorageError } = await supabaseAdmin.storage
            .from(MARKET_IMAGES_BUCKET)
            .remove([imageKey]);
          
          if (deleteStorageError) {
            console.warn(`[Action - market] Product DB record deleted, but failed to delete image ${imageKey} from storage:`, deleteStorageError.message);
          } else {
            console.log(`[Action - market] Image ${imageKey} deleted from storage.`);
          }
        }
        
        console.log(`[Action - market] Product ID: ${productId} deleted successfully.`);
        return json({ success: true, message: `Product deleted successfully.`, intent, productId });

      } catch (error: any) {
        console.error("[Action - market] Delete item general error:", error);
         if (error.message.includes("supabaseAdmin") || (error.message.includes("undefined") && error.message.includes("storage")) || (error.message.includes("undefined") && error.message.includes("from"))) {
            console.error("[Action - market] Error likely related to supabaseAdmin client being undefined or not fully initialized at the time of use (delete).");
        }
        return json({ success: false, error: error.message || "An unexpected error occurred.", intent }, { status: 500 });
      }
    }
    case "purchaseItem": {
      try {
        const itemId = formData.get("itemId") as string;
        const quantityStr = formData.get("quantity") as string;
        const userId = formData.get("userId") as string; 

        console.log(`[Action - purchaseItem] Attempting purchase for userId: ${userId}, itemId: ${itemId}, quantity: ${quantityStr}`);

        if (!itemId || !quantityStr || !userId) {
          return json({ success: false, error: "Missing item ID, quantity, or user ID.", intent }, { status: 400 });
        }

        const quantity = parseInt(quantityStr, 10);
        if (isNaN(quantity) || quantity <= 0) {
          return json({ success: false, error: "Invalid quantity.", intent }, { status: 400 });
        }
        
        if (!supabaseAdmin || !supabaseAdmin.from) {
            console.error("[Action - market] supabaseAdmin or supabaseAdmin.from is undefined before purchase operation. Check .env for SUPABASE_SERVICE_KEY.");
            return json({ success: false, error: "Server configuration error for purchase operation. Admin client may not be initialized.", intent }, { status: 500 });
        }

        const { data: itemDb, error: itemError } = await supabaseAdmin
          .from('marketplace_items')
          .select('*') 
          .eq('id', itemId)
          .single();

        if (itemError || !itemDb) {
          console.error("[Action - purchaseItem] Error fetching item:", itemError);
          return json({ success: false, error: "Item not found or error fetching item.", intent }, { status: 404 });
        }
        const itemApp = mapDbItemToMarketplaceItem(itemDb); 

        if (itemApp.status !== 'active') {
            return json({ success: false, error: "This item is currently not available for purchase.", intent }, { status: 400 });
        }

        if (itemApp.stock !== -1 && itemApp.stock < quantity) {
          return json({ success: false, error: `Insufficient stock. Only ${itemApp.stock} available.`, intent }, { status: 400 });
        }

        const { data: userProfile, error: profileError } = await supabaseAdmin
          .from('profiles') 
          .select('id, balance') 
          .eq('id', userId)
          .single();

        if (profileError) {
          console.error(`[Action - purchaseItem] Supabase error fetching user profile for ID '${userId}'. Error:`, profileError);
          return json({ success: false, error: `Error fetching user profile: ${profileError.message}. This could be due to incorrect admin credentials, network issues, or an invalid User ID format.`, intent }, { status: 500 });
        }
        if (!userProfile) {
          console.error(`[Action - purchaseItem] User profile not found for ID: ${userId}. Ensure this user exists in the 'profiles' table and the ID is a valid UUID.`);
          return json({ success: false, error: `User profile not found for ID: ${userId}. Please ensure the user exists in the database and the ID is a valid UUID.`, intent }, { status: 404 });
        }

        const currentPricePerItem = itemApp.price; 
        const calculatedTotalPrice = currentPricePerItem * quantity; 

        if (userProfile.balance < calculatedTotalPrice) {
          return json({ success: false, error: "Insufficient ESSENCE balance.", intent }, { status: 400 });
        }
        
        const newBalance = userProfile.balance - calculatedTotalPrice;
        const { error: balanceUpdateError } = await supabaseAdmin
          .from('profiles')
          .update({ balance: newBalance })
          .eq('id', userId);

        if (balanceUpdateError) {
          console.error("[Action - purchaseItem] Error updating user balance:", balanceUpdateError);
          return json({ success: false, error: "Failed to update user balance. Purchase not completed.", intent }, { status: 500 });
        }

        let updatedItemStock = itemApp.stock;
        if (itemApp.stock !== -1) {
          const newStock = itemApp.stock - quantity;
          updatedItemStock = newStock;
          const { error: stockUpdateError } = await supabaseAdmin 
            .from('marketplace_items')
            .update({ stock: newStock }) 
            .eq('id', itemId);

          if (stockUpdateError) {
            console.error("[Action - purchaseItem] Error updating item stock:", stockUpdateError);
            await supabaseAdmin.from('profiles').update({ balance: userProfile.balance }).eq('id', userId); 
            return json({ success: false, error: "Failed to update item stock. Purchase cancelled and balance restored.", intent }, { status: 500 });
          }
        }

        const purchaseTimestamp = new Date().toISOString();
        const initialStatus: 'pending' | 'delivered' = itemApp.category === 'Digital Goods' ? 'delivered' : 'pending';
        const initialDeliveryDate = initialStatus === 'delivered' ? purchaseTimestamp : null;

        const newPurchaseRecordDataForDb = {
          item_id: itemApp.id,
          item_name_snapshot: itemApp.name,
          price_per_item_snapshot: currentPricePerItem, 
          total_price: calculatedTotalPrice,           
          quantity: quantity,
          purchase_date: purchaseTimestamp,
          user_id: userId,
          status: initialStatus,
          delivery_date: initialDeliveryDate,
        };
        
        // When creating a purchase record, try to fetch related profile name using supabaseAdmin
        const { data: createdPurchaseRecordDb, error: purchaseRecordError } = await supabaseAdmin
          .from('purchase_records')
          .insert(newPurchaseRecordDataForDb)
          .select(`*, profiles (full_name)`) // Attempt to join here with admin client
          .single();

        if (purchaseRecordError || !createdPurchaseRecordDb) {
          console.error("[Action - purchaseItem] Error creating purchase record:", purchaseRecordError);
          // Attempt to revert changes if purchase record creation fails
          await supabaseAdmin.from('profiles').update({ balance: userProfile.balance }).eq('id', userId); 
          if (itemApp.stock !== -1) { 
            await supabaseAdmin.from('marketplace_items').update({ stock: itemApp.stock }).eq('id', itemId);
          }
          // Check if the error is the "relation public.users does not exist"
          if (purchaseRecordError?.message.includes("relation \"public.users\" does not exist")) {
             console.error("[Action - purchaseItem] CRITICAL: 'public.users' error even with supabaseAdmin during purchase record creation join. This points to a fundamental issue with the 'profiles' join, possibly a view definition.");
             return json({ success: false, error: `Failed to record purchase due to a database relation issue (public.users). Transaction cancelled.`, intent }, { status: 500 });
          }
          return json({ success: false, error: `Failed to record purchase: ${purchaseRecordError?.message || 'Unknown error'}. Transaction cancelled and changes reverted.`, intent }, { status: 500 });
        }
        
        const createdPurchaseRecordApp = mapDbPurchaseRecordToApp(createdPurchaseRecordDb);

        console.log(`[Action - purchaseItem] User ${userId} purchased ${quantity}x ${itemApp.name} (ID: ${itemId}) for ${calculatedTotalPrice} ESSENCE.`);
        return json({
          success: true,
          message: `Successfully purchased ${quantity}x ${itemApp.name}!`,
          intent,
          finalBalance: newBalance, 
          userId: userId,
          updatedItem: { ...itemApp, stock: updatedItemStock },
          purchaseRecord: createdPurchaseRecordApp, 
        });

      } catch (error: any)
       {
        console.error("[Action - purchaseItem] General error:", error);
        if (error.message.includes("supabaseAdmin") || (error.message.includes("undefined") && error.message.includes("from"))) {
            console.error("[Action - market] Error likely related to supabaseAdmin client being undefined or not fully initialized at the time of use (purchase).");
        }
        return json({ success: false, error: error.message || "An unexpected error occurred during purchase.", intent }, { status: 500 });
      }
    }
    default: {
      console.warn(`[Action - market] Unhandled intent: ${intent}`);
      return json({ success: false, error: `Unhandled intent: ${intent}`, intent }, { status: 400 });
    }
  }
}
// --- End Action Function ---

// --- Shop Tab Content (Moved to top level) ---
function ShopContent() {
  const allItems = useStore((state) => state.marketplaceItems);
  const activeItems = useMemo(() => allItems.filter(item => item.status === 'active'), [allItems]);
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  const handleSelectItem = useCallback((item: MarketplaceItem) => {
    setSelectedItem(item);
  }, []); 

  const handleCloseModal = useCallback(() => {
    setSelectedItem(null);
  }, []); 

  const categories = useMemo(() => {
    const uniqueCategories = new Set(activeItems.map(item => item.category));
    return Array.from(uniqueCategories);
  }, [activeItems]);

  const displayedItems = useMemo(() => {
    let items = [...activeItems];
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      items = items.filter(item =>
        item.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        (item.description && item.description.toLowerCase().includes(lowerCaseSearchTerm))
      );
    }
    if (filterCategory !== "all") {
      items = items.filter(item => item.category === filterCategory);
    }
    switch (sortBy) {
      case "price-asc": items.sort((a, b) => a.price - b.price); break;
      case "price-desc": items.sort((a, b) => b.price - a.price); break;
      case "name-asc": items.sort((a, b) => a.name.localeCompare(b.name)); break;
      case "name-desc": items.sort((a, b) => b.name.localeCompare(a.name)); break;
      default: break;
    }
    return items;
  }, [activeItems, searchTerm, filterCategory, sortBy]);

  return (
    <div className="space-y-4 p-4">
      <div className="flex flex-col gap-4 md:flex-row">
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <FilterSortPanel
          categories={categories}
          selectedCategory={filterCategory}
          onCategoryChange={setFilterCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      </div>
      <div className="flex-1">
         <ProductGrid items={displayedItems} onSelectItem={handleSelectItem} />
      </div>
      <ProductDetailModal item={selectedItem} onClose={handleCloseModal} />
    </div>
  );
}
// --- End Shop Tab Content ---

// --- Setup Tab Content (Moved to top level) ---
function SetupContent() {
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>(); 
  const { marketplaceItems } = useStore((state) => ({
    marketplaceItems: state.marketplaceItems,
  }));

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<MarketplaceItem | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<MarketplaceItem | null>(null);
  
  const processedActionRef = useRef<string | null>(null);

  useEffect(() => {
    const actionKey = actionData ? `${actionData.intent}-${(actionData as any).message || (actionData as any).error}-${(actionData as any).productId || (actionData as any).item?.id}` : null;

    if (actionData?.success && actionKey && processedActionRef.current !== actionKey) {
      if (actionData.intent === 'addMarketplaceItem') {
        console.log("[SetupContent Effect] Action 'addMarketplaceItem' successful. Closing form.");
        setShowAddForm(false); 
      } else if (actionData.intent === 'deleteMarketplaceItem') {
        console.log("[SetupContent Effect] Action 'deleteMarketplaceItem' successful. Closing modal.");
        setDeletingProduct(null); 
      } else if (actionData.intent === 'editMarketplaceItem') {
        console.log("[SetupContent Effect] Action 'editMarketplaceItem' successful. Closing modal.");
        setEditingProduct(null); 
      }
      processedActionRef.current = actionKey;
    } else if (!actionData?.success && actionData?.error && actionKey && processedActionRef.current !== actionKey) {
      processedActionRef.current = actionKey;
    }

  }, [actionData]);


  const categories = useMemo(() => {
    const uniqueCategories = new Set(marketplaceItems.map(item => item.category));
    return Array.from(uniqueCategories);
  }, [marketplaceItems]);

  const handleCancelAddForm = useCallback(() => setShowAddForm(false), []); 

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Inventory Management</h2>
        {!showAddForm && (
           <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium"
          >
            + Add New Product
          </button>
        )}
      </div>

      {showAddForm && (
        <AddProductForm
          onCancel={handleCancelAddForm}
          categories={categories}
          navigation={navigation}
          actionData={actionData}
        />
      )}

      <InventoryTable
        items={marketplaceItems} 
        onEdit={(item) => setEditingProduct(item)}
        onDelete={(item) => setDeletingProduct(item)}
      />

      <EditProductModal
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        product={editingProduct}
        categories={categories}
        navigation={navigation}
        actionData={actionData}
      />

      <DeleteConfirmationModal
        isOpen={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        product={deletingProduct}
        navigation={navigation}
        defaultPlaceholderImageUrl={DEFAULT_PLACEHOLDER_IMAGE_URL} 
      />
    </div>
  );
}
// --- End Setup Tab Content ---

// --- Sales Log Tab Content (Moved to top level) ---
interface SalesContentProps {
  purchaseRecords: PurchaseRecordWithBuyerDetails[];
}

function SalesContent({ purchaseRecords }: SalesContentProps) {
  // console.log("[SalesContent] Received purchaseRecords, count:", purchaseRecords.length); // For debugging
  return (
    <div className="p-4 space-y-6">
       <h2 className="text-xl font-semibold">Sales Log</h2>
       <SalesLogTable records={purchaseRecords} />
    </div>
  );
}
// --- End Sales Log Tab Content ---


export default function Marketplace() {
  const { marketplaceItems: loaderMarketplaceItems, purchaseRecords: loaderPurchaseRecords } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const { 
    setMarketplaceItems, 
    updateMarketplaceItem, 
    setPurchaseRecords,
    addPurchaseRecord, 
    setCurrentUser, 
    currentUser, 
  } = useStore(state => ({
    setMarketplaceItems: state.setMarketplaceItems,
    updateMarketplaceItem: state.updateMarketplaceItem,
    setPurchaseRecords: state.setPurchaseRecords,
    addPurchaseRecord: state.addPurchaseRecord, 
    setCurrentUser: state.setCurrentUser,
    currentUser: state.currentUser, 
  }));

  const processedActionDataKeyRef = useRef<string | null>(null);

  useEffect(() => {
    console.log("[Marketplace Route] Loader data received. Syncing ALL items/records to Zustand.");
    console.log("[Marketplace Route] Loader marketplaceItems count:", loaderMarketplaceItems?.length);
    console.log("[Marketplace Route] Loader purchaseRecords count:", loaderPurchaseRecords?.length);
    setMarketplaceItems(loaderMarketplaceItems); 
    setPurchaseRecords(loaderPurchaseRecords);
  }, [loaderMarketplaceItems, loaderPurchaseRecords, setMarketplaceItems, setPurchaseRecords]);

  useEffect(() => {
    if (!actionData) {
      return;
    }
    
    const currentActionKey = `${actionData.intent}-${actionData.success}-${(actionData as any).message || (actionData as any).error}-${(actionData as any).userId || ''}-${(actionData as any).finalBalance || ''}-${(actionData as any).updatedItem?.id || ''}-${(actionData as any).purchaseRecord?.id || ''}`;

    if (processedActionDataKeyRef.current === currentActionKey) {
        console.log("[Marketplace Route Effect] Action data already processed, skipping:", currentActionKey);
        return; 
    }
    
    console.log("[Marketplace Route Effect] Processing actionData:", actionData);
    processedActionDataKeyRef.current = currentActionKey;

    if (actionData.intent === 'purchaseItem' && actionData.success) {
      console.log("[Marketplace Route Effect] Purchase successful. Processing action data for purchase:", actionData);
      
      if (actionData.finalBalance !== undefined && actionData.userId && currentUser && currentUser.id === actionData.userId) {
        if (currentUser.balance !== actionData.finalBalance) {
          console.log(`[Marketplace Route Effect] Updating balance for user ${actionData.userId} from ${currentUser.balance} to ${actionData.finalBalance}`);
          setCurrentUser({ ...currentUser, balance: actionData.finalBalance });
        }
      }
      if (actionData.updatedItem) {
        console.log(`[Marketplace Route Effect] Updating marketplace item ID: ${(actionData.updatedItem as MarketplaceItem).id}`);
        updateMarketplaceItem(actionData.updatedItem as MarketplaceItem); 
      }
      if (actionData.purchaseRecord) {
        console.log(`[Marketplace Route Effect] Adding new purchase record ID: ${(actionData.purchaseRecord as PurchaseRecordWithBuyerDetails).id} to store.`);
        addPurchaseRecord(actionData.purchaseRecord as PurchaseRecordWithBuyerDetails);
      }
    } else if (actionData.success) {
        console.log(`[Marketplace Route Effect] Successful action '${actionData.intent}', but not 'purchaseItem'. Item:`, (actionData as any).item);
    } else if (!actionData.success && actionData.error) {
        console.warn("[Marketplace Route Effect] Action failed:", actionData.error, "Intent:", actionData.intent);
    }

  }, [actionData, setCurrentUser, updateMarketplaceItem, addPurchaseRecord, currentUser]);


  const userRole = useUserRole();
  const isSuperAdmin = userRole === 'Super Admin';
  type ActiveMarketTab = 'shop' | 'setup' | 'sales';
  const [activeTab, setActiveTab] = useState<ActiveMarketTab>('shop');

  const storePurchaseRecords = useStore((state) => state.purchaseRecords);


  const tabClasses = (tabName: ActiveMarketTab) =>
    cn(
      "px-4 py-2 font-medium text-sm rounded-md cursor-pointer",
      activeTab === tabName
        ? "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
        : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
    );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Marketplace</h1>

      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-4" aria-label="Tabs">
          <button
            className={tabClasses('shop')}
            onClick={() => setActiveTab('shop')}
            aria-current={activeTab === 'shop' ? 'page' : undefined}
          >
            Shop
          </button>
          {isSuperAdmin && (
            <>
              <button
                className={tabClasses('setup')}
                onClick={() => setActiveTab('setup')}
                aria-current={activeTab === 'setup' ? 'page' : undefined}
              >
                Set-up
              </button>
              <button
                className={tabClasses('sales')}
                onClick={() => setActiveTab('sales')}
                aria-current={activeTab === 'sales' ? 'page' : undefined}
              >
                Sales Log
              </button>
            </>
          )}
        </nav>
      </div>

      <div>
        {activeTab === 'shop' && <ShopContent />}
        {isSuperAdmin && activeTab === 'setup' && <SetupContent />}
        {isSuperAdmin && activeTab === 'sales' && <SalesContent purchaseRecords={storePurchaseRecords} />}
      </div>
    </div>
  );
}
