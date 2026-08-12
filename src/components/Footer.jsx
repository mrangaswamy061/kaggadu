import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Phone, Mail, Instagram, MessageCircle, Heart } from 'lucide-react';

export default function Footer() {
  const [settings, setSettings] = useState({
    phone: '7760013106',
    trekLeadPhone: '9353772729',
    email: 'kaggadu@gmail.com',
    instagram: '@kaggadu_adventures',
    instagramUrl: 'https://instagram.com/kaggadu_adventures',
    whatsappNumber: '917760013106'
  });

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data && data.phone) {
          setSettings(data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-forest-950 text-white pt-12 pb-24 md:pb-12 border-t border-forest-900 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img src="/logo.jpg" alt="Kaggadu Logo" className="w-10 h-10 rounded-xl border border-white/20" />
              <div>
                <span className="font-black text-lg tracking-wider block leading-none">KAGGADU</span>
                <span className="text-[10px] text-emerald-400 font-semibold tracking-widest uppercase">Live with Nature • Since 2020</span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Karnataka's leading trekking and nature adventure community exploring the Western Ghats.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">Quick Links</h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li><Link href="/treks" className="hover:text-white">Treks</Link></li>
              <li><Link href="/calendar" className="hover:text-white">Trek Calendar</Link></li>
              <li><Link href="/gallery" className="hover:text-white">Trail Gallery</Link></li>
              <li><Link href="/events" className="hover:text-white">Events</Link></li>
              <li><Link href="/about" className="hover:text-white">About Kaggadu</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>

          {/* Dynamic Contact Details */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">Contact Us</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <a href={`tel:${settings.phone}`} className="hover:text-white">{settings.phone}</a>
                <span className="text-[10px] text-slate-400">(Main Line)</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <a href={`tel:${settings.trekLeadPhone}`} className="hover:text-white">{settings.trekLeadPhone}</a>
                <span className="text-[10px] text-slate-400">(Trek Lead)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <a href={`mailto:${settings.email}`} className="hover:text-white">{settings.email}</a>
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="w-3.5 h-3.5 text-emerald-400" />
                <a href={settings.instagramUrl || 'https://instagram.com/kaggadu_adventures'} target="_blank" rel="noreferrer" className="hover:text-white">
                  {settings.instagram || '@kaggadu_adventures'}
                </a>
              </li>
            </ul>
          </div>

          {/* WhatsApp Direct CTA */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">WhatsApp Support</h4>
            <p className="text-xs text-slate-300">Have questions about trek dates or homestay food? Reach out anytime!</p>
            <a
              href={`https://wa.me/${settings.whatsappNumber || '917760013106'}?text=Hi%20Kaggadu%20Adventures%2C%20I%20have%20a%20question`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-md"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>CHAT ON WHATSAPP</span>
            </a>
          </div>

        </div>

        {/* Copyright */}
        <div className="border-t border-forest-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© {new Date().getFullYear()} KAGGADU ADVENTURES. All rights reserved.</p>
          <div className="flex items-center gap-1 text-[11px]">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            <span>for Karnataka Trekkers</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
