import React, { useState, useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import { MapPin, Footprints, Clock, Mountain, Sun, Users, CheckCircle2, XCircle, AlertCircle, ChevronDown, ChevronUp, Calendar, ShieldCheck, ArrowRight, Check } from 'lucide-react';
import StickyBookBar from '../components/StickyBookBar';
import { TrekDetailSkeleton } from '../components/SkeletonLoader';

export default function TrekDetailPage() {
  const [, params] = useRoute('/treks/:slug');
  const slug = params?.slug;

  const [trek, setTrek] = useState(null);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});

  useEffect(() => {
    if (slug) {
      fetchTrekDetails();
    }
  }, [slug]);

  const fetchTrekDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/treks/${slug}`);
      if (!res.ok) throw new Error('Not found');
      const trekData = await res.json();
      setTrek(trekData);

      // Fetch batches for this trek
      const batchRes = await fetch(`/api/batches?trekId=${trekData.id}`);
      const batchData = await batchRes.json();
      setBatches(batchData || []);
      if (batchData?.length > 0) {
        setSelectedBatch(batchData[0]);
      }
    } catch (err) {
      console.error('Error fetching trek details:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleCheck = (idx) => {
    setCheckedItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  if (loading) return <TrekDetailSkeleton />;

  if (!trek) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-4">
        <Mountain className="w-16 h-16 text-slate-300 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Trek Not Found</h2>
        <p className="text-xs text-slate-500">The trek you are looking for does not exist or has been updated.</p>
        <Link href="/treks" className="inline-block px-5 py-2.5 bg-forest-900 text-white font-bold text-xs rounded-xl">
          Back to All Treks
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-32">
      
      {/* 1. HERO IMAGE HEADER */}
      <div className="relative h-[55vh] md:h-[65vh] w-full overflow-hidden bg-slate-950">
        <img
          src={trek.image || '/images/hero_western_ghats.jpg'}
          alt={trek.name}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        <div className="absolute bottom-6 left-0 right-0 max-w-4xl mx-auto px-4 text-white space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-emerald-500/90 backdrop-blur-md text-forest-950 font-extrabold text-[10px] uppercase rounded-full tracking-wide">
              {trek.difficulty}
            </span>
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white font-semibold text-[10px] rounded-full flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-300" />
              {trek.location}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            {trek.name}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-normal max-w-xl">
            {trek.tagline}
          </p>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="max-w-4xl mx-auto px-4 mt-6 space-y-8">
        
        {/* 2. ICON-BASED OVERVIEW CARDS */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center shrink-0">
              <Footprints className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-medium block">Distance</span>
              <span className="text-xs font-bold text-slate-900">{trek.distance}</span>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Mountain className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-medium block">Altitude</span>
              <span className="text-xs font-bold text-slate-900">{trek.altitude}</span>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-medium block">Duration</span>
              <span className="text-xs font-bold text-slate-900">{trek.duration}</span>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-medium block">Best Season</span>
              <span className="text-xs font-bold text-slate-900 truncate">{trek.bestSeason?.split(' ')[0]}</span>
            </div>
          </div>
        </section>

        {/* 3. UPCOMING BATCHES SELECTOR */}
        {batches.length > 0 && (
          <section className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-forest-700" />
                  <span>Select Upcoming Batch</span>
                </h3>
                <p className="text-xs text-slate-500">Pick a convenient weekend to book your seat</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {batches.map((batch) => {
                const availableSeats = (batch.capacity || 25) - (batch.bookedCount || 0);
                const isFull = batch.status === 'Full' || availableSeats <= 0;
                const isSelected = selectedBatch?.id === batch.id;

                return (
                  <div
                    key={batch.id}
                    onClick={() => !isFull && setSelectedBatch(batch)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isFull
                        ? 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'
                        : isSelected
                        ? 'bg-forest-50/80 border-forest-700 shadow-sm ring-1 ring-forest-700'
                        : 'bg-white border-slate-200 hover:border-forest-300'
                    }`}
                  >
                    <div>
                      <div className="font-extrabold text-sm text-slate-900">
                        {batch.startDate} to {batch.endDate}
                      </div>
                      <div className="text-xs text-slate-500 font-medium mt-0.5">
                        ₹{batch.price?.toLocaleString()} / person
                      </div>
                    </div>

                    <div>
                      {isFull ? (
                        <span className="px-2.5 py-1 bg-rose-100 text-rose-800 font-bold text-[10px] rounded-full uppercase">
                          FULL
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full">
                          {availableSeats} seats left
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 4. TREK HIGHLIGHTS */}
        {trek.highlights && trek.highlights.length > 0 && (
          <section className="space-y-3">
            <h3 className="font-extrabold text-lg text-slate-900">Trek Highlights</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {trek.highlights.map((item, idx) => (
                <div key={idx} className="bg-white p-3.5 rounded-2xl border border-slate-200/80 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-800">{item}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. TIMELINE ITINERARY */}
        {trek.itinerary && trek.itinerary.length > 0 && (
          <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-lg text-slate-900">Trek Itinerary</h3>
            <div className="relative pl-6 border-l-2 border-forest-200 space-y-6">
              {trek.itinerary.map((item, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-forest-700 ring-4 ring-white" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-forest-700 bg-forest-50 px-2 py-0.5 rounded-md">
                    {item.day}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 mt-1">{item.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. INCLUDED / NOT INCLUDED */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Included */}
          <div className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-sm space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>What is Included</span>
            </h3>
            <ul className="space-y-2">
              {trek.included?.map((inc, i) => (
                <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{inc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Not Included */}
          <div className="bg-white p-5 rounded-3xl border border-rose-100 shadow-sm space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-500" />
              <span>Not Included</span>
            </h3>
            <ul className="space-y-2">
              {trek.excluded?.map((exc, i) => (
                <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>{exc}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 7. PACKING CHECKLIST */}
        {trek.checklist && trek.checklist.length > 0 && (
          <section className="bg-earth-50 p-5 rounded-3xl border border-slate-200/80 space-y-3">
            <h3 className="font-extrabold text-base text-slate-900">Packing Checklist</h3>
            <p className="text-xs text-slate-500">Tap to check items as you pack your backpack</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {trek.checklist.map((item, idx) => (
                <label
                  key={idx}
                  onClick={() => toggleCheck(idx)}
                  className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer text-xs font-medium transition-colors ${
                    checkedItems[idx]
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900 line-through'
                      : 'bg-white border-slate-200 text-slate-800'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={!!checkedItems[idx]}
                    onChange={() => {}}
                    className="w-4 h-4 text-forest-700 rounded focus:ring-forest-700"
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </section>
        )}

        {/* 8. SAFETY FIRST SECTION */}
        <section className="bg-forest-900 text-white p-6 rounded-3xl space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h3 className="font-extrabold text-lg">Adventure With Safety First</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
            <div className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Experienced local trek leaders who know Western Ghats trails inside out</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Basic first-aid kit carried on every single trek</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Monsoon weather monitoring & emergency evacuation protocol</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Small managed group sizes for personalized care</span>
            </div>
          </div>
        </section>

        {/* 9. FAQs ACCORDION */}
        {trek.faqs && trek.faqs.length > 0 && (
          <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-extrabold text-lg text-slate-900">Frequently Asked Questions</h3>
            <div className="divide-y divide-slate-100">
              {trek.faqs.map((faq, idx) => (
                <div key={idx} className="py-3">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between text-left font-bold text-xs sm:text-sm text-slate-800"
                  >
                    <span>{faq.question}</span>
                    {openFaq === idx ? (
                      <ChevronUp className="w-4 h-4 text-forest-700 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {openFaq === idx && (
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed animate-fade-in">
                      {faq.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

      </div>

      {/* STICKY BOTTOM BOOKING CTA BAR */}
      <StickyBookBar trek={trek} />

    </div>
  );
}
