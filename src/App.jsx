import React, { useState } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import Header from './components/Header';
import MobileBottomNav from './components/MobileBottomNav';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import TreksPage from './pages/TreksPage';
import TrekDetailPage from './pages/TrekDetailPage';
import CalendarPage from './pages/CalendarPage';
import BookingPage from './pages/BookingPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import GalleryPage from './pages/GalleryPage';
import EventsPage from './pages/EventsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminDashboard from './pages/admin/AdminDashboard';

// Search Modal
import { Search, X } from 'lucide-react';

export default function App() {
  const [location, navigate] = useLocation();
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleGlobalSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchModalOpen(false);
      navigate(`/treks?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const isAdminRoute = location.startsWith('/kaggadu-admin');

  return (
    <div className="min-h-screen flex flex-col justify-between bg-earth-50 text-slate-900 font-sans">
      
      {/* Top Header */}
      {!isAdminRoute && (
        <Header onOpenSearch={() => setSearchModalOpen(true)} />
      )}

      {/* Main View Area */}
      <main className="flex-1">
        <Switch>
          <Route path="/">
            <HomePage searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </Route>
          <Route path="/treks" component={TreksPage} />
          <Route path="/treks/:slug" component={TrekDetailPage} />
          <Route path="/calendar" component={CalendarPage} />
          <Route path="/book/:slug" component={BookingPage} />
          <Route path="/booking-confirmation/:id" component={BookingConfirmationPage} />
          <Route path="/gallery" component={GalleryPage} />
          <Route path="/events" component={EventsPage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/contact" component={ContactPage} />
          
          {/* Protected Admin Route */}
          <Route path="/kaggadu-admin-access" component={AdminDashboard} />

          <Route component={NotFoundPage} />
        </Switch>
      </main>

      {/* Floating WhatsApp Quick Contact Button */}
      {!isAdminRoute && <FloatingWhatsApp />}

      {/* Sticky Mobile Bottom Navigation */}
      {!isAdminRoute && <MobileBottomNav />}

      {/* Footer */}
      {!isAdminRoute && <Footer />}

      {/* Global Quick Search Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-16 px-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-5 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-900">Search Western Ghats Treks</h3>
              <button onClick={() => setSearchModalOpen(false)} className="p-1 rounded-full text-slate-400 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGlobalSearchSubmit} className="relative">
              <input
                type="text"
                autoFocus
                placeholder="Search Kudremukha, Netravathi, Kodachadri..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-earth-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:border-forest-700"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
