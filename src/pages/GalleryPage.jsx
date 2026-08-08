import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, X, Sparkles } from 'lucide-react';

const CATEGORIES = ['All', 'Treks', 'Waterfalls', 'Mountains', 'Monsoon', 'Camping'];

export default function GalleryPage() {
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gallery');
      const data = await res.json();
      setItems(data || []);
    } catch (err) {
      console.error('Error fetching gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = activeCategory === 'All' 
    ? items 
    : items.filter(item => item.category?.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-forest-900 text-white p-6 sm:p-8 rounded-3xl space-y-2">
        <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider block">
          Visual Memories
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight">Kaggadu Trail Gallery</h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
          Explore captured moments from our Western Ghats treks, waterfalls, and mountain peak summits.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-forest-900 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Instagram-style Image Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
            <div key={n} className="aspect-square bg-slate-200 rounded-2xl skeleton-shimmer" />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <ImageIcon className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No photos in this category</h3>
          <p className="text-xs text-slate-500">More trail moments will be updated after upcoming weekend treks!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedImage(item)}
              className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 cursor-pointer group shadow-sm hover:shadow-md transition-all"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 text-white">
                <span className="text-xs font-bold truncate">{item.title}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full Screen Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 p-3 text-white/80 hover:text-white bg-white/10 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-3xl w-full space-y-3 text-center">
            <img
              src={selectedImage.image}
              alt={selectedImage.title}
              className="max-h-[75vh] w-auto mx-auto rounded-2xl shadow-2xl object-contain"
            />
            <div className="text-white">
              <h3 className="font-bold text-base">{selectedImage.title}</h3>
              <span className="text-xs text-emerald-400 font-semibold">{selectedImage.category}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
