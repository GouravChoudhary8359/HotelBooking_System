import React from 'react';
import { Booking } from '../../types/hotel';
import { useHotel } from '../../context/HotelContext';
import {
  X,
  CheckCircle2,
  Printer,
  Download,
  Calendar,
  MapPin,
  Clock,
  QrCode,
  ShieldCheck,
  CreditCard,
  Building,
  ArrowRight,
  Share2,
} from 'lucide-react';

interface BookingVoucherModalProps {
  booking: Booking;
  onClose: () => void;
}

export const BookingVoucherModal: React.FC<BookingVoucherModalProps> = ({
  booking,
  onClose,
}) => {
  const { formatPrice, setActiveTab } = useHotel();

  const handlePrint = () => {
    window.print();
  };

  const handleViewAllBookings = () => {
    onClose();
    setActiveTab('guest-my-bookings');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Success Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-black/20 hover:bg-black/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-xs">
            <CheckCircle2 className="w-7 h-7 text-white" />
          </div>

          <h2 className="text-xl font-black tracking-tight">Booking Confirmed!</h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1">
            Thank you, {booking.guestDetails.fullName}. Your luxury stay is officially reserved.
          </p>

          <div className="mt-3 inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-md text-xs font-mono font-semibold tracking-wider">
            <span>REFERENCE: {booking.id}</span>
          </div>
        </div>

        {/* Printable Voucher Paper */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 print:p-0">
          {/* Hotel & Reservation Metadata */}
          <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-slate-900">HotelPro Grand Resort</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                  CONFIRMED VOUCHER
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>777 Azure Shore Boulevard, Coastal Haven</span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-400">Date Issued</div>
              <div className="text-xs font-semibold text-slate-800">
                {new Date(booking.bookedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
            </div>
          </div>

          {/* Stay Particulars */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <div className="text-slate-400 font-medium mb-1">Check-In</div>
              <div className="font-bold text-slate-900 text-sm">{booking.checkInDate}</div>
              <div className="text-[11px] text-slate-500">From 3:00 PM</div>
            </div>
            <div>
              <div className="text-slate-400 font-medium mb-1">Check-Out</div>
              <div className="font-bold text-slate-900 text-sm">{booking.checkOutDate}</div>
              <div className="text-[11px] text-slate-500">Until 11:00 AM</div>
            </div>
            <div>
              <div className="text-slate-400 font-medium mb-1">Duration & Room</div>
              <div className="font-bold text-slate-900 text-sm">
                {booking.nights} {booking.nights === 1 ? 'Night' : 'Nights'}
              </div>
              <div className="text-[11px] text-slate-500">Room {booking.roomNumber}</div>
            </div>
            <div>
              <div className="text-slate-400 font-medium mb-1">Guests</div>
              <div className="font-bold text-slate-900 text-sm">
                {booking.guests.adults} Adults
                {booking.guests.children > 0 ? `, ${booking.guests.children} Kids` : ''}
              </div>
              <div className="text-[11px] text-emerald-600 font-semibold">Confirmed</div>
            </div>
          </div>

          {/* Reserved Accommodation */}
          <div className="flex gap-4 items-center p-3.5 rounded-xl border border-slate-200">
            <img
              src={booking.roomImage}
              alt={booking.roomTitle}
              className="w-20 h-20 rounded-lg object-cover shrink-0"
            />
            <div>
              <h4 className="font-bold text-sm text-slate-900">{booking.roomTitle}</h4>
              <div className="text-xs text-slate-500 mt-0.5">
                {booking.roomType} · Room {booking.roomNumber}
              </div>
              <div className="text-xs text-slate-600 mt-1">
                Guest: <span className="font-semibold text-slate-800">{booking.guestDetails.fullName}</span> ({booking.guestDetails.email})
              </div>
            </div>
          </div>

          {/* Add-ons & Inclusions */}
          {booking.addons && booking.addons.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Included Enhancements
              </h4>
              <div className="space-y-1.5">
                {booking.addons.map((addon) => (
                  <div
                    key={addon.id}
                    className="flex justify-between items-center text-xs text-slate-700 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100"
                  >
                    <span>{addon.name}</span>
                    <span className="font-semibold">{formatPrice(addon.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Financial Breakdown Table */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Payment & Settlement
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
              <div className="flex justify-between px-4 py-2.5 bg-slate-50/50">
                <span className="text-slate-600">Base Room Total</span>
                <span className="font-medium text-slate-800">
                  {formatPrice(booking.priceBreakdown.baseRoomTotal)}
                </span>
              </div>
              {booking.priceBreakdown.addonsTotal > 0 && (
                <div className="flex justify-between px-4 py-2.5">
                  <span className="text-slate-600">Add-ons & Amenities</span>
                  <span className="font-medium text-slate-800">
                    +{formatPrice(booking.priceBreakdown.addonsTotal)}
                  </span>
                </div>
              )}
              {booking.priceBreakdown.discountTotal > 0 && (
                <div className="flex justify-between px-4 py-2.5 text-emerald-600 font-medium">
                  <span>Promotional Discount</span>
                  <span>-{formatPrice(booking.priceBreakdown.discountTotal)}</span>
                </div>
              )}
              <div className="flex justify-between px-4 py-2.5">
                <span className="text-slate-600">Taxes, Tourism & Service Surcharge</span>
                <span className="font-medium text-slate-800">
                  +{formatPrice(booking.priceBreakdown.taxAndFees)}
                </span>
              </div>
              <div className="flex justify-between px-4 py-3 bg-blue-50/40 text-sm font-bold">
                <span className="text-slate-900">Total Billed ({booking.paymentMethod})</span>
                <span className="text-blue-700">
                  {formatPrice(booking.priceBreakdown.grandTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* QR Code and Check-in Instructions */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Express Reception Fast-Pass</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Present this digital QR code or your reference #{booking.id} upon arrival at front desk
                for 60-second express keycard issuance.
              </p>
            </div>
            <div className="w-20 h-20 bg-white p-1 rounded-lg border border-slate-200 shrink-0 flex items-center justify-center shadow-xs">
              <QrCode className="w-16 h-16 text-slate-800" />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Voucher</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save as PDF</span>
            </button>
          </div>

          <button
            onClick={handleViewAllBookings}
            className="px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-md flex items-center gap-2 transition-all cursor-pointer"
          >
            <span>View in My Reservations</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
