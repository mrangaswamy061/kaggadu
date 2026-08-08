import React from 'react';
import { Phone, MessageCircle, Mail, Instagram, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      <div className="bg-forest-900 text-white p-6 sm:p-8 rounded-3xl space-y-2">
        <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider block">
          Get In Touch
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight">Contact Kaggadu Adventures</h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Have questions about upcoming treks, custom group bookings, or payment updates? We are here to help!
        </p>
      </div>

      {/* Quick Contact Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Primary Kaggadu Phone */}
        <a
          href="tel:7760013106"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-forest-700 transition-all flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center shrink-0">
            <Phone className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Kaggadu Main Line</span>
            <span className="font-extrabold text-base text-slate-900">7760013106</span>
            <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">Tap to Call</span>
          </div>
        </a>

        {/* Trek Lead Phone */}
        <a
          href="tel:9353772729"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-forest-700 transition-all flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <Phone className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Trek Lead Line</span>
            <span className="font-extrabold text-base text-slate-900">9353772729</span>
            <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">Tap to Call</span>
          </div>
        </a>

        {/* WhatsApp Direct */}
        <a
          href="https://wa.me/917760013106?text=Hi%20Kaggadu%20Adventures%2C%20I%20have%20an%20enquiry!"
          target="_blank"
          rel="noreferrer"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-500 transition-all flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <MessageCircle className="w-6 h-6 fill-white" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">WhatsApp Support</span>
            <span className="font-extrabold text-base text-slate-900">7760013106</span>
            <span className="text-[11px] text-emerald-600 font-semibold block mt-0.5">Instant Chat</span>
          </div>
        </a>

        {/* Email */}
        <a
          href="mailto:kaggadu@gmail.com"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-500 transition-all flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Email Address</span>
            <span className="font-bold text-sm text-slate-900">kaggadu@gmail.com</span>
            <span className="text-[11px] text-blue-600 font-semibold block mt-0.5">Send Email</span>
          </div>
        </a>

      </div>

      {/* Instagram Official Banner */}
      <div className="bg-gradient-to-r from-purple-900 to-forest-900 text-white p-6 rounded-3xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Instagram className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base">@kaggadu_adventures</h3>
            <span className="text-xs text-purple-200">Official Instagram Page</span>
          </div>
        </div>
        <a
          href="https://instagram.com/kaggadu_adventures"
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 bg-white text-forest-950 font-bold text-xs rounded-xl hover:bg-slate-100 shrink-0"
        >
          Follow Page
        </a>
      </div>

    </div>
  );
}
