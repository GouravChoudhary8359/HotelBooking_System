import React from 'react';
import { Calendar, Users, Search, Sparkles, Shield, Award, Clock } from 'lucide-react';
import { RoomType } from '../../types/hotel';

interface HeroSearchProps {
  checkInDate: string;
  setCheckInDate: (date: string) => void;
  checkOutDate: string;
  setCheckOutDate: (date: string) => void;
  guestCount: number;
  setGuestCount: (count: number) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const CATEGORIES: { label: string; value: string }[] = [
  { label: 'All Rooms & Suites', value: 'ALL' },
  { label: 'Standard Deluxe', value: 'Standard Deluxe' },
  { label: 'Ocean View Suites', value: 'Ocean View Suite' },
  { label: 'Executive Penthouses', value: 'Executive Penthouse' },
  { label: 'Presidential Villas', value: 'Presidential Villa' },
  { label: 'Family Garden Suites', value: 'Family Garden Suite' },
];

export const HeroSearch: React.FC<HeroSearchProps> = ({
  checkInDate,
  setCheckInDate,
  checkOutDate,
  setCheckOutDate,
  guestCount,
  setGuestCount,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <div className="relative mb-10">
      {/* Background Graphic Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 text-white shadow-xl">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-blue-950/70" />

        <div className="relative max-w-5xl mx-auto px-6 py-12 md:py-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold mb-4 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>Luxury Hospitality & Seamless Reservations</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            Experience Unmatched Comfort & Elegance
          </h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-slate-300 leading-relaxed mb-8">
            Discover bespoke oceanfront suites, executive penthouses, and private garden villas.
            Guaranteed best rates, instantaneous confirmation, and flexible cancellation.
          </p>

          {/* Quick Value Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300 mb-8">
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Best Rate Guaranteed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Instant Digital Voucher</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-blue-400" />
              <span>5-Star Hospitality Standard</span>
            </div>
          </div>

          {/* Floating Search & Booking Filter Box */}
          <div className="bg-white rounded-xl shadow-2xl p-4 md:p-6 text-slate-900 text-left border border-slate-100 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Check-In Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Check-In
                </label>
                <div className="relative flex items-center border border-slate-200 rounded-lg px-3 py-2 bg-slate-50/50 hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <Calendar className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full text-xs sm:text-sm font-medium bg-transparent focus:outline-none text-slate-800"
                  />
                </div>
              </div>

              {/* Check-Out Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Check-Out
                </label>
                <div className="relative flex items-center border border-slate-200 rounded-lg px-3 py-2 bg-slate-50/50 hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <Calendar className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="w-full text-xs sm:text-sm font-medium bg-transparent focus:outline-none text-slate-800"
                  />
                </div>
              </div>

              {/* Guests Count */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Guests
                </label>
                <div className="relative flex items-center border border-slate-200 rounded-lg px-3 py-2 bg-slate-50/50 hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <Users className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full text-xs sm:text-sm font-medium bg-transparent focus:outline-none text-slate-800 cursor-pointer"
                  >
                    <option value={1}>1 Guest (Single)</option>
                    <option value={2}>2 Guests (Couple / Pair)</option>
                    <option value={3}>3 Guests</option>
                    <option value={4}>4 Guests (Family / Group)</option>
                    <option value={5}>5+ Guests (Villa)</option>
                  </select>
                </div>
              </div>

              {/* Search Keywords */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Room Search
                </label>
                <div className="relative flex items-center border border-slate-200 rounded-lg px-3 py-2 bg-slate-50/50 hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    placeholder="e.g. Ocean, Penthouse, King"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs sm:text-sm font-medium bg-transparent focus:outline-none text-slate-800 placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Segmented Filter Bar for Categories */}
      <div className="mt-6 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.value
                  ? 'bg-blue-700 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing curated inventory with live pricing & instant confirmation
        </div>
      </div>
    </div>
  );
};
