import React, { useState, useEffect } from 'react';
import { CalendarCheck, MapPin, MessageCircle, ArrowRight } from 'lucide-react';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      setEvents(data || []);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      
      <div className="bg-forest-900 text-white p-6 sm:p-8 rounded-3xl space-y-2">
        <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider block">
          Community Meetups
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight">Kaggadu Events</h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Stargazing campouts, community get-togethers, and special monsoon trips.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(n => <div key={n} className="h-44 bg-slate-200 rounded-3xl skeleton-shimmer" />)}
        </div>
      ) : events.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 space-y-3">
          <CalendarCheck className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No events scheduled right now</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Stay tuned on our Instagram page or WhatsApp for announcement of upcoming community meetups!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((ev) => (
            <div key={ev.id} className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-5 items-center">
              <img
                src={ev.image || '/images/hero_western_ghats.jpg'}
                alt={ev.title}
                className="w-full sm:w-44 aspect-[4/3] object-cover rounded-2xl shrink-0"
              />
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full uppercase">
                    {ev.status || 'Upcoming'}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">{ev.date}</span>
                </div>
                <h3 className="font-extrabold text-lg text-slate-900">{ev.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{ev.description}</p>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-forest-700 pt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{ev.location}</span>
                </div>
                <div className="pt-2">
                  <a
                    href={`https://wa.me/917760013106?text=Hi%20Kaggadu%20Adventures%2C%20I%20want%20to%20register%20for%20the%20${encodeURIComponent(ev.title)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-forest-900 text-white font-bold text-xs rounded-xl hover:bg-forest-800 shadow-sm"
                  >
                    <span>Register Interest</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
