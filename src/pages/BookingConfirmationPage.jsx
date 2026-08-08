import React, { useState, useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import { CheckCircle2, MessageCircle, Home, Calendar, MapPin, Users, Copy, Sparkles, ShieldCheck } from 'lucide-react';

export default function BookingConfirmationPage() {
  const [, params] = useRoute('/booking-confirmation/:id');
  const bookingId = params?.id;

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`);
      if (res.ok) {
        const data = await res.json();
        setBooking(data);
      }
    } catch (err) {
      console.error('Error fetching booking confirmation:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center">
        <div className="h-40 bg-slate-200 rounded-3xl skeleton-shimmer" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Booking Details Not Found</h2>
        <Link href="/" className="inline-block px-5 py-2.5 bg-forest-900 text-white font-bold text-xs rounded-xl">
          Return to Home
        </Link>
      </div>
    );
  }

  // Pre-filled WhatsApp message format (Requirement 27)
  const whatsappMsg = `Hi Kaggadu Adventures! I have completed my booking.

*Booking ID:* ${booking.id}
*Participant:* ${booking.fullName}
*Trek:* ${booking.trekName}
*Date:* ${booking.batchDate}
*Participants:* ${booking.participantsCount}
*Amount:* ₹${booking.totalAmount}
*Pickup Location:* ${booking.pickupLocation}
*Status:* ${booking.status}

Please verify my booking payment.`;

  const encodedMsg = encodeURIComponent(whatsappMsg);
  const whatsappUrl = `https://wa.me/917760013106?text=${encodedMsg}`;

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      
      {/* Confirmation Success Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-soft-lg text-center space-y-4 animate-fade-in">
        
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
            Booking Received!
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-2">
            Thank You, {booking.fullName}!
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
            Your booking request has been safely received. Kaggadu Adventures team will confirm your participation shortly.
          </p>
        </div>

        {/* Booking Reference Card */}
        <div className="bg-earth-50 p-4 rounded-2xl border border-slate-200/80 text-left space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
            <span className="text-xs text-slate-400 font-bold uppercase">Booking ID</span>
            <span className="font-mono text-sm font-black text-forest-900">{booking.id}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block">Trek</span>
              <span className="font-bold text-slate-800">{booking.trekName}</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-semibold block">Trek Batch</span>
              <span className="font-bold text-slate-800">{booking.batchDate}</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-semibold block">Participants</span>
              <span className="font-bold text-slate-800">{booking.participantsCount} Person(s)</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-semibold block">Total Amount</span>
              <span className="font-extrabold text-forest-900">₹{booking.totalAmount}</span>
            </div>

            <div className="col-span-2 pt-1 border-t border-slate-200/60">
              <span className="text-[10px] text-slate-400 font-semibold block">Pickup Location</span>
              <span className="font-semibold text-slate-700">{booking.pickupLocation}</span>
            </div>
          </div>
        </div>

        {/* Primary Call-To-Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-extrabold text-xs tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>WHATSAPP KAGGADU</span>
          </a>

          <Link
            href="/"
            className="w-full sm:flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl text-center transition-colors flex items-center justify-center gap-1.5"
          >
            <Home className="w-4 h-4" />
            <span>BACK TO HOME</span>
          </Link>
        </div>

      </div>

    </div>
  );
}
