import React, { useState, useRef } from 'react';
import {
  CheckCircle2,
  ArrowLeft,
  Phone,
  MessageCircle,
  UploadCloud,
  X,
  ChevronRight,
  Truck,
  FileImage,
  Mail,
} from 'lucide-react';

interface CustomOrderPageProps {
  onBack: () => void;
}

export interface CakeSizeOption {
  id: string;
  name: string;
  inches: number;
  diameterSpec: string;
  servings: string;
  sliceCount: string;
  basePrice: number;
  desc: string;
  tag?: string;
  popular?: boolean;
  imageSrc: string;
}

const CAKE_SIZES: CakeSizeOption[] = [
  {
    id: '4inch',
    name: '4" Cake',
    inches: 4,
    diameterSpec: '4″',
    servings: '2 – 4 Servings',
    sliceCount: '2-4 slices',
    basePrice: 1200,
    desc: '2 – 4 Servings',
    tag: 'Bento',
    imageSrc: '/cake-size-4inch.webp',
  },
  {
    id: '6inch',
    name: '6" Cake',
    inches: 6,
    diameterSpec: '6″',
    servings: '6 – 8 Servings',
    sliceCount: '6-8 slices',
    basePrice: 1800,
    desc: '6 – 8 Servings',
    tag: 'Popular',
    imageSrc: '/cake-size-6inch.webp',
  },
  {
    id: '8inch',
    name: '8" Cake',
    inches: 8,
    diameterSpec: '8″',
    servings: '12 – 16 Servings',
    sliceCount: '12-16 slices',
    basePrice: 2800,
    desc: '12 – 16 Servings',
    tag: 'Best Seller',
    popular: true,
    imageSrc: '/cake-size-8inch.webp',
  },
  {
    id: '10inch',
    name: '10" Cake',
    inches: 10,
    diameterSpec: '10″',
    servings: '20 – 26 Servings',
    sliceCount: '20-26 slices',
    basePrice: 4200,
    desc: '20 – 26 Servings',
    tag: 'Feast Size',
    imageSrc: '/cake-size-10inch.webp',
  },
];

const SPONGE_FLAVORS = [
  { id: 'chocolate', name: 'Belgian Chocolate', image: '/flavor-chocolate.jpg' },
  { id: 'vanilla', name: 'Vanilla Bean', image: '/flavor-vanilla.jpg' },
  { id: 'pistachio', name: 'Pistachio Rose', image: '/flavor-pistachio.jpg' },
  { id: 'red-velvet', name: 'Red Velvet', image: '/flavor-red-velvet.jpg' },
  { id: 'caramel', name: 'Salted Caramel', image: '/flavor-caramel.jpg' },
];

const FILLING_OPTIONS = [
  { id: 'swiss-buttercream', name: 'Swiss Buttercream' },
  { id: 'dark-ganache', name: 'Belgian Ganache' },
  { id: 'cream-cheese', name: 'Cream Cheese' },
  { id: 'fruit-compote', name: 'Raspberry Compote' },
  { id: 'salted-caramel', name: 'Caramel Cream' },
];

const COLOR_PALETTES = [
  { id: 'ivory', name: 'Ivory White', bg: 'bg-stone-100 border-stone-300' },
  { id: 'pink', name: 'Rose Pink', bg: 'bg-pink-100 border-pink-300' },
  { id: 'sage', name: 'Sage Green', bg: 'bg-emerald-100 border-emerald-300' },
  { id: 'chocolate', name: 'Mocha', bg: 'bg-amber-100 border-amber-300' },
  { id: 'lilac', name: 'Soft Lilac', bg: 'bg-purple-100 border-purple-300' },
];

type DeliveryZone = 'inside_dhaka' | 'outside_dhaka' | 'pickup';

export const CustomOrderPage: React.FC<CustomOrderPageProps> = ({ onBack }) => {
  // Two-phase stepper state
  const [currentPhase, setCurrentPhase] = useState<1 | 2>(1);

  // Phase 1: Cake Size
  const [selectedSizeId, setSelectedSizeId] = useState('8inch');

  // Phase 2: Ingredients, Reference Image & Delivery
  const [spongeFlavor, setSpongeFlavor] = useState('chocolate');
  const [filling, setFilling] = useState('swiss-buttercream');
  const [selectedColor, setSelectedColor] = useState('ivory');
  const [isEggless, setIsEggless] = useState(false);
  const [inscription, setInscription] = useState('');

  // Reference Image
  const [referenceImageFile, setReferenceImageFile] = useState<File | null>(null);
  const [referenceImagePreview, setReferenceImagePreview] = useState<string | null>(null);
  const [referenceNotes, setReferenceNotes] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Delivery details: Inside Dhaka (100) vs Outside Dhaka (120) vs Pickup (0)
  const [deliveryZone, setDeliveryZone] = useState<DeliveryZone>('inside_dhaka');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('02:00 PM');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  // Submitted order state
  const [submittedOrder, setSubmittedOrder] = useState<any | null>(null);

  // Pricing calculations
  const activeSize = CAKE_SIZES.find((s) => s.id === selectedSizeId) || CAKE_SIZES[2];
  const egglessFee = isEggless ? 250 : 0;
  const deliveryCost = deliveryZone === 'inside_dhaka' ? 100 : deliveryZone === 'outside_dhaka' ? 120 : 0;
  const grandTotal = activeSize.basePrice + egglessFee + deliveryCost;

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReferenceImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeReferenceImage = () => {
    setReferenceImageFile(null);
    setReferenceImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Submit order handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const zoneLabels: Record<DeliveryZone, string> = {
      inside_dhaka: 'Inside Dhaka (৳100)',
      outside_dhaka: 'Outside Dhaka (৳120)',
      pickup: 'Bakery Pickup (Free)',
    };

    const orderData = {
      orderId: `HKP-${Date.now().toString().slice(-6)}`,
      sizeName: activeSize.name,
      imageSrc: activeSize.imageSrc,
      diameterSpec: activeSize.diameterSpec,
      servings: activeSize.servings,
      basePrice: activeSize.basePrice,
      spongeFlavor: SPONGE_FLAVORS.find((f) => f.id === spongeFlavor)?.name,
      spongeFlavorImage: SPONGE_FLAVORS.find((f) => f.id === spongeFlavor)?.image,
      filling: FILLING_OPTIONS.find((f) => f.id === filling)?.name,
      color: COLOR_PALETTES.find((c) => c.id === selectedColor)?.name,
      isEggless,
      egglessFee,
      inscription: inscription.trim() || 'None',
      hasReferenceImage: Boolean(referenceImagePreview),
      referenceImageName: referenceImageFile?.name || null,
      referenceNotes,
      deliveryZone,
      deliveryZoneText: zoneLabels[deliveryZone],
      deliveryCost,
      date,
      time,
      name,
      phone,
      email: email.trim(),
      address: deliveryZone === 'pickup' ? 'Bakery Pickup (Bashundhara R/A, Block F, Dhaka)' : address,
      notes,
      totalPrice: grandTotal,
    };

    setSubmittedOrder(orderData);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Send order confirmation via Brevo
    try {
      fetch('/api/send-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      }).catch(() => {});
    } catch {}
  };

  // Pre-filled WhatsApp message
  const getWhatsAppUrl = () => {
    if (!submittedOrder) return '';
    const text =
      `*New Custom Cake Order (${submittedOrder.orderId})*%0A%0A` +
      `🎂 *PHASE 1 - CAKE SIZE:*%0A` +
      `• Size: ${submittedOrder.sizeName} (${submittedOrder.diameterSpec})%0A` +
      `• Portions: ${submittedOrder.servings}%0A%0A` +
      `🧁 *PHASE 2 - INGREDIENTS & DESIGN:*%0A` +
      `• Sponge Flavor: ${submittedOrder.spongeFlavor}%0A` +
      `• Filling / Cream: ${submittedOrder.filling}%0A` +
      `• Dietary: ${submittedOrder.isEggless ? '100% Pure Eggless (+৳250)' : 'Standard Artisan Sponge'}%0A` +
      `• Color Theme: ${submittedOrder.color}%0A` +
      `• Inscription: "${submittedOrder.inscription}"%0A` +
      (submittedOrder.hasReferenceImage
        ? `• Reference Image: Yes (attaching in this chat: ${submittedOrder.referenceImageName || 'photo'})%0A`
        : '• Reference Image: None%0A') +
      (submittedOrder.referenceNotes ? `• Design Notes: ${submittedOrder.referenceNotes}%0A` : '') +
      `%0A` +
      `🚚 *DELIVERY & FULFILLMENT:*%0A` +
      `• Area: ${submittedOrder.deliveryZoneText}%0A` +
      `• Delivery Cost: ৳${submittedOrder.deliveryCost}%0A` +
      `• Address: ${submittedOrder.address}%0A` +
      `• Date & Time: ${submittedOrder.date} at ${submittedOrder.time}%0A` +
      `• Customer: ${submittedOrder.name} (${submittedOrder.phone})%0A` +
      (submittedOrder.email ? `• Email: ${submittedOrder.email}%0A` : '') +
      (submittedOrder.notes ? `• Instructions: ${submittedOrder.notes}%0A` : '') +
      `%0A` +
      `💰 *ESTIMATED TOTAL:* ৳${submittedOrder.totalPrice.toLocaleString()} (incl. delivery)%0A`;

    return `https://wa.me/8801339656675?text=${text}`;
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-neutral-900 selection:bg-neutral-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
        
        {/* Back Link */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-neutral-500 hover:text-black transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to Bakery Home</span>
          </button>
          <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400">
            Hakuna Potata Custom Studio
          </span>
        </div>

        {/* Confirmation Screen */}
        {submittedOrder ? (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200/80 shadow-xl max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-500">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="text-center mb-8">
              <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-emerald-600 font-display">
                Order Logged Successfully
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mt-1 font-display">
                Thank You, {submittedOrder.name}!
              </h2>
              <p className="text-neutral-500 text-xs sm:text-sm mt-2 max-w-md mx-auto leading-relaxed">
                Your custom cake inquiry <span className="font-mono font-bold text-neutral-900">#{submittedOrder.orderId}</span> has been prepared. Click below to confirm directly with our bakers on WhatsApp!
              </p>
            </div>

            {/* Email Invoice Banner */}
            {submittedOrder.email && (
              <div className="bg-emerald-50/90 border border-emerald-200/80 rounded-2xl p-4 mb-6 flex items-start gap-3 text-left">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-950">
                    Official Invoice &amp; Receipt Emailed
                  </div>
                  <div className="text-[11px] text-emerald-850 mt-0.5 leading-relaxed text-neutral-600">
                    An itemized confirmation invoice was sent to <span className="font-semibold font-mono text-emerald-950">{submittedOrder.email}</span>.
                  </div>
                </div>
              </div>
            )}

            {/* Receipt Summary Card */}
            <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200/70 text-xs sm:text-sm space-y-3 mb-6">
              <div className="flex justify-between py-1 border-b border-neutral-200 items-center">
                <span className="text-neutral-500">Phase 1: Cake Size</span>
                <div className="flex items-center gap-2">
                  <img
                    src={submittedOrder.imageSrc}
                    alt={submittedOrder.sizeName}
                    className="w-8 h-8 object-contain"
                  />
                  <span className="font-bold text-neutral-900">
                    {submittedOrder.sizeName} ({submittedOrder.diameterSpec})
                  </span>
                </div>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-200">
                <span className="text-neutral-500">Portions &amp; Slices</span>
                <span className="font-bold text-neutral-900">{submittedOrder.servings}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-200 items-center">
                <span className="text-neutral-500">Sponge Flavor</span>
                <div className="flex items-center gap-2">
                  {submittedOrder.spongeFlavorImage && (
                    <img
                      src={submittedOrder.spongeFlavorImage}
                      alt={submittedOrder.spongeFlavor}
                      className="w-5 h-5 rounded-md object-cover ring-1 ring-neutral-200"
                    />
                  )}
                  <span className="font-bold text-neutral-900">{submittedOrder.spongeFlavor}</span>
                </div>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-200">
                <span className="text-neutral-500">Filling / Cream</span>
                <span className="font-bold text-neutral-900">{submittedOrder.filling}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-200">
                <span className="text-neutral-500">Dietary Preparation</span>
                <span className="font-bold text-neutral-900">
                  {submittedOrder.isEggless ? '100% Pure Eggless (+৳250)' : 'Standard Sponge'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-200">
                <span className="text-neutral-500">Custom Inscription</span>
                <span className="font-bold italic text-neutral-900">"{submittedOrder.inscription}"</span>
              </div>

              {/* Reference Image in Receipt */}
              {referenceImagePreview && (
                <div className="py-2 border-b border-neutral-200">
                  <span className="text-neutral-500 block mb-2">Reference Image:</span>
                  <img
                    src={referenceImagePreview}
                    alt="Reference Preview"
                    className="w-24 h-24 object-cover rounded-xl border border-neutral-300"
                  />
                  {submittedOrder.referenceNotes && (
                    <p className="text-xs text-neutral-600 mt-1 italic">
                      Note: {submittedOrder.referenceNotes}
                    </p>
                  )}
                </div>
              )}

              <div className="flex justify-between py-1 border-b border-neutral-200">
                <span className="text-neutral-500">Delivery Region</span>
                <span className="font-bold text-neutral-900">{submittedOrder.deliveryZoneText}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-200">
                <span className="text-neutral-500">Delivery Fee</span>
                <span className="font-bold text-neutral-900">৳{submittedOrder.deliveryCost}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-200">
                <span className="text-neutral-500">Schedule</span>
                <span className="font-bold text-neutral-900">
                  {submittedOrder.date} at {submittedOrder.time}
                </span>
              </div>
              {submittedOrder.email && (
                <div className="flex justify-between py-1 border-b border-neutral-200">
                  <span className="text-neutral-500">Invoice Sent To</span>
                  <span className="font-bold text-neutral-900 font-mono text-[11px] truncate max-w-[200px] sm:max-w-xs">{submittedOrder.email}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 text-base font-bold text-neutral-900">
                <span>Estimated Grand Total</span>
                <span className="text-black text-lg font-mono">৳{submittedOrder.totalPrice.toLocaleString()}</span>
              </div>
            </div>

            {/* Confirmation CTA Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Confirm Order via WhatsApp</span>
              </a>
              <a
                href="tel:+8801339656675"
                className="flex-1 bg-black hover:bg-neutral-800 text-white font-bold text-xs py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Call Bakery (+880 1339656675)</span>
              </a>
            </div>

            <button
              onClick={() => {
                setSubmittedOrder(null);
                setCurrentPhase(1);
              }}
              className="mt-4 w-full text-center text-xs text-neutral-500 hover:text-black py-2 transition-colors cursor-pointer"
            >
              Order Another Cake
            </button>
          </div>
        ) : (
          /* Main Two-Phase Order Studio Flow */
          <div>
            {/* Simple Stepper Tabs */}
            <div className="max-w-md mx-auto mb-8 select-none">
              <div className="grid grid-cols-2 p-1 bg-neutral-100 rounded-xl border border-neutral-200/90 shadow-inner">
                <button
                  type="button"
                  onClick={() => setCurrentPhase(1)}
                  className={`py-2 px-3 rounded-lg text-xs font-bold tracking-wide transition-all cursor-pointer text-center ${
                    currentPhase === 1
                      ? 'bg-black text-white shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  1. Size
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentPhase(2)}
                  className={`py-2 px-3 rounded-lg text-xs font-bold tracking-wide transition-all cursor-pointer text-center ${
                    currentPhase === 2
                      ? 'bg-black text-white shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  2. Ingredients &amp; Delivery
                </button>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* PHASE 1: CAKE SIZE SELECTION */}
            {/* ========================================================================= */}
            {currentPhase === 1 && (
              <div className="animate-in fade-in duration-300">
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-sm mb-8">
                  <div className="text-center mb-6">
                    <h2 className="text-lg sm:text-xl font-bold text-neutral-900 font-display">
                      Select Size
                    </h2>
                  </div>

                  {/* Size Cards Grid - 4 Columns */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                    {CAKE_SIZES.map((size) => {
                      const isSelected = selectedSizeId === size.id;
                      return (
                        <div
                          key={size.id}
                          onClick={() => setSelectedSizeId(size.id)}
                          className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer select-none flex flex-col items-center text-center relative group ${
                            isSelected
                              ? 'border-black bg-black text-white shadow-lg ring-2 ring-black scale-[1.02]'
                              : 'border-neutral-200 hover:border-neutral-400 bg-white hover:bg-neutral-50/50 text-neutral-900'
                          }`}
                        >
                          {/* Image */}
                          <div className="h-28 sm:h-32 w-full flex items-center justify-center my-2">
                            <img
                              src={size.imageSrc}
                              alt={`${size.inches} inch`}
                              className="h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-sm"
                            />
                          </div>

                          {/* Minimal Text */}
                          <h3 className="text-xl sm:text-2xl font-black font-display mt-1">
                            {size.inches}″
                          </h3>
                          <span
                            className={`text-xs mt-0.5 ${
                              isSelected ? 'text-neutral-300' : 'text-neutral-500'
                            }`}
                          >
                            {size.servings}
                          </span>
                          <span
                            className={`text-sm sm:text-base font-bold font-mono mt-2.5 ${
                              isSelected ? 'text-white' : 'text-neutral-900'
                            }`}
                          >
                            ৳{size.basePrice.toLocaleString()}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Action Bar */}
                  <div className="pt-4 border-t border-neutral-200 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-neutral-500 block">
                        Selected: <strong className="text-neutral-900">{activeSize.inches}″</strong> ({activeSize.servings})
                      </span>
                      <span className="text-lg font-black font-mono text-neutral-900">
                        ৳{activeSize.basePrice.toLocaleString()}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setCurrentPhase(2);
                        window.scrollTo({ top: 80, behavior: 'smooth' });
                      }}
                      className="bg-black hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-2 cursor-pointer font-display"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* PHASE 2: INGREDIENTS, REFERENCE IMAGE & DELIVERY */}
            {/* ========================================================================= */}
            {currentPhase === 2 && (
              <form onSubmit={handleSubmit} className="animate-in fade-in duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Left 2 Columns: Customization Inputs */}
                  <div className="lg:col-span-2 space-y-8">
                    
                    {/* Size Summary Banner in Phase 2 */}
                    <div className="bg-white rounded-2xl p-4 border border-neutral-200 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={activeSize.imageSrc}
                          alt={activeSize.name}
                          className="w-12 h-12 object-contain filter drop-shadow-sm shrink-0"
                        />
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                            Selected Size:
                          </span>
                          <span className="block text-sm font-bold text-neutral-900 font-display">
                            {activeSize.name} · {activeSize.servings} · ৳{activeSize.basePrice.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCurrentPhase(1)}
                        className="text-xs font-bold text-neutral-600 hover:text-black underline underline-offset-2 cursor-pointer"
                      >
                        Change Size
                      </button>
                    </div>

                    {/* Section 1: Cake Ingredients */}
                    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-neutral-200/80 shadow-sm space-y-6">
                      <div className="border-b border-neutral-100 pb-3">
                        <h2 className="text-base sm:text-lg font-bold text-neutral-900 font-display">
                          Flavors &amp; Fillings
                        </h2>
                      </div>

                      {/* Sponge Flavors */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2.5">
                          1. Sponge Flavor
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                          {SPONGE_FLAVORS.map((flavor) => {
                            const isSelected = spongeFlavor === flavor.id;
                            return (
                              <button
                                type="button"
                                key={flavor.id}
                                onClick={() => setSpongeFlavor(flavor.id)}
                                className={`p-2 sm:p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-center gap-2.5 ${
                                  isSelected
                                    ? 'border-black bg-black text-white shadow-md ring-1 ring-black'
                                    : 'border-neutral-200 hover:border-neutral-300 bg-white hover:bg-neutral-50/70 text-neutral-800'
                                }`}
                              >
                                <img
                                  src={flavor.image}
                                  alt={flavor.name}
                                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg object-cover shrink-0 shadow-xs ${
                                    isSelected ? 'ring-1 ring-white/30' : 'ring-1 ring-neutral-200/60'
                                  }`}
                                />
                                <span className="text-xs font-bold truncate leading-tight">{flavor.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Fillings */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2.5">
                          2. Filling &amp; Cream
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                          {FILLING_OPTIONS.map((f) => (
                            <button
                              type="button"
                              key={f.id}
                              onClick={() => setFilling(f.id)}
                              className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                                filling === f.id
                                  ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm'
                                  : 'border-neutral-200 hover:border-neutral-300 bg-neutral-50/50 text-neutral-800'
                              }`}
                            >
                              <span className="text-xs font-bold block truncate">{f.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Dietary / Eggless Toggle */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                          3. Dietary Preference
                        </label>
                        <div className="grid grid-cols-2 gap-2.5">
                          <button
                            type="button"
                            onClick={() => setIsEggless(false)}
                            className={`py-2.5 px-3 rounded-xl border text-center cursor-pointer transition-all text-xs font-bold ${
                              !isEggless
                                ? 'border-neutral-900 bg-black text-white'
                                : 'border-neutral-200 bg-neutral-50/60 text-neutral-700 hover:bg-neutral-100'
                            }`}
                          >
                            Standard
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsEggless(true)}
                            className={`py-2.5 px-3 rounded-xl border text-center cursor-pointer transition-all text-xs font-bold ${
                              isEggless
                                ? 'border-emerald-700 bg-emerald-700 text-white'
                                : 'border-neutral-200 bg-neutral-50/60 text-neutral-700 hover:bg-neutral-100'
                            }`}
                          >
                            Eggless (+৳250)
                          </button>
                        </div>
                      </div>

                      {/* Custom Inscription */}
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <label className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                            4. Message on Cake
                          </label>
                          <span className="text-[10px] font-mono text-neutral-400">
                            {inscription.length} / 40
                          </span>
                        </div>
                        <input
                          type="text"
                          maxLength={40}
                          placeholder="e.g. Happy Birthday Sarah!"
                          value={inscription}
                          onChange={(e) => setInscription(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-neutral-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all bg-neutral-50/50"
                        />
                      </div>

                      {/* Color Theme */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                          5. Accent Color
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {COLOR_PALETTES.map((c) => (
                            <button
                              type="button"
                              key={c.id}
                              onClick={() => setSelectedColor(c.id)}
                              className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all text-left ${
                                selectedColor === c.id
                                  ? 'border-neutral-900 ring-2 ring-neutral-900 bg-white font-bold text-neutral-900'
                                  : 'border-neutral-200 hover:border-neutral-300 text-neutral-700'
                              }`}
                            >
                              <span className={`w-3.5 h-3.5 rounded-full border ${c.bg} shrink-0`} />
                              <span className="text-xs truncate">{c.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Reference Image Upload */}
                    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-neutral-200/80 shadow-sm space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                        <h2 className="text-base sm:text-lg font-bold text-neutral-900 font-display flex items-center gap-2">
                          <FileImage className="w-4 h-4 text-pink-500" />
                          <span>Reference Photo</span>
                        </h2>
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                          Optional
                        </span>
                      </div>

                      {/* Upload Box */}
                      {!referenceImagePreview ? (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="border-2 border-dashed border-neutral-200 hover:border-black rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-neutral-50/60 group"
                        >
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                          <UploadCloud className="w-6 h-6 text-neutral-400 group-hover:text-black mb-1.5 transition-colors" />
                          <span className="text-xs font-bold text-neutral-700">
                            Upload reference photo
                          </span>
                          <span className="text-[10px] text-neutral-400 mt-0.5">
                            PNG, JPG (up to 15MB)
                          </span>
                        </div>
                      ) : (
                        <div className="relative border border-neutral-200 rounded-2xl p-3 bg-neutral-50 flex items-center gap-3">
                          <img
                            src={referenceImagePreview}
                            alt="Reference"
                            className="w-16 h-16 object-cover rounded-xl border border-neutral-200 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-mono text-emerald-600 font-bold uppercase tracking-wider flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Image Attached
                            </span>
                            <h4 className="text-xs font-bold text-neutral-800 truncate mt-0.5">
                              {referenceImageFile?.name || 'Custom Cake Reference'}
                            </h4>
                          </div>
                          <button
                            type="button"
                            onClick={removeReferenceImage}
                            className="p-1.5 rounded-lg hover:bg-rose-50 text-neutral-400 hover:text-rose-600 border border-neutral-200 transition-colors cursor-pointer text-xs"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      <div>
                        <input
                          type="text"
                          placeholder="Design notes (optional)"
                          value={referenceNotes}
                          onChange={(e) => setReferenceNotes(e.target.value)}
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:border-black outline-none bg-neutral-50/50"
                        />
                      </div>
                    </div>

                    {/* Section 3: Delivery Details */}
                    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-neutral-200/80 shadow-sm space-y-5">
                      <div className="border-b border-neutral-100 pb-2">
                        <h2 className="text-base sm:text-lg font-bold text-neutral-900 font-display flex items-center gap-2">
                          <Truck className="w-4 h-4 text-blue-600" />
                          <span>Delivery Details</span>
                        </h2>
                      </div>

                      {/* Delivery Zone Options */}
                      <div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {/* Inside Dhaka */}
                          <div
                            onClick={() => setDeliveryZone('inside_dhaka')}
                            className={`p-3.5 rounded-2xl border transition-all cursor-pointer select-none flex items-center justify-between sm:flex-col sm:items-start gap-1 ${
                              deliveryZone === 'inside_dhaka'
                                ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm'
                                : 'border-neutral-200 hover:border-neutral-300 bg-neutral-50/50 text-neutral-800'
                            }`}
                          >
                            <div>
                              <span className="font-bold text-xs sm:text-sm block">Inside Dhaka</span>
                              <span className={`text-[10px] ${deliveryZone === 'inside_dhaka' ? 'text-neutral-300' : 'text-neutral-400'}`}>
                                All areas
                              </span>
                            </div>
                            <span
                              className={`text-xs font-bold font-mono px-2 py-0.5 rounded-full ${
                                deliveryZone === 'inside_dhaka' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              ৳100
                            </span>
                          </div>

                          {/* Outside Dhaka */}
                          <div
                            onClick={() => setDeliveryZone('outside_dhaka')}
                            className={`p-3.5 rounded-2xl border transition-all cursor-pointer select-none flex items-center justify-between sm:flex-col sm:items-start gap-1 ${
                              deliveryZone === 'outside_dhaka'
                                ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm'
                                : 'border-neutral-200 hover:border-neutral-300 bg-neutral-50/50 text-neutral-800'
                            }`}
                          >
                            <div>
                              <span className="font-bold text-xs sm:text-sm block">Outside Dhaka</span>
                              <span className={`text-[10px] ${deliveryZone === 'outside_dhaka' ? 'text-neutral-300' : 'text-neutral-400'}`}>
                                Suburbs &amp; Greater Dhaka
                              </span>
                            </div>
                            <span
                              className={`text-xs font-bold font-mono px-2 py-0.5 rounded-full ${
                                deliveryZone === 'outside_dhaka' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              ৳120
                            </span>
                          </div>

                          {/* Bakery Pickup */}
                          <div
                            onClick={() => setDeliveryZone('pickup')}
                            className={`p-3.5 rounded-2xl border transition-all cursor-pointer select-none flex items-center justify-between sm:flex-col sm:items-start gap-1 ${
                              deliveryZone === 'pickup'
                                ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm'
                                : 'border-neutral-200 hover:border-neutral-300 bg-neutral-50/50 text-neutral-800'
                            }`}
                          >
                            <div>
                              <span className="font-bold text-xs sm:text-sm block">Bakery Pickup</span>
                              <span className={`text-[10px] ${deliveryZone === 'pickup' ? 'text-neutral-300' : 'text-neutral-400'}`}>
                                Bashundhara R/A
                              </span>
                            </div>
                            <span
                              className={`text-xs font-bold font-mono px-2 py-0.5 rounded-full ${
                                deliveryZone === 'pickup' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              FREE
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Date & Time */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                            Date *
                          </label>
                          <input
                            type="date"
                            required
                            min={new Date().toISOString().split('T')[0]}
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 focus:border-black outline-none bg-neutral-50/50 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                            Time Slot *
                          </label>
                          <select
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 focus:border-black outline-none bg-neutral-50/50 font-mono"
                          >
                            <option value="11:00 AM">11:00 AM – 01:00 PM</option>
                            <option value="02:00 PM">02:00 PM – 04:00 PM</option>
                            <option value="05:00 PM">05:00 PM – 07:00 PM</option>
                            <option value="08:00 PM">08:00 PM – 10:00 PM</option>
                          </select>
                        </div>
                      </div>

                      {/* Name & Phone */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                            Name *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Your Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 focus:border-black outline-none bg-neutral-50/50"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                            Phone *
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="017XXXXXXXX"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 focus:border-black outline-none bg-neutral-50/50 font-mono"
                          />
                        </div>
                      </div>

                      {/* Email for Full Invoice */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                            Email Address *
                          </label>
                          <span className="text-[10px] text-neutral-400 font-medium">
                            Official invoice will be emailed here
                          </span>
                        </div>
                        <input
                          type="email"
                          required
                          placeholder="your.email@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 focus:border-black outline-none bg-neutral-50/50"
                        />
                      </div>

                      {/* Address */}
                      {deliveryZone !== 'pickup' && (
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                            Delivery Address *
                          </label>
                          <textarea
                            rows={2}
                            required
                            placeholder="House, Road, Area..."
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 focus:border-black outline-none bg-neutral-50/50 resize-none"
                          />
                        </div>
                      )}

                      {/* Special Instructions */}
                      <div>
                        <input
                          type="text"
                          placeholder="Special instructions (optional)"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 focus:border-black outline-none bg-neutral-50/50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Live Order Summary Card */}
                  <div className="lg:col-span-1">
                    <div className="sticky top-20 bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-lg space-y-6">
                      <div className="border-b border-neutral-100 pb-3">
                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400 font-display">
                          Order Summary
                        </span>
                        <h3 className="text-lg font-bold text-neutral-900 font-display mt-0.5">
                          Custom Cake Estimate
                        </h3>
                      </div>

                      {/* Phase 1 Summary Item */}
                      <div className="space-y-3 text-xs">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-neutral-400 font-mono text-[10px] uppercase block">
                              Phase 1: Size
                            </span>
                            <span className="font-bold text-neutral-900">{activeSize.name}</span>
                            <span className="text-[11px] text-neutral-500 block">
                              {activeSize.diameterSpec} · {activeSize.servings}
                            </span>
                          </div>
                          <span className="font-bold font-mono text-neutral-900">
                            ৳{activeSize.basePrice.toLocaleString()}
                          </span>
                        </div>

                        {/* Phase 2 Ingredients Item */}
                        <div className="pt-2 border-t border-neutral-100">
                          <span className="text-neutral-400 font-mono text-[10px] uppercase block mb-1">
                            Phase 2: Ingredients
                          </span>
                          <div className="flex items-center gap-2">
                            <img
                              src={SPONGE_FLAVORS.find((f) => f.id === spongeFlavor)?.image}
                              alt="Flavor"
                              className="w-6 h-6 rounded-md object-cover ring-1 ring-neutral-200 shrink-0"
                            />
                            <div>
                              <span className="font-semibold text-neutral-800 block text-[11px] leading-tight">
                                {SPONGE_FLAVORS.find((f) => f.id === spongeFlavor)?.name}
                              </span>
                              <span className="text-neutral-500 text-[10px] block">
                                with {FILLING_OPTIONS.find((f) => f.id === filling)?.name}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Eggless Surcharge */}
                        {isEggless && (
                          <div className="flex justify-between text-emerald-700 text-xs font-semibold">
                            <span>100% Pure Eggless Sponge</span>
                            <span className="font-mono">+৳250</span>
                          </div>
                        )}

                        {/* Reference Image Badge */}
                        {referenceImagePreview && (
                          <div className="flex items-center gap-1.5 text-[11px] text-pink-700 bg-pink-50 px-2.5 py-1 rounded-lg">
                            <FileImage className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">Reference photo attached</span>
                          </div>
                        )}

                        {/* Delivery Surcharge */}
                        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
                          <div>
                            <span className="text-neutral-400 font-mono text-[10px] uppercase block">
                              Delivery Fee
                            </span>
                            <span className="font-semibold text-neutral-800">
                              {deliveryZone === 'inside_dhaka'
                                ? 'Inside Dhaka'
                                : deliveryZone === 'outside_dhaka'
                                ? 'Outside Dhaka'
                                : 'Bakery Pickup'}
                            </span>
                          </div>
                          <span className="font-bold font-mono text-neutral-900">
                            {deliveryCost > 0 ? `৳${deliveryCost}` : 'FREE'}
                          </span>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="pt-4 border-t border-neutral-200">
                        <div className="flex justify-between items-baseline mb-1">
                          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-display">
                            Grand Total
                          </span>
                          <span className="text-2xl font-black font-mono text-neutral-900">
                            ৳{grandTotal.toLocaleString()}
                          </span>
                        </div>
                        <span className="text-[10px] text-neutral-400 block text-right">
                          All taxes &amp; packaging included
                        </span>
                      </div>

                      {/* Buttons */}
                      <div className="space-y-2.5 pt-2">
                        <button
                          type="submit"
                          className="w-full bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider font-display py-3.5 px-4 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <MessageCircle className="w-4 h-4 text-emerald-400" />
                          <span>Review &amp; Submit Order</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setCurrentPhase(1);
                            window.scrollTo({ top: 100, behavior: 'smooth' });
                          }}
                          className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs py-2.5 px-4 rounded-xl transition-colors cursor-pointer text-center"
                        >
                          ← Back to Phase 1 (Size)
                        </button>
                      </div>

                      <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 text-[10px] text-neutral-500 leading-normal text-center">
                        🔒 No advance payment required online. We confirm via WhatsApp and collect payment upon artisan baking.
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomOrderPage;
