export type RoomType = 'Standard Deluxe' | 'Ocean View Suite' | 'Executive Penthouse' | 'Presidential Villa' | 'Family Garden Suite';

export type RoomStatus = 'Available' | 'Occupied' | 'Cleaning' | 'Maintenance';

export interface Amenity {
  id: string;
  name: string;
  icon: string;
}

export interface Room {
  id: string;
  roomNumber: string;
  title: string;
  type: RoomType;
  pricePerNight: number;
  originalPrice?: number;
  capacity: {
    adults: number;
    children: number;
  };
  bedType: string;
  floor: number;
  sizeSqFt: number;
  description: string;
  images: string[];
  amenities: string[];
  status: RoomStatus;
  currentGuest?: {
    name: string;
    checkIn: string;
    checkOut: string;
  };
  rating: number;
  reviewCount: number;
  features: string[];
}

export interface BookingAddon {
  id: string;
  name: string;
  price: number;
  description: string;
  selected?: boolean;
}

export interface GuestDetails {
  fullName: string;
  email: string;
  phone: string;
  specialRequests?: string;
  idProofNumber?: string;
  city?: string;
}

export type PaymentMethod = 'Credit Card' | 'Debit Card' | 'PayPal' | 'UPI / NetBanking' | 'Pay at Hotel';
export type PaymentStatus = 'Paid' | 'Pending' | 'Refunded';
export type BookingStatus = 'Confirmed' | 'Checked-In' | 'Checked-Out' | 'Cancelled';

export interface Booking {
  id: string; // e.g. HP-89412
  roomId: string;
  roomNumber: string;
  roomTitle: string;
  roomType: RoomType;
  roomImage: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  guests: {
    adults: number;
    children: number;
  };
  guestDetails: GuestDetails;
  addons: BookingAddon[];
  priceBreakdown: {
    baseRoomTotal: number;
    addonsTotal: number;
    taxAndFees: number;
    discountTotal: number;
    grandTotal: number;
  };
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  bookedAt: string;
  roomServiceOrders?: {
    id: string;
    item: string;
    requestedAt: string;
    status: 'Pending' | 'Delivered';
  }[];
}

export interface HousekeepingTask {
  id: string;
  roomId: string;
  roomNumber: string;
  roomType: string;
  stage: 'Dirty' | 'In Progress' | 'Cleaned' | 'Inspected';
  assignedStaff: string;
  priority: 'Urgent' | 'High' | 'Normal';
  notes: string;
  updatedAt: string;
}

export interface GuestRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  vipTier: 'Silver' | 'Gold' | 'Platinum';
  totalStays: number;
  totalSpent: number;
  lastStay: string;
  notes: string;
}

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'INR';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rate: number; // vs USD
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'booking' | 'checkin' | 'maintenance' | 'system';
}
