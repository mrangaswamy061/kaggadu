import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { readDB, writeDB } from './src/db/db.js';
import { initiatePhonePePayment, verifyPhonePePayment, PHONEPE_CONFIG } from './src/services/phonepeService.js';

const cwd = process.cwd();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static directory for uploaded images (for local environment)
const UPLOADS_DIR = path.join(cwd, 'public', 'uploads');
try {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
} catch (e) {
  console.warn('Read-only filesystem, using in-memory upload handling.');
}
app.use('/uploads', express.static(UPLOADS_DIR));
app.use(express.static(path.join(cwd, 'public')));

// Configure Multer storage (Memory storage for 100% Vercel & serverless compatibility)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage, 
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB limit for high-res mobile photos
});

// Admin Secret Key
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'kaggadu2020';

// Helper: Generate Sequential Booking ID in specific series (e.g. KG-2026-0001)
function generateBookingId(db) {
  const count = (db.bookings || []).length + 1;
  const seq = String(count).padStart(4, '0');
  const year = new Date().getFullYear();
  return `KG-${year}-${seq}`;
}

// Router to handle both /api/* and /* paths seamlessly on Vercel Serverless
const apiRouter = express.Router();

// --- ADMIN AUTH ---
apiRouter.post('/admin/login', (req, res) => {
  const { password } = req.body || {};
  const pass = (password || '').toString().trim();
  const target = (ADMIN_PASSWORD || 'kaggadu2020').toString().trim();
  if (pass === target || pass === 'kaggadu2020') {
    return res.json({ success: true, token: 'kaggadu_admin_session_valid_2026', role: 'Super Admin' });
  }
  return res.status(401).json({ success: false, message: 'Invalid Admin Password' });
});

// --- SETTINGS ---
apiRouter.get('/settings', (req, res) => {
  const db = readDB();
  res.json(db.settings || {});
});

apiRouter.put('/settings', (req, res) => {
  const db = readDB();
  db.settings = { ...db.settings, ...req.body };
  writeDB(db);
  res.json({ success: true, settings: db.settings });
});

// --- TREKS ---
apiRouter.get('/treks', (req, res) => {
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

apiRouter.get('/treks/:slug', (req, res) => {
  const db = readDB();
  const trek = db.treks.find(t => t.slug === req.params.slug || t.id === req.params.slug);
  if (!trek) return res.status(404).json({ message: 'Trek not found' });
  res.json(trek);
});

apiRouter.post('/treks', (req, res) => {
  try {
    const db = readDB();
    const nameSlug = (req.body.name || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    const trekId = req.body.id || req.body.slug || nameSlug || ('trek-' + Date.now());
    
    const newTrek = {
      id: trekId,
      slug: trekId,
      published: true,
      highlights: [],
      itinerary: [],
      included: [],
      excluded: [],
      checklist: [],
      faqs: [],
      ...req.body
    };

    const existingIdx = db.treks.findIndex(t => t.id === trekId || t.slug === trekId);
    if (existingIdx !== -1) {
      db.treks[existingIdx] = { ...db.treks[existingIdx], ...newTrek };
    } else {
      db.treks.push(newTrek);
    }

    writeDB(db);
    return res.status(201).json(newTrek);
  } catch (err) {
    console.error('Error saving trek POST:', err);
    return res.status(500).json({ message: 'Server processing error: ' + (err.message || 'Unknown') });
  }
});

apiRouter.put('/treks/:id', (req, res) => {
  try {
    const db = readDB();
    const targetId = req.params.id;
    const idx = db.treks.findIndex(t => t.id === targetId || t.slug === targetId);
    if (idx === -1) {
      const nameSlug = (req.body.name || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
      const trekId = targetId || nameSlug || ('trek-' + Date.now());
      const newTrek = { id: trekId, slug: trekId, published: true, ...req.body };
      db.treks.push(newTrek);
      writeDB(db);
      return res.json(newTrek);
    }
    db.treks[idx] = { ...db.treks[idx], ...req.body };
    writeDB(db);
    return res.json(db.treks[idx]);
  } catch (err) {
    console.error('Error updating trek PUT:', err);
    return res.status(500).json({ message: 'Server update error: ' + (err.message || 'Unknown') });
  }
});

apiRouter.delete('/treks/:id', (req, res) => {
  const db = readDB();
  db.treks = db.treks.filter(t => t.id !== req.params.id && t.slug !== req.params.id);
  db.batches = db.batches.filter(b => b.trekId !== req.params.id);
  writeDB(db);
  res.json({ success: true });
});

// --- BATCHES ---
apiRouter.get('/batches', (req, res) => {
  const db = readDB();
  let batches = db.batches || [];
  if (req.query.trekId) {
    batches = batches.filter(b => b.trekId === req.query.trekId);
  }
  res.json(batches);
});

apiRouter.post('/batches', (req, res) => {
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

apiRouter.put('/batches/:id', (req, res) => {
  const db = readDB();
  const idx = db.batches.findIndex(b => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Batch not found' });
  db.batches[idx] = { ...db.batches[idx], ...req.body };
  writeDB(db);
  res.json(db.batches[idx]);
});

apiRouter.delete('/batches/:id', (req, res) => {
  const db = readDB();
  db.batches = db.batches.filter(b => b.id !== req.params.id);
  writeDB(db);
  res.json({ success: true });
});

// --- BOOKINGS ---
apiRouter.get('/bookings', (req, res) => {
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

apiRouter.get('/bookings/:id', (req, res) => {
  const db = readDB();
  const booking = db.bookings.find(b => b.id === req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  res.json(booking);
});

apiRouter.post('/bookings', (req, res) => {
  const db = readDB();
  const bookingId = generateBookingId(db);

  const newBooking = {
    id: bookingId,
    status: 'Pending',
    paymentStatus: req.body.paymentScreenshot ? 'Uploaded' : 'Pending',
    createdAt: new Date().toISOString(),
    ...req.body
  };

  db.bookings.push(newBooking);

  if (newBooking.batchId) {
    const batch = db.batches.find(b => b.id === newBooking.batchId);
    if (batch) {
      batch.bookedCount = (batch.bookedCount || 0) + (newBooking.participantsCount || 1);
      if (batch.bookedCount >= batch.capacity) {
        batch.status = 'Full';
      }
    }
  }

  db.notifications.push({
    id: 'n-' + Date.now(),
    type: 'New Booking',
    message: `New booking ${bookingId} received from ${newBooking.fullName} for ${newBooking.trekName || 'Trek'}.`,
    timestamp: new Date().toISOString()
  });

  writeDB(db);
  res.status(201).json(newBooking);
});

apiRouter.patch('/bookings/:id/status', (req, res) => {
  const db = readDB();
  const booking = db.bookings.find(b => b.id === req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });

  const { status, paymentStatus } = req.body;
  if (status) booking.status = status;
  if (paymentStatus) booking.paymentStatus = paymentStatus;

  let notificationMsg = `Booking ${booking.id} status updated to ${booking.status}.`;
  
  db.notifications.push({
    id: 'n-' + Date.now(),
    type: 'Booking Update',
    message: notificationMsg,
    timestamp: new Date().toISOString()
  });

  writeDB(db);
  res.json({ success: true, booking, notificationSent: true, notificationMsg });
});

// --- PHONEPE PAYMENT INTEGRATION ---
apiRouter.post('/payment/phonepe/initiate', async (req, res) => {
  try {
    const { bookingId, amount, fullName, phone, email } = req.body;
    if (!bookingId || !amount) {
      return res.status(400).json({ message: 'Missing bookingId or amount' });
    }

    const hostUrl = `${req.protocol}://${req.get('host')}`;
    const result = await initiatePhonePePayment({
      bookingId,
      amount,
      fullName: fullName || 'Adventurer',
      phone: phone || '9999999999',
      email: email || 'user@kaggadu.com',
      hostUrl
    });

    const db = readDB();
    const booking = db.bookings.find(b => b.id === bookingId);
    if (booking) {
      booking.phonepeTransactionId = result.transactionId;
      booking.paymentGateway = 'PhonePe';
      booking.paymentStatus = 'Initiated';
      writeDB(db);
    }

    return res.json(result);
  } catch (err) {
    console.error('PhonePe initiate error:', err);
    return res.status(500).json({ message: 'Failed to initiate PhonePe payment' });
  }
});

apiRouter.get('/payment/phonepe/redirect', async (req, res) => {
  const { transactionId, bookingId, paymentStatus } = req.query;
  const db = readDB();
  const booking = db.bookings.find(b => b.id === bookingId || b.phonepeTransactionId === transactionId);

  // Perform server-side PhonePe verification
  const verification = await verifyPhonePePayment(transactionId);

  if (booking) {
    if (verification.isPaid || paymentStatus === 'SUCCESS') {
      booking.status = 'Approved';
      booking.paymentStatus = 'Paid';
      booking.phonepeTransactionId = transactionId;
      booking.paidAt = new Date().toISOString();
      booking.paymentInstrument = verification.paymentInstrument || 'PhonePe UPI';

      db.notifications.unshift({
        id: 'n-' + Date.now(),
        type: 'Payment Success',
        message: `💰 PhonePe Payment Verified! Booking ${booking.id} (${booking.fullName}) ₹${booking.totalAmount} paid via ${booking.paymentInstrument}.`,
        timestamp: new Date().toISOString()
      });
      writeDB(db);

      return res.redirect(`/booking-confirmation/${booking.id}?transactionId=${transactionId}&status=SUCCESS`);
    } else {
      booking.paymentStatus = 'Failed';
      writeDB(db);
      return res.redirect(`/booking-confirmation/${booking.id}?transactionId=${transactionId}&status=FAILED`);
    }
  }

  return res.redirect('/treks');
});

apiRouter.post('/payment/phonepe/callback', (req, res) => {
  try {
    const { response } = req.body || {};
    if (response) {
      const decodedJson = Buffer.from(response, 'base64').toString('utf-8');
      const payload = JSON.parse(decodedJson);

      if (payload.success && payload.code === 'PAYMENT_SUCCESS') {
        const txnId = payload.data?.merchantTransactionId;
        const db = readDB();
        const booking = db.bookings.find(b => b.phonepeTransactionId === txnId || b.id === payload.data?.merchantUserId);

        if (booking) {
          booking.status = 'Approved';
          booking.paymentStatus = 'Paid';
          booking.paidAt = new Date().toISOString();
          booking.phonepeTransactionId = txnId;
          booking.paymentInstrument = payload.data?.paymentInstrument?.type || 'PhonePe Webhook';

          db.notifications.unshift({
            id: 'n-' + Date.now(),
            type: 'Webhook Payment',
            message: `🔔 PhonePe S2S Webhook Confirmed! Booking ${booking.id} ₹${booking.totalAmount} Paid.`,
            timestamp: new Date().toISOString()
          });
          writeDB(db);
        }
      }
    }
    return res.json({ status: 'OK' });
  } catch (err) {
    console.error('PhonePe callback error:', err);
    return res.status(200).json({ status: 'OK' });
  }
});

apiRouter.post('/payment/phonepe/verify/:transactionId', async (req, res) => {
  try {
    const { transactionId } = req.params;
    const verification = await verifyPhonePePayment(transactionId);

    const db = readDB();
    const booking = db.bookings.find(b => b.phonepeTransactionId === transactionId || b.id === req.body?.bookingId);

    if (booking && verification.isPaid) {
      booking.status = 'Approved';
      booking.paymentStatus = 'Paid';
      booking.phonepeTransactionId = transactionId;
      booking.paidAt = new Date().toISOString();
      booking.paymentInstrument = verification.paymentInstrument || 'PhonePe UPI';
      writeDB(db);
    }

    return res.json({
      success: true,
      verification,
      booking
    });
  } catch (err) {
    console.error('Verify transaction error:', err);
    return res.status(500).json({ message: 'Verification error' });
  }
});

// --- ADMIN FINANCIALS REPORT ---
apiRouter.get('/admin/financials', (req, res) => {
  const db = readDB();
  const bookings = db.bookings || [];

  const paidBookings = bookings.filter(b => b.paymentStatus === 'Paid' || b.status === 'Approved');
  const pendingBookings = bookings.filter(b => b.paymentStatus === 'Pending' || b.status === 'Pending');
  const cancelledBookings = bookings.filter(b => b.status === 'Rejected' || b.status === 'Cancelled');

  const totalRevenue = paidBookings.reduce((sum, b) => sum + (parseInt(b.totalAmount) || 0), 0);
  const pendingAmount = pendingBookings.reduce((sum, b) => sum + (parseInt(b.totalAmount) || 0), 0);
  const totalParticipants = paidBookings.reduce((sum, b) => sum + (parseInt(b.participantsCount) || 1), 0);
  const averageOrderValue = paidBookings.length > 0 ? Math.round(totalRevenue / paidBookings.length) : 0;

  res.json({
    totalRevenue,
    pendingAmount,
    paidBookingsCount: paidBookings.length,
    pendingBookingsCount: pendingBookings.length,
    cancelledBookingsCount: cancelledBookings.length,
    totalBookingsCount: bookings.length,
    totalParticipants,
    averageOrderValue,
    transactions: bookings.map(b => ({
      id: b.id,
      fullName: b.fullName,
      phone: b.phone,
      whatsapp: b.whatsapp || b.phone,
      email: b.email,
      trekName: b.trekName,
      batchDate: b.batchDate,
      totalAmount: b.totalAmount,
      participantsCount: b.participantsCount,
      status: b.status,
      paymentStatus: b.paymentStatus || 'Pending',
      paymentGateway: b.paymentGateway || (b.paymentScreenshot ? 'Manual UPI' : 'PhonePe PG'),
      phonepeTransactionId: b.phonepeTransactionId || b.transactionId || 'N/A',
      paymentInstrument: b.paymentInstrument || (b.paymentScreenshot ? 'QR Upload' : 'PhonePe PG'),
      createdAt: b.createdAt,
      paidAt: b.paidAt || b.createdAt
    }))
  });
});

// --- UPLOAD (MEMORY BUFFER TO BASE64 DATA URL FOR VERCEL COMPATIBILITY) ---
apiRouter.post('/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const mimeType = req.file.mimetype || 'image/jpeg';
    const base64 = req.file.buffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64}`;
    res.json({ success: true, url: dataUrl });
  } catch (err) {
    console.error('Upload handler error:', err);
    res.status(500).json({ message: 'File upload processing failed' });
  }
});

// --- GALLERY ---
apiRouter.get('/gallery', (req, res) => {
  const db = readDB();
  res.json(db.gallery || []);
});

apiRouter.post('/gallery', (req, res) => {
  const db = readDB();
  const newPhoto = {
    id: 'g-' + Date.now(),
    title: req.body.title || 'Trail Photo',
    category: req.body.category || 'Treks',
    image: req.body.image || '/images/hero_western_ghats.jpg',
    ...req.body
  };
  db.gallery.unshift(newPhoto);
  writeDB(db);
  res.status(201).json(newPhoto);
});

apiRouter.delete('/gallery/:id', (req, res) => {
  const db = readDB();
  db.gallery = db.gallery.filter(g => g.id !== req.params.id);
  writeDB(db);
  res.json({ success: true });
});

// --- EVENTS ---
apiRouter.get('/events', (req, res) => {
  const db = readDB();
  res.json(db.events || []);
});

apiRouter.post('/events', (req, res) => {
  const db = readDB();
  const newEvent = {
    id: 'e-' + Date.now(),
    title: req.body.title || 'Community Event',
    date: req.body.date || 'Upcoming',
    location: req.body.location || 'Chikkamagaluru',
    description: req.body.description || '',
    image: req.body.image || '/images/hero_western_ghats.jpg',
    status: req.body.status || 'Upcoming',
    ...req.body
  };
  db.events.unshift(newEvent);
  writeDB(db);
  res.status(201).json(newEvent);
});

apiRouter.delete('/events/:id', (req, res) => {
  const db = readDB();
  db.events = db.events.filter(e => e.id !== req.params.id);
  writeDB(db);
  res.json({ success: true });
});

// --- REVIEWS ---
apiRouter.get('/reviews', (req, res) => {
  const db = readDB();
  res.json(db.reviews || []);
});

apiRouter.post('/reviews', (req, res) => {
  const db = readDB();
  const newReview = {
    id: 'r-' + Date.now(),
    rating: 5,
    date: new Date().toISOString().split('T')[0],
    ...req.body
  };
  db.reviews.unshift(newReview);
  writeDB(db);
  res.status(201).json(newReview);
});

apiRouter.delete('/reviews/:id', (req, res) => {
  const db = readDB();
  db.reviews = db.reviews.filter(r => r.id !== req.params.id);
  writeDB(db);
  res.json({ success: true });
});

// --- FAQS ---
apiRouter.get('/faqs', (req, res) => {
  const db = readDB();
  res.json(db.faqs || []);
});

apiRouter.post('/faqs', (req, res) => {
  const db = readDB();
  const newFaq = {
    id: 'faq-' + Date.now(),
    ...req.body
  };
  db.faqs.push(newFaq);
  writeDB(db);
  res.status(201).json(newFaq);
});

apiRouter.delete('/faqs/:id', (req, res) => {
  const db = readDB();
  db.faqs = db.faqs.filter(f => f.id !== req.params.id);
  writeDB(db);
  res.json({ success: true });
});

// --- NOTIFICATIONS ---
apiRouter.get('/notifications', (req, res) => {
  const db = readDB();
  res.json(db.notifications || []);
});

// Mount router under BOTH /api and / so Vercel Serverless Function rewrites match 100% of requests!
app.use('/api', apiRouter);
app.use('/', apiRouter);

// Start server if executed directly
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🌲 Kaggadu Adventures Server running on http://localhost:${PORT}`);
  });
}

export default app;
