import React, { useState } from 'react';
import { X, CreditCard, DollarSign, Wallet, ArrowRight, Smartphone, Landmark, Banknote } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../context/DataContext';
import { Booking, Transaction } from '../types';
import { SIMULATION_DATE_OBJ } from '../constants';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
}

export default function PaymentModal({ isOpen, onClose, booking }: PaymentModalProps) {
  const { addTransaction, updateBooking } = useData();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'Credit Card' | 'Cash' | 'Bank Transfer' | 'UPI'>('Credit Card');

  if (!booking) return null;

  const remaining = booking.totalAmount - booking.paidAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payAmount = parseFloat(amount);
    
    if (isNaN(payAmount) || payAmount <= 0) return;

    const newTransaction: Transaction = {
      id: `TRX-${Math.floor(1000 + Math.random() * 9000)}`,
      bookingId: booking.id,
      guestName: booking.guestName,
      amount: payAmount,
      date: SIMULATION_DATE_OBJ.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      method: method,
      status: 'Paid',
    };

    addTransaction(newTransaction);
    
    const updatedBooking: Booking = {
      ...booking,
      paidAmount: booking.paidAmount + payAmount,
      status: booking.status // Keep same status
    };
    
    updateBooking(updatedBooking);
    onClose();
    setAmount('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50 shrink-0">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Process Payment</h2>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Ref: {booking.id}</p>
              </div>
              <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto">
              <div className="bg-blue-50 rounded-xl p-4 flex items-center justify-between border border-blue-100">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Remaining Balance</p>
                  <p className="text-2xl font-bold text-blue-700">₹{remaining.toLocaleString()}</p>
                </div>
                <Wallet size={32} className="text-blue-200" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Payment Amount (₹)</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</div>
                    <input
                      required
                      type="number"
                      step="0.01"
                      max={remaining}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-lg font-bold text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                      placeholder="0.00"
                    />
                    <button 
                      type="button" 
                      onClick={() => setAmount(remaining.toString())}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-blue-600 uppercase hover:underline"
                    >
                      Pay All
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Method</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['Credit Card', 'UPI', 'Cash', 'Bank Transfer'] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMethod(m)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                          method === m 
                            ? 'bg-slate-900 border-slate-900 text-white shadow-md' 
                            : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                        }`}
                      >
                        {m === 'Credit Card' ? <CreditCard size={18} className={method === m ? 'text-blue-400' : 'text-slate-300'} /> :
                         m === 'UPI' ? <Smartphone size={18} className={method === m ? 'text-blue-400' : 'text-slate-300'} /> :
                         m === 'Cash' ? <Banknote size={18} className={method === m ? 'text-blue-400' : 'text-slate-300'} /> :
                         <Landmark size={18} className={method === m ? 'text-blue-400' : 'text-slate-300'} />}
                        <span className="text-[8px] font-bold uppercase mt-1 text-center leading-tight">{m}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!amount || parseFloat(amount) <= 0}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all active:scale-[0.98] shadow-lg shadow-blue-500/20 mt-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                >
                  Pay Now <ArrowRight size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
