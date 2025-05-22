import React from 'react';
import { Form } from '@remix-run/react';
import type { Navigation } from '@remix-run/router';
import type { MarketplaceItem } from '~/types/market';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: MarketplaceItem | null;
  navigation: Navigation;
  defaultPlaceholderImageUrl: string; // Added prop
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  product,
  navigation,
  defaultPlaceholderImageUrl, // Use prop
}: DeleteConfirmationModalProps) {
  if (!isOpen || !product) return null;

  const isSubmitting = navigation.state === 'submitting' && 
                       navigation.formData?.get('intent') === 'deleteMarketplaceItem' && 
                       navigation.formData?.get('productId') === product.id;

  // Determine if the image is a custom uploaded image (not the default placeholder)
  const isCustomImage = product.imageUrl && product.imageUrl !== defaultPlaceholderImageUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Confirm Deletion</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          Are you sure you want to delete the product "<strong>{product.name}</strong>"? This action cannot be undone.
          {isCustomImage && ( // Show message only for custom images
            <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
              The associated custom image will also be deleted from storage.
            </span>
          )}
        </p>
        <Form method="post" action="/market"> {/* Ensure action points to your market route */}
          <input type="hidden" name="intent" value="deleteMarketplaceItem" />
          <input type="hidden" name="productId" value={product.id} />
          {/* Pass imageUrl to action; the action logic will decide if it's deletable */}
          {product.imageUrl && <input type="hidden" name="imageUrl" value={product.imageUrl} />}
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500 dark:hover:bg-gray-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800 disabled:opacity-50"
            >
              {isSubmitting ? 'Deleting...' : 'Delete Product'}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
