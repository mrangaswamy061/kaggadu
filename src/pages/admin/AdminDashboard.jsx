import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Lock, LogOut, Check, X, AlertTriangle, Search, Plus, Trash2, Edit, Eye, MessageCircle, Calendar, Image, Star, HelpCircle, Bell, Settings, FileText, CheckCircle2, UserCheck
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

  // Modals & Editors
  const [showTrekModal, setShowTrekModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [editingTrek, setEditingTrek] = useState(null);
  
  // New Trek Form State
  const [trekForm, setTrekForm] = useState({
    name: '', slug: '', location: 'Chikkamagaluru', distance: '7 + 7 KM', difficulty: 'Moderate', price: 3499, tagline: '', category: 'Monsoon'
  });

  // New Batch Form State
  const [batchForm, setBatchForm] = useState({
    trekId: '', startDate: '', endDate: '', price: 3499, capacity: 25
  });

  useEffect(() => {
    if (token) {
      fetchAdminData();
    }
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput })
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('kaggadu_admin_token', data.token);
        setToken(data.token);
      } else {
        setLoginError('Invalid Admin Password!');
      }
    } catch (err) {
      setLoginError('Login request failed.');
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

  // Update Booking Status
  const handleUpdateBookingStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchAdminData();
      }
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  // Add / Save Trek
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

  // Add Batch
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

  // 1. IF NOT LOGGED IN -> SHOW SECURE LOGIN FORM
  if (!token) {
    return (
      <div className="max-w-md mx-auto py-20 px-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-soft-lg space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-forest-900 text-white flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-7 h-7 text-emerald-400" />
            </div>
            <h1 className="text-2xl font-black text-slate-900">Admin Portal Access</h1>
            <p className="text-xs text-slate-500">Kaggadu Adventures Secure Control Center</p>
          </div>

          {loginError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-medium">
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
                className="w-full p-3 bg-earth-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-forest-700"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Default password: kaggadu2020</span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-forest-900 hover:bg-forest-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all uppercase tracking-wider"
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

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {[
          { id: 'bookings', label: 'Bookings', badge: pendingBookingsCount },
          { id: 'treks', label: 'Treks' },
          { id: 'batches', label: 'Batches' },
          { id: 'gallery', label: 'Gallery' },
          { id: 'events', label: 'Events' },
          { id: 'reviews', label: 'Reviews' },
          { id: 'faqs', label: 'FAQs' },
          { id: 'notifications', label: 'Alerts' },
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

      {/* TAB 1: BOOKINGS MANAGEMENT */}
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
                  <th className="p-3">Booking ID</th>
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
                      <td className="p-3 font-mono font-bold text-forest-900">{b.id}</td>
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
              <p className="text-xs text-slate-500">Add, edit or publish Western Ghats treks</p>
            </div>
            <button
              onClick={() => {
                setEditingTrek(null);
                setTrekForm({ name: '', slug: '', location: 'Chikkamagaluru', distance: '7 + 7 KM', difficulty: 'Moderate', price: 3499, tagline: '', category: 'Monsoon' });
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
              <div key={t.id} className="p-4 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-3">
                <div>
                  <div className="font-extrabold text-sm text-slate-900">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.location} • ₹{t.price}</div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-forest-700 bg-forest-50 px-2 py-0.5 rounded">
                    {t.difficulty}
                  </span>
                  <button
                    onClick={() => handleDeleteItem('treks', t.id)}
                    className="text-rose-600 p-1 hover:bg-rose-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: BATCHES MANAGEMENT */}
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
              <div key={b.id} className="p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900">{b.trekId}</span>
                  <span className="text-slate-500 ml-2">({b.startDate} to {b.endDate})</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold">{b.bookedCount || 0} / {b.capacity} Booked</span>
                  <button onClick={() => handleDeleteItem('batches', b.id)} className="text-rose-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 9: SETTINGS */}
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
                className="w-full p-2.5 bg-earth-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="font-bold block mb-1">Main Phone</label>
              <input
                type="text"
                value={settings.phone || ''}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full p-2.5 bg-earth-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div className="col-span-2">
              <label className="font-bold block mb-1">Bank Details</label>
              <textarea
                rows={2}
                value={settings.bankDetails || ''}
                onChange={(e) => setSettings({ ...settings, bankDetails: e.target.value })}
                className="w-full p-2.5 bg-earth-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>
          <button type="submit" className="px-6 py-2.5 bg-forest-900 text-white font-bold text-xs rounded-xl">
            Save Platform Settings
          </button>
        </form>
      )}

      {/* NEW TREK MODAL */}
      {showTrekModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveTrek} className="bg-white rounded-3xl p-6 max-w-md w-full space-y-3 text-xs">
            <h3 className="font-bold text-base text-slate-900">Add / Edit Trek</h3>
            <input
              type="text"
              placeholder="Trek Name (e.g. Netravathi Peak)"
              required
              value={trekForm.name}
              onChange={(e) => setTrekForm({ ...trekForm, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
              className="w-full p-2.5 border rounded-xl"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Location (e.g. Chikkamagaluru)"
                value={trekForm.location}
                onChange={(e) => setTrekForm({ ...trekForm, location: e.target.value })}
                className="p-2.5 border rounded-xl"
              />
              <input
                type="number"
                placeholder="Price ₹"
                value={trekForm.price}
                onChange={(e) => setTrekForm({ ...trekForm, price: parseInt(e.target.value) })}
                className="p-2.5 border rounded-xl"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowTrekModal(false)} className="px-4 py-2 bg-slate-100 rounded-xl">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-forest-900 text-white font-bold rounded-xl">Save Trek</button>
            </div>
          </form>
        </div>
      )}

      {/* NEW BATCH MODAL */}
      {showBatchModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSaveBatch} className="bg-white rounded-3xl p-6 max-w-md w-full space-y-3 text-xs">
            <h3 className="font-bold text-base text-slate-900">Add Batch Dates</h3>
            <select
              value={batchForm.trekId}
              onChange={(e) => setBatchForm({ ...batchForm, trekId: e.target.value })}
              className="w-full p-2.5 border rounded-xl"
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
              <button type="button" onClick={() => setShowBatchModal(false)} className="px-4 py-2 bg-slate-100 rounded-xl">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-forest-900 text-white font-bold rounded-xl">Save Batch</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
