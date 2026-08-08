import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { readDB, writeDB } from './src/db/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static directory for uploaded images
const UPLOADS_DIR = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use('/uploads', express.static(UPLOADS_DIR));
app.use(express.static(path.join(__dirname, 'public')));

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, 'kaggadu-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage: storage });

// Admin Secret Key (can be overriden by process.env.ADMIN_PASSWORD)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'kaggadu2020';

// Helper: Generate Booking ID
function generateBookingId() {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `KG-2026-${rand}`;
}

// REST API ROUTES

// --- ADMIN AUTH ---
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    return res.json({ success: true, token: 'kaggadu_admin_session_valid_2026', role: 'Super Admin' });
  }
  return res.status(401).json({ success: false, message: 'Invalid Admin Password' });
});

// --- SETTINGS ---
app.get('/api/settings', (req, res) => {
  const db = readDB();
  res.json(db.settings);
});

app.put('/api/settings', (req, res) => {
  const db = readDB();
  db.settings = { ...db.settings, ...req.body };
  writeDB(db);
  res.json({ success: true, settings: db.settings });
});

// --- TREKS ---
app.get('/api/treks', (req, res) => {
  const db = readDB();
  let treks = db.treks || [];
  
  const { search, category, difficulty, publishedOnly } = req.query;

  if (publishedOnly === 'true') {
    treks = treks.filter(t => t.published !== false);
  }
  
  if (category && category !== 'All') {
    treks = treks.filter(t => t.category?.toLowerCase() === category.toLowerCase() || t.difficulty?.toLowerCase().includes(category.toLowerCase()));
  }

  if (difficulty && difficulty !== 'All') {
    treks = treks.filter(t => t.difficulty?.toLowerCase().includes(difficulty.toLowerCase()));
  }

  if (search) {
    const q = search.toLowerCase();
    treks = treks.filter(t => 
      t.name.toLowerCase().includes(q) || 
      t.location.toLowerCase().includes(q) ||
      t.tagline?.toLowerCase().includes(q)
    );
  }

  res.json(treks);
});

app.get('/api/treks/:slug', (req, res) => {
  const db = readDB();
  const trek = db.treks.find(t => t.slug === req.params.slug || t.id === req.params.slug);
  if (!trek) return res.status(404).json({ message: 'Trek not found' });
  res.json(trek);
});

app.post('/api/treks', (req, res) => {
  const db = readDB();
  const newTrek = {
    id: req.body.slug || 'trek-' + Date.now(),
    published: true,
    highlights: [],
    itinerary: [],
    included: [],
    excluded: [],
    checklist: [],
    faqs: [],
    ...req.body
  };
  db.treks.push(newTrek);
  writeDB(db);
  res.status(201).json(newTrek);
});

app.put('/api/treks/:id', (req, res) => {
  const db = readDB();
  const idx = db.treks.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Trek not found' });
  db.treks[idx] = { ...db.treks[idx], ...req.body };
  writeDB(db);
  res.json(db.treks[idx]);
});

app.delete('/api/treks/:id', (req, res) => {
  const db = readDB();
  db.treks = db.treks.filter(t => t.id !== req.params.id);
  db.batches = db.batches.filter(b => b.trekId !== req.params.id);
  writeDB(db);
  res.json({ success: true });
});

// --- BATCHES ---
app.get('/api/batches', (req, res) => {
  const db = readDB();
  let batches = db.batches || [];
  if (req.query.trekId) {
    batches = batches.filter(b => b.trekId === req.query.trekId);
  }
  res.json(batches);
});

app.post('/api/batches', (req, res) => {
  const db = readDB();
  const newBatch = {
    id: 'batch-' + Date.now(),
    bookedCount: 0,
    status: 'Open',
    pickupPoints: ['Indiranagar (10:00 PM)', 'Yeshwanthpur (11:00 PM)'],
    ...req.body
  };
  db.batches.push(newBatch);
  writeDB(db);
  res.status(201).json(newBatch);
});

app.put('/api/batches/:id', (req, res) => {
  const db = readDB();
  const idx = db.batches.findIndex(b => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Batch not found' });
  db.batches[idx] = { ...db.batches[idx], ...req.body };
  writeDB(db);
  res.json(db.batches[idx]);
});

app.delete('/api/batches/:id', (req, res) => {
  const db = readDB();
  db.batches = db.batches.filter(b => b.id !== req.params.id);
  writeDB(db);
  res.json({ success: true });
});

// --- BOOKINGS ---
app.get('/api/bookings', (req, res) => {
  const db = readDB();
  let bookings = db.bookings || [];
  const { trekId, status, search } = req.query;
  if (trekId) bookings = bookings.filter(b => b.trekId === trekId);
  if (status) bookings = bookings.filter(b => b.status === status);
  if (search) {
    const q = search.toLowerCase();
    bookings = bookings.filter(b => 
      b.id.toLowerCase().includes(q) ||
      b.fullName.toLowerCase().includes(q) ||
      b.phone.includes(q)
    );
  }
  res.json(bookings.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

app.get('/api/bookings/:id', (req, res) => {
  const db = readDB();
  const booking = db.bookings.find(b => b.id === req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  res.json(booking);
});

app.post('/api/bookings', (req, res) => {
  const db = readDB();
  const bookingId = generateBookingId();

  const newBooking = {
    id: bookingId,
    status: 'Pending',
    paymentStatus: req.body.paymentScreenshot ? 'Uploaded' : 'Pending',
    createdAt: new Date().toISOString(),
    ...req.body
  };

  db.bookings.push(newBooking);

  // Update batch seat count if batchId matches
  if (newBooking.batchId) {
    const batch = db.batches.find(b => b.id === newBooking.batchId);
    if (batch) {
      batch.bookedCount = (batch.bookedCount || 0) + (newBooking.participantsCount || 1);
      if (batch.bookedCount >= batch.capacity) {
        batch.status = 'Full';
      }
    }
  }

  // Create internal notification
  db.notifications.push({
    id: 'n-' + Date.now(),
    type: 'New Booking',
    message: `New booking ${bookingId} received from ${newBooking.fullName} for ${newBooking.trekName || 'Trek'}.`,
    timestamp: new Date().toISOString()
  });

  writeDB(db);
  res.status(201).json(newBooking);
});

app.patch('/api/bookings/:id/status', (req, res) => {
  const db = readDB();
  const booking = db.bookings.find(b => b.id === req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });

  const { status, paymentStatus } = req.body;
  if (status) booking.status = status;
  if (paymentStatus) booking.paymentStatus = paymentStatus;

  // Log status notification trigger
  const notificationMsg = `Booking ${booking.id} status updated to ${booking.status}. Notification sent to ${booking.fullName} (${booking.phone}).`;
  db.notifications.push({
    id: 'n-' + Date.now(),
    type: `Booking ${booking.status}`,
    message: notificationMsg,
    timestamp: new Date().toISOString()
  });

  writeDB(db);
  res.json({ success: true, booking, notificationSent: true, notificationMsg });
});

// --- UPLOAD ---
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const publicUrl = `/uploads/${req.file.filename}`;
  res.json({ success: true, url: publicUrl });
});

// --- GALLERY ---
app.get('/api/gallery', (req, res) => {
  const db = readDB();
  res.json(db.gallery || []);
});

app.post('/api/gallery', (req, res) => {
  const db = readDB();
  const item = { id: 'g-' + Date.now(), ...req.body };
  db.gallery.push(item);
  writeDB(db);
  res.status(201).json(item);
});

app.delete('/api/gallery/:id', (req, res) => {
  const db = readDB();
  db.gallery = db.gallery.filter(g => g.id !== req.params.id);
  writeDB(db);
  res.json({ success: true });
});

// --- EVENTS ---
app.get('/api/events', (req, res) => {
  const db = readDB();
  res.json(db.events || []);
});

app.post('/api/events', (req, res) => {
  const db = readDB();
  const ev = { id: 'ev-' + Date.now(), status: 'Upcoming', ...req.body };
  db.events.push(ev);
  writeDB(db);
  res.status(201).json(ev);
});

app.delete('/api/events/:id', (req, res) => {
  const db = readDB();
  db.events = db.events.filter(e => e.id !== req.params.id);
  writeDB(db);
  res.json({ success: true });
});

// --- REVIEWS ---
app.get('/api/reviews', (req, res) => {
  const db = readDB();
  res.json(db.reviews || []);
});

app.post('/api/reviews', (req, res) => {
  const db = readDB();
  const r = { id: 'r-' + Date.now(), date: 'Recently', ...req.body };
  db.reviews.push(r);
  writeDB(db);
  res.status(201).json(r);
});

app.delete('/api/reviews/:id', (req, res) => {
  const db = readDB();
  db.reviews = db.reviews.filter(r => r.id !== req.params.id);
  writeDB(db);
  res.json({ success: true });
});

// --- FAQS ---
app.get('/api/faqs', (req, res) => {
  const db = readDB();
  res.json(db.faqs || []);
});

app.post('/api/faqs', (req, res) => {
  const db = readDB();
  const f = { id: 'f-' + Date.now(), ...req.body };
  db.faqs.push(f);
  writeDB(db);
  res.status(201).json(f);
});

app.delete('/api/faqs/:id', (req, res) => {
  const db = readDB();
  db.faqs = db.faqs.filter(f => f.id !== req.params.id);
  writeDB(db);
  res.json({ success: true });
});

// --- NOTIFICATIONS ---
app.get('/api/notifications', (req, res) => {
  const db = readDB();
  res.json((db.notifications || []).sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)));
});

// Start Server
app.listen(PORT, () => {
  console.log(`🌲 Kaggadu Adventures Backend Server running on port ${PORT}`);
});
