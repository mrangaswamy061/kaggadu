import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Calendar as CalendarIcon, MapPin, ArrowRight, Compass } from 'lucide-react';

export default function CalendarPage() {
  const [batches, setBatches] = useState([]);
  const [treks, setTreks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCalendarData();
  }, []);

  const fetchCalendarData = async () => {
    setLoading(true);
    try {
      const [batchesRes, treksRes] = await Promise.all([
        fetch('/api/batches'),
        fetch('/api/treks?publishedOnly=true')
      ]);
      const batchData = await batchesRes.json();
      const trekData = await treksRes.json();

      setBatches(batchData || []);
      setTreks(trekData || []);
    } catch (err) {
      console.error('Error fetching calendar data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTrekInfo = (trekId) => {
    return treks.find(t => t.id === trekId || t.slug === trekId) || {};
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-forest-900 text-white p-6 rounded-3xl space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full">
          <CalendarIcon className="w-3.5 h-3.5" />
          <span>UPCOMING BATCHES CALENDAR</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Trek Schedule</h1>
        <p className="text-xs text-slate-300">
          Find available departure dates for Karnataka Western Ghats group treks. Tap any batch to book directly.
        </p>
      </div>

      {/* Batches List */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4].map(n => (
            <div key={n} className="h-24 bg-slate-200/60 rounded-2xl skeleton-shimmer" />
          ))}
        </div>
      ) : batches.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 space-y-3">
          <Compass className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No upcoming batches listed</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Contact Kaggadu team on WhatsApp to request a custom date for your group!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {batches.map((batch) => {
            const trek = getTrekInfo(batch.trekId);
            const availableSeats = (batch.capacity || 25) - (batch.bookedCount || 0);
            const isFull = batch.status === 'Full' || availableSeats <= 0;

            return (
              <div
                key={batch.id}
                className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  {/* Date Badge */}
                  <div className="w-14 h-14 rounded-2xl bg-forest-100 text-forest-900 flex flex-col items-center justify-center shrink-0 border border-forest-200">
                    <span className="text-[10px] font-black uppercase tracking-wider">
                      {batch.startDate?.split('-')[1] ? new Date(batch.startDate).toLocaleString('default', { month: 'short' }) : 'AUG'}
                    </span>
                    <span className="text-lg font-black leading-none">
                      {batch.startDate?.split('-')[2] || '15'}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-slate-900 text-base">
                        {trek.name || batch.trekId}
                      </h3>
                      {trek.difficulty && (
                        <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                          {trek.difficulty}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-forest-700" />
                        {trek.location || 'Chikkamagaluru'}
                      </span>
                      <span>•</span>
                      <span className="font-bold text-forest-900">
                        ₹{batch.price || trek.price}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                  <div>
                    {isFull ? (
                      <span className="px-3 py-1 bg-rose-100 text-rose-800 font-extrabold text-[10px] rounded-full">
                        FULL
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-extrabold text-[10px] rounded-full">
                        {availableSeats} seats left
                      </span>
                    )}
                  </div>

                  {isFull ? (
                    <a
                      href={`https://wa.me/917760013106?text=Hi%20Kaggadu%20Adventures%2C%20I%20want%20to%20join%20the%20waitlist%20for%20${encodeURIComponent(trek.name)}%20on%20${batch.startDate}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-300"
                    >
                      Join Waitlist
                    </a>
                  ) : (
                    <Link
                      href={`/book/${trek.slug || trek.id || batch.trekId}?batchId=${batch.id}`}
                      className="px-4 py-2 bg-forest-900 hover:bg-forest-800 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-sm"
                    >
                      <span>BOOK SEAT</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
