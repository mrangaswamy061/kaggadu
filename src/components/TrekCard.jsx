import React from 'react';
import { Link } from 'wouter';
import { MapPin, Calendar, Footprints, Clock, ArrowRight } from 'lucide-react';

export default function TrekCard({ trek, nextBatchDate }) {
  const getDifficultyBadge = (difficulty) => {
    const diff = difficulty?.toLowerCase() || '';
    if (diff.includes('easy')) {
      return <span className="badge-difficulty-easy px-2.5 py-0.5 rounded-full text-[11px] font-semibold">Easy</span>;
    } else if (diff.includes('hard')) {
      return <span className="badge-difficulty-hard px-2.5 py-0.5 rounded-full text-[11px] font-semibold">Moderate – Hard</span>;
    }
    return <span className="badge-difficulty-moderate px-2.5 py-0.5 rounded-full text-[11px] font-semibold">Moderate</span>;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col group">
      
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={trek.image || '/images/hero_western_ghats.jpg'}
          alt={trek.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Difficulty Badge Top Right */}
        <div className="absolute top-3 right-3">
          {getDifficultyBadge(trek.difficulty)}
        </div>

        {/* Category Chip Top Left */}
        {trek.category && (
          <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border border-white/20">
            {trek.category}
          </div>
        )}

        {/* Location & Title overlay at bottom of image */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-300 mb-0.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>{trek.location}</span>
          </div>
          <h3 className="text-lg font-bold leading-snug drop-shadow-sm">
            {trek.name}
          </h3>
        </div>
      </div>

      {/* Info Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2 py-2 border-b border-slate-100 mb-3 text-slate-600 text-xs">
          <div className="flex items-center gap-1.5">
            <Footprints className="w-3.5 h-3.5 text-forest-700 shrink-0" />
            <span className="truncate font-medium text-slate-800">{trek.distance}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-forest-700 shrink-0" />
            <span className="truncate font-medium text-slate-800">{trek.duration || '2 Days'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-forest-700 shrink-0" />
            <span className="truncate font-medium text-slate-800">{nextBatchDate || 'Next Weekend'}</span>
          </div>
        </div>

        {/* Tagline */}
        <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
          {trek.tagline || `Experience scenic Western Ghats trail with Kaggadu Adventures.`}
        </p>

        {/* Price & Action CTA */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <div>
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">Starting at</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-extrabold text-forest-900">₹{trek.price?.toLocaleString()}</span>
              <span className="text-[10px] text-slate-500 font-medium">/ person</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/treks/${trek.slug || trek.id}`}
              className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-forest-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Details
            </Link>

            <Link
              href={`/book/${trek.slug || trek.id}`}
              className="px-3.5 py-2 text-xs font-bold text-white bg-forest-900 hover:bg-forest-800 active:scale-95 rounded-xl transition-all flex items-center gap-1 shadow-sm"
            >
              <span>BOOK NOW</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
