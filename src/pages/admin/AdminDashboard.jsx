import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Lock, LogOut, Check, X, AlertTriangle, Search, Plus, Trash2, Edit, Eye, MessageCircle, Calendar, Image as ImageIcon, Star, HelpCircle, Bell, Settings, FileText, CheckCircle2, UserCheck, Upload, Compass, MapPin
} from 'lucide-react';

export default function AdminDashboard() {
  const [token, setToken] = useState(localStorage.getItem('kaggadu_admin_token') || '');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [activeTab, setActiveTab] = useState('bookings');
  
  // Data States
  const [bookings, setBookings] = useState([]);
  const [treks, setTreks] = useState([]);
  const [batches, setBatches] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [events, setEvents] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [settings, setSettings] = useState({});
  
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals
  const [showTrekModal, setShowTrekModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showFaqModal, setShowFaqModal] = useState(false);

  const [editingTrek, setEditingTrek] = useState(null);

  // Form States
  const [trekForm, setTrekForm] = useState({
    name: '', slug: '', tagline: '', location: 'Chikkamagaluru', distance: '7 + 7 KM', difficulty: 'Moderate', altitude: '1,520 Meters', duration: '2 Days / 1 Night', bestSeason: 'Monsoon & Post-Monsoon', price: 3499, image: '/images/hero_western_ghats.jpg', category: 'Monsoon',
    itinerary: [
      { day: 'DAY 0', title: 'Overnight Journey', description: 'Overnight travel from Bengaluru to base village.' },
      { day: 'DAY 1', title: 'Trek Summit Ascent', description: 'Trek to summit, packed lunch, return to homestay.' },
      { day: 'DAY 2', title: 'Waterfall Visit & Return', description: 'Explore stream, return to Bengaluru.' }
    ],
    included: ['Transportation', 'Trek Permits', 'Meals', 'Homestay Stay', 'Trek Guide'],
    excluded: ['Personal Expenses', 'Highway Meals'],
    checklist: ['Trekking shoes', 'Raincoat / Poncho', '2L Water bottle', 'Backpack', 'Torch']
  });

  const [batchForm, setBatchForm] = useState({
    trekId: '', startDate: '', endDate: '', price: 3499, capacity: 25
  });

  const [galleryForm, setGalleryForm] = useState({
    title: '', category: 'Treks', image: '/images/hero_western_ghats.jpg'
  });

  const [eventForm, setEventForm] = useState({
    title: '', date: '', location: '', description: '', image: '/images/hero_western_ghats.jpg', status: 'Upcoming', registrationUrl: '#'
  });

  const [faqForm, setFaqForm] = useState({
    question: '', answer: ''
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (token) {
      fetchAdminData();
    }
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    const inputPass = passwordInput.trim();
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: inputPass })
      });
      const data = await res.json();
      if (data.token || data.success) {
        const validToken = data.token || 'kaggadu_admin_session_valid_2026';
        localStorage.setItem('kaggadu_admin_token', validToken);
        setToken(validToken);
        return;
      }
    } catch (err) {
      console.warn('API login error, trying client fallback:', err);
    }

    if (inputPass === 'kaggadu2020') {
      const validToken = 'kaggadu_admin_session_valid_2026';
      localStorage.setItem('kaggadu_admin_token', validToken);
      setToken(validToken);
    } else {
      setLoginError('Invalid Admin Password!');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('kaggadu_admin_token');
    setToken('');
  };

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [bRes, tRes, btRes, gRes, eRes, rRes, fRes, nRes, sRes] = await Promise.all([
        fetch('/api/bookings'),
        fetch('/api/treks'),
        fetch('/api/batches'),
        fetch('/api/gallery'),
        fetch('/api/events'),
        fetch('/api/reviews'),
        fetch('/api/faqs'),
        fetch('/api/notifications'),
        fetch('/api/settings')
      ]);

      setBookings(await bRes.json());
      setTreks(await tRes.json());
      setBatches(await btRes.json());
      setGallery(await gRes.json());
      setEvents(await eRes.json());
      setReviews(await rRes.json());
      setFaqs(await fRes.json());
      setNotifications(await nRes.json());
      setSettings(await sRes.json());
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Image Upload Helper
  const handleImageUpload = async (e, callback) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.url) callback(data.url);
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  // Update Booking Status
  const handleUpdateBookingStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) fetchAdminData();
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  // Save / Update Trek
  const handleSaveTrek = async (e) => {
    e.preventDefault();
    try {
      const method = editingTrek ? 'PUT' : 'POST';
      const url = editingTrek ? `/api/treks/${editingTrek.id}` : '/api/treks';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trekForm)
      });
      if (res.ok) {
        setShowTrekModal(false);
        setEditingTrek(null);
        fetchAdminData();
      }
    } catch (err) {
      console.error('Save trek failed:', err);
    }
  };

  // Save Batch
  const handleSaveBatch = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/batches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batchForm)
      });
      if (res.ok) {
        setShowBatchModal(false);
        fetchAdminData();
      }
    } catch (err) {
      console.error('Save batch failed:', err);
    }
  };

  // Save Gallery Photo
  const handleSaveGallery = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(galleryForm)
      });
      if (res.ok) {
        setShowGalleryModal(false);
        fetchAdminData();
      }
    } catch (err) {
      console.error('Save gallery failed:', err);
    }
  };

  // Save Event
  const handleSaveEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventForm)
      });
      if (res.ok) {
        setShowEventModal(false);
        fetchAdminData();
      }
    } catch (err) {
      console.error('Save event failed:', err);
    }
  };

  // Save FAQ
  const handleSaveFaq = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(faqForm)
      });
      if (res.ok) {
        setShowFaqModal(false);
        fetchAdminData();
      }
    } catch (err) {
      console.error('Save FAQ failed:', err);
    }
  };

  // Delete Item Helper
  const handleDeleteItem = async (endpoint, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await fetch(`/api/${endpoint}/${id}`, { method: 'DELETE' });
      fetchAdminData();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  // Save Settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      alert('Settings updated successfully!');
    } catch (err) {
      console.error('Save settings failed:', err);
    }
  };

  // 1. LOGIN SCREEN
  if (!token) {
    return (
      <div className="max-w-md mx-auto py-20 px-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-soft-lg space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-forest-900 text-white flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-7 h-7 text-emerald-400" />
            </div>
            <h1 className="text-2xl font-black text-slate-900">Admin Portal Access</h1>
            <p className="text-xs text-slate-500">Kaggadu Adventures Control Center</p>
          </div>

          {loginError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-medium text-center">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">Admin Password</label>
              <input
                type="password"
                required
                placeholder="Enter password..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full p-3 bg-earth-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-forest-700 text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-forest-900 hover:bg-forest-800 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-md transition-all uppercase tracking-wider"
            >
              LOGIN TO DASHBOARD
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. DASHBOARD MAIN VIEW
  const pendingBookingsCount = bookings.filter(b => b.status === 'Pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Header Bar */}
      <div className="bg-forest-950 text-white p-5 rounded-3xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src="/logo.jpg" alt="Logo" className="w-10 h-10 rounded-xl border border-white/20" />
          <div>
            <h1 className="font-extrabold text-base tracking-wide flex items-center gap-2">
              <span>KAGGADU ADMIN</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full uppercase font-bold">
                Protected Portal
              </span>
            </h1>
            <span className="text-[11px] text-slate-400">Live Management Dashboard</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {[
          { id: 'bookings', label: 'Bookings', badge: pendingBookingsCount },
          { id: 'treks', label: 'Treks' },
          { id: 'batches', label: 'Batches' },
          { id: 'gallery', label: 'Gallery' },
          { id: 'events', label: 'Events' },
          { id: 'faqs', label: 'FAQs' },
          { id: 'settings', label: 'Settings' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === tab.id
                ? 'bg-forest-900 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge > 0 && (
              <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Bookings Management</h2>
              <p className="text-xs text-slate-500">Approve, reject, or manage participant requests</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search participant name, ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 bg-earth-50 border border-slate-200 rounded-xl text-xs"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-earth-50 border border-slate-200 rounded-xl text-xs font-semibold"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-earth-50 text-slate-500 font-bold border-b border-slate-200">
                  <th className="p-3">Booking Series ID</th>
                  <th className="p-3">Participant</th>
                  <th className="p-3">Trek & Batch</th>
                  <th className="p-3">Count</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings
                  .filter(b => statusFilter === 'All' || b.status === statusFilter)
                  .filter(b => !searchTerm || b.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || b.id?.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-black text-forest-900">{b.id}</td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{b.fullName}</div>
                        <div className="text-[10px] text-slate-500">{b.phone} • {b.pickupLocation}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-slate-800">{b.trekName}</div>
                        <div className="text-[10px] text-slate-400">{b.batchDate}</div>
                      </td>
                      <td className="p-3 font-bold">{b.participantsCount}</td>
                      <td className="p-3 font-black text-forest-900">₹{b.totalAmount}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                          b.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                          b.status === 'Pending' ? 'bg-amber-100 text-amber-900' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
                          {b.status !== 'Approved' && (
                            <button
                              onClick={() => handleUpdateBookingStatus(b.id, 'Approved')}
                              className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500"
                              title="Approve Booking"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {b.status !== 'Rejected' && (
                            <button
                              onClick={() => handleUpdateBookingStatus(b.id, 'Rejected')}
                              className="p-1.5 bg-rose-600 text-white rounded-lg hover:bg-rose-500"
                              title="Reject Booking"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <a
                            href={`https://wa.me/91${b.whatsapp || b.phone}?text=Hi%20${encodeURIComponent(b.fullName)}%2C%20regarding%20your%20Kaggadu%20booking%20${b.id}%20(${b.trekName})...`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg hover:bg-emerald-200"
                            title="Send WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: TREKS MANAGEMENT */}
      {activeTab === 'treks' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Treks Management</h2>
              <p className="text-xs text-slate-500">Add, edit, or customize Western Ghats treks and itineraries</p>
            </div>
            <button
              onClick={() => {
                setEditingTrek(null);
                setTrekForm({
                  name: '', slug: '', tagline: '', location: 'Chikkamagaluru', distance: '7 + 7 KM', difficulty: 'Moderate', altitude: '1,520 Meters', duration: '2 Days / 1 Night', bestSeason: 'Monsoon & Post-Monsoon', price: 3499, image: '/images/hero_western_ghats.jpg', category: 'Monsoon',
                  itinerary: [
                    { day: 'DAY 0', title: 'Overnight Journey', description: 'Overnight travel from Bengaluru to base village.' },
                    { day: 'DAY 1', title: 'Trek Summit Ascent', description: 'Trek to summit, packed lunch, return to homestay.' },
                    { day: 'DAY 2', title: 'Waterfall Visit & Return', description: 'Explore stream, return to Bengaluru.' }
                  ],
                  included: ['Transportation', 'Trek Permits', 'Meals', 'Homestay Stay', 'Trek Guide'],
                  excluded: ['Personal Expenses', 'Highway Meals'],
                  checklist: ['Trekking shoes', 'Raincoat / Poncho', '2L Water bottle', 'Backpack', 'Torch']
                });
                setShowTrekModal(true);
              }}
              className="px-4 py-2 bg-forest-900 text-white font-bold text-xs rounded-xl flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Trek</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {treks.map((t) => (
              <div key={t.id} className="p-4 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-3 bg-earth-50/50">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-forest-700 bg-forest-100 px-2 py-0.5 rounded">
                      {t.difficulty}
                    </span>
                    <span className="font-extrabold text-sm text-forest-900">₹{t.price}</span>
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900">{t.name}</h3>
                  <p className="text-xs text-slate-500">{t.location} • {t.distance}</p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                  <button
                    onClick={() => {
                      setEditingTrek(t);
                      setTrekForm(t);
                      setShowTrekModal(true);
                    }}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteItem('treks', t.id)}
                    className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: BATCHES */}
      {activeTab === 'batches' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Batches Management</h2>
              <p className="text-xs text-slate-500">Configure departure dates and seat capacities</p>
            </div>
            <button
              onClick={() => {
                if (treks.length > 0) setBatchForm({ ...batchForm, trekId: treks[0].id });
                setShowBatchModal(true);
              }}
              className="px-4 py-2 bg-forest-900 text-white font-bold text-xs rounded-xl flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add Batch</span>
            </button>
          </div>

          <div className="space-y-2">
            {batches.map((b) => (
              <div key={b.id} className="p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between text-xs bg-earth-50/50">
                <div>
                  <span className="font-bold text-slate-900 uppercase">{b.trekId}</span>
                  <span className="text-slate-500 ml-2 font-medium">({b.startDate} to {b.endDate})</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-forest-900">₹{b.price}</span>
                  <span className="font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                    {b.bookedCount || 0} / {b.capacity} Booked
                  </span>
                  <button onClick={() => handleDeleteItem('batches', b.id)} className="text-rose-600 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: GALLERY */}
      {activeTab === 'gallery' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Gallery Photos</h2>
              <p className="text-xs text-slate-500">Upload & categorize trail photos</p>
            </div>
            <button
              onClick={() => setShowGalleryModal(true)}
              className="px-4 py-2 bg-forest-900 text-white font-bold text-xs rounded-xl flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add Photo</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {gallery.map((g) => (
              <div key={g.id} className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 group border border-slate-200">
                <img src={g.image} alt={g.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between text-white text-xs">
                  <span className="font-bold truncate">{g.title}</span>
                  <button
                    onClick={() => handleDeleteItem('gallery', g.id)}
                    className="self-end p-1.5 bg-rose-600 text-white rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: EVENTS */}
      {activeTab === 'events' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Community Events</h2>
              <p className="text-xs text-slate-500">Camping & adventure event meetups</p>
            </div>
            <button
              onClick={() => setShowEventModal(true)}
              className="px-4 py-2 bg-forest-900 text-white font-bold text-xs rounded-xl flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add Event</span>
            </button>
          </div>

          <div className="space-y-3">
            {events.map((ev) => (
              <div key={ev.id} className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-4 text-xs bg-earth-50/50">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">{ev.title}</h3>
                  <p className="text-slate-500">{ev.date} • {ev.location}</p>
                </div>
                <button onClick={() => handleDeleteItem('events', ev.id)} className="text-rose-600 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: FAQS */}
      {activeTab === 'faqs' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">FAQs Management</h2>
              <p className="text-xs text-slate-500">Add or edit trek FAQs</p>
            </div>
            <button
              onClick={() => setShowFaqModal(true)}
              className="px-4 py-2 bg-forest-900 text-white font-bold text-xs rounded-xl flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add FAQ</span>
            </button>
          </div>

          <div className="space-y-3">
            {faqs.map((f) => (
              <div key={f.id} className="p-4 rounded-2xl border border-slate-200 space-y-1 text-xs bg-earth-50/50">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-slate-900">{f.question}</h3>
                  <button onClick={() => handleDeleteItem('faqs', f.id)} className="text-rose-600 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-slate-600">{f.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: SETTINGS */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-extrabold text-slate-900">Platform Settings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-bold block mb-1">Official UPI ID</label>
              <input
                type="text"
                value={settings.upiId || ''}
                onChange={(e) => setSettings({ ...settings, upiId: e.target.value })}
                className="w-full p-2.5 bg-earth-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
            <div>
              <label className="font-bold block mb-1">Main Phone</label>
              <input
                type="text"
                value={settings.phone || ''}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full p-2.5 bg-earth-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
            <div className="col-span-2">
              <label className="font-bold block mb-1">Bank Details</label>
              <textarea
                rows={2}
                value={settings.bankDetails || ''}
                onChange={(e) => setSettings({ ...settings, bankDetails: e.target.value })}
                className="w-full p-2.5 bg-earth-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
          </div>
          <button type="submit" className="px-6 py-2.5 bg-forest-900 text-white font-bold text-xs rounded-xl shadow-md">
            Save Platform Settings
          </button>
        </form>
      )}

      {/* TREK MODAL (WITH FULL ITINERARY BUILDER) */}
      {showTrekModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveTrek} className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 text-xs max-h-[85vh] overflow-y-auto">
            <h3 className="font-extrabold text-base text-slate-900">
              {editingTrek ? 'Edit Trek Details' : 'Add New Trek'}
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="font-bold block mb-1">Trek Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kudremukha Peak Trek"
                  value={trekForm.name}
                  onChange={(e) => setTrekForm({ ...trekForm, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="Chikkamagaluru"
                    value={trekForm.location}
                    onChange={(e) => setTrekForm({ ...trekForm, location: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Price ₹</label>
                  <input
                    type="number"
                    placeholder="3499"
                    value={trekForm.price}
                    onChange={(e) => setTrekForm({ ...trekForm, price: parseInt(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Distance</label>
                  <input
                    type="text"
                    placeholder="10 + 10 KM"
                    value={trekForm.distance}
                    onChange={(e) => setTrekForm({ ...trekForm, distance: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Difficulty</label>
                  <select
                    value={trekForm.difficulty}
                    onChange={(e) => setTrekForm({ ...trekForm, difficulty: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Easy – Moderate">Easy – Moderate</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Moderate – Hard">Moderate – Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Trek Tagline</label>
                <input
                  type="text"
                  placeholder="Conquer the iconic horse-faced peak"
                  value={trekForm.tagline}
                  onChange={(e) => setTrekForm({ ...trekForm, tagline: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              {/* Itinerary Builder */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="font-extrabold text-slate-900 block">Trek Itinerary Days</label>
                  <button
                    type="button"
                    onClick={() => setTrekForm({
                      ...trekForm,
                      itinerary: [...(trekForm.itinerary || []), { day: `DAY ${(trekForm.itinerary || []).length}`, title: '', description: '' }]
                    })}
                    className="text-forest-700 font-bold text-[11px] underline"
                  >
                    + Add Day
                  </button>
                </div>

                {(trekForm.itinerary || []).map((day, idx) => (
                  <div key={idx} className="p-3 bg-earth-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="DAY 1"
                        value={day.day}
                        onChange={(e) => {
                          const newIt = [...trekForm.itinerary];
                          newIt[idx].day = e.target.value;
                          setTrekForm({ ...trekForm, itinerary: newIt });
                        }}
                        className="w-1/3 p-2 border rounded-lg font-bold"
                      />
                      <input
                        type="text"
                        placeholder="Day Title (e.g. Summit Ascent)"
                        value={day.title}
                        onChange={(e) => {
                          const newIt = [...trekForm.itinerary];
                          newIt[idx].title = e.target.value;
                          setTrekForm({ ...trekForm, itinerary: newIt });
                        }}
                        className="w-2/3 p-2 border rounded-lg font-medium"
                      />
                    </div>
                    <textarea
                      rows={2}
                      placeholder="Day description..."
                      value={day.description}
                      onChange={(e) => {
                        const newIt = [...trekForm.itinerary];
                        newIt[idx].description = e.target.value;
                        setTrekForm({ ...trekForm, itinerary: newIt });
                      }}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                ))}
              </div>

              {/* Image Upload */}
              <div className="space-y-1 pt-2 border-t border-slate-200">
                <label className="font-bold block mb-1">Cover Image</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={trekForm.image}
                    onChange={(e) => setTrekForm({ ...trekForm, image: e.target.value })}
                    className="w-full p-2 border rounded-xl"
                  />
                  <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer shrink-0 font-bold">
                    Upload
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => setTrekForm({ ...trekForm, image: url }))} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button type="button" onClick={() => setShowTrekModal(false)} className="px-4 py-2 bg-slate-100 rounded-xl font-bold">Cancel</button>
              <button type="submit" className="px-5 py-2 bg-forest-900 text-white font-extrabold rounded-xl shadow-md">Save Trek</button>
            </div>
          </form>
        </div>
      )}

      {/* GALLERY MODAL */}
      {showGalleryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveGallery} className="bg-white rounded-3xl p-6 max-w-md w-full space-y-3 text-xs">
            <h3 className="font-bold text-base text-slate-900">Add Photo to Gallery</h3>
            <input
              type="text"
              placeholder="Photo Title (e.g. Netravathi Summit Ridge)"
              required
              value={galleryForm.title}
              onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
              className="w-full p-2.5 border rounded-xl"
            />
            <select
              value={galleryForm.category}
              onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
              className="w-full p-2.5 border rounded-xl font-semibold"
            >
              <option value="Treks">Treks</option>
              <option value="Waterfalls">Waterfalls</option>
              <option value="Mountains">Mountains</option>
              <option value="Monsoon">Monsoon</option>
              <option value="Camping">Camping</option>
            </select>
            <div>
              <label className="font-bold block mb-1">Image URL / Upload</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={galleryForm.image}
                  onChange={(e) => setGalleryForm({ ...galleryForm, image: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
                <label className="px-3 py-2 bg-slate-100 rounded-xl cursor-pointer font-bold shrink-0">
                  Upload
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => setGalleryForm({ ...galleryForm, image: url }))} className="hidden" />
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowGalleryModal(false)} className="px-4 py-2 bg-slate-100 rounded-xl font-bold">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-forest-900 text-white font-bold rounded-xl">Save Photo</button>
            </div>
          </form>
        </div>
      )}

      {/* EVENT MODAL */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveEvent} className="bg-white rounded-3xl p-6 max-w-md w-full space-y-3 text-xs">
            <h3 className="font-bold text-base text-slate-900">Add Community Event</h3>
            <input
              type="text"
              placeholder="Event Title (e.g. Stargazing Camping Night)"
              required
              value={eventForm.title}
              onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
              className="w-full p-2.5 border rounded-xl"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Date (e.g. Sep 12 - 13, 2026)"
                value={eventForm.date}
                onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                className="p-2.5 border rounded-xl"
              />
              <input
                type="text"
                placeholder="Location (e.g. Chikkamagaluru)"
                value={eventForm.location}
                onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                className="p-2.5 border rounded-xl"
              />
            </div>
            <textarea
              rows={3}
              placeholder="Event description..."
              value={eventForm.description}
              onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
              className="w-full p-2.5 border rounded-xl"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowEventModal(false)} className="px-4 py-2 bg-slate-100 rounded-xl font-bold">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-forest-900 text-white font-bold rounded-xl">Save Event</button>
            </div>
          </form>
        </div>
      )}

      {/* BATCH MODAL */}
      {showBatchModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveBatch} className="bg-white rounded-3xl p-6 max-w-md w-full space-y-3 text-xs">
            <h3 className="font-bold text-base text-slate-900">Add Batch Dates</h3>
            <select
              value={batchForm.trekId}
              onChange={(e) => setBatchForm({ ...batchForm, trekId: e.target.value })}
              className="w-full p-2.5 border rounded-xl font-semibold"
            >
              {treks.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                required
                value={batchForm.startDate}
                onChange={(e) => setBatchForm({ ...batchForm, startDate: e.target.value })}
                className="p-2.5 border rounded-xl"
              />
              <input
                type="date"
                required
                value={batchForm.endDate}
                onChange={(e) => setBatchForm({ ...batchForm, endDate: e.target.value })}
                className="p-2.5 border rounded-xl"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowBatchModal(false)} className="px-4 py-2 bg-slate-100 rounded-xl font-bold">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-forest-900 text-white font-bold rounded-xl">Save Batch</button>
            </div>
          </form>
        </div>
      )}

      {/* FAQ MODAL */}
      {showFaqModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveFaq} className="bg-white rounded-3xl p-6 max-w-md w-full space-y-3 text-xs">
            <h3 className="font-bold text-base text-slate-900">Add FAQ Question</h3>
            <input
              type="text"
              placeholder="Question..."
              required
              value={faqForm.question}
              onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
              className="w-full p-2.5 border rounded-xl font-bold"
            />
            <textarea
              rows={3}
              placeholder="Answer..."
              required
              value={faqForm.answer}
              onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
              className="w-full p-2.5 border rounded-xl font-medium"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowFaqModal(false)} className="px-4 py-2 bg-slate-100 rounded-xl font-bold">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-forest-900 text-white font-bold rounded-xl">Save FAQ</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
