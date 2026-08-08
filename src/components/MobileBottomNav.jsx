import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Home, Compass, Calendar, Grid, Info, PhoneCall, Image, CalendarCheck, Shield, X, Ticket } from 'lucide-react';

export default function MobileBottomNav() {
  const [location] = useLocation();
  const [moreDrawerOpen, setMoreDrawerOpen] = useState(false);

  const mainTabs = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Treks', path: '/treks', icon: Compass },
    { name: 'Calendar', path: '/calendar', icon: Calendar },
  ];

  return (
    <>
      {/* Fixed Sticky Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-bottom-nav md:hidden pb-safe">
        <div className="grid grid-cols-4 items-center h-16 px-1">
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = location === tab.path || (tab.path === '/treks' && location.startsWith('/treks/'));
            return (
              <Link
                key={tab.path}
                href={tab.path}
                className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
                  isActive ? 'text-forest-800 font-bold' : 'text-slate-500 font-normal hover:text-slate-900'
                }`}
              >
                <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-forest-100/80 text-forest-800' : ''}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] leading-tight mt-0.5">{tab.name}</span>
              </Link>
            );
          })}

          {/* More Tab Trigger */}
          <button
            onClick={() => setMoreDrawerOpen(true)}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
              moreDrawerOpen ? 'text-forest-800 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${moreDrawerOpen ? 'bg-forest-100/80 text-forest-800' : ''}`}>
              <Grid className="w-5 h-5" />
            </div>
            <span className="text-[11px] leading-tight mt-0.5">More</span>
          </button>
        </div>
      </nav>

      {/* Slide-Up Bottom Sheet for "More" Menu */}
      {moreDrawerOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm md:hidden animate-fade-in">
          <div className="bg-white rounded-t-3xl p-6 shadow-2xl border-t border-slate-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <img src="/logo.jpg" alt="Logo" className="w-8 h-8 rounded-md" />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">KAGGADU ADVENTURES</h3>
                  <p className="text-[10px] text-slate-500">Live with Nature • Since 2020</p>
                </div>
              </div>
              <button
                onClick={() => setMoreDrawerOpen(false)}
                className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 py-5">
              <Link
                href="/gallery"
                onClick={() => setMoreDrawerOpen(false)}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-earth-50 hover:bg-forest-50 border border-slate-200/80 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center">
                  <Image className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-semibold text-xs text-slate-900 block">Gallery</span>
                  <span className="text-[10px] text-slate-500">Trek photos</span>
                </div>
              </Link>

              <Link
                href="/events"
                onClick={() => setMoreDrawerOpen(false)}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-earth-50 hover:bg-forest-50 border border-slate-200/80 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-semibold text-xs text-slate-900 block">Events</span>
                  <span className="text-[10px] text-slate-500">Community trips</span>
                </div>
              </Link>

              <Link
                href="/about"
                onClick={() => setMoreDrawerOpen(false)}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-earth-50 hover:bg-forest-50 border border-slate-200/80 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-semibold text-xs text-slate-900 block">About Us</span>
                  <span className="text-[10px] text-slate-500">Our story</span>
                </div>
              </Link>

              <Link
                href="/contact"
                onClick={() => setMoreDrawerOpen(false)}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-earth-50 hover:bg-forest-50 border border-slate-200/80 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-semibold text-xs text-slate-900 block">Contact</span>
                  <span className="text-[10px] text-slate-500">7760013106</span>
                </div>
              </Link>
            </div>

            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <a
                href="https://wa.me/917760013106?text=Hi%20Kaggadu%20Adventures%2C%20I%20want%20to%20check%20my%20booking%20status"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-forest-900 text-white font-semibold text-xs shadow-sm"
              >
                <Ticket className="w-4 h-4 text-emerald-400" />
                Check Booking Status via WhatsApp
              </a>

              <Link
                href="/kaggadu-admin-access"
                onClick={() => setMoreDrawerOpen(false)}
                className="w-full text-center py-2 text-[11px] font-medium text-slate-400 hover:text-slate-700 flex items-center justify-center gap-1"
              >
                <Shield className="w-3.5 h-3.5" /> Kaggadu Admin Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
