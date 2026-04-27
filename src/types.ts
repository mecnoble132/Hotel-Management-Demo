export type RoomType = 'Standard' | 'Deluxe' | 'Suite' | 'Penthouse';
export type RoomStatus = 'Available' | 'Occupied' | 'Cleaning' | 'Maintenance';
export type BookingStatus = 'Confirmed' | 'Pending' | 'Checked-in' | 'Checked-out' | 'Cancelled';
export type PaymentStatus = 'Paid' | 'Partial' | 'Overdue' | 'Awaiting' | 'Refunded' | 'Pending';

export interface Room {
  id: string;
  number: string;
  type: RoomType;
  status: RoomStatus;
  floor: number;
}

export interface Booking {
  id: string;
  guestName: string;
  guestEmail: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  status: BookingStatus;
  totalAmount: number;
  paidAmount: number;
  notes?: string;
  nights: number;
}

export interface Transaction {
  id: string;
  bookingId: string;
  guestName: string;
  amount: number;
  date: string;
  method: 'Credit Card' | 'Cash' | 'Bank Transfer';
  status: PaymentStatus;
}
