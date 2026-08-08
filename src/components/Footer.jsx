import React from 'react';
import { Link } from 'wouter';
import { Phone, Mail, Instagram, MessageCircle, Heart } from 'lucide-react';

export default function Footer() {
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

          {/* Contact Details */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">Contact Us</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <a href="tel:7760013106" className="hover:text-white">7760013106</a>
                <span className="text-[10px] text-slate-400">(Main Line)</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <a href="tel:9353772729" className="hover:text-white">9353772729</a>
                <span className="text-[10px] text-slate-400">(Trek Lead)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <a href="mailto:kaggadu@gmail.com" className="hover:text-white">kaggadu@gmail.com</a>
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="w-3.5 h-3.5 text-emerald-400" />
                <a href="https://instagram.com/kaggadu_adventures" target="_blank" rel="noreferrer" className="hover:text-white">@kaggadu_adventures</a>
              </li>
            </ul>
          </div>

          {/* Legal & Policies */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">Policies</h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-white">Cancellation Policy</a></li>
              <li><a href="#" className="hover:text-white">Safety Guidelines</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <span>© 2020 Kaggadu Adventures. All Rights Reserved.</span>
          <span className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Karnataka Trekkers
          </span>
        </div>

      </div>
    </footer>
  );
}
