import React, { useState } from 'react';
import { Download, Plus, Search, Calendar, ChevronDown, Filter, MoreVertical, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { useData } from '../context/DataContext';
import BookingModal from '../components/BookingModal';

export default function BookingsList() {
  const { bookings, rooms } = useData();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['Confirmed', 'Pending', 'Checked-in', 'Checked-out']);

  const getRoomInfo = (roomId: string) => rooms.find(r => r.id === roomId);

  const toggleStatus = (status: string) => {
    setSelectedStatuses(prev => 
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.guestName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatuses.includes(b.status);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Bookings Management</h1>
          <p className="text-slate-500 text-sm mt-1">Monitor guest reservations and historical records.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm bg-white">
            Export
          </button>
          <button 
            onClick={() => setIsBookingModalOpen(true)}
            className="flex-1 sm:flex-none bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-sm"
          >
            + New
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center gap-6">
        <div className="grid grid-cols-2 lg:flex gap-6 items-center flex-1">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Date Range</label>
            <div className="flex items-center gap-2 text-[11px] lg:text-xs font-semibold text-slate-700 cursor-pointer">
              <Calendar size={14} className="text-slate-400 shrink-0" />
              <span className="truncate">Oct 12 - 20, 2023</span>
              <ChevronDown size={14} className="text-slate-400 shrink-0" />
            </div>
          </div>

          <div className="hidden lg:block h-8 w-px bg-slate-100"></div>

          <div className="flex flex-col gap-1 col-span-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Status</label>
            <div className="flex items-center gap-3">
              <StatusCheckbox 
                label="Conf." 
                checked={selectedStatuses.includes('Confirmed')} 
                onClick={() => toggleStatus('Confirmed')}
              />
              <StatusCheckbox 
                label="Pend." 
                checked={selectedStatuses.includes('Pending')} 
                onClick={() => toggleStatus('Pending')}
              />
              <StatusCheckbox 
                label="In" 
                checked={selectedStatuses.includes('Checked-in')} 
                onClick={() => toggleStatus('Checked-in')}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
          <div className="relative flex-1 md:w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text" 
              placeholder="Search guests..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 pl-9 pr-4 text-xs focus:ring-1 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <button className="p-2 text-slate-400 hover:text-slate-600 shrink-0">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto overflow-y-hidden">
          <table className="w-full text-left text-sm min-w-[650px] border-collapse translate-z-0">
            <thead className="bg-[#f8fafc] border-b border-slate-100 text-slate-400 uppercase text-[10px] font-bold">
              <tr>
                <th className="px-6 py-3 whitespace-nowrap">Guest Details</th>
                <th className="px-4 py-3 whitespace-nowrap">Room</th>
                <th className="px-4 py-3 whitespace-nowrap">Dates</th>
                <th className="px-4 py-3 text-center whitespace-nowrap">Status</th>
                <th className="px-4 py-3 text-right whitespace-nowrap">Total</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[...filteredBookings].reverse().map((b, i) => {
                const room = getRoomInfo(b.roomId);
                
                return (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-[10px] shrink-0">
                          {b.guestName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 leading-tight truncate">{b.guestName}</p>
                          <p className="text-[10px] text-slate-400 font-medium">#{b.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col text-xs">
                        <span className="font-bold text-slate-800">{room?.number || '---'}</span>
                        <span className="text-[10px] text-slate-400 uppercase">{room?.type || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-xs">
                        <p className="font-semibold text-slate-700 whitespace-nowrap">{b.checkIn} - {b.checkOut}</p>
                        <p className="text-[10px] text-slate-400">{b.nights} Nights</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight ${
                        b.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' :
                        b.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                        b.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <p className="font-bold text-slate-900">${b.totalAmount.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-slate-600">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium">
          <p className="text-slate-400">Total: {bookings.length} reservations</p>
          <div className="flex items-center gap-1">
            <button className="p-1 px-2 text-slate-400 hover:text-blue-900 transition-colors disabled:opacity-30" disabled>
              Prev
            </button>
            <div className="flex items-center gap-1 mx-2">
              <button className="w-7 h-7 lg:w-8 lg:h-8 rounded text-[10px] lg:text-xs font-bold transition-all bg-slate-900 text-white shadow-sm">1</button>
            </div>
            <button className="p-1 px-2 text-slate-400 hover:text-blue-900 transition-colors" disabled>
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <InsightCard label="Active Bookings" value={bookings.filter(b => b.status === 'Confirmed' || b.status === 'Checked-in').length.toString()} icon={TrendingUp} variant="primary" />
        <InsightCard label="New Today" value="4" sub="+12% (24h)" variant="white" />
        <InsightCard label="Avg Stay" value="3.4" sub="Nights per guest" variant="white" />
        <InsightCard label="Cancelled" value={bookings.filter(b => b.status === 'Cancelled').length.toString()} sub="Last 30 days" variant="white" />
      </div>

      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
      />
    </div>
  );
}

function StatusCheckbox({ label, checked, onClick }: { label: string; checked?: boolean; onClick?: () => void }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer group" onClick={onClick}>
      <div className={`w-3.5 h-3.5 rounded border transition-all flex items-center justify-center ${
        checked ? 'bg-blue-600 border-blue-600' : 'border-slate-300 group-hover:border-blue-400'
      }`}>
        {checked && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
      </div>
      <span className="text-[11px] font-medium text-slate-600 group-hover:text-blue-600 transition-colors uppercase">{label}</span>
    </label>
  );
}

function InsightCard({ label, value, sub, variant }: any) {
  if (variant === 'primary') {
    return (
      <div className="bg-slate-900 p-6 rounded-lg text-white shadow-md border-0">
        <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wider mb-2">{label}</p>
        <h4 className="text-2xl font-bold leading-none">{value}</h4>
        <p className="text-[10px] text-slate-400 font-medium mt-2">{sub}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col">
      <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2">{label}</p>
      <h4 className="text-2xl font-bold text-slate-800 leading-none">{value}</h4>
      <p className={`text-[10px] font-bold mt-2 ${sub?.includes('+') ? 'text-emerald-600' : 'text-slate-400'}`}>{sub}</p>
    </div>
  );
}
