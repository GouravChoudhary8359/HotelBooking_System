/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HotelProvider, useHotel } from './context/HotelContext';
import { Header } from './components/Header';
import { HeroSearch } from './components/guest/HeroSearch';
import { RoomCard } from './components/guest/RoomCard';
import { RoomDetailsModal } from './components/guest/RoomDetailsModal';
import { BookingCheckoutModal } from './components/guest/BookingCheckoutModal';
import { BookingVoucherModal } from './components/guest/BookingVoucherModal';
import { MyBookingsView } from './components/guest/MyBookingsView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { RoomInventoryView } from './components/admin/RoomInventoryView';
import { BookingsManagerView } from './components/admin/BookingsManagerView';
import { HousekeepingKanbanView } from './components/admin/HousekeepingKanbanView';
import { GuestCrmView } from './components/admin/GuestCrmView';
import { ReportsView } from './components/admin/ReportsView';
import { MentorSubmissionHub } from './components/submission/MentorSubmissionHub';
import { InteractiveDemoTour } from './components/submission/InteractiveDemoTour';
import {
  Hotel,
  Shield,
  Clock,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  Video,
  Award,
  ExternalLink,
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const {
    activeTab,
    rooms,
    selectedRoomForDetails,
    setSelectedRoomForDetails,
    selectedRoomForBooking,
    setSelectedRoomForBooking,
    activeVoucher,
    setActiveVoucher,
    setActiveTab,
  } = useHotel();

  // Search & Filter State
  const [checkInDate, setCheckInDate] = useState<string>(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  const [checkOutDate, setCheckOutDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [guestCount, setGuestCount] = useState<number>(2);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filtered rooms for guest view
  const filteredRooms = rooms.filter((r) => {
    if (selectedCategory !== 'ALL' && r.type !== selectedCategory) return false;
    if (guestCount > r.capacity.adults + r.capacity.children) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = r.title.toLowerCase().includes(q);
      const matchType = r.type.toLowerCase().includes(q);
      const matchDesc = r.description.toLowerCase().includes(q);
      const matchAmenity = r.amenities.some((a) => a.toLowerCase().includes(q));
      return matchTitle || matchType || matchDesc || matchAmenity;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Guest View: Rooms Discovery */}
        {activeTab === 'guest-rooms' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <HeroSearch
              checkInDate={checkInDate}
              setCheckInDate={setCheckInDate}
              checkOutDate={checkOutDate}
              setCheckOutDate={setCheckOutDate}
              guestCount={guestCount}
              setGuestCount={setGuestCount}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />

            <div>
              <div className="flex items-center justify-between pb-3 mb-5 border-b border-slate-200">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    Available Accommodations ({filteredRooms.length})
                  </h2>
                  <p className="text-xs text-slate-500">
                    Hand-curated rooms with luxury amenities, ocean terraces, and private plunge pools
                  </p>
                </div>
              </div>

              {filteredRooms.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
                  <Hotel className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-800">No matching suites found</h3>
                  <p className="text-xs text-slate-500 mt-1 mb-4">
                    Try adjusting your dates, reducing the guest count, or clearing search keywords.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('ALL');
                      setSearchQuery('');
                      setGuestCount(2);
                    }}
                    className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg"
                  >
                    Reset Search Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRooms.map((room) => (
                    <RoomCard key={room.id} room={room} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Guest View: My Bookings */}
        {activeTab === 'guest-my-bookings' && <MyBookingsView />}

        {/* Staff Admin Views */}
        {activeTab === 'admin-dashboard' && <AdminDashboard />}
        {activeTab === 'admin-rooms' && <RoomInventoryView />}
        {activeTab === 'admin-bookings' && <BookingsManagerView />}
        {activeTab === 'admin-housekeeping' && <HousekeepingKanbanView />}
        {activeTab === 'admin-crm' && <GuestCrmView />}
        {activeTab === 'admin-reports' && <ReportsView />}

        {/* Mentor Submission & Demo Video Hub */}
        {activeTab === 'submission-hub' && <MentorSubmissionHub />}
      </main>

      {/* Modals */}
      {selectedRoomForDetails && (
        <RoomDetailsModal
          room={selectedRoomForDetails}
          onClose={() => setSelectedRoomForDetails(null)}
        />
      )}

      {selectedRoomForBooking && (
        <BookingCheckoutModal
          room={selectedRoomForBooking}
          onClose={() => setSelectedRoomForBooking(null)}
          defaultCheckIn={checkInDate}
          defaultCheckOut={checkOutDate}
        />
      )}

      {activeVoucher && (
        <BookingVoucherModal
          booking={activeVoucher}
          onClose={() => setActiveVoucher(null)}
        />
      )}

      {/* Interactive Tour Overlay */}
      <InteractiveDemoTour />

      {/* Footer */}
      <footer className="bg-slate-900 text-white border-t border-slate-800 mt-16 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                  <Hotel className="w-4 h-4" />
                </div>
                <span className="font-bold text-base tracking-tight text-white">HotelPro</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Complete enterprise hotel booking & management platform. Powering seamless reservations,
                front desk room inventory, and housekeeping operations.
              </p>
              <div className="text-[11px] text-blue-400 font-semibold">
                Built for SkillWallet MERN Full Stack Capstone Project
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-200 uppercase tracking-wider mb-3">
                Guest Experience
              </h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <button onClick={() => setActiveTab('guest-rooms')} className="hover:text-white">
                    Explore Rooms & Suites
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('guest-my-bookings')} className="hover:text-white">
                    My Reservations & Concierge
                  </button>
                </li>
                <li>
                  <span className="text-slate-500">Express QR Fast-Pass Check-In</span>
                </li>
                <li>
                  <span className="text-slate-500">24/7 Digital Concierge Desk</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-200 uppercase tracking-wider mb-3">
                Hotel Operations Suite
              </h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <button onClick={() => setActiveTab('admin-dashboard')} className="hover:text-white">
                    Property Dashboard & KPIs
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('admin-rooms')} className="hover:text-white">
                    Visual Room Inventory Rack
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('admin-housekeeping')} className="hover:text-white">
                    Housekeeping Kanban Board
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('admin-reports')} className="hover:text-white">
                    Financial Audits & CSV Export
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-200 uppercase tracking-wider mb-3">
                Mentor Evaluation Pack
              </h4>
              <p className="text-slate-400 mb-3 leading-relaxed">
                Access your live hosted demo URL, screencast tour, and complete MERN project repository.
              </p>
              <button
                onClick={() => setActiveTab('submission-hub')}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Open Submission Hub</span>
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
            <div>
              © 2026 HotelPro Hospitality Solutions. Full-Stack MERN Architecture.
            </div>
            <div className="flex items-center gap-4">
              <span>Node.js v18+</span>
              <span>·</span>
              <span>Express.js REST</span>
              <span>·</span>
              <span>MongoDB</span>
              <span>·</span>
              <span>React 19 & Tailwind</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <HotelProvider>
      <MainAppContent />
    </HotelProvider>
  );
}
