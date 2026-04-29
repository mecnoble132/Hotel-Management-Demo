import { Room, Booking, Transaction } from './types';

export const rooms: Room[] = [
  { id: '1', number: '101', type: 'Deluxe', status: 'Occupied', floor: 1 },
  { id: '2', number: '102', type: 'Standard', status: 'Maintenance', floor: 1 },
  { id: '3', number: '103', type: 'Suite', status: 'Occupied', floor: 1 },
  { id: '4', number: '104', type: 'Deluxe', status: 'Cleaning', floor: 1 },
  { id: '5', number: '108', type: 'Standard', status: 'Available', floor: 1 },
  { id: '6', number: '112', type: 'Standard', status: 'Available', floor: 1 },
  { id: '7', number: '201', type: 'Penthouse', status: 'Occupied', floor: 2 },
  { id: '8', number: '215', type: 'Suite', status: 'Occupied', floor: 2 },
  { id: '9', number: '304', type: 'Standard', status: 'Cleaning', floor: 3 },
  { id: '10', number: '312', type: 'Deluxe', status: 'Checked-out' as any, floor: 3 }, // Special status for demo
  { id: '11', number: '402', type: 'Deluxe', status: 'Available', floor: 4 },
  { id: '12', number: '504', type: 'Penthouse', status: 'Available', floor: 5 },
];

const today = new Date();
const formatDate = (offset: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offset);
  return d.toISOString().split('T')[0];
};

const formatDisplayDate = (offset: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const bookings: Booking[] = [
  {
    id: 'BK-99021',
    guestName: 'Hari Krishnan',
    guestEmail: 'hari.krishnan@example.in',
    roomId: '11',
    checkIn: formatDate(0), // Today
    checkOut: formatDate(4),
    status: 'Confirmed',
    totalAmount: 15500,
    paidAmount: 15500,
    nights: 4,
  },
  {
    id: 'BK-99025',
    guestName: 'Gopi Nath',
    guestEmail: 'gopi.nath@example.in',
    roomId: '5',
    checkIn: formatDate(-1), // Yesterday
    checkOut: formatDate(0),
    status: 'Pending',
    totalAmount: 4500,
    paidAmount: 2000,
    nights: 1,
  },
  {
    id: 'BK-98991',
    guestName: 'Ravi Shankar',
    guestEmail: 'ravi.shankar@example.in',
    roomId: '7',
    checkIn: formatDate(-4),
    checkOut: formatDate(1),
    status: 'Cancelled',
    totalAmount: 48000,
    paidAmount: 0,
    nights: 5,
  },
  {
    id: 'BK-99042',
    guestName: 'Siva Kumar',
    guestEmail: 'siva.kumar@example.in',
    roomId: '6',
    checkIn: formatDate(-9),
    checkOut: formatDate(-7),
    status: 'Confirmed',
    totalAmount: 8500,
    paidAmount: 8500,
    nights: 2,
  },
  {
    id: 'BK-99001',
    guestName: 'Madhu Sudhan',
    guestEmail: 'madhu.s@example.in',
    roomId: '11',
    checkIn: formatDate(-5),
    checkOut: formatDate(-1),
    status: 'Confirmed',
    totalAmount: 18400,
    paidAmount: 18400,
    nights: 4,
  },
  {
    id: 'BK-98115',
    guestName: 'Advaith Nair',
    guestEmail: 'advaith.nair@example.in',
    roomId: '8',
    checkIn: formatDate(-2),
    checkOut: formatDate(0),
    status: 'Checked-in',
    totalAmount: 12500,
    paidAmount: 12500,
    nights: 2,
  },
  {
    id: 'BK-98116',
    guestName: 'Arjun Menon',
    guestEmail: 'arjun.menon@example.in',
    roomId: '1',
    checkIn: formatDate(0),
    checkOut: formatDate(1),
    status: 'Confirmed',
    totalAmount: 6000,
    paidAmount: 6000,
    nights: 1,
  },
  {
    id: 'BK-98117',
    guestName: 'Nivin Thomas',
    guestEmail: 'nivin.t@example.in',
    roomId: '3',
    checkIn: formatDate(-3),
    checkOut: formatDate(1),
    status: 'Confirmed',
    totalAmount: 18000,
    paidAmount: 9000,
    nights: 4,
  },
  {
    id: 'BK-98118',
    guestName: 'Rahul Raj',
    guestEmail: 'rahul.r@example.in',
    roomId: '12',
    checkIn: formatDate(-1),
    checkOut: formatDate(3),
    status: 'Confirmed',
    totalAmount: 32000,
    paidAmount: 0,
    nights: 4,
  },
];

export const transactions: Transaction[] = [
  {
    id: 'TRX-9405',
    bookingId: 'BK-98117',
    guestName: 'Nivin Thomas',
    amount: 9000,
    date: formatDisplayDate(0),
    method: 'UPI',
    status: 'Paid',
  },
  {
    id: 'TRX-9402',
    bookingId: 'BK-99001',
    guestName: 'Madhu Sudhan',
    amount: 18400,
    date: formatDisplayDate(-1),
    method: 'Credit Card',
    status: 'Paid',
  },
  {
    id: 'TRX-9406',
    bookingId: 'BK-99021',
    guestName: 'Hari Krishnan',
    amount: 15500,
    date: formatDisplayDate(0),
    method: 'UPI',
    status: 'Paid',
  },
  {
    id: 'TRX-9398',
    bookingId: 'BK-99025',
    guestName: 'Gopi Nath',
    amount: 4500,
    date: formatDisplayDate(-1),
    method: 'UPI',
    status: 'Pending',
  },
  {
    id: 'TRX-9385',
    bookingId: 'BK-99042',
    guestName: 'Siva Kumar',
    amount: 8500,
    date: formatDisplayDate(-9),
    method: 'Credit Card',
    status: 'Paid',
  },
  {
    id: 'TRX-9372',
    bookingId: 'BK-98115',
    guestName: 'Advaith Nair',
    amount: 2500,
    date: formatDisplayDate(-2),
    method: 'Cash',
    status: 'Paid',
  },
];
