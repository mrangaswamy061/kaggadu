import React from 'react';
import { Shield, Compass, Heart, Users, MapPin, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      {/* Brand Story Header */}
      <div className="bg-forest-900 text-white p-8 rounded-3xl space-y-3 text-center">
        <img src="/logo.jpg" alt="Kaggadu Logo" className="w-16 h-16 rounded-2xl mx-auto border-2 border-emerald-400/30" />
        <span className="text-emerald-400 text-xs font-extrabold uppercase tracking-widest block">
          Since 2020
        </span>
        <h1 className="text-3xl font-black uppercase tracking-tight">LIVE WITH NATURE</h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          Kaggadu Adventures is a dedicated trekking and adventure community focused on exploring the pristine Western Ghats of Karnataka.
        </p>
      </div>

      {/* Story & Philosophy */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs text-slate-700 leading-relaxed">
        <h2 className="text-lg font-extrabold text-slate-900">Our Story</h2>
        <p>
          Founded in 2020 in Karnataka, <strong>Kaggadu Adventures</strong> was born out of a deep love for the lush green mountains, cascading waterfalls, and misty ridge walks of the Western Ghats. We are not a corporate travel agency — we are a passionate community of outdoor lovers, trek guides, and nature stewards.
        </p>
        <p>
          Whether conquering Kudremukha's iconic horse-face peak, walking along Netravathi’s rolling green spine, or camping under the stars in Charmadi, we aim to deliver safe, authentic, and memorable nature experiences for every trekker.
        </p>
      </div>

      {/* 6 Core Pillars */}
      <div className="space-y-4">
        <h2 className="text-xl font-extrabold text-slate-900 text-center">Why Kaggadu</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Experienced Trek Leaders</h3>
            <p className="text-xs text-slate-600">Trail-tested leaders equipped with first aid & safety protocols.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Small Managed Groups</h3>
            <p className="text-xs text-slate-600">Maximized safety, personal attention, and lifelong friendships.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Local Knowledge</h3>
            <p className="text-xs text-slate-600">Deep roots in Western Ghats villages, local homestays & trails.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Responsible Travel</h3>
            <p className="text-xs text-slate-600">Leave No Trace ethics, eco-friendly permits & plastic control.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Authentic Food & Stay</h3>
            <p className="text-xs text-slate-600">Home-cooked Malnad meals and warm local hospitality.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Unforgettable Memories</h3>
            <p className="text-xs text-slate-600">Every weekend is a fresh story waiting to be lived.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
