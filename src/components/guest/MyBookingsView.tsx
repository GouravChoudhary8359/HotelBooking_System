import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  CalendarCheck,
  Calendar,
  Clock,
  MapPin,
  FileText,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Sparkles,
  Utensils,
  Plus,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { Booking } from '../../types/hotel';

export const MyBookingsView: React.FC = () => {
  const {
    bookings,
    formatPrice,
    cancelBooking,
    setActiveVoucher,
    addRoomServiceItem,
    setActiveTab,
  } = useHotel();

  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');
  const [selectedBookingForService, setSelectedBookingForService] = useState<string | null>(null);
  const [customServiceRequest, setCustomServiceRequest] = useState<string>('');

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'active') return b.bookingStatus === 'Confirmed' || b.bookingStatus === 'Checked-In';
    if (filter === 'completed') return b.bookingStatus === 'Checked-Out';
    if (filter === 'cancelled') return b.bookingStatus === 'Cancelled';
    return true;
  });

  const handleOrderService = (bookingId: string, item: string) => {
    addRoomServiceItem(bookingId, item);
  };

  const handleCustomService = (bookingId: string) => {
    if (!customServiceRequest.trim()) return;
    addRoomServiceItem(bookingId, customServiceRequest.trim());
    setCustomServiceRequest('');
  };

  const QUICK_ROOM_SERVICES = [
    'Fresh Egyptian Cotton Towels & Bathrobe',
    'Chilled Laurent-Perrier Brut Champagne & Strawberries',
    'Artisan Farmhouse Cheese Board & Crackers',
    'Hypoallergenic Pillow Menu (Memory Foam & Silk)',
    'Espresso Pods & Fine Herbal Tea Restock',
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-blue-700" />
            <span>My Reservations & Guest Concierge</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track stay status, view digital invoices, request on-demand room amenities, and manage reservations.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('guest-rooms')}
          className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
        >
          <span>Book Another Room</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Filter Tabs (Interactive buttons) */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit text-xs font-semibold">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
            filter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All ({bookings.length})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
            filter === 'active' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Active / Upcoming ({bookings.filter((b) => b.bookingStatus === 'Confirmed' || b.bookingStatus === 'Checked-In').length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
            filter === 'completed' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Completed ({bookings.filter((b) => b.bookingStatus === 'Checked-Out').length})
        </button>
        <button
          onClick={() => setFilter('cancelled')}
          className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
            filter === 'cancelled' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Cancelled ({bookings.filter((b) => b.bookingStatus === 'Cancelled').length})
        </button>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No reservations found in this category</h3>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            You don't have any bookings matching the current filter.
          </p>
          <button
            onClick={() => setActiveTab('guest-rooms')}
            className="px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            Explore Available Suites
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => {
            const isConfirmed = b.bookingStatus === 'Confirmed';
            const isCheckedIn = b.bookingStatus === 'Checked-In';
            const isCheckedOut = b.bookingStatus === 'Checked-Out';
            const isCancelled = b.bookingStatus === 'Cancelled';

            return (
              <div
                key={b.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden p-5 sm:p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-start gap-4">
                    <img
                      src={b.roomImage}
                      alt={b.roomTitle}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shrink-0"
                    />
                    <div>
                      {/* Unboxed Metadata Header */}
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1">
                        <span className="font-mono font-bold text-blue-700">{b.id}</span>
                        <span aria-hidden="true">·</span>
                        <span>Room {b.roomNumber}</span>
                        <span aria-hidden="true">·</span>
                        <span>{b.roomType}</span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-900">{b.roomTitle}</h3>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            {b.checkInDate} to {b.checkOutDate} ({b.nights} nights)
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            {b.guests.adults} Adults{b.guests.children > 0 ? `, ${b.guests.children} Kids` : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status & Total Price */}
                  <div className="flex flex-col sm:items-end justify-between gap-2 border-t lg:border-t-0 pt-3 lg:pt-0">
                    <div>
                      {isConfirmed && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-100 text-blue-800">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                          Confirmed Reservation
                        </span>
                      )}
                      {isCheckedIn && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Currently Checked-In
                        </span>
                      )}
                      {isCheckedOut && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
                          Completed Stay
                        </span>
                      )}
                      {isCancelled && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-100 text-rose-800">
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          Cancelled (Refunded)
                        </span>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-black text-slate-900">
                        {formatPrice(b.priceBreakdown.grandTotal)}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {b.paymentStatus} via {b.paymentMethod}
                      </div>
                    </div>
                  </div>
                </div>

                {/* In-Room Concierge & Room Service Orders (if active) */}
                {(isConfirmed || isCheckedIn) && (
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Utensils className="w-3.5 h-3.5 text-amber-600" />
                        <span>In-Room Hospitality & Concierge Service</span>
                      </div>
                      <button
                        onClick={() =>
                          setSelectedBookingForService(
                            selectedBookingForService === b.id ? null : b.id
                          )
                        }
                        className="text-xs text-blue-700 font-semibold hover:underline cursor-pointer"
                      >
                        {selectedBookingForService === b.id ? 'Close Menu' : '+ Request Amenity / Service'}
                      </button>
                    </div>

                    {/* Active Requested Items */}
                    {b.roomServiceOrders && b.roomServiceOrders.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {b.roomServiceOrders.map((order) => (
                          <div
                            key={order.id}
                            className="flex items-center justify-between text-xs bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100"
                          >
                            <span className="text-slate-700">{order.item}</span>
                            <span className="text-[11px] font-semibold text-emerald-600">
                              {order.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Dropdown Quick Request Options */}
                    {selectedBookingForService === b.id && (
                      <div className="mt-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100 space-y-2 animate-in fade-in duration-150">
                        <div className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                          1-Click Concierge Requests (Delivered to Room {b.roomNumber})
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {QUICK_ROOM_SERVICES.map((item, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleOrderService(b.id, item)}
                              className="text-left text-xs bg-white hover:bg-blue-100/60 p-2 rounded-lg border border-slate-200 transition-colors text-slate-800 flex items-center justify-between cursor-pointer"
                            >
                              <span className="truncate pr-2">{item}</span>
                              <Plus className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            </button>
                          ))}
                        </div>

                        {/* Custom Request input */}
                        <div className="flex gap-2 pt-1">
                          <input
                            type="text"
                            placeholder="Need anything else? (e.g. Iron & ironing board, taxi booking)"
                            value={customServiceRequest}
                            onChange={(e) => setCustomServiceRequest(e.target.value)}
                            className="flex-1 text-xs border border-slate-200 bg-white rounded-lg px-3 py-1.5 focus:outline-none"
                          />
                          <button
                            onClick={() => handleCustomService(b.id)}
                            className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg cursor-pointer"
                          >
                            Send
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Footer Action Bar */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="text-slate-400">
                    Booked on {new Date(b.bookedAt).toLocaleDateString()}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveVoucher(b)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                      <span>View Voucher & Invoice</span>
                    </button>

                    {!isCancelled && !isCheckedOut && (
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              `Are you sure you want to cancel booking ${b.id}? A full refund will be initiated.`
                            )
                          ) {
                            cancelBooking(b.id);
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold transition-colors cursor-pointer"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
