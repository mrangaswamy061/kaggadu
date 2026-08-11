import React, { useState, useEffect } from 'react';
import { useRoute, useLocation, Link } from 'wouter';
import { Check, ShieldCheck, ArrowRight, ArrowLeft, Copy, Upload, AlertCircle, Sparkles, Phone, User, Users, MapPin, CreditCard } from 'lucide-react';
import { compressImage } from '../utils/imageCompressor.js';

export default function BookingPage() {
  const [, params] = useRoute('/book/:slug');
  const [, navigate] = useLocation();
  const slug = params?.slug;

  const [step, setStep] = useState(1);
  const [trek, setTrek] = useState(null);
  const [batches, setBatches] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  // Form State
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [participantsCount, setParticipantsCount] = useState(1);
  const [pickupLocation, setPickupLocation] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');

  // Payment Upload State
  const [uploading, setUploading] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBookingInitialData();
  }, [slug]);

  const fetchBookingInitialData = async () => {
    setLoading(true);
    try {
      const [trekRes, settingsRes] = await Promise.all([
        fetch(`/api/treks/${slug}`),
        fetch('/api/settings')
      ]);

      const trekData = await trekRes.json();
      const settingsData = await settingsRes.json();
      setTrek(trekData);
      setSettings(settingsData || {});

      // Fetch batches for this trek
      const batchRes = await fetch(`/api/batches?trekId=${trekData.id}`);
      const batchData = await batchRes.json();
      setBatches(batchData || []);
      if (batchData?.length > 0) {
        setSelectedBatchId(batchData[0].id);
        if (batchData[0].pickupPoints?.length > 0) {
          setPickupLocation(batchData[0].pickupPoints[0]);
        }
      }
    } catch (err) {
      console.error('Error initializing booking data:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentBatch = batches.find(b => b.id === selectedBatchId) || batches[0];
  const unitPrice = currentBatch?.price || trek?.price || 3499;
  const totalPrice = unitPrice * participantsCount;

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const compressedDataUrl = await compressImage(file);
      if (compressedDataUrl) {
        setScreenshotUrl(compressedDataUrl);
        return;
      }

      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.url) {
        setScreenshotUrl(data.url);
      }
    } catch (err) {
      console.error('File upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(settings.upiId || '7760013106@ybl');
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (!fullName || !phone || !whatsapp) {
      setErrorMsg('Please fill in your name, phone number, and WhatsApp number.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    try {
      const payload = {
        trekId: trek.id,
        trekName: trek.name,
        batchId: selectedBatchId,
        batchDate: currentBatch ? `${currentBatch.startDate} to ${currentBatch.endDate}` : 'Upcoming Batch',
        fullName,
        phone,
        whatsapp,
        email,
        age: parseInt(age) || 24,
        gender,
        emergencyName,
        emergencyPhone,
        pickupLocation: pickupLocation || 'Yeshwanthpur (11:00 PM)',
        participantsCount: parseInt(participantsCount),
        specialNotes,
        totalAmount: totalPrice,
        paymentScreenshot: screenshotUrl
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.id) {
        navigate(`/booking-confirmation/${data.id}`);
      } else {
        setErrorMsg('Booking creation failed. Please try again.');
      }
    } catch (err) {
      console.error('Booking submission error:', err);
      setErrorMsg('Failed to process booking. Please contact support.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 space-y-4">
        <div className="h-10 bg-slate-200 rounded-xl skeleton-shimmer" />
        <div className="h-64 bg-slate-200 rounded-3xl skeleton-shimmer" />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-6">
      
      {/* Step Indicator */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-500 pb-2 border-b border-slate-200">
        <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-forest-800' : ''}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-forest-900 text-white' : 'bg-slate-200'}`}>1</span>
          <span className="hidden sm:inline">Batch</span>
        </div>
        <div className="h-0.5 w-6 bg-slate-200" />
        <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-forest-800' : ''}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-forest-900 text-white' : 'bg-slate-200'}`}>2</span>
          <span className="hidden sm:inline">Details</span>
        </div>
        <div className="h-0.5 w-6 bg-slate-200" />
        <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-forest-800' : ''}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-forest-900 text-white' : 'bg-slate-200'}`}>3</span>
          <span className="hidden sm:inline">Payment</span>
        </div>
      </div>

      {/* STEP 1: SELECT BATCH + PARTICIPANTS */}
      {step === 1 && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5 animate-fade-in">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-[10px] font-bold text-forest-700 uppercase tracking-wider block">Step 1 of 3</span>
            <h2 className="text-xl font-black text-slate-900">{trek?.name}</h2>
            <p className="text-xs text-slate-500">Select trek date and number of participants</p>
          </div>

          {/* Batches Selection */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-slate-800 block">Select Batch Date</label>
            <div className="space-y-2">
              {batches.map((b) => {
                const available = (b.capacity || 25) - (b.bookedCount || 0);
                const isFull = b.status === 'Full' || available <= 0;
                return (
                  <div
                    key={b.id}
                    onClick={() => !isFull && setSelectedBatchId(b.id)}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                      isFull
                        ? 'bg-slate-50 border-slate-200 opacity-50 cursor-not-allowed'
                        : selectedBatchId === b.id
                        ? 'bg-forest-50 border-forest-700 ring-1 ring-forest-700'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">{b.startDate} to {b.endDate}</span>
                      <span className="text-[10px] text-slate-500">₹{b.price} / person</span>
                    </div>
                    {isFull ? (
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">FULL</span>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">{available} seats left</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Number of Participants */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-slate-800 block">Number of Participants</label>
            <div className="flex items-center gap-3">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setParticipantsCount(num)}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all ${
                    participantsCount === num
                      ? 'bg-forest-900 text-white shadow-md'
                      : 'bg-earth-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {num} {num === 1 ? 'Person' : 'People'}
                </button>
              ))}
            </div>
          </div>

          {/* Pickup Location */}
          {currentBatch?.pickupPoints && (
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 block">Pickup Location (Bengaluru)</label>
              <select
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                className="w-full bg-earth-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:outline-none"
              >
                {currentBatch.pickupPoints.map((loc, idx) => (
                  <option key={idx} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          )}

          {/* Summary Price */}
          <div className="bg-forest-900 text-white p-4 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-300 uppercase font-semibold block">Total Amount</span>
              <span className="text-xs text-emerald-300">₹{unitPrice} x {participantsCount} participant(s)</span>
            </div>
            <span className="text-xl font-black text-white">₹{totalPrice.toLocaleString()}</span>
          </div>

          <button
            onClick={() => setStep(2)}
            className="w-full py-3.5 bg-forest-900 hover:bg-forest-800 active:scale-95 text-white font-extrabold text-xs tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>CONTINUE TO PARTICIPANT DETAILS</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 2: PARTICIPANT DETAILS */}
      {step === 2 && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 animate-fade-in">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-forest-700 uppercase tracking-wider block">Step 2 of 3</span>
              <h2 className="text-lg font-black text-slate-900">Participant Details</h2>
            </div>
            <button onClick={() => setStep(1)} className="text-xs text-slate-500 underline">Back</button>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 text-xs">
            <div>
              <label className="font-bold text-slate-800 block mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="Enter lead participant name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-3 bg-earth-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-forest-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="10-digit mobile"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 bg-earth-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-forest-700"
                />
              </div>
              <div>
                <label className="font-bold text-slate-800 block mb-1">WhatsApp Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="WhatsApp number"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full p-3 bg-earth-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-forest-700"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">Email Address</label>
              <input
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-earth-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-forest-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Age</label>
                <input
                  type="number"
                  placeholder="Age (e.g. 25)"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full p-3 bg-earth-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-forest-700"
                />
              </div>
              <div>
                <label className="font-bold text-slate-800 block mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full p-3 bg-earth-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Emergency Contact Name</label>
                <input
                  type="text"
                  placeholder="Parent / Guardian Name"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  className="w-full p-3 bg-earth-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-slate-800 block mb-1">Emergency Phone</label>
                <input
                  type="tel"
                  placeholder="Emergency Phone"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  className="w-full p-3 bg-earth-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="font-bold text-slate-800 block mb-1">Special Requirements / Medical Notes (Optional)</label>
              <textarea
                rows={2}
                placeholder="Vegetarian preference, allergies, etc."
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                className="w-full p-3 bg-earth-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-3">
            <button
              onClick={() => setStep(1)}
              className="w-1/3 py-3 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
            >
              BACK
            </button>
            <button
              onClick={() => {
                if (!fullName || !phone || !whatsapp) {
                  setErrorMsg('Full Name, Phone, and WhatsApp are required!');
                  return;
                }
                setErrorMsg('');
                setStep(3);
              }}
              className="w-2/3 py-3 bg-forest-900 hover:bg-forest-800 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md"
            >
              <span>PROCEED TO PAYMENT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: PAYMENT & CONFIRMATION SUBMISSION */}
      {step === 3 && (
        <form onSubmit={handleSubmitBooking} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5 animate-fade-in">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-forest-700 uppercase tracking-wider block">Step 3 of 3</span>
              <h2 className="text-lg font-black text-slate-900">Payment & Submit</h2>
            </div>
            <button type="button" onClick={() => setStep(2)} className="text-xs text-slate-500 underline">Edit Details</button>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Amount Due Card */}
          <div className="bg-forest-900 text-white p-5 rounded-2xl space-y-2">
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Total Booking Amount</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black">₹{totalPrice.toLocaleString()}</span>
              <span className="text-xs text-slate-300">for {participantsCount} participant(s)</span>
            </div>
            <div className="text-[11px] text-slate-300 border-t border-white/10 pt-2 flex justify-between">
              <span>{trek.name}</span>
              <span>{currentBatch?.startDate}</span>
            </div>
          </div>

          {/* UPI Payment Instructions */}
          <div className="bg-earth-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">UPI / GPay / PhonePe Payment</h4>
            
            <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block">KAGGADU OFFICIAL UPI ID</span>
                <span className="font-mono text-xs font-bold text-forest-900">{settings.upiId || '7760013106@ybl'}</span>
              </div>
              <button
                type="button"
                onClick={handleCopyUPI}
                className="px-3 py-1.5 bg-forest-100 text-forest-900 hover:bg-forest-200 font-bold text-[11px] rounded-lg flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copySuccess ? 'Copied!' : 'Copy UPI'}</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-600 whitespace-pre-line leading-relaxed">
              {settings.paymentInstructions || 'Pay via GooglePay/PhonePe to 7760013106 and upload screenshot below.'}
            </p>
          </div>

          {/* Payment Screenshot Upload */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-slate-800 block">
              Upload Payment Screenshot (Optional / Quick Approval)
            </label>
            <div className="border-2 border-dashed border-slate-300 hover:border-forest-700 rounded-2xl p-4 text-center bg-earth-50/50">
              {screenshotUrl ? (
                <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-emerald-300">
                  <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600" />
                    Screenshot Attached
                  </span>
                  <button type="button" onClick={() => setScreenshotUrl('')} className="text-xs text-rose-600 underline">
                    Remove
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center gap-1">
                  <Upload className="w-6 h-6 text-slate-400" />
                  <span className="text-xs font-bold text-forest-900">
                    {uploading ? 'Uploading...' : 'Tap to select payment screenshot'}
                  </span>
                  <span className="text-[10px] text-slate-400">JPG, PNG up to 5MB</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-1/3 py-3 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
            >
              BACK
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-2/3 py-3.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <span>CONFIRMING BOOKING...</span>
              ) : (
                <>
                  <span>CONFIRM BOOKING</span>
                  <Check className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      )}

    </div>
  );
}
