import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  ClipboardList,
  Search,
  Filter,
  CheckCircle2,
  LogOut,
  LogIn,
  XCircle,
  FileText,
  Calendar,
  Phone,
  Mail,
  AlertCircle,
} from 'lucide-react';
import { BookingStatus } from '../../types/hotel';

export const BookingsManagerView: React.FC = () => {
  const {
    bookings,
    checkInBooking,
    checkOutBooking,
    cancelBooking,
    formatPrice,
    setActiveVoucher,
  } = useHotel();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter !== 'ALL' && b.bookingStatus !== statusFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = b.guestDetails.fullName.toLowerCase().includes(q);
      const matchId = b.id.toLowerCase().includes(q);
      const matchRoom = b.roomNumber.toLowerCase().includes(q);
      const matchEmail = b.guestDetails.email.toLowerCase().includes(q);
      return matchName || matchId || matchRoom || matchEmail;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-blue-700" />
            <span>Reservations & Front Desk Manager</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Complete booking log with guest arrivals, departures, billing records, and fast check-in processing.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by ID, guest name, or room..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full">
          <span className="font-semibold text-slate-400 uppercase tracking-wider text-[11px] mr-1">
            Filter:
          </span>
          {['ALL', 'Confirmed', 'Checked-In', 'Checked-Out', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-4">Booking Ref</th>
                <th className="py-3 px-4">Room & Tier</th>
                <th className="py-3 px-4">Guest Info</th>
                <th className="py-3 px-4">Dates & Nights</th>
                <th className="py-3 px-4">Financials</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    No reservations matched your criteria.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Booking ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                      {b.id}
                      <div className="text-[10px] text-slate-400 font-sans font-normal">
                        {new Date(b.bookedAt).toLocaleDateString()}
                      </div>
                    </td>

                    {/* Room */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">Room {b.roomNumber}</div>
                      <div className="text-[11px] text-slate-500">{b.roomType}</div>
                    </td>

                    {/* Guest */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{b.guestDetails.fullName}</div>
                      <div className="text-[11px] text-slate-400">{b.guestDetails.email}</div>
                      <div className="text-[11px] text-slate-400">{b.guestDetails.phone}</div>
                    </td>

                    {/* Dates */}
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 font-medium">
                        {b.checkInDate} → {b.checkOutDate}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {b.nights} nights · {b.guests.adults}A, {b.guests.children}C
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">
                        {formatPrice(b.priceBreakdown.grandTotal)}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {b.paymentStatus} · {b.paymentMethod}
                      </div>
                    </td>

                    {/* Status badge */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold ${
                          b.bookingStatus === 'Confirmed'
                            ? 'bg-blue-100 text-blue-800'
                            : b.bookingStatus === 'Checked-In'
                            ? 'bg-emerald-100 text-emerald-800'
                            : b.bookingStatus === 'Checked-Out'
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {b.bookingStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setActiveVoucher(b)}
                          title="View Invoice & Voucher"
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>

                        {b.bookingStatus === 'Confirmed' && (
                          <button
                            onClick={() => checkInBooking(b.id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md flex items-center gap-1 transition-colors"
                          >
                            <LogIn className="w-3 h-3" />
                            <span>Check-In</span>
                          </button>
                        )}

                        {b.bookingStatus === 'Checked-In' && (
                          <button
                            onClick={() => checkOutBooking(b.id)}
                            className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-md flex items-center gap-1 transition-colors"
                          >
                            <LogOut className="w-3 h-3" />
                            <span>Check-Out</span>
                          </button>
                        )}

                        {b.bookingStatus !== 'Cancelled' && b.bookingStatus !== 'Checked-Out' && (
                          <button
                            onClick={() => {
                              if (window.confirm(`Cancel reservation ${b.id}?`)) {
                                cancelBooking(b.id);
                              }
                            }}
                            title="Cancel reservation"
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
