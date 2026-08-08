import React from 'react';
import { Link } from 'wouter';
import { ArrowRight, MessageCircle } from 'lucide-react';

export default function StickyBookBar({ trek }) {
  if (!trek) return null;

  return (
    <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl py-3 px-4 transition-all">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block">
            Starting Price
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-forest-900">
              ₹{trek.price?.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-slate-500">/ person</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`https://wa.me/917760013106?text=Hi%20Kaggadu%20Adventures%2C%20I%20have%20a%20question%20about%20the%20${encodeURIComponent(trek.name)}%20trek`}
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
            title="Ask via WhatsApp"
          >
            <MessageCircle className="w-5 h-5 fill-emerald-600 text-emerald-600" />
          </a>

          <Link
            href={`/book/${trek.slug || trek.id}`}
            className="px-6 py-3 bg-forest-900 hover:bg-forest-800 active:scale-95 text-white font-extrabold text-xs tracking-wider rounded-xl transition-all shadow-md flex items-center gap-1.5"
          >
            <span>BOOK NOW</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
