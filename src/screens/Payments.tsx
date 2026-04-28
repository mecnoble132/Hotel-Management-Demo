import React, { useState } from 'react';
import { Download, Plus, Calendar, Filter, CreditCard, Banknote, Landmark, MoreVertical, ChevronLeft, ChevronRight, TrendingUp, Wallet, History, Smartphone } from 'lucide-react';
import { useData } from '../context/DataContext';
import PaymentModal from '../components/PaymentModal';

export default function Payments() {
  const { transactions, bookings } = useData();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedBookingForPayment, setSelectedBookingForPayment] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('All');

  const methods = ['All', 'Credit Card', 'UPI', 'Cash', 'Bank Transfer'];

  const openPaymentModal = (booking: any) => {
    setSelectedBookingForPayment(booking);
    setIsPaymentModalOpen(true);
  };

  const pendingBookings = bookings.filter(b => b.paidAmount < b.totalAmount && b.status !== 'Cancelled');
  const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.guestName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMethod = selectedMethod === 'All' || t.method === selectedMethod;
    return matchesSearch && matchesMethod;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Financial Records</h1>
          <p className="text-slate-500 text-sm mt-1">Monitor revenue, transactions and guest billing.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-all text-xs shadow-sm bg-white">
            <Download size={14} />
            <span className="truncate">Export</span>
          </button>
          <button 
            onClick={() => {
              if (pendingBookings.length > 0) {
                openPaymentModal(pendingBookings[0]);
              }
            }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all text-xs shadow-sm"
          >
            <Plus size={14} />
            <span className="truncate">Process Payment</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <FinanceCard 
          label="Total Revenue" 
          value={`₹${totalRevenue.toLocaleString()}`} 
          highlight="+12.5% ↑" 
          highlightColor="text-emerald-600 font-bold"
          icon={TrendingUp} 
          iconColor="text-emerald-500" 
        />
        <FinanceCard 
          label="Pending Billing" 
          value={`₹${bookings.reduce((sum, b) => sum + (b.totalAmount - b.paidAmount), 0).toLocaleString()}`} 
          highlight="Critical" 
          highlightColor="text-red-600 font-bold"
          icon={Wallet} 
          iconColor="text-blue-500" 
        />
        <FinanceCard 
          label="Daily Transactions" 
          value={transactions.filter(t => t.date === 'Oct 23, 2023').length.toString()} 
          highlight="Normal" 
          highlightColor="text-slate-500 font-bold"
          icon={History} 
          iconColor="text-slate-400" 
        />
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px] relative">
          <input 
            type="text" 
            placeholder="Search transactions or guests..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 pl-3 pr-4 text-xs focus:ring-1 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <select 
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="appearance-none bg-white px-3 py-1.5 pr-8 rounded-lg border border-slate-200 cursor-pointer text-xs font-semibold text-slate-700 focus:ring-1 focus:ring-blue-500 outline-none min-w-[120px]"
            >
              {methods.map(m => <option key={m} value={m}>{m === 'All' ? 'All Methods' : m}</option>)}
            </select>
            <ChevronLeft size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 rotate-[-90deg] text-slate-400 pointer-events-none" />
          </div>

          <button 
            onClick={() => { setSearchTerm(''); setSelectedMethod('All'); }}
            className="text-xs font-bold text-slate-400 hover:text-slate-600 px-3 py-1"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto overflow-y-hidden">
          {/* Desktop Table */}
          <table className="hidden sm:table w-full text-left text-sm min-w-[650px] border-collapse translate-z-0">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                <th className="px-6 py-3 whitespace-nowrap">Reference</th>
                <th className="px-4 py-3 whitespace-nowrap">Guest</th>
                <th className="px-4 py-3 text-right whitespace-nowrap">Amount</th>
                <th className="px-4 py-3 whitespace-nowrap">Method</th>
                <th className="px-4 py-3 whitespace-nowrap">Status</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[...filteredTransactions].reverse().map((t, i) => (
                <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-6 py-4 text-xs font-bold text-slate-500 font-mono tracking-tighter">#{t.id}</td>
                  <td className="px-4 py-4">
                    <p className="font-semibold text-slate-900 truncate">{t.guestName}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{t.date}</p>
                  </td>
                  <td className="px-4 py-4 text-right font-bold text-slate-800">₹{t.amount.toLocaleString()}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase">
                      {t.method === 'Credit Card' ? <CreditCard size={12} className="shrink-0" /> : t.method === 'Cash' ? <Banknote size={12} className="shrink-0" /> : t.method === 'UPI' ? <Smartphone size={12} className="shrink-0" /> : <Landmark size={12} className="shrink-0" />}
                      <span className="truncate">{t.method}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight ${
                      t.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' :
                      t.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-slate-600">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile Card List */}
          <div className="sm:hidden divide-y divide-slate-100">
            {[...filteredTransactions].reverse().map((t, i) => (
              <div key={i} className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 font-mono tracking-tighter">REF #{t.id}</p>
                    <h4 className="font-bold text-slate-900 text-sm leading-tight mt-0.5">{t.guestName}</h4>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-tight ${
                    t.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' :
                    t.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {t.status}
                  </span>
                </div>
                
                <div className="flex justify-between items-end border-t border-slate-50 pt-2">
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-400 font-medium">{t.date}</p>
                    <div className="flex items-center gap-1.5 text-slate-500 font-bold text-[9px] uppercase">
                      {t.method === 'Credit Card' ? <CreditCard size={10} /> : t.method === 'Cash' ? <Banknote size={10} /> : t.method === 'UPI' ? <Smartphone size={10} /> : <Landmark size={10} />}
                      {t.method}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 font-medium leading-none mb-1">Amount</p>
                    <p className="text-lg font-bold text-slate-900 leading-none">₹{t.amount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredTransactions.length === 0 && (
              <div className="p-12 text-center text-slate-400 text-sm italic">
                No transactions match your search.
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
          <p className="text-xs text-slate-400 font-medium">Showing {filteredTransactions.length} transactions</p>
          <div className="flex items-center gap-2">
             <button className="p-1.5 text-slate-300 hover:text-blue-900 transition-colors" disabled>
              <ChevronLeft size={18} />
            </button>
            <button className="w-8 h-8 rounded-lg text-xs font-bold bg-blue-900 text-white shadow-lg">1</button>
            <button className="p-1.5 text-slate-300 hover:text-blue-900 transition-colors" disabled>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)} 
        booking={selectedBookingForPayment}
      />
    </div>
  );
}

function FinanceCard({ label, value, highlight, highlightColor, icon: Icon, iconColor }: any) {
  return (
    <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
          <Icon size={18} className={iconColor} />
        </div>
        <span className={`text-[10px] uppercase tracking-tight ${highlightColor}`}>{highlight}</span>
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-slate-800 leading-none">{value}</h3>
      </div>
    </div>
  );
}

function FilterSelect({ icon: Icon, label }: any) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-all text-xs font-semibold text-slate-700">
      <Icon size={14} className="text-slate-400" />
      <span>{label}</span>
      <ChevronLeft size={14} className="rotate-[-90deg] text-slate-300 ml-1" />
    </div>
  );
}
