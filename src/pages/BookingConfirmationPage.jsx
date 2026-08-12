import React, { useState, useEffect } from 'react';
import { useRoute, Link, useLocation } from 'wouter';
import { CheckCircle2, MessageCircle, Home, Calendar, MapPin, Users, Copy, Sparkles, ShieldCheck, Printer, RefreshCw, AlertCircle } from 'lucide-react';

export default function BookingConfirmationPage() {
  const [, params] = useRoute('/booking-confirmation/:id');
  const bookingId = params?.id;

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    setLoading(true);
    try {
      // 1. Fetch initial booking record
      const res = await fetch(`/api/bookings/${bookingId}`);
      if (res.ok) {
        const data = await res.json();
        setBooking(data);

        // 2. If booking has a transactionId and is not yet marked Paid, perform server-side PhonePe verification
        if (data.phonepeTransactionId && data.paymentStatus !== 'Paid') {
          verifyPhonePeTxn(data.phonepeTransactionId);
        }
      }
    } catch (err) {
      console.error('Error fetching booking confirmation:', err);
    } finally {
      setLoading(false);
    }
  };

  const verifyPhonePeTxn = async (txnId) => {
    setVerifying(true);
    try {
      const res = await fetch(`/api/payment/phonepe/verify/${txnId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId })
      });
      const data = await res.json();
      if (data.booking) {
        setBooking(data.booking);
      }
    } catch (err) {
      console.error('PhonePe verification check failed:', err);
    } finally {
      setVerifying(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
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

  const isPaid = booking.paymentStatus === 'Paid' || booking.status === 'Approved';

  // Format automated WhatsApp Ticket Message
  const whatsappMsg = `Hi Kaggadu Adventures! I have completed my trek booking payment.

*Booking ID:* ${booking.id}
*Participant:* ${booking.fullName}
*Trek:* ${booking.trekName}
*Date:* ${booking.batchDate}
*Participants:* ${booking.participantsCount} Trekker(s)
*Amount Paid:* ₹${booking.totalAmount}
*Payment Status:* ${isPaid ? 'PAID & VERIFIED ✓' : booking.paymentStatus}
*Transaction ID:* ${booking.phonepeTransactionId || 'N/A'}
*Pickup Point:* ${booking.pickupLocation}

Please verify my booking ticket!`;

  const encodedMsg = encodeURIComponent(whatsappMsg);
  const whatsappUrl = `https://wa.me/917760013106?text=${encodedMsg}`;

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      
      {/* Confirmation Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-soft-lg text-center space-y-5 animate-fade-in">
        
        {/* Header Icon */}
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ring-8 ${
          isPaid ? 'bg-emerald-100 text-emerald-600 ring-emerald-50' : 'bg-amber-100 text-amber-600 ring-amber-50'
        }`}>
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <div className="flex items-center justify-center gap-2">
            <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
              isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
            }`}>
              {isPaid ? 'Payment Confirmed & Verified' : 'Booking Received'}
            </span>
          </div>

          <h1 className="text-2xl font-black text-slate-900 mt-2">
            Thank You, {booking.fullName}!
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
            {isPaid
              ? 'Your PhonePe payment has been verified server-side. Your trek slot is locked!'
              : 'Your booking has been registered. Kaggadu team will verify payment details shortly.'}
          </p>
        </div>

        {/* Server-Side PhonePe Verification Badge */}
        {booking.phonepeTransactionId && (
          <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 text-left flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-purple-700 font-bold uppercase block">PhonePe Server Verification</span>
              <span className="font-mono text-xs text-purple-950 font-bold">Txn: {booking.phonepeTransactionId}</span>
            </div>
            <button
              onClick={() => verifyPhonePeTxn(booking.phonepeTransactionId)}
              disabled={verifying}
              className="px-2.5 py-1 bg-purple-600 text-white rounded-lg font-bold text-[10px] flex items-center gap-1"
            >
              <RefreshCw className={`w-3 h-3 ${verifying ? 'animate-spin' : ''}`} />
              <span>{verifying ? 'Verifying...' : 'Re-Check'}</span>
            </button>
          </div>
        )}

        {/* Booking Ticket Summary Card */}
        <div className="bg-earth-50 p-5 rounded-2xl border border-slate-200/80 text-left space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Official Booking ID</span>
              <span className="font-mono text-base font-black text-forest-900">{booking.id}</span>
            </div>
            <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase ${
              isPaid ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
            }`}>
              {isPaid ? 'PAID & APPROVED' : booking.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block">Trek Name</span>
              <span className="font-bold text-slate-800">{booking.trekName}</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-semibold block">Batch Dates</span>
              <span className="font-bold text-slate-800">{booking.batchDate}</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-semibold block">Trekkers Count</span>
              <span className="font-bold text-slate-800">{booking.participantsCount} Person(s)</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-semibold block">Total Amount</span>
              <span className="font-extrabold text-forest-900">₹{booking.totalAmount?.toLocaleString()}</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-semibold block">Payment Method</span>
              <span className="font-bold text-slate-700">{booking.paymentGateway || 'PhonePe PG'}</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 font-semibold block">Contact Mobile</span>
              <span className="font-bold text-slate-700">{booking.phone}</span>
            </div>

            <div className="col-span-2 pt-2 border-t border-slate-200">
              <span className="text-[10px] text-slate-400 font-semibold block">Bengaluru Pickup Location</span>
              <span className="font-bold text-slate-800">{booking.pickupLocation}</span>
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
            <span>SEND WHATSAPP RECEIPT</span>
          </a>

          <button
            onClick={handlePrintReceipt}
            className="w-full sm:flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>PRINT RECEIPT</span>
          </button>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="text-xs font-bold text-forest-800 hover:underline flex items-center justify-center gap-1"
          >
            <Home className="w-3.5 h-3.5" /> Return to Kaggadu Home
          </Link>
        </div>

      </div>

    </div>
  );
}
