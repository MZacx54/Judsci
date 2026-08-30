import React, { useState, useEffect } from 'react';
import { AppSection } from '../types';
import logo from '../assets/logo.png';

interface HeaderProps {
  activeSection: AppSection;
  onNavigate: (section: AppSection) => void;
}

const Header: React.FC<HeaderProps> = ({ activeSection, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const navItems = [
    { label: 'Home', section: AppSection.HOME },
    { label: 'About Us', section: AppSection.ABOUT },
    { label: 'Programs', section: AppSection.PROGRAMS },
    { label: 'Consultations', section: AppSection.BOOKINGS },
    { label: 'Resources', section: AppSection.RESOURCES },
    { label: 'News', section: AppSection.NEWS },
    { label: 'Donations', section: AppSection.DONATIONS },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100'
            : 'bg-white/80 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div
            className="flex items-center space-x-3 cursor-pointer py-2"
            onClick={() => {
              onNavigate(AppSection.HOME);
              setIsOpen(false);
            }}
          >
            <img src={logo} alt="JUDSCI Bauchi Logo" className="h-10 sm:h-12 w-auto object-contain" />
            <span className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
              JUDSCI <span className="text-green-700">Bauchi</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => (
              <button
                key={item.section}
                onClick={() => onNavigate(item.section)}
                className={`px-3.5 py-2 text-sm font-medium rounded-full transition-all ${
                  activeSection === item.section
                    ? 'bg-green-100/80 text-green-800 font-semibold shadow-sm'
                    : 'text-gray-700 hover:text-green-700 hover:bg-gray-100/70'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => onNavigate(AppSection.DONATIONS)}
              className="ml-3 px-5 py-2.5 text-sm font-bold text-white bg-green-700 hover:bg-green-800 rounded-full transition-all shadow-md hover:shadow-green-700/20 active:scale-95"
            >
              Donate Now
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center md:hidden gap-2">
            <button
              onClick={() => {
                onNavigate(AppSection.DONATIONS);
                setIsOpen(false);
              }}
              className="px-3 py-1.5 text-xs font-bold text-white bg-green-700 rounded-full shadow-sm"
            >
              Donate
            </button>
            <button
              className="p-2 text-gray-700 hover:text-green-700 focus:outline-none rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Mobile Navigation"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer Content */}
          <div className="fixed top-20 left-0 right-0 bottom-0 bg-white z-50 overflow-y-auto px-6 py-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-top duration-300">
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 px-3">
                Navigation Menu
              </div>
              {navItems.map((item) => (
                <button
                  key={item.section}
                  onClick={() => {
                    onNavigate(item.section);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3.5 text-base font-semibold rounded-xl transition-all ${
                    activeSection === item.section
                      ? 'bg-green-50 text-green-700 border border-green-200 shadow-sm'
                      : 'text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <span>{item.label}</span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>

            <div className="pt-6 border-t border-gray-100 space-y-3 mt-6">
              <button
                onClick={() => {
                  onNavigate(AppSection.DONATIONS);
                  setIsOpen(false);
                }}
                className="w-full py-4 text-base font-bold text-white bg-green-700 hover:bg-green-800 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                ❤️ Support Our Mission (Donate)
              </button>
              <button
                onClick={() => {
                  onNavigate(AppSection.BOOKINGS);
                  setIsOpen(false);
                }}
                className="w-full py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all text-center"
              >
                📅 Book a Free Consultation
              </button>
              <div className="text-center text-xs text-gray-400 pt-2">
                Catholic Cathedral Secretariat, Bauchi
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
