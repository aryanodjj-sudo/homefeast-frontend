import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import NavLinks from "./NavLinks";
import UserMenu from "./UserMenu";
import ThemeToggle from "../Common/ThemeToggle";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur dark:bg-gray-950/90">
      <nav className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link to="/" className="text-3xl font-bold text-orange-500">
          🍽️ HomeFeast
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <NavLinks />
          <ThemeToggle />
          <UserMenu />
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="flex items-center justify-center rounded-lg p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 md:hidden"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {isMenuOpen && (
        <div className="border-t bg-white px-4 pb-4 pt-2 dark:bg-gray-950 md:hidden">
          <div className="flex flex-col gap-4">
            <NavLinks mobile />
            <div className="flex items-center justify-between border-t pt-4 dark:border-gray-800">
              <ThemeToggle />
              <UserMenu />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;