import React, { useState } from 'react';
import { Bed, DoorOpen, HardHat, TrendingUp, MoreVertical, CheckCircle, MessageSquare, Plus } from 'lucide-react';
import { useData } from '../context/DataContext';
import BookingModal from '../components/BookingModal';

export default function Dashboard() {
  const { rooms, bookings, transactions } = useData();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const pendingPayments = bookings.filter(b => b.paidAmount < b.totalAmount && b.status !== 'Cancelled');
  const checkinsToday = bookings.filter(b => {
    const today = new Date('2023-10-23'); // Demo date
    const checkin = new Date(b.checkIn);
    return checkin.toDateString() === today.toDateString() && b.status === 'Confirmed';
  }).length;

  const totalOccupied = rooms.filter(r => r.status === 'Occupied').length;
  const occupancyRate = ((totalOccupied / rooms.length) * 100).toFixed(1);

  // Calculate 24h revenue from transactions
  const dailyRevenue = transactions
    .filter(t => t.date === 'Oct 23, 2023') // Demo date
    .reduce((sum, t) => sum + t.amount, 0);
  
  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Operations Overview</h1>
          <p className="text-slate-500 text-sm mt-1 italic sm:not-italic">Monday, October 23, 2023 • 08:45 AM</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm">
            Reports
          </button>
          <button 
            onClick={() => setIsBookingModalOpen(true)}
            className="flex-1 sm:flex-none bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-sm whitespace-nowrap"
          >
            + New Booking
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Core Metrics */}
        <div className="col-span-12 lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <MetricCard 
            label="Occupancy" 
            value={`${occupancyRate}%`} 
            sub="+2.4% vs yest." 
            icon={Bed} 
            iconBg="bg-blue-50" 
            iconColor="text-blue-600"
            trend={true}
          />
          <MetricCard 
            label="Check-ins" 
            value={checkinsToday.toString()} 
            sub="Expected Today" 
            icon={DoorOpen} 
            iconBg="bg-slate-50" 
            iconColor="text-slate-600" 
          />
          <MetricCard 
            label="Revenue (24h)" 
            value={`$${dailyRevenue.toLocaleString()}`} 
            sub="Trending Up" 
            icon={TrendingUp} 
            iconBg="bg-emerald-50" 
            iconColor="text-emerald-600"
          />
        </div>

        {/* Revenue Summary */}
        <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-sm font-bold uppercase tracking-wide text-slate-700">Daily Revenue</h4>
            <button className="text-slate-400 hover:text-slate-600">
              <MoreVertical size={16} />
            </button>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <h3 className="text-3xl font-bold text-slate-800">${dailyRevenue.toLocaleString()}</h3>
            <div className="h-24 w-full flex items-end gap-1 mt-6">
              {[40, 65, 55, 85, 45, 100, 30].map((h, i) => (
                <div 
                  key={i} 
                  className={`flex-1 rounded-t transition-all duration-500 ${i === 5 ? 'bg-blue-500' : 'bg-slate-100'}`}
                  style={{ height: `${h}%` }}
                ></div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2">
              <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
            </div>
          </div>
        </div>

        {/* Pending Payments */}
        <div className="col-span-12 lg:col-span-12 xl:col-span-7 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700">Pending Payments</h3>
            <button className="text-xs text-blue-600 font-bold hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto overflow-y-hidden">
            <table className="w-full text-left text-xs sm:text-sm min-w-[500px] border-collapse translate-z-0">
              <thead className="bg-white border-b border-slate-100 text-slate-400 uppercase text-[10px] font-bold">
                <tr>
                  <th className="px-6 py-3">Guest</th>
                  <th className="px-4 py-3">Room</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {pendingPayments.slice(0, 4).map((p, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{p.guestName}</td>
                    <td className="px-4 py-4 text-slate-500 font-mono text-[10px]">#{rooms.find(r => r.id === p.roomId)?.number}</td>
                    <td className="px-4 py-4 font-bold text-slate-900">${p.totalAmount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full uppercase tracking-tight ${
                        p.paidAmount === 0 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {p.paidAmount === 0 ? 'Overdue' : 'Partial'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Housekeeping */}
        <div className="col-span-12 lg:col-span-12 xl:col-span-5 bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col min-h-0">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700">Housekeeping Snapshot</h3>
            <span className="text-[10px] text-slate-400 font-medium hidden xs:inline">Updated 5m ago</span>
          </div>
          <div className="grid grid-cols-2 xs:grid-cols-4 gap-3 mb-6">
            <StatusBox icon={CheckCircle} color="text-emerald-500" label="Clean" value={rooms.filter(r => r.status === 'Available').length.toString()} />
            <StatusBox icon={HardHat} color="text-amber-500" label="Dirty" value={rooms.filter(r => r.status === 'Cleaning').length.toString()} />
            <StatusBox icon={CheckCircle} color="text-blue-500" label="Occupied" value={rooms.filter(r => r.status === 'Occupied').length.toString()} />
            <StatusBox icon={HardHat} color="text-red-500" label="Maint." value={rooms.filter(r => r.status === 'Maintenance').length.toString()} />
          </div>
          <div className="mt-auto p-4 bg-slate-900 text-white rounded-lg border-0 shadow-md">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-[10px] font-bold uppercase text-slate-400">Shift Handover</h4>
              <MessageSquare size={14} className="text-slate-400" />
            </div>
            <p className="text-[11px] text-slate-300 font-medium leading-relaxed italic line-clamp-2">
              Room 304 AC reported noisy. Maintenance crew scheduled for 10 AM today. Please verify with guest after...
            </p>
          </div>
        </div>
      </div>

      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
      />

      {/* FAB */}
      <button 
        onClick={() => setIsBookingModalOpen(true)}
        className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 w-12 h-12 sm:w-14 sm:h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-50">
        <MessageSquare size={20} className="sm:hidden" />
        <Plus size={24} className="hidden sm:block" />
      </button>
    </div>
  );
}

function MetricCard({ label, value, sub, icon: Icon, iconBg, iconColor, trend }: any) {
  return (
    <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex flex-col gap-1">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-tight">{label}</p>
      <div className="flex items-end justify-between mt-2">
        <div className="flex items-center gap-3">
          <div className={`p-2 ${iconBg} ${iconColor} rounded-lg`}>
            <Icon size={20} />
          </div>
          <span className="text-2xl font-bold text-slate-800">{value}</span>
        </div>
        <span className={`text-xs font-medium mb-1 ${trend ? 'text-emerald-600' : 'text-slate-400'}`}>
          {sub}
        </span>
      </div>
    </div>
  );
}

function StatusBox({ icon: Icon, color, label, value }: any) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 p-2 border border-slate-100 rounded-md hover:bg-slate-50 transition-colors cursor-pointer aspect-square">
      <Icon className={color} size={18} />
      <span className="text-lg font-bold text-slate-800 leading-none mt-1">{value}</span>
      <span className="text-[9px] font-bold uppercase tracking-tight text-slate-400">{label}</span>
    </div>
  );
}
