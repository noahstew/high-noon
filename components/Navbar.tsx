'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const navLinks = [
  { name: 'About', href: '/about' },
  { name: 'Blog', href: '/blog' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu when Escape key is pressed
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleEsc);

    // Prevent body scrolling when menu is open
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="sticky top-0 w-full bg-white px-6 py-5 flex justify-between items-center shadow-md z-50  border-b-2 border-primary">
      {/* Left: Logo */}
      <div className="flex items-center z-20 group">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="High Noon Optimist Club Logo"
            width={175}
            height={80}
            className="transition-transform duration-200 group-hover:scale-105"
          />
        </Link>
      </div>

      {/* Right: Nav links (Desktop) */}
      <div className="hidden md:flex items-center space-x-10">
        <ul className="flex space-x-10 text-primary text-2xl font-semibold">
          {navLinks.map((link) => (
            <li key={link.name} className="group relative">
              <Link href={link.href} className="transition-colors duration-200">
                {link.name}
                <span className="pointer-events-none absolute left-1/2 bottom-0 w-0 group-hover:w-full h-[3px] bg-primary transition-all duration-300 ease-in-out -translate-x-1/2 origin-center"></span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Hamburger button */}
      <button
        className="md:hidden z-20 p-2 text-primary hover:text-dark focus:outline-none transition-colors duration-200"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <svg
          className="w-9 h-9"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          {isMenuOpen ? (
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 111.414 1.414L11.414 10l4.293 4.293a1 1 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 01-1.414-1.414L8.586 10 4.293 5.707a1 1 010-1.414z"
            />
          ) : (
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            />
          )}
        </svg>
      </button>

      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 transition-opacity duration-300"
          onClick={toggleMenu}
          aria-label="Close menu overlay"
        />
      )}

      {/* Mobile slide-in menu */}
      <div
        className={`fixed top-0 right-0 w-2/3 sm:w-1/2 max-w-sm h-full bg-gray-200 z-40 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } flex flex-col p-8 justify-between shadow-2xl`}
      >
        <button
          className="absolute top-8 right-8 text-primary hover:text-dark text-6xl font-semibold transition-colors duration-200"
          onClick={toggleMenu}
          aria-label="Close menu"
        >
          &times;
        </button>
        {/* Mobile menu items */}
        <ul className="flex flex-col items-end space-y-8 text-primary text-4xl font-semibold mt-24">
          {navLinks.map((link) => (
            <li key={link.name} className="group relative">
              <Link
                href={link.href}
                onClick={toggleMenu}
                className="transition-colors duration-200"
              >
                {link.name}
                <span className="pointer-events-none absolute left-1/2 bottom-0 w-0 group-hover:w-full h-[3px] bg-primary transition-all duration-300 ease-in-out -translate-x-1/2 origin-center"></span>
              </Link>
            </li>
          ))}
        </ul>
        {/* Logo at bottom of mobile menu */}
        <div className="flex flex-col items-end w-full">
          <Link
            href="/"
            onClick={toggleMenu}
            className="flex items-center z-20 group"
          >
            <Image
              src="/logo.png"
              alt="High Noon Optimist Club Logo"
              width={120}
              height={120}
              className="transition-transform duration-200 group-hover:scale-110"
            />
          </Link>
        </div>
      </div>
    </nav>
  );
}
