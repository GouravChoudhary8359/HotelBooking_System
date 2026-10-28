import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Room,
  Booking,
  HousekeepingTask,
  GuestRecord,
  CurrencyCode,
  NotificationItem,
  RoomStatus,
} from '../types/hotel';
import {
  INITIAL_ROOMS,
  INITIAL_BOOKINGS,
  INITIAL_HOUSEKEEPING,
  INITIAL_GUESTS,
  CURRENCIES,
} from '../data/mockHotelData';

export type AppNavTab =
  | 'guest-rooms'
  | 'guest-my-bookings'
  | 'admin-dashboard'
  | 'admin-rooms'
  | 'admin-bookings'
  | 'admin-housekeeping'
  | 'admin-crm'
  | 'admin-reports'
  | 'submission-hub';

interface HotelContextType {
  rooms: Room[];
  bookings: Booking[];
  housekeeping: HousekeepingTask[];
  guests: GuestRecord[];
  activeCurrency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (amountInUSD: number) => string;
  activeTab: AppNavTab;
  setActiveTab: (tab: AppNavTab) => void;
  selectedRoomForDetails: Room | null;
  setSelectedRoomForDetails: (room: Room | null) => void;
  selectedRoomForBooking: Room | null;
  setSelectedRoomForBooking: (room: Room | null) => void;
  activeVoucher: Booking | null;
  setActiveVoucher: (booking: Booking | null) => void;
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  // Core Domain Operations
  createBooking: (newBooking: Omit<Booking, 'id' | 'bookedAt' | 'bookingStatus'>) => Booking;
  checkInBooking: (bookingId: string) => void;
  checkOutBooking: (bookingId: string) => void;
  cancelBooking: (bookingId: string) => void;
  updateRoomStatus: (roomId: string, status: RoomStatus) => void;
  addNewRoom: (room: Omit<Room, 'id' | 'rating' | 'reviewCount'>) => void;
  updateHousekeepingTask: (taskId: string, stage: HousekeepingTask['stage'], assignedStaff?: string) => void;
  addRoomServiceItem: (bookingId: string, item: string) => void;
  resetAllData: () => void;
  isDemoTourActive: boolean;
  setIsDemoTourActive: (active: boolean) => void;
}

const HotelContext = createContext<HotelContextType | undefined>(undefined);

export const HotelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem('hotelpro_rooms');
    return saved ? JSON.parse(saved) : INITIAL_ROOMS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('hotelpro_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [housekeeping, setHousekeeping] = useState<HousekeepingTask[]>(() => {
    const saved = localStorage.getItem('hotelpro_housekeeping');
    return saved ? JSON.parse(saved) : INITIAL_HOUSEKEEPING;
  });

  const [guests, setGuests] = useState<GuestRecord[]>(() => {
    const saved = localStorage.getItem('hotelpro_guests');
    return saved ? JSON.parse(saved) : INITIAL_GUESTS;
  });

  const [activeCurrency, setActiveCurrency] = useState<CurrencyCode>('USD');
  const [activeTab, setActiveTab] = useState<AppNavTab>('guest-rooms');
  const [selectedRoomForDetails, setSelectedRoomForDetails] = useState<Room | null>(null);
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState<Room | null>(null);
  const [activeVoucher, setActiveVoucher] = useState<Booking | null>(null);
  const [isDemoTourActive, setIsDemoTourActive] = useState<boolean>(false);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'New Reservation Received',
      message: 'HP-89428 confirmed for Room 305 (Rohan Sharma)',
      time: '12m ago',
      read: false,
      type: 'booking',
    },
    {
      id: 'notif-2',
      title: 'VIP Arrival Alert',
      message: 'Sophia Laurent checked into Royal Horizon Villa (401)',
      time: '1h ago',
      read: false,
      type: 'checkin',
    },
    {
      id: 'notif-3',
      title: 'Housekeeping Priority',
      message: 'Room 102 marked Dirty - Family arrival scheduled at 3 PM',
      time: '2h ago',
      read: true,
      type: 'maintenance',
    },
  ]);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('hotelpro_rooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('hotelpro_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('hotelpro_housekeeping', JSON.stringify(housekeeping));
  }, [housekeeping]);

  useEffect(() => {
    localStorage.setItem('hotelpro_guests', JSON.stringify(guests));
  }, [guests]);

  const formatPrice = (amountInUSD: number): string => {
    const config = CURRENCIES[activeCurrency] || CURRENCIES.USD;
    const converted = amountInUSD * config.rate;
    if (activeCurrency === 'INR') {
      return `${config.symbol} ${Math.round(converted).toLocaleString('en-IN')}`;
    }
    return `${config.symbol}${Math.round(converted).toLocaleString('en-US')}`;
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const createBooking = (newBookingData: Omit<Booking, 'id' | 'bookedAt' | 'bookingStatus'>): Booking => {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const newId = `HP-${randomSuffix}`;
    const fullBooking: Booking = {
      ...newBookingData,
      id: newId,
      bookedAt: new Date().toISOString(),
      bookingStatus: 'Confirmed',
    };

    // Update bookings
    setBookings((prev) => [fullBooking, ...prev]);

    // Update room status
    setRooms((prev) =>
      prev.map((r) =>
        r.id === newBookingData.roomId
          ? {
              ...r,
              status: 'Occupied',
              currentGuest: {
                name: newBookingData.guestDetails.fullName,
                checkIn: newBookingData.checkInDate,
                checkOut: newBookingData.checkOutDate,
              },
            }
          : r
      )
    );

    // Update or add to Guests CRM
    setGuests((prev) => {
      const existing = prev.find(
        (g) => g.email.toLowerCase() === newBookingData.guestDetails.email.toLowerCase()
      );
      if (existing) {
        return prev.map((g) =>
          g.id === existing.id
            ? {
                ...g,
                totalStays: g.totalStays + 1,
                totalSpent: g.totalSpent + newBookingData.priceBreakdown.grandTotal,
                lastStay: 'Just booked (Upcoming)',
              }
            : g
        );
      } else {
        const newGuest: GuestRecord = {
          id: `gst-${Date.now()}`,
          name: newBookingData.guestDetails.fullName,
          email: newBookingData.guestDetails.email,
          phone: newBookingData.guestDetails.phone,
          vipTier: 'Silver',
          totalStays: 1,
          totalSpent: newBookingData.priceBreakdown.grandTotal,
          lastStay: 'Just booked',
          notes: newBookingData.guestDetails.specialRequests || 'First time guest',
        };
        return [newGuest, ...prev];
      }
    });

    // Add alert notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'New Guest Booking Confirmed',
        message: `${newId} - Room ${newBookingData.roomNumber} booked by ${newBookingData.guestDetails.fullName}`,
        time: 'Just now',
        read: false,
        type: 'booking',
      },
      ...prev,
    ]);

    setActiveVoucher(fullBooking);
    return fullBooking;
  };

  const checkInBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, bookingStatus: 'Checked-In' } : b))
    );
    const target = bookings.find((b) => b.id === bookingId);
    if (target) {
      setRooms((prev) =>
        prev.map((r) =>
          r.id === target.roomId
            ? {
                ...r,
                status: 'Occupied',
                currentGuest: {
                  name: target.guestDetails.fullName,
                  checkIn: target.checkInDate,
                  checkOut: target.checkOutDate,
                },
              }
            : r
        )
      );
    }
  };

  const checkOutBooking = (bookingId: string) => {
    const target = bookings.find((b) => b.id === bookingId);
    if (!target) return;

    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, bookingStatus: 'Checked-Out' } : b))
    );

    // Room becomes Cleaning
    setRooms((prev) =>
      prev.map((r) =>
        r.id === target.roomId
          ? { ...r, status: 'Cleaning', currentGuest: undefined }
          : r
      )
    );

    // Create Housekeeping Task
    const newTask: HousekeepingTask = {
      id: `hk-${Date.now()}`,
      roomId: target.roomId,
      roomNumber: target.roomNumber,
      roomType: target.roomType,
      stage: 'Dirty',
      assignedStaff: 'Unassigned',
      priority: 'High',
      notes: `Guest ${target.guestDetails.fullName} checked out. Full departure cleaning required.`,
      updatedAt: 'Just now',
    };
    setHousekeeping((prev) => [newTask, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Guest Checked Out',
        message: `${target.guestDetails.fullName} checked out of Room ${target.roomNumber}. Cleaning task created.`,
        time: 'Just now',
        read: false,
        type: 'checkin',
      },
      ...prev,
    ]);
  };

  const cancelBooking = (bookingId: string) => {
    const target = bookings.find((b) => b.id === bookingId);
    if (!target) return;

    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? { ...b, bookingStatus: 'Cancelled', paymentStatus: 'Refunded' }
          : b
      )
    );

    setRooms((prev) =>
      prev.map((r) =>
        r.id === target.roomId
          ? { ...r, status: 'Available', currentGuest: undefined }
          : r
      )
    );

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Reservation Cancelled',
        message: `Booking ${target.id} (Room ${target.roomNumber}) cancelled and marked refunded.`,
        time: 'Just now',
        read: false,
        type: 'booking',
      },
      ...prev,
    ]);
  };

  const updateRoomStatus = (roomId: string, status: RoomStatus) => {
    setRooms((prev) =>
      prev.map((r) =>
        r.id === roomId
          ? {
              ...r,
              status,
              currentGuest: status === 'Available' ? undefined : r.currentGuest,
            }
          : r
      )
    );
  };

  const addNewRoom = (roomData: Omit<Room, 'id' | 'rating' | 'reviewCount'>) => {
    const newRoom: Room = {
      ...roomData,
      id: `room-${Date.now()}`,
      rating: 5.0,
      reviewCount: 1,
    };
    setRooms((prev) => [newRoom, ...prev]);
  };

  const updateHousekeepingTask = (
    taskId: string,
    stage: HousekeepingTask['stage'],
    assignedStaff?: string
  ) => {
    setHousekeeping((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const updated = {
            ...task,
            stage,
            assignedStaff: assignedStaff !== undefined ? assignedStaff : task.assignedStaff,
            updatedAt: 'Just now',
          };
          // If task reached Inspected or Cleaned, update corresponding room to Available
          if (stage === 'Inspected') {
            updateRoomStatus(task.roomId, 'Available');
          } else if (stage === 'Cleaned') {
            // Keep in cleaning / ready for inspection
          }
          return updated;
        }
        return task;
      })
    );
  };

  const addRoomServiceItem = (bookingId: string, item: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          const currentOrders = b.roomServiceOrders || [];
          return {
            ...b,
            roomServiceOrders: [
              ...currentOrders,
              {
                id: `rs-${Date.now()}`,
                item,
                requestedAt: 'Just now',
                status: 'Pending',
              },
            ],
          };
        }
        return b;
      })
    );
  };

  const resetAllData = () => {
    setRooms(INITIAL_ROOMS);
    setBookings(INITIAL_BOOKINGS);
    setHousekeeping(INITIAL_HOUSEKEEPING);
    setGuests(INITIAL_GUESTS);
    localStorage.removeItem('hotelpro_rooms');
    localStorage.removeItem('hotelpro_bookings');
    localStorage.removeItem('hotelpro_housekeeping');
    localStorage.removeItem('hotelpro_guests');
  };

  return (
    <HotelContext.Provider
      value={{
        rooms,
        bookings,
        housekeeping,
        guests,
        activeCurrency,
        setCurrency: setActiveCurrency,
        formatPrice,
        activeTab,
        setActiveTab,
        selectedRoomForDetails,
        setSelectedRoomForDetails,
        selectedRoomForBooking,
        setSelectedRoomForBooking,
        activeVoucher,
        setActiveVoucher,
        notifications,
        markNotificationAsRead,
        clearNotifications,
        createBooking,
        checkInBooking,
        checkOutBooking,
        cancelBooking,
        updateRoomStatus,
        addNewRoom,
        updateHousekeepingTask,
        addRoomServiceItem,
        resetAllData,
        isDemoTourActive,
        setIsDemoTourActive,
      }}
    >
      {children}
    </HotelContext.Provider>
  );
};

export const useHotel = () => {
  const context = useContext(HotelContext);
  if (!context) {
    throw new Error('useHotel must be used within a HotelProvider');
  }
  return context;
};
