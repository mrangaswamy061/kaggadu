import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Search, Shield, Users, MapPin, Compass, Star, ArrowRight, MessageCircle, HeartHandshake, Mountain, Sparkles, CheckCircle2 } from 'lucide-react';
import TrekCard from '../components/TrekCard';
import FilterChips from '../components/FilterChips';
import { TrekCardSkeleton } from '../components/SkeletonLoader';

export default function HomePage({ searchQuery, setSearchQuery }) {
  const [treks, setTreks] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [offers, setOffers] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTreks();
    fetchReviews();
    fetchAnnouncements();
    fetchOffers();

    // Auto-polling every 15s for live real-time updates from Admin Panel
    const timer = setInterval(() => {
      fetchTreks();
      fetchAnnouncements();
      fetchOffers();
    }, 15000);

    return () => clearInterval(timer);
  }, [activeCategory, searchQuery]);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/announcements?activeOnly=true');
      const data = await res.json();
      setAnnouncements(data || []);
    } catch (e) {}
  };

  const fetchOffers = async () => {
    try {
      const res = await fetch('/api/offers?activeOnly=true');
      const data = await res.json();
      setOffers(data || []);
    } catch (e) {}
  };

  const fetchTreks = async () => {
    setLoading(true);
    try {
      let apiTreks = [];
      try {
        const res = await fetch('/api/treks?publishedOnly=true');
        apiTreks = await res.json();
      } catch(e) {}

      let customTreks = [];
      try {
        customTreks = JSON.parse(localStorage.getItem('kaggadu_custom_treks') || '[]');
      } catch(e) {}

      const mergedMap = new Map();
      (apiTreks || []).forEach(t => mergedMap.set(t.id || t.slug, t));
      customTreks.forEach(t => mergedMap.set(t.id || t.slug, t));

      let mergedList = Array.from(mergedMap.values());
      if (activeCategory !== 'All') {
        mergedList = mergedList.filter(t => t.category?.toLowerCase() === activeCategory.toLowerCase() || t.difficulty?.toLowerCase().includes(activeCategory.toLowerCase()));
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        mergedList = mergedList.filter(t => t.name?.toLowerCase().includes(q) || t.location?.toLowerCase().includes(q));
      }

      setTreks(mergedList);
    } catch (err) {
      console.error('Error fetching treks:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews');
      const data = await res.json();
      setReviews(data || []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  return (
    <div className="space-y-6 md:space-y-12">
      
      {/* 0. DYNAMIC ANNOUNCEMENT BANNERS */}
      {announcements.length > 0 && (
        <div className="space-y-2 max-w-7xl mx-auto px-4 pt-2">
          {announcements.map((anc) => (
            <div
              key={anc.id}
              className="bg-gradient-to-r from-emerald-900 via-forest-900 to-emerald-950 text-white p-3.5 rounded-2xl shadow-sm border border-emerald-500/30 flex items-center justify-between gap-3 text-xs animate-fade-in"
            >
              <div className="flex items-center gap-2.5">
                <span className="bg-emerald-400 text-forest-950 font-black text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                  {anc.badge || 'UPDATE'}
                </span>
                <span className="font-extrabold text-slate-100">{anc.title}</span>
                <span className="hidden sm:inline text-slate-300">• {anc.message}</span>
              </div>
              {anc.link && (
                <Link href={anc.link} className="px-3 py-1 bg-white/10 hover:bg-white/20 text-emerald-300 font-bold text-[11px] rounded-lg shrink-0 flex items-center gap-1">
                  <span>View</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[80vh] flex items-center justify-center rounded-b-[2.5rem] overflow-hidden -mt-2 bg-forest-950 text-white px-4">
        {/* Background Image with Overlay */}
        <img
          src="/images/hero_western_ghats.jpg"
          alt="Western Ghats Trekking background"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-40 scale-105 transform animate-pulse duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/60 to-transparent" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6 pt-12 pb-16">
          
          {/* Brand Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-emerald-300 tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>KAGGADU ADVENTURES • SINCE 2020</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight uppercase font-sans">
            LIVE WITH <span className="text-emerald-400 underline decoration-emerald-500/50">NATURE</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-200 font-normal max-w-xl mx-auto leading-relaxed">
            Adventure through the breathtaking Western Ghats of Karnataka with Kaggadu Adventures. Authentic group trekking, camping & monsoon trails.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/treks"
              className="w-full sm:w-auto px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-forest-950 font-extrabold text-sm rounded-full transition-all shadow-lg shadow-emerald-500/20 text-center flex items-center justify-center gap-2"
            >
              <span>BOOK A TREK</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/treks"
              className="w-full sm:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-semibold text-sm rounded-full transition-all border border-white/30 text-center backdrop-blur-sm"
            >
              EXPLORE TREKS
            </Link>
          </div>

          {/* Direct WhatsApp link */}
          <div className="pt-2">
            <a
              href="https://wa.me/917760013106?text=Hi%20Kaggadu%20Adventures%2C%20I%20want%20to%20know%20about%20upcoming%20treks"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-emerald-300 hover:text-emerald-200 underline font-medium"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-emerald-400 text-forest-950" />
              <span>Questions? WhatsApp us directly at 7760013106</span>
            </a>
          </div>
        </div>
      </section>

      {/* DYNAMIC PROMOTIONAL OFFERS & DISCOUNTS */}
      {offers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {offers.map((off) => (
              <div key={off.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {off.discount || 'LIMITED OFFER'}
                  </span>
                  <h3 className="font-extrabold text-sm text-slate-900">{off.title}</h3>
                  <p className="text-xs text-slate-500">{off.description}</p>
                </div>
                {off.code && (
                  <div className="bg-earth-50 border border-slate-300 p-2.5 rounded-2xl text-center shrink-0">
                    <span className="text-[9px] font-extrabold text-slate-400 block uppercase">USE CODE</span>
                    <span className="font-mono text-xs font-black text-forest-900 tracking-wider">{off.code}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 2. QUICK TREK SEARCH & FILTER CHIPS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-5 md:p-6 border border-slate-200/80 shadow-soft-lg space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Where do you want to go?
              </h2>
              <p className="text-xs text-slate-500">
                Explore Karnataka's finest Western Ghats trekking destinations
              </p>
            </div>

            {/* Quick Search Input */}
            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="Search Kudremukha, Netravathi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-earth-50 border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-forest-700/20 focus:border-forest-700 transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* Filter Chips */}
          <FilterChips
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />
        </div>
      </section>

      {/* 3. UPCOMING TREKS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Upcoming Adventures</span>
              <span className="text-xs bg-forest-100 text-forest-800 px-2.5 py-0.5 rounded-full font-bold">
                {treks.length} Available
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Handpicked weekend & monsoon group treks
            </p>
          </div>

          <Link
            href="/treks"
            className="text-xs font-bold text-forest-700 hover:text-forest-900 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <TrekCardSkeleton key={n} />
            ))}
          </div>
        ) : treks.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200">
            <Mountain className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-base">New Adventures Coming Soon</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              We are adding new batch dates for this category. Contact us on WhatsApp for custom group requests!
            </p>
            <button
              onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
              className="px-4 py-2 bg-forest-900 text-white text-xs font-semibold rounded-xl"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {treks.map((trek) => (
              <TrekCard key={trek.id} trek={trek} />
            ))}
          </div>
        )}
      </section>

      {/* 4. WHY KAGGADU SECTION */}
      <section className="bg-forest-900 text-white py-12 md:py-16 rounded-3xl mx-4 sm:mx-6 lg:mx-8 px-6 sm:px-10">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest block mb-2">
            Why Travel With Us
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight">
            Trek With Safety, Community & Trust
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mt-2">
            Kaggadu Adventures is founded by local adventure lovers who know every trail, peak, and stream in the Western Ghats.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base">Experienced Trek Leaders</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Our trek leads carry years of Western Ghats trail experience, first-aid knowledge, and safety protocols.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base">Small Managed Groups</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              We keep group sizes small so every trekker gets personal attention, safety, and real community bonding.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base">Responsible & Local</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              We support local villagers, stay in authentic Malnad homestays, and follow Leave No Trace ethics strictly.
            </p>
          </div>
        </div>
      </section>


      {/* 6. INSTAGRAM SECTION FALLBACK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-900 to-forest-900 text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest block">
              Follow Our Adventures
            </span>
            <h3 className="text-2xl font-bold">@kaggadu_adventures</h3>
            <p className="text-xs text-slate-300 max-w-md">
              Watch real trek reels, waterfall clips, and photos updated every weekend straight from the trails.
            </p>
          </div>

          <a
            href="https://instagram.com/kaggadu_adventures"
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 bg-white text-forest-950 font-bold text-xs rounded-full hover:bg-slate-100 transition-all shrink-0 active:scale-95 shadow-md"
          >
            Follow on Instagram
          </a>
        </div>
      </section>

    </div>
  );
}
