import { Room, Booking, Transaction } from '../types';
import { rooms as initialRooms, bookings as initialBookings, transactions as initialTransactions } from '../mockData';

const KEYS = {
  ROOMS: 'grandstay_rooms_v4',
  BOOKINGS: 'grandstay_bookings_v4',
  TRANSACTIONS: 'grandstay_transactions_v4',
};

export const storageService = {
  init: () => {
    if (!localStorage.getItem(KEYS.ROOMS)) {
      localStorage.setItem(KEYS.ROOMS, JSON.stringify(initialRooms));
    }
    if (!localStorage.getItem(KEYS.BOOKINGS)) {
      localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(initialBookings));
    }
    if (!localStorage.getItem(KEYS.TRANSACTIONS)) {
      localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(initialTransactions));
    }
  },

  getRooms: (): Room[] => {
    const data = localStorage.getItem(KEYS.ROOMS);
    return data ? JSON.parse(data) : [];
  },

  updateRoom: (updatedRoom: Room) => {
    const rooms = storageService.getRooms();
    const newRooms = rooms.map(r => r.id === updatedRoom.id ? updatedRoom : r);
    localStorage.setItem(KEYS.ROOMS, JSON.stringify(newRooms));
    window.dispatchEvent(new Event('storage-update'));
  },

  getBookings: (): Booking[] => {
    const data = localStorage.getItem(KEYS.BOOKINGS);
    return data ? JSON.parse(data) : [];
  },

  saveBooking: (booking: Booking) => {
    const bookings = storageService.getBookings();
    const index = bookings.findIndex(b => b.id === booking.id);
    let newBookings;
    if (index > -1) {
      newBookings = bookings.map(b => b.id === booking.id ? booking : b);
    } else {
      newBookings = [...bookings, booking];
    }
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(newBookings));
    window.dispatchEvent(new Event('storage-update'));
  },

  getTransactions: (): Transaction[] => {
    const data = localStorage.getItem(KEYS.TRANSACTIONS);
    return data ? JSON.parse(data) : [];
  },

  saveTransaction: (transaction: Transaction) => {
    const transactions = storageService.getTransactions();
    localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify([...transactions, transaction]));
    window.dispatchEvent(new Event('storage-update'));
  }
};
