import React from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  LayoutDashboard,
  BedDouble,
  Users,
  DollarSign,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { rooms, bookings, housekeeping, formatPrice, setActiveTab } = useHotel();

  // Metrics
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter((r) => r.status === 'Occupied').length;
  const availableRooms = rooms.filter((r) => r.status === 'Available').length;
  const cleaningRooms = rooms.filter((r) => r.status === 'Cleaning').length;
  const maintenanceRooms = rooms.filter((r) => r.status === 'Maintenance').length;

  const occupancyRate = Math.round((occupiedRooms / totalRooms) * 100);

  const confirmedBookings = bookings.filter((b) => b.bookingStatus === 'Confirmed');
  const checkedInBookings = bookings.filter((b) => b.bookingStatus === 'Checked-In');

  const totalRevenue = bookings
    .filter((b) => b.bookingStatus !== 'Cancelled')
    .reduce((sum, b) => sum + b.priceBreakdown.grandTotal, 0);

  const dirtyTasksCount = housekeeping.filter(
    (h) => h.stage === 'Dirty' || h.stage === 'In Progress'
  ).length;

  return (
    <div className="space-y-6">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-900 text-white uppercase tracking-wider">
              Staff Portal
            </span>
            <span className="text-xs text-slate-500 font-medium">Hotel Operational Command</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Property Overview & Live Operations
          </h2>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab('admin-rooms')}
            className="px-3.5 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <BedDouble className="w-3.5 h-3.5" />
            <span>Manage Room Rack</span>
          </button>
          <button
            onClick={() => setActiveTab('admin-bookings')}
            className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Reservations List</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Occupancy Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Occupancy Rate
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{occupancyRate}%</span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +5.2% vs last wk
            </span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {occupiedRooms} of {totalRooms} rooms occupied
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${occupancyRate}%` }} />
          </div>
        </div>

        {/* Total Confirmed Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Current Period Revenue
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{formatPrice(totalRevenue)}</span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +14.8%
            </span>
          </div>
          <div className="text-xs text-slate-500 mt-1">From {bookings.length} reservations</div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '78%' }} />
          </div>
        </div>

        {/* Today's Arrivals / Departures */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Guest Movement
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{confirmedBookings.length}</span>
            <span className="text-xs text-slate-600 font-medium">Pending Check-Ins</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {checkedInBookings.length} Guests currently residing
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '60%' }} />
          </div>
        </div>

        {/* Housekeeping Alert */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Housekeeping Queue
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{dirtyTasksCount}</span>
            <span className="text-xs text-rose-600 font-semibold">Rooms Need Turn</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {housekeeping.filter((h) => h.stage === 'Inspected').length} rooms verified clean
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: '45%' }} />
          </div>
        </div>
      </div>

      {/* Room Inventory Status Rack Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Room Status Distribution</h3>
            <p className="text-xs text-slate-500">Live inventory state across all hotel floors</p>
          </div>
          <button
            onClick={() => setActiveTab('admin-rooms')}
            className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View detailed room rack</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Segmented status bar */}
        <div className="h-4 w-full rounded-full bg-slate-100 flex overflow-hidden">
          <div
            style={{ width: `${(availableRooms / totalRooms) * 100}%` }}
            className="bg-emerald-500 transition-all"
            title={`Available: ${availableRooms}`}
          />
          <div
            style={{ width: `${(occupiedRooms / totalRooms) * 100}%` }}
            className="bg-amber-500 transition-all"
            title={`Occupied: ${occupiedRooms}`}
          />
          <div
            style={{ width: `${(cleaningRooms / totalRooms) * 100}%` }}
            className="bg-blue-500 transition-all"
            title={`Cleaning: ${cleaningRooms}`}
          />
          <div
            style={{ width: `${(maintenanceRooms / totalRooms) * 100}%` }}
            className="bg-rose-500 transition-all"
            title={`Maintenance: ${maintenanceRooms}`}
          />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>Available ({availableRooms})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span>Occupied ({occupiedRooms})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-500" />
            <span>Cleaning ({cleaningRooms})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500" />
            <span>Maintenance ({maintenanceRooms})</span>
          </div>
        </div>
      </div>

      {/* Two columns: Recent Bookings Table & Quick Front Desk Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Reservations Table (Cols 1-8) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h3 className="text-sm font-bold text-slate-900">Recent Booking Log</h3>
            <button
              onClick={() => setActiveTab('admin-bookings')}
              className="text-xs text-blue-700 font-semibold hover:underline"
            >
              See all ({bookings.length})
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-100">
                  <th className="pb-2.5">ID / Room</th>
                  <th className="pb-2.5">Guest</th>
                  <th className="pb-2.5">Stay Dates</th>
                  <th className="pb-2.5">Amount</th>
                  <th className="pb-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.slice(0, 5).map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50">
                    <td className="py-3">
                      <div className="font-mono font-bold text-blue-700">{b.id}</div>
                      <div className="text-[11px] text-slate-500">Room {b.roomNumber}</div>
                    </td>
                    <td className="py-3">
                      <div className="font-semibold text-slate-800">{b.guestDetails.fullName}</div>
                      <div className="text-[11px] text-slate-400">{b.guestDetails.phone}</div>
                    </td>
                    <td className="py-3">
                      <div className="text-slate-700">{b.checkInDate}</div>
                      <div className="text-[11px] text-slate-400">{b.nights} nights</div>
                    </td>
                    <td className="py-3 font-semibold text-slate-900">
                      {formatPrice(b.priceBreakdown.grandTotal)}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Operational Shortcuts (Cols 9-12) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Quick Operations</h3>
            <div className="space-y-2.5">
              <button
                onClick={() => setActiveTab('admin-bookings')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-left transition-all cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-slate-800">Front Desk Check-in / Out</div>
                  <div className="text-[11px] text-slate-400">Process arriving & departing guests</div>
                </div>
                <ArrowRight className="w-4 h-4 text-blue-600" />
              </button>

              <button
                onClick={() => setActiveTab('admin-housekeeping')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-left transition-all cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-slate-800">Housekeeping Tasks Kanban</div>
                  <div className="text-[11px] text-slate-400">{dirtyTasksCount} rooms needing attention</div>
                </div>
                <ArrowRight className="w-4 h-4 text-blue-600" />
              </button>

              <button
                onClick={() => setActiveTab('admin-crm')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-left transition-all cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-slate-800">VIP Guest Profiles & CRM</div>
                  <div className="text-[11px] text-slate-400">Loyalty tiers & guest histories</div>
                </div>
                <ArrowRight className="w-4 h-4 text-blue-600" />
              </button>

              <button
                onClick={() => setActiveTab('admin-reports')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-left transition-all cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-slate-800">Financial Reports & Exports</div>
                  <div className="text-[11px] text-slate-400">Download CSV / JSON ledger</div>
                </div>
                <ArrowRight className="w-4 h-4 text-blue-600" />
              </button>
            </div>
          </div>

          {/* SkillWallet Project Submission Reminder Card */}
          <div className="bg-gradient-to-br from-blue-700 to-indigo-800 text-white rounded-2xl p-5 shadow-sm">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/40 uppercase tracking-wider">
              Ready for Mentor Review
            </span>
            <h4 className="text-sm font-bold mt-2">SkillWallet Project Submission</h4>
            <p className="text-xs text-blue-100 mt-1 leading-relaxed">
              Generate your live Demo Link, interactive Walkthrough Video, and MERN architecture report
              in 1 click.
            </p>
            <button
              onClick={() => setActiveTab('submission-hub')}
              className="mt-3.5 w-full py-2 bg-white hover:bg-blue-50 text-blue-700 rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              Open Demo Video & Link Center →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
