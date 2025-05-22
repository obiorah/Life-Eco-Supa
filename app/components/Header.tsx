import { useState } from "react"; // Import useState
import { Link, NavLink, useRouteLoaderData } from "@remix-run/react"; // Import useRouteLoaderData
import { cn } from "~/lib/utils";
import { useUserRole } from "~/hooks/useUserRole";
import type { AppUser } from "~/root"; // Import the AppUser type

export function Header() {
  // Get user data from the root loader
  const rootData = useRouteLoaderData<typeof import("~/root").loader>("root");
  const user = rootData?.user as AppUser | null | undefined; // Cast to AppUser or null/undefined

  const userRole = useUserRole(); // Keep using this for role display for now
  const isAdminOrSuperAdmin = userRole === 'Admin' || userRole === 'Super Admin';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    cn(
      "block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md", // Base styles for mobile links
      "md:inline-block md:p-0 md:hover:bg-transparent md:dark:hover:bg-transparent", // Desktop overrides
      isActive
        ? "text-gray-900 dark:text-gray-50 font-semibold md:font-medium" // Active style (bold on mobile)
        : "text-gray-500 dark:text-gray-400" // Inactive style
    );

  // Determine the display name - use email for now, or 'Loading...'
  const displayName = user?.email ?? 'Loading...';
  // TODO: Fetch and use full_name from a user profile table later

  return (
    <header className="relative flex h-16 items-center justify-between border-b bg-white px-4 dark:bg-gray-900">
      {/* Left Side: Logo and Desktop Nav */}
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <DollarSignIcon className="h-6 w-6" />
          <span>Life Economy</span>
        </Link>
        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-4 text-sm font-medium md:flex">
          <NavLink to="/" end className={navLinkClasses}>
            Dashboard
          </NavLink>
          <NavLink to="/transactions" className={navLinkClasses}>
            Transactions
          </NavLink>
          <NavLink to="/transfer" className={navLinkClasses}>
            Transfer
          </NavLink>
          <NavLink to="/market" className={navLinkClasses}> {/* Added Market Link */}
            Market
          </NavLink>
          {isAdminOrSuperAdmin && (
            <NavLink to="/reports" className={navLinkClasses}>
              Reports
            </NavLink>
          )}
          {userRole === 'Super Admin' && (
            <NavLink to="/admin" className={navLinkClasses}>
              Admin
            </NavLink>
          )}
          <NavLink to="/management" className={navLinkClasses}>
            Management
          </NavLink>
          <NavLink to="/settings" className={navLinkClasses}>
            Settings
          </NavLink>
        </nav>
      </div>

      {/* Right Side: User Info and Hamburger Button */}
      <div className="flex items-center gap-4">
        {/* User Dropdown Placeholder - Updated */}
        <div className="hidden items-center gap-2 rounded-md border p-2 text-sm md:flex">
          {/* Use the fetched user's email */}
          <span>{displayName}</span>
          <span className="rounded-sm bg-gray-200 px-1 text-xs dark:bg-gray-700">
            {/* Keep using useUserRole for now, TODO: use user.role */}
            {userRole || 'User'}
          </span>
          <LogOutIcon className="h-4 w-4" />
        </div>

        {/* Hamburger Button (Visible on Mobile) */}
        <button
          onClick={toggleMobileMenu}
          className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white md:hidden"
          aria-controls="mobile-menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span className="sr-only">Open main menu</span>
          {isMobileMenuOpen ? (
            <XIcon className="block h-6 w-6" aria-hidden="true" />
          ) : (
            <MenuIcon className="block h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile Menu (Dropdown) */}
      {isMobileMenuOpen && (
        <div
          className="absolute left-0 right-0 top-16 z-20 border-b border-t bg-white dark:bg-gray-900 md:hidden"
          id="mobile-menu"
        >
          <nav className="space-y-1 px-2 pb-3 pt-2">
            <NavLink to="/" end className={navLinkClasses} onClick={toggleMobileMenu}>
              Dashboard
            </NavLink>
            <NavLink to="/transactions" className={navLinkClasses} onClick={toggleMobileMenu}>
              Transactions
            </NavLink>
            <NavLink to="/transfer" className={navLinkClasses} onClick={toggleMobileMenu}>
              Transfer
            </NavLink>
            <NavLink to="/market" className={navLinkClasses} onClick={toggleMobileMenu}> {/* Added Market Link */}
              Market
            </NavLink>
            {isAdminOrSuperAdmin && (
              <NavLink to="/reports" className={navLinkClasses} onClick={toggleMobileMenu}>
                Reports
              </NavLink>
            )}
            {userRole === 'Super Admin' && (
              <NavLink to="/admin" className={navLinkClasses} onClick={toggleMobileMenu}>
                Admin
              </NavLink>
            )}
            <NavLink to="/management" className={navLinkClasses} onClick={toggleMobileMenu}>
              Management
            </NavLink>
            <NavLink to="/settings" className={navLinkClasses} onClick={toggleMobileMenu}>
              Settings
            </NavLink>
            {/* Mobile User Info/Logout - Updated */}
            <div className="border-t border-gray-200 px-4 py-3 dark:border-gray-700">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {/* Placeholder for user avatar if you have one */}
                   <span className="inline-block h-8 w-8 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-600">
                    <svg className="h-full w-full text-gray-300 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </span>
                </div>
                <div className="ml-3">
                  {/* Use the fetched user's email */}
                  <div className="text-base font-medium text-gray-800 dark:text-white">{displayName}</div>
                  {/* Keep using useUserRole for now, TODO: use user.role */}
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{userRole || 'User'}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                 <button className="flex w-full items-center rounded-md px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white">
                   <LogOutIcon className="mr-3 h-5 w-5" />
                   Sign out
                 </button>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

// --- Icons ---

function DollarSignIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function LogOutIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}

// Add Menu and X icons
function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
      />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}
