import React, { useState, useEffect } from 'react';
import { Search, Compass, SlidersHorizontal } from 'lucide-react';
import TrekCard from '../components/TrekCard';
import FilterChips from '../components/FilterChips';
import { TrekCardSkeleton } from '../components/SkeletonLoader';

export default function TreksPage() {
  const [treks, setTreks] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTreks();
  }, [category, difficultyFilter, search]);

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
      if (category !== 'All') {
        mergedList = mergedList.filter(t => t.category?.toLowerCase() === category.toLowerCase() || t.difficulty?.toLowerCase().includes(category.toLowerCase()));
      }
      if (difficultyFilter !== 'All') {
        mergedList = mergedList.filter(t => t.difficulty?.toLowerCase().includes(difficultyFilter.toLowerCase()));
      }
      if (search) {
        const q = search.toLowerCase();
        mergedList = mergedList.filter(t => t.name?.toLowerCase().includes(q) || t.location?.toLowerCase().includes(q));
      }

      setTreks(mergedList);
    } catch (err) {
      console.error('Error fetching treks:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-forest-900 text-white p-6 sm:p-8 rounded-3xl space-y-2">
        <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider block">
          Karnataka Western Ghats
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight">Explore All Treks</h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
          Choose from monsoon ridge walks, challenging mountain summits, and serene forest waterfall trails.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          
          {/* Search Field */}
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="Search Kudremukha, Netravathi, Kodachadri..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-earth-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-forest-700/20 focus:border-forest-700"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>

          {/* Difficulty Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <SlidersHorizontal className="w-4 h-4 text-slate-500 shrink-0" />
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="w-full sm:w-auto bg-earth-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Moderate">Moderate</option>
              <option value="Hard">Moderate – Hard</option>
            </select>
          </div>
        </div>

        {/* Filter Chips */}
        <FilterChips activeCategory={category} onSelectCategory={setCategory} />
      </div>

      {/* Trek Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map(n => <TrekCardSkeleton key={n} />)}
        </div>
      ) : treks.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <Compass className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No treks matching your search</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search criteria or explore all available Western Ghats treks.
          </p>
          <button
            onClick={() => { setCategory('All'); setDifficultyFilter('All'); setSearch(''); }}
            className="px-5 py-2 bg-forest-900 text-white text-xs font-bold rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {treks.map(trek => (
            <TrekCard key={trek.id} trek={trek} />
          ))}
        </div>
      )}

    </div>
  );
}
