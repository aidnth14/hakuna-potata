import React from 'react';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  defaultMessage?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber = '8801339656675',
  defaultMessage = 'Hello Hakuna Potata! I would like to inquire about your cakes.',
}) => {
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <aside aria-label="WhatsApp Contact" className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-50 group select-none">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Hakuna Potata on WhatsApp"
        title="Chat on WhatsApp (+880 1339656675)"
        className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white shadow-[0_8px_25px_rgba(0,0,0,0.22)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.35)] transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer p-0.5 border border-neutral-200/80"
      >
        <img
          src="https://img.icons8.com/?size=100&id=62855&format=png&color=000000"
          alt="WhatsApp"
          className="w-full h-full object-contain filter drop-shadow-xs"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/whatsapp-icon.png';
          }}
        />

        {/* Hover Tooltip Badge */}
        <span className="absolute right-full mr-3.5 px-3 py-1.5 rounded-xl bg-black text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-xl hidden sm:flex items-center gap-1.5 font-display border border-neutral-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Chat on WhatsApp</span>
        </span>
      </a>
    </aside>
  );
};

export default WhatsAppButton;
