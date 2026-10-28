import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import {
  Hotel,
  CalendarCheck,
  LayoutDashboard,
  BedDouble,
  ClipboardList,
  Sparkles,
  Users,
  BarChart3,
  Video,
  Bell,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  Layers,
  Play,
} from 'lucide-react';
import { CURRENCIES } from '../data/mockHotelData';
import { CurrencyCode } from '../types/hotel';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    activeCurrency,
    setCurrency,
    notifications,
    markNotificationAsRead,
    clearNotifications,
    bookings,
    resetAllData,
    setIsDemoTourActive,
  } = useHotel();

  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const activeBookingsCount = bookings.filter((b) => b.bookingStatus !== 'Cancelled').length;

  const isAdminTab = activeTab.startsWith('admin-');

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Mentor Submission & Live Demo Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white px-4 py-2 text-xs md:text-sm font-medium flex flex-wrap items-center justify-between gap-3 shadow-inner">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-500/40 text-blue-100 text-xs font-semibold uppercase tracking-wider">
            SkillWallet Project
          </span>
          <span className="font-semibold">HotelPro - Complete Hotel Booking & Management Solution</span>
          <span className="hidden md:inline text-blue-200">· Full-Stack MERN Architecture</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDemoTourActive(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold text-xs shadow-sm transition-all"
            title="Auto-run guided interactive walkthrough"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Interactive Demo Tour</span>
          </button>

          <button
            onClick={() => setActiveTab('submission-hub')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-all ${
              activeTab === 'submission-hub'
                ? 'bg-white text-blue-700 shadow-md'
                : 'bg-white/20 hover:bg-white/30 text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Add Demo & GitHub Links</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Identity */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => setActiveTab('guest-rooms')}
              className="flex items-center gap-2.5 group text-left cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center shadow-md group-hover:bg-blue-800 transition-colors">
                <Hotel className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-bold tracking-tight text-slate-900">HotelPro</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 uppercase tracking-wider">
                    Suites & Resorts
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-none">Booking & Management Platform</p>
              </div>
            </button>

            {/* Nav Tabs */}
            <nav className="hidden lg:flex items-center gap-1">
              <button
                onClick={() => setActiveTab('guest-rooms')}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'guest-rooms'
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Browse & Book Rooms
              </button>

              <button
                onClick={() => setActiveTab('guest-my-bookings')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'guest-my-bookings'
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>My Reservations</span>
                <span className="text-xs px-1.5 py-0.2 bg-blue-100 text-blue-700 font-bold rounded-full">
                  {activeBookingsCount}
                </span>
              </button>

              {/* Admin Portal Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowAdminMenu(!showAdminMenu)}
                  onBlur={() => setTimeout(() => setShowAdminMenu(false), 200)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isAdminTab
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Hotel Management</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                </button>

                {showAdminMenu && (
                  <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Staff Operational Modules
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab('admin-dashboard');
                        setShowAdminMenu(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 text-left transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-blue-600" />
                      <div>
                        <div className="font-medium">Overview Dashboard</div>
                        <div className="text-xs text-slate-400">Occupancy & KPIs</div>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('admin-rooms');
                        setShowAdminMenu(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 text-left transition-colors"
                    >
                      <BedDouble className="w-4 h-4 text-indigo-600" />
                      <div>
                        <div className="font-medium">Room Inventory & Rack</div>
                        <div className="text-xs text-slate-400">Status, Pricing & Add Room</div>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('admin-bookings');
                        setShowAdminMenu(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 text-left transition-colors"
                    >
                      <ClipboardList className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div className="font-medium">Bookings & Reservations</div>
                        <div className="text-xs text-slate-400">Check-in, Check-out & Invoices</div>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('admin-housekeeping');
                        setShowAdminMenu(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 text-left transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <div>
                        <div className="font-medium">Housekeeping Kanban</div>
                        <div className="text-xs text-slate-400">Cleaning workflow & staff</div>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('admin-crm');
                        setShowAdminMenu(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 text-left transition-colors"
                    >
                      <Users className="w-4 h-4 text-purple-600" />
                      <div>
                        <div className="font-medium">Guest CRM & Profiles</div>
                        <div className="text-xs text-slate-400">VIP tiers & stay records</div>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('admin-reports');
                        setShowAdminMenu(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 text-left transition-colors"
                    >
                      <BarChart3 className="w-4 h-4 text-rose-600" />
                      <div>
                        <div className="font-medium">Financial & Occupancy Reports</div>
                        <div className="text-xs text-slate-400">Revenue analytics & export</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => setActiveTab('submission-hub')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'submission-hub'
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Video className="w-4 h-4 text-blue-600" />
                <span>Demo Video & Links</span>
              </button>
            </nav>
          </div>

          {/* Right Controls: Currency, Notifications, Reset */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Currency Selector */}
            <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50 text-xs font-semibold">
              {(Object.keys(CURRENCIES) as CurrencyCode[]).map((cur) => (
                <button
                  key={cur}
                  onClick={() => setCurrency(cur)}
                  className={`px-2 py-1 rounded-md transition-colors ${
                    activeCurrency === cur
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {cur}
                </button>
              ))}
            </div>

            {/* Notification Center */}
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
                )}
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-800 uppercase tracking-wider">
                      Live Operations Feed ({notifications.length})
                    </span>
                    <button
                      onClick={clearNotifications}
                      className="text-xs text-slate-400 hover:text-slate-700"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400">
                        No new notifications
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationAsRead(n.id)}
                          className={`p-3 text-left hover:bg-slate-50 cursor-pointer transition-colors ${
                            !n.read ? 'bg-blue-50/50' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                            <span>{n.title}</span>
                            <span className="text-[10px] text-slate-400 font-normal">{n.time}</span>
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Reset Demo State Button */}
            <button
              onClick={() => {
                if (window.confirm('Reset all rooms, bookings, and housekeeping to initial demo state?')) {
                  resetAllData();
                }
              }}
              title="Reset Demo Data"
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors hidden sm:block"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Quick Switch to Admin or Guest mode button */}
            <button
              onClick={() =>
                setActiveTab(isAdminTab ? 'guest-rooms' : 'admin-dashboard')
              }
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isAdminTab
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isAdminTab ? 'Switch to Guest Mode' : 'Staff Admin Panel'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Sub-bar */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 text-xs">
          <button
            onClick={() => setActiveTab('guest-rooms')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
              activeTab === 'guest-rooms' ? 'bg-blue-100 text-blue-700' : 'text-slate-600'
            }`}
          >
            Rooms
          </button>
          <button
            onClick={() => setActiveTab('guest-my-bookings')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
              activeTab === 'guest-my-bookings' ? 'bg-blue-100 text-blue-700' : 'text-slate-600'
            }`}
          >
            Reservations ({activeBookingsCount})
          </button>
          <button
            onClick={() => setActiveTab('admin-dashboard')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
              activeTab === 'admin-dashboard' ? 'bg-slate-900 text-white' : 'text-slate-600'
            }`}
          >
            Admin Dashboard
          </button>
          <button
            onClick={() => setActiveTab('admin-rooms')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
              activeTab === 'admin-rooms' ? 'bg-slate-900 text-white' : 'text-slate-600'
            }`}
          >
            Room Rack
          </button>
          <button
            onClick={() => setActiveTab('admin-bookings')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
              activeTab === 'admin-bookings' ? 'bg-slate-900 text-white' : 'text-slate-600'
            }`}
          >
            Bookings
          </button>
          <button
            onClick={() => setActiveTab('admin-housekeeping')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
              activeTab === 'admin-housekeeping' ? 'bg-slate-900 text-white' : 'text-slate-600'
            }`}
          >
            Housekeeping
          </button>
          <button
            onClick={() => setActiveTab('submission-hub')}
            className={`px-3 py-1.5 rounded-md whitespace-nowrap font-semibold ${
              activeTab === 'submission-hub' ? 'bg-blue-600 text-white' : 'text-blue-700 bg-blue-50'
            }`}
          >
            Demo Video & Link
          </button>
        </div>
      </div>
    </header>
  );
};
