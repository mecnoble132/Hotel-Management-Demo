import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Room, Booking, Transaction } from '../types';
import { storageService } from '../services/storageService';

interface DataContextType {
  rooms: Room[];
  bookings: Booking[];
  transactions: Transaction[];
  updateRoom: (room: Room) => void;
  addBooking: (booking: Booking) => void;
  updateBooking: (booking: Booking) => void;
  addTransaction: (transaction: Transaction) => void;
  refreshData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const refreshData = useCallback(() => {
    storageService.init();
    setRooms(storageService.getRooms());
    setBookings(storageService.getBookings());
    setTransactions(storageService.getTransactions());
  }, []);

  useEffect(() => {
    refreshData();
    window.addEventListener('storage-update', refreshData);
    return () => window.removeEventListener('storage-update', refreshData);
  }, [refreshData]);

  const updateRoom = (room: Room) => {
    storageService.updateRoom(room);
  };

  const addBooking = (booking: Booking) => {
    storageService.saveBooking(booking);
  };

  const updateBooking = (booking: Booking) => {
    storageService.saveBooking(booking);
  };

  const addTransaction = (transaction: Transaction) => {
    storageService.saveTransaction(transaction);
  };

  return (
    <DataContext.Provider value={{ 
      rooms, 
      bookings, 
      transactions, 
      updateRoom, 
      addBooking, 
      updateBooking, 
      addTransaction,
      refreshData
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
