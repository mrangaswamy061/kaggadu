import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function FloatingWhatsApp({ trekName }) {
  const message = trekName 
    ? `Hi Kaggadu Adventures, I am interested in the ${trekName} trek!`
    : `Hi Kaggadu Adventures, I am interested in exploring upcoming Western Ghats treks with you!`;

  const encodedMsg = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/917760013106?text=${encodedMsg}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Kaggadu Adventures on WhatsApp"
      className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-30 flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white p-3 md:px-4 md:py-3 rounded-full shadow-lg hover:shadow-xl transition-all group"
    >
      <MessageCircle className="w-6 h-6 fill-white text-emerald-500 animate-pulse" />
      <span className="hidden md:inline font-bold text-xs tracking-wide">
        WhatsApp Us
      </span>
    </a>
  );
}
