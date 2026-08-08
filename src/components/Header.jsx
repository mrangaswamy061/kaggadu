import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Compass, Phone, MessageCircle, Menu, X, Search, ShieldCheck } from 'lucide-react';

export default function Header({ onOpenSearch }) {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Treks', path: '/treks' },
    { name: 'Calendar', path: '/calendar' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${
      scrolled ? 'glass-nav shadow-sm py-2.5' : 'bg-white/95 backdrop-blur-md py-3'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <img 
            src="/logo.jpg" 
            alt="Kaggadu Adventures Logo" 
            className="h-10 w-auto rounded-lg shadow-sm border border-forest-100 group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-wider text-forest-900 leading-none">
              KAGGADU
            </span>
            <span className="text-[10px] font-medium text-forest-700 tracking-widest uppercase mt-0.5">
              Live with Nature • Since 2020
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7">
          {navItems.map((item) => {
            const isActive = location === item.path;
            return (
              <Link 
                key={item.path} 
                href={item.path}
                className={`text-sm font-semibold transition-colors py-1 relative ${
                  isActive 
                    ? 'text-forest-700' 
                    : 'text-slate-700 hover:text-forest-800'
                }`}
              >
                {item.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-forest-700 rounded-full animate-fade-in" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Header Actions */}
        <div className="hidden md:flex items-center gap-3">
          <button 
            onClick={onOpenSearch}
            className="p-2 text-slate-600 hover:text-forest-800 rounded-full hover:bg-forest-50 transition-colors"
            title="Search Treks"
          >
            <Search className="w-5 h-5" />
          </button>
          
          <a
            href="https://wa.me/917760013106?text=Hi%20Kaggadu%20Adventures%2C%20I%20am%20interested%20in%20a%20trek!"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-full transition-colors border border-emerald-200"
          >
            <MessageCircle className="w-4 h-4 fill-emerald-600 text-emerald-600" />
            WhatsApp Us
          </a>

          <Link
            href="/treks"
            className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white bg-forest-900 hover:bg-forest-800 rounded-full transition-all shadow-sm hover:shadow-md"
          >
            BOOK A TREK
          </Link>
        </div>

        {/* Mobile Header Buttons */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onOpenSearch}
            className="p-2 text-slate-700 hover:text-forest-800 rounded-full active:bg-forest-50 transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-800 rounded-lg hover:bg-forest-50 transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Top Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-nav border-b border-forest-100 px-4 pt-3 pb-6 animate-fade-in">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2.5 rounded-xl font-medium text-sm flex items-center justify-between ${
                  location === item.path 
                    ? 'bg-forest-100 text-forest-900 font-semibold' 
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{item.name}</span>
                <span className="text-xs text-slate-400">→</span>
              </Link>
            ))}

            <div className="pt-3 mt-2 border-t border-slate-200 flex flex-col gap-2">
              <a
                href="https://wa.me/917760013106?text=Hi%20Kaggadu%20Adventures%2C%20I%20want%20to%20know%20about%20upcoming%20treks"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 text-white font-semibold text-sm shadow-sm"
              >
                <MessageCircle className="w-5 h-5" />
                Chat on WhatsApp (7760013106)
              </a>

              <Link
                href="/kaggadu-admin-access"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-slate-500 hover:text-slate-800"
              >
                <ShieldCheck className="w-4 h-4" /> Admin Portal Access
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
