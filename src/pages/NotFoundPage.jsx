import React from 'react';
import { Link } from 'wouter';
import { Compass, Footprints, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="max-w-md mx-auto py-20 px-4 text-center space-y-6">
      <div className="w-20 h-20 rounded-3xl bg-forest-100 text-forest-800 flex items-center justify-center mx-auto shadow-sm">
        <Compass className="w-10 h-10 animate-spin duration-3000" />
      </div>

      <div className="space-y-2">
        <span className="text-4xl font-black text-forest-900">404</span>
        <h1 className="text-xl font-extrabold text-slate-900">
          Looks like you've taken the wrong trail!
        </h1>
        <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
          The page or trail you are looking for has moved or does not exist. Let's get you back on the summit trail.
        </p>
      </div>

      <div className="pt-2">
        <Link
          href="/treks"
          className="inline-flex items-center gap-2 px-6 py-3 bg-forest-900 hover:bg-forest-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO TREKS</span>
        </Link>
      </div>
    </div>
  );
}
