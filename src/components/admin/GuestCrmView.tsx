import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  Users,
  Search,
  Award,
  Crown,
  Phone,
  Mail,
  DollarSign,
  Calendar,
  Sparkles,
} from 'lucide-react';

export const GuestCrmView: React.FC = () => {
  const { guests, formatPrice } = useHotel();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGuests = guests.filter((g) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      g.name.toLowerCase().includes(q) ||
      g.email.toLowerCase().includes(q) ||
      g.phone.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-700" />
            <span>Guest CRM & Loyalty Intelligence</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Maintain guest histories, track VIP tiers, record personalized preferences, and nurture hospitality relationships.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search guest by name, email, or telephone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none text-xs"
          />
        </div>
        <div className="text-xs text-slate-500 font-medium hidden sm:block">
          {guests.length} Registered Guest Profiles
        </div>
      </div>

      {/* Guest Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {filteredGuests.map((guest) => {
          const isPlatinum = guest.vipTier === 'Platinum';
          const isGold = guest.vipTier === 'Gold';

          return (
            <div
              key={guest.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all space-y-4"
            >
              {/* Profile Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-800 font-bold text-base flex items-center justify-center border border-blue-200">
                    {guest.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{guest.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <Mail className="w-3.5 h-3.5" />
                      <span>{guest.email}</span>
                    </div>
                  </div>
                </div>

                {/* VIP Badge */}
                <div
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                    isPlatinum
                      ? 'bg-purple-100 text-purple-800 border border-purple-200'
                      : isGold
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  <Crown className="w-3.5 h-3.5" />
                  <span>{guest.vipTier} Member</span>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-2 bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs text-center">
                <div>
                  <span className="text-slate-400 block text-[11px]">Total Stays</span>
                  <span className="font-black text-slate-900 text-sm">{guest.totalStays}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Lifetime Spend</span>
                  <span className="font-black text-emerald-700 text-sm">
                    {formatPrice(guest.totalSpent)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Last Stay</span>
                  <span className="font-semibold text-slate-800 text-xs">{guest.lastStay}</span>
                </div>
              </div>

              {/* Preferences & Concierge Notes */}
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Concierge & Guest Preferences:
                </span>
                <p className="text-xs text-slate-700 bg-amber-50/50 p-2.5 rounded-lg border border-amber-100 leading-relaxed">
                  {guest.notes}
                </p>
              </div>

              {/* Contact Footer */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{guest.phone}</span>
                </span>
                <span className="text-blue-700 font-semibold cursor-pointer hover:underline">
                  View Full History
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
