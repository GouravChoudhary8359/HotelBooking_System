import React, { useState } from 'react';
import { Room, BookingAddon, PaymentMethod } from '../../types/hotel';
import { useHotel } from '../../context/HotelContext';
import { STANDARD_ADDONS } from '../../data/mockHotelData';
import {
  X,
  Calendar,
  Users,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Tag,
  Clock,
  HelpCircle,
} from 'lucide-react';

interface BookingCheckoutModalProps {
  room: Room;
  onClose: () => void;
  defaultCheckIn?: string;
  defaultCheckOut?: string;
}

export const BookingCheckoutModal: React.FC<BookingCheckoutModalProps> = ({
  room,
  onClose,
  defaultCheckIn,
  defaultCheckOut,
}) => {
  const { formatPrice, createBooking } = useHotel();

  // Wizard Step (1: Stay & Addons, 2: Guest Details, 3: Payment & Confirm)
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Dates
  const [checkInDate, setCheckInDate] = useState<string>(
    defaultCheckIn || new Date().toISOString().split('T')[0]
  );
  const [checkOutDate, setCheckOutDate] = useState<string>(() => {
    if (defaultCheckOut) return defaultCheckOut;
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });

  // Guests
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);

  // Addons
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>(['addon-breakfast']);

  // Guest Details
  const [fullName, setFullName] = useState<string>('Jordan Reed');
  const [email, setEmail] = useState<string>('jordan.reed@hotelpro-guest.com');
  const [phone, setPhone] = useState<string>('+1 (555) 782-9901');
  const [city, setCity] = useState<string>('Chicago, IL');
  const [specialRequests, setSpecialRequests] = useState<string>(
    'Quiet room, high floor, anniversary setup if available.'
  );

  // Promo Code
  const [promoCode, setPromoCode] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<boolean>(false);
  const [promoError, setPromoError] = useState<string>('');

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Credit Card');
  const [cardNumber, setCardNumber] = useState<string>('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState<string>('12/28');
  const [cardCvc, setCardCvc] = useState<string>('888');
  const [upiId, setUpiId] = useState<string>('jordan@okhdfcbank');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Calculate nights
  const calculateNights = (): number => {
    const start = new Date(checkInDate).getTime();
    const end = new Date(checkOutDate).getTime();
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return isNaN(diff) || diff < 1 ? 1 : diff;
  };

  const nights = calculateNights();

  // Price calculations
  const baseRoomTotal = room.pricePerNight * nights;

  const selectedAddons: BookingAddon[] = STANDARD_ADDONS.filter((addon) =>
    selectedAddonIds.includes(addon.id)
  );

  const addonsTotal = selectedAddons.reduce((sum, addon) => {
    // For breakfast, multiply by nights and adults
    if (addon.id === 'addon-breakfast') {
      return sum + addon.price * nights * Math.max(1, adults);
    }
    return sum + addon.price;
  }, 0);

  const discountTotal = appliedPromo ? Math.round(baseRoomTotal * 0.1) : 0;
  const taxableSubtotal = baseRoomTotal + addonsTotal - discountTotal;
  const taxAndFees = Math.round(taxableSubtotal * 0.1); // 10% tax
  const grandTotal = taxableSubtotal + taxAndFees;

  const toggleAddon = (addonId: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'HOTELPRO10' || promoCode.trim().toUpperCase() === 'PROMO10') {
      setAppliedPromo(true);
      setPromoError('');
    } else {
      setPromoError('Invalid coupon. Try "HOTELPRO10" for 10% off.');
    }
  };

  const handleConfirmReservation = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      createBooking({
        roomId: room.id,
        roomNumber: room.roomNumber,
        roomTitle: room.title,
        roomType: room.type,
        roomImage: room.images[0],
        checkInDate,
        checkOutDate,
        nights,
        guests: { adults, children },
        guestDetails: {
          fullName,
          email,
          phone,
          city,
          specialRequests,
        },
        addons: selectedAddons,
        priceBreakdown: {
          baseRoomTotal,
          addonsTotal,
          taxAndFees,
          discountTotal,
          grandTotal,
        },
        paymentMethod,
        paymentStatus: paymentMethod === 'Pay at Hotel' ? 'Pending' : 'Paid',
      });
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700">
              <span>Step {step} of 3</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-500 font-normal">
                {step === 1 && 'Dates & Enhancements'}
                {step === 2 && 'Guest Information'}
                {step === 3 && 'Payment & Confirmation'}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Reserving {room.title} (Room {room.roomNumber})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Line */}
        <div className="w-full bg-slate-100 h-1">
          <div
            className="bg-blue-600 h-1 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Modal Body: 2 Columns on desktop (Inputs on Left, Order Summary on Right) */}
        <div className="overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Wizard Form (Cols 1-7) */}
          <div className="lg:col-span-7 space-y-6">
            {/* STEP 1: Dates & Add-ons */}
            {step === 1 && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>Select Stay Period</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">
                        Check-In Date
                      </label>
                      <input
                        type="date"
                        value={checkInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                        className="w-full text-xs sm:text-sm font-medium border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">
                        Check-Out Date
                      </label>
                      <input
                        type="date"
                        value={checkOutDate}
                        onChange={(e) => setCheckOutDate(e.target.value)}
                        className="w-full text-xs sm:text-sm font-medium border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-blue-700 font-medium">
                    Calculated stay: {nights} {nights === 1 ? 'night' : 'nights'}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span>Guests Occupancy</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">
                        Adults
                      </label>
                      <select
                        value={adults}
                        onChange={(e) => setAdults(Number(e.target.value))}
                        className="w-full text-xs sm:text-sm font-medium border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none"
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'Adult' : 'Adults'}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">
                        Children
                      </label>
                      <select
                        value={children}
                        onChange={(e) => setChildren(Number(e.target.value))}
                        className="w-full text-xs sm:text-sm font-medium border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none"
                      >
                        {[0, 1, 2, 3].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'Child' : 'Children'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Optional Stay Enhancements</span>
                    </div>
                    <span className="text-[11px] font-normal text-slate-400">Add to booking</span>
                  </h3>

                  <div className="space-y-2">
                    {STANDARD_ADDONS.map((addon) => {
                      const isChecked = selectedAddonIds.includes(addon.id);
                      return (
                        <div
                          key={addon.id}
                          onClick={() => toggleAddon(addon.id)}
                          className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start justify-between gap-3 ${
                            isChecked
                              ? 'border-blue-500 bg-blue-50/40 ring-1 ring-blue-500'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}}
                              className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                            />
                            <div>
                              <div className="font-semibold text-slate-900">{addon.name}</div>
                              <div className="text-slate-500 mt-0.5 leading-snug">
                                {addon.description}
                              </div>
                            </div>
                          </div>
                          <div className="font-bold text-slate-900 shrink-0 text-right">
                            +{formatPrice(addon.price)}
                            {addon.id === 'addon-breakfast' && (
                              <div className="text-[10px] text-slate-400 font-normal">/person/night</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Guest Information */}
            {step === 2 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">Primary Guest Details</h3>
                  <p className="text-xs text-slate-500">
                    We'll send the confirmation voucher and receipt to this contact.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Jordan Reed"
                      className="w-full text-xs sm:text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jordan.reed@example.com"
                        className="w-full text-xs sm:text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 782-9901"
                        className="w-full text-xs sm:text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      City of Residence
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Chicago, IL"
                      className="w-full text-xs sm:text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Special Requests / Preferences
                    </label>
                    <textarea
                      rows={2}
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="e.g. Quiet room, late arrival, twin bed setup, foam pillows"
                      className="w-full text-xs sm:text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Payment & Confirmation */}
            {step === 3 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">Payment Method</h3>
                  <p className="text-xs text-slate-500">
                    Select your preferred payment channel for immediate confirmation.
                  </p>
                </div>

                {/* Method selector */}
                <div className="grid grid-cols-3 gap-2">
                  {(['Credit Card', 'UPI / NetBanking', 'Pay at Hotel'] as PaymentMethod[]).map(
                    (method) => (
                      <button
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                          paymentMethod === method
                            ? 'border-blue-600 bg-blue-50 text-blue-800 ring-1 ring-blue-600'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {method}
                      </button>
                    )
                  )}
                </div>

                {/* Simulated Payment Form */}
                {paymentMethod === 'Credit Card' && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span className="font-semibold">Simulated Secure Gateway</span>
                      <span className="flex items-center gap-1 text-emerald-600">
                        <Lock className="w-3.5 h-3.5" /> 256-Bit SSL Encrypted
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                        Card Number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full text-xs font-medium border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-none"
                        />
                        <CreditCard className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full text-xs font-medium border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                          CVC / CVV
                        </label>
                        <input
                          type="password"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          placeholder="•••"
                          maxLength={4}
                          className="w-full text-xs font-medium border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'UPI / NetBanking' && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      UPI ID / Virtual Payment Address (VPA)
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@okhdfcbank"
                      className="w-full text-xs font-medium border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-none"
                    />
                    <p className="text-[11px] text-slate-500">
                      Supports Google Pay, PhonePe, Paytm, BHIM, and major Indian banking portals.
                    </p>
                  </div>
                )}

                {paymentMethod === 'Pay at Hotel' && (
                  <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-700" />
                      Pay Upon Arrival at Reception
                    </div>
                    <p className="text-amber-800 text-[11px]">
                      Your reservation will be held guaranteed until 6:00 PM on your arrival date.
                      You can pay via cash or card at the front desk.
                    </p>
                  </div>
                )}

                {/* Promo Code Input */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="Discount code (try HOTELPRO10)"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="w-full text-xs border border-slate-200 rounded-lg pl-8 p-2.5 bg-slate-50 focus:bg-white focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={handleApplyPromo}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {appliedPromo && (
                    <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 10% promo discount applied!
                    </div>
                  )}
                  {promoError && (
                    <div className="text-[11px] text-rose-500 mt-1">{promoError}</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary (Cols 8-12) */}
          <div className="lg:col-span-5 bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Reservation Summary
              </h4>

              {/* Room Card Mini */}
              <div className="flex gap-3 pb-3 border-b border-slate-200">
                <img
                  src={room.images[0]}
                  alt={room.title}
                  className="w-16 h-16 rounded-lg object-cover shrink-0"
                />
                <div>
                  <h5 className="text-xs font-bold text-slate-900 line-clamp-1">{room.title}</h5>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Room {room.roomNumber} · {room.type}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Floor {room.floor} · {room.bedType}
                  </div>
                </div>
              </div>

              {/* Stay Details */}
              <div className="py-3 border-b border-slate-200 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Stay:</span>
                  <span className="font-semibold text-slate-800">
                    {checkInDate} to {checkOutDate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-semibold text-slate-800">{nights} Nights</span>
                </div>
                <div className="flex justify-between">
                  <span>Guests:</span>
                  <span className="font-semibold text-slate-800">
                    {adults} Adults{children > 0 ? `, ${children} Kids` : ''}
                  </span>
                </div>
              </div>

              {/* Cost Itemization */}
              <div className="py-3 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>
                    Base Room ({nights} nights × {formatPrice(room.pricePerNight)})
                  </span>
                  <span className="font-medium text-slate-900">
                    {formatPrice(baseRoomTotal)}
                  </span>
                </div>

                {selectedAddons.length > 0 && (
                  <div className="flex justify-between">
                    <span>Stay Enhancements ({selectedAddons.length})</span>
                    <span className="font-medium text-slate-900">
                      +{formatPrice(addonsTotal)}
                    </span>
                  </div>
                )}

                {appliedPromo && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Promotional Discount (10%)</span>
                    <span>-{formatPrice(discountTotal)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Taxes & Service Fees (10%)</span>
                  <span className="font-medium text-slate-900">
                    +{formatPrice(taxAndFees)}
                  </span>
                </div>
              </div>
            </div>

            {/* Total Block */}
            <div className="pt-3 border-t border-slate-200">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-xs font-bold text-slate-700">Total Payable</span>
                <span className="text-xl font-black text-blue-700">
                  {formatPrice(grandTotal)}
                </span>
              </div>
              <div className="text-[10px] text-slate-400">
                Free cancellation up to 24h prior. Instant receipt issued upon confirmation.
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div>
            {step > 1 && (
              <button
                onClick={() => setStep((prev) => (prev - 1) as 1 | 2)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>

            {step < 3 ? (
              <button
                onClick={() => {
                  if (step === 2 && !fullName.trim()) {
                    alert('Please enter your full name');
                    return;
                  }
                  setStep((prev) => (prev + 1) as 2 | 3);
                }}
                className="px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-md flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Continue to {step === 1 ? 'Guest Info' : 'Payment'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleConfirmReservation}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Generating Voucher...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Confirm & Pay {formatPrice(grandTotal)}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
