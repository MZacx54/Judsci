
import React, { useState } from 'react';
import { AppSection } from '../types';

import logo from '../assets/logo.png';

interface HeaderProps {
  activeSection: AppSection;
  onNavigate: (section: AppSection) => void;
}

const Header: React.FC<HeaderProps> = ({ activeSection, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' : 'bg-transparent'
      }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate(AppSection.HOME)}>
          <img src={logo} alt="JUDSCI Bauchi" className="h-12 w-auto object-contain" />
          <span className="text-xl font-bold text-gray-900 hidden sm:block">JUDSCI <span className="text-green-700">Bauchi</span></span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-1 lg:space-x-4">
          {navItems.map((item) => (
            <button
              key={item.section}
              onClick={() => onNavigate(item.section)}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeSection === item.section
                ? 'bg-green-50 text-green-700'
                : 'text-gray-600 hover:text-green-700 hover:bg-gray-50'
                }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => onNavigate(AppSection.DONATIONS)}
            className="ml-4 px-4 py-2 text-sm font-semibold text-white bg-green-700 hover:bg-green-800 rounded-full transition-all shadow-md active:scale-95"
          >
            Donate Now
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-gray-600"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </nav>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-2 shadow-xl animate-in fade-in slide-in-from-top-4 duration-200">
          {navItems.map((item) => (
            <button
              key={item.section}
              onClick={() => {
                onNavigate(item.section);
                setIsOpen(false);
              }}
              className={`block w-full text-left px-4 py-3 text-base font-medium rounded-lg ${activeSection === item.section
                ? 'bg-green-50 text-green-700'
                : 'text-gray-600'
                }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
