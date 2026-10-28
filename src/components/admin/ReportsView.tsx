import React from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  BarChart3,
  Download,
  DollarSign,
  TrendingUp,
  PieChart,
  Calendar,
  FileSpreadsheet,
  CheckCircle,
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { bookings, rooms, formatPrice } = useHotel();

  const totalRevenue = bookings
    .filter((b) => b.bookingStatus !== 'Cancelled')
    .reduce((sum, b) => sum + b.priceBreakdown.grandTotal, 0);

  const averageBookingValue =
    bookings.length > 0 ? Math.round(totalRevenue / bookings.length) : 0;

  // Breakdown by Room Type
  const revenueByType: Record<string, number> = {};
  bookings
    .filter((b) => b.bookingStatus !== 'Cancelled')
    .forEach((b) => {
      revenueByType[b.roomType] = (revenueByType[b.roomType] || 0) + b.priceBreakdown.grandTotal;
    });

  // Breakdown by Payment Method
  const paymentBreakdown: Record<string, number> = {};
  bookings.forEach((b) => {
    paymentBreakdown[b.paymentMethod] = (paymentBreakdown[b.paymentMethod] || 0) + 1;
  });

  const exportCSV = () => {
    const headers = [
      'Booking ID',
      'Room Number',
      'Room Type',
      'Guest Name',
      'Guest Email',
      'Check In',
      'Check Out',
      'Nights',
      'Status',
      'Total Amount USD',
    ];
    const rows = bookings.map((b) => [
      b.id,
      b.roomNumber,
      `"${b.roomType}"`,
      `"${b.guestDetails.fullName}"`,
      b.guestDetails.email,
      b.checkInDate,
      b.checkOutDate,
      b.nights,
      b.bookingStatus,
      b.priceBreakdown.grandTotal,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `hotelpro_bookings_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportJSON = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(bookings, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `hotelpro_financial_ledger_${new Date().toISOString().split('T')[0]}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.removeChild(downloadAnchor);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-700" />
            <span>Financial & Occupancy Analytics</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Property performance indicators, category revenue distribution, settlement methods, and downloadable audit exports.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={exportCSV}
            className="px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={exportJSON}
            className="px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Top 3 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Gross Billed Revenue
          </span>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {formatPrice(totalRevenue)}
          </div>
          <div className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +16.4% YoY performance
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Average Booking Value (ABV)
          </span>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {formatPrice(averageBookingValue)}
          </div>
          <div className="text-xs text-slate-500 mt-1">Across all room tiers</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total Room Nights Sold
          </span>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {bookings.reduce((sum, b) => sum + b.nights, 0)} Nights
          </div>
          <div className="text-xs text-slate-500 mt-1">Avg 3.2 nights per stay</div>
        </div>
      </div>

      {/* Breakdown by Category & Payment method */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Room Category */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Revenue by Accommodation Tier</h3>
          <div className="space-y-4">
            {Object.entries(revenueByType).map(([type, amount]) => {
              const pct = totalRevenue > 0 ? Math.round((amount / totalRevenue) * 100) : 0;
              return (
                <div key={type} className="space-y-1.5 text-xs">
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>{type}</span>
                    <span>
                      {formatPrice(amount)} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Channels Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Payment Method Distribution</h3>
          <div className="space-y-3">
            {Object.entries(paymentBreakdown).map(([method, count]) => {
              const pct = Math.round((count / bookings.length) * 100);
              return (
                <div
                  key={method}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900">{method}</div>
                    <div className="text-slate-400 text-[11px]">{count} transactions</div>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-blue-700 text-sm">{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
