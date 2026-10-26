import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../../assets/logo.png';
import {
  LuFileText,
  LuShield,
  LuLifeBuoy,
  LuMenu,
  LuX,
} from 'react-icons/lu';

const PublicNavbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pathname = location.pathname;
  const isTerms = pathname.startsWith('/terms');
  const isPrivacy = pathname.startsWith('/privacy');
  const isContact = pathname.startsWith('/contact');

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs print:hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-3">
        {/* Logo */}
        <Link to="/" onClick={closeMenu} className="flex items-center shrink-0">
          <img
            src={Logo}
            alt="WeCure Health Logo"
            className="h-8 sm:h-9 w-auto max-w-[150px] sm:max-w-none object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          <Link
            to="/terms"
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition flex items-center space-x-1.5 ${
              isTerms
                ? 'bg-[#006C93]/10 text-[#006C93] font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <LuFileText className="w-4 h-4 shrink-0" />
            <span>Terms & Conditions</span>
          </Link>

          <Link
            to="/privacy"
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition flex items-center space-x-1.5 ${
              isPrivacy
                ? 'bg-[#006C93]/10 text-[#006C93] font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <LuShield className="w-4 h-4 shrink-0" />
            <span>Privacy Policy</span>
          </Link>

          <Link
            to="/contact"
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition flex items-center space-x-1.5 ${
              isContact
                ? 'bg-[#006C93]/10 text-[#006C93] font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <LuLifeBuoy className="w-4 h-4 shrink-0" />
            <span>Contact Us</span>
          </Link>
        </nav>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            className="p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-[#006C93]/20 cursor-pointer"
          >
            {mobileMenuOpen ? (
              <LuX className="w-6 h-6 text-slate-800" />
            ) : (
              <LuMenu className="w-6 h-6 text-slate-800" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-4 space-y-1 shadow-lg transition-all">
          <Link
            to="/terms"
            onClick={closeMenu}
            className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
              isTerms
                ? 'bg-[#006C93]/10 text-[#006C93] font-semibold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <LuFileText className="w-4 h-4 text-[#006C93]" />
            <span>Terms & Conditions</span>
          </Link>

          <Link
            to="/privacy"
            onClick={closeMenu}
            className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
              isPrivacy
                ? 'bg-[#006C93]/10 text-[#006C93] font-semibold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <LuShield className="w-4 h-4 text-[#006C93]" />
            <span>Privacy Policy</span>
          </Link>

          <Link
            to="/contact"
            onClick={closeMenu}
            className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
              isContact
                ? 'bg-[#006C93]/10 text-[#006C93] font-semibold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <LuLifeBuoy className="w-4 h-4 text-[#006C93]" />
            <span>Contact Us</span>
          </Link>
        </div>
      )}
    </header>
  );
};

export default PublicNavbar;
