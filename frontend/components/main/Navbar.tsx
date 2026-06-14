"use client";

import React, { useState, useEffect, useRef } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { FiChevronDown } from "react-icons/fi";
import ThemeToggle from "../sub/Toggle";

interface NavLinkItem {
  href?: string;
  label: string;
  subLinks?: NavLinkItem[];
  target?: string;
}

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");

  const navLinks: NavLinkItem[] = [
    { href: "/", label: "Home" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [showToast]);
 useEffect(() => {
  const token = localStorage.getItem("token");
  const storedRole =
    localStorage.getItem("role") || "";

  setIsLoggedIn(!!token);
  setRole(storedRole);
}, []);

 const handleInventoryClick = (
  e: React.MouseEvent
) => {
  e.preventDefault();

  const token =
    localStorage.getItem("token");

  if (token) {
    window.location.href =
      "/manage-inventory";
    return;
  }

  setShowToast(true);

  if (isMobileMenuOpen) {
    setIsMobileMenuOpen(false);
  }
};
  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("userId");
  localStorage.removeItem("name");
setRole("");
  setIsLoggedIn(false);

  window.location.href = "/login";
};

  const themedLinkInPillClasses = "text-foreground hover:text-orange-500 dark:hover:text-yellow-400 transition-colors duration-200";
  const themedAdminButtonBaseClasses = "bg-theme-gradient text-primary-foreground font-medium transition-all duration-300";
  const themedAdminButtonHoverClasses = "hover:opacity-90 hover:shadow-lg";

  return (
    <>
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-20 right-4 z-[9999] animate-slide-in">
          <div className="bg-orange-500/10 border border-orange-500/30 backdrop-blur-xl rounded-lg px-5 py-4 shadow-2xl flex items-center gap-3 max-w-sm">
            <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m5-7V7a5 5 0 00-10 0v4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-orange-400">Login Required</p>
              <p className="text-xs text-orange-300/70 mt-0.5">Please login first to access inventory management.</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <div className="w-full h-[65px] fixed top-0
                      shadow-md dark:shadow-primary/20
                      bg-background/80 dark:bg-background/85
                      backdrop-blur-md z-50 px-4 sm:px-10 border-b border-border/30 dark:border-border/50">
        <div className="w-full h-full max-w-screen-xl mx-auto flex flex-row items-center justify-between">
          {/* Logo and Brand Name */}
          <a
            href="/"
            className="h-auto w-auto flex flex-row items-center"
            onClick={() => isMobileMenuOpen && setIsMobileMenuOpen(false)}
          >
            <span className="font-bold ml-[10px] hidden md:block text-foreground text-xl">
              STAC
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex h-full flex-row items-center pl-[60px] lg:pl-[80px]">
            <div className="flex items-center h-auto 
                            border border-border bg-card/70 dark:bg-card/80
                            px-[20px] py-[10px] rounded-full text-foreground
                            space-x-4 lg:space-x-5">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href || "#"}
                  className={`cursor-pointer flex items-center ${themedLinkInPillClasses}`}
                  onClick={() => {
                    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </nav>

          {/* Desktop: Inventory, Login, ThemeToggle */}
          <div className="hidden md:flex flex-row gap-2 sm:gap-3 items-center text-foreground">
            <button
              onClick={handleInventoryClick}
              className={`cursor-pointer px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm border border-orange-500/30 text-orange-400 hover:bg-orange-500/10 font-medium transition-all duration-300`}
            >
              Inventory Management
            </button>
            {role === "admin" && (
  <a
    href="/history"
    className="cursor-pointer px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 font-medium transition-all duration-300"
  >
    History
  </a>
)}
            <ThemeToggle/>
            {!isLoggedIn ? (
  <a
    href="/login"
    className={`cursor-pointer px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm ${themedAdminButtonBaseClasses} ${themedAdminButtonHoverClasses}`}
  >
    Login
  </a>
) : (
  <button
    onClick={handleLogout}
    className="cursor-pointer px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm bg-red-500 text-white hover:bg-red-600"
  >
    Logout
  </button>
)}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2 sm:gap-3">
            <ThemeToggle/>
            <button
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
              className="p-1.5 text-foreground/80 hover:text-primary focus:outline-none rounded-full hover:bg-muted/50"
            >
              {isMobileMenuOpen ? (
                <AiOutlineClose size={24} />
              ) : (
                <AiOutlineMenu size={24} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`
          md:hidden fixed inset-0 top-[65px] z-40
          bg-background/95 backdrop-blur-lg
          overflow-y-auto 
          flex flex-col items-center pt-8 pb-16 px-5 space-y-3
          transform transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}
        `}
      >
        {navLinks.map((link) => (
          <div key={link.label} className="w-full text-center">
            <a
              href={link.href}
              className={`w-full inline-flex items-center justify-center py-3 text-2xl ${themedLinkInPillClasses}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          </div>
        ))}
        <div className="pt-8 flex flex-col items-center space-y-6 w-full">
          <button
            onClick={handleInventoryClick}
            className="cursor-pointer px-6 py-3 rounded-full text-lg border border-orange-500/30 text-orange-400 hover:bg-orange-500/10 font-medium transition-all duration-300"
          >
            Inventory Management
          </button>
          {role === "admin" && (
  <a
    href="/history"
    onClick={() =>
      setIsMobileMenuOpen(false)
    }
    className="cursor-pointer px-6 py-3 rounded-full text-lg border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 font-medium transition-all duration-300"
  >
    History
  </a>
)}
          {!isLoggedIn ? (
  <a
    href="/login"
    className={`cursor-pointer px-6 py-3 rounded-full text-lg ${themedAdminButtonBaseClasses} ${themedAdminButtonHoverClasses}`}
    onClick={() => setIsMobileMenuOpen(false)}
  >
    Login
  </a>
) : (
  <button
    onClick={() => {
      handleLogout();
      setIsMobileMenuOpen(false);
    }}
    className="cursor-pointer px-6 py-3 rounded-full text-lg bg-red-500 text-white hover:bg-red-600"
  >
    Logout
  </button>
)}
        </div>
      </div>
    </>
  );
};

export default Navbar;