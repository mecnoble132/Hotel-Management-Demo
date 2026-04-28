import React, { useState } from 'react';
import { QrCode, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function CheckInOut() {
  const { bookings, rooms, updateBooking, updateRoom } = useData();
  const [view, setView] = useState<'arrivals' | 'departures'>('arrivals');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoomType, setSelectedRoomType] = useState('All');

  const roomTypes = ['All', ...new Set(rooms.map(r => r.type))];

  const arrivingToday = bookings.filter(b => {
    const today = new Date('2023-10-23'); // Demo date
    const checkin = new Date(b.checkIn);
    return checkin.toDateString() === today.toDateString() && b.status === 'Confirmed';
  });

  const departingToday = bookings.filter(b => {
    const today = new Date('2023-10-23'); // Demo date
    const checkout = new Date(b.checkOut);
    return checkout.toDateString() === today.toDateString() && b.status === 'Checked-in';
  });

  const activeBookings = view === 'arrivals' ? arrivingToday : departingToday;

  const filteredBookings = activeBookings.filter(b => {
    const room = rooms.find(r => r.id === b.roomId);
    const matchesSearch = b.guestName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (room?.number?.toString() || '').includes(searchTerm);
    const matchesRoomType = selectedRoomType === 'All' || room?.type === selectedRoomType;
    return matchesSearch && matchesRoomType;
  });

  const handleCheckIn = (bookingId: string, roomId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    const room = rooms.find(r => r.id === roomId);
    if (booking && room) {
      updateBooking({ ...booking, status: 'Checked-in' });
      updateRoom({ ...room, status: 'Occupied' });
    }
  };

  const handleCheckOut = (bookingId: string, roomId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    const room = rooms.find(r => r.id === roomId);
    if (booking && room) {
      updateBooking({ ...booking, status: 'Checked-out' });
      updateRoom({ ...room, status: 'Cleaning' });
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Check-in / Check-out</h1>
          <p className="text-slate-500 text-sm mt-1">Manage guest transitions and room status.</p>
        </div>
        <div className="flex bg-slate-200/50 p-1 rounded-lg border border-slate-200 w-full sm:w-auto">
          <button 
            onClick={() => setView('arrivals')}
            className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-bold rounded-md tracking-tight whitespace-nowrap transition-all ${view === 'arrivals' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Arriving Today
          </button>
          <button 
            onClick={() => setView('departures')}
            className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-bold rounded-md tracking-tight whitespace-nowrap transition-all ${view === 'departures' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Departing Today
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatWidget label="Expected" value={activeBookings.length.toString()} highlight={`${view === 'arrivals' ? '+12% today' : 'Normal volume'}`} trend={view === 'arrivals'} />
        <StatWidget label="Rooms Ready" value={rooms.filter(r => r.status === 'Available').length.toString()} progress={Math.round((rooms.filter(r => r.status === 'Available').length / rooms.length) * 100)} />
        <StatWidget label="Pending Actions" value={activeBookings.length.toString()} highlight={view === 'arrivals' ? 'Needs check-in' : 'Needs check-out'} alert />
        <div className="bg-slate-900 p-5 rounded-lg text-white border-0 shadow-md flex flex-col justify-between overflow-hidden relative">
          <QrCode className="absolute -right-4 -bottom-4 w-20 h-20 text-white/5 rotate-12" />
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest relative z-10">Quick Actions</p>
          <button className="w-full mt-4 bg-blue-600 text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all text-xs relative z-10">
            <QrCode size={16} />
            Scan QR
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between bg-slate-50/30 gap-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
            <div className="relative group">
              <select 
                value={selectedRoomType}
                onChange={(e) => setSelectedRoomType(e.target.value)}
                className="appearance-none bg-white px-3 py-1.5 pr-8 rounded-lg border border-slate-200 cursor-pointer text-xs font-semibold text-slate-700 focus:ring-1 focus:ring-blue-500 outline-none w-full"
              >
                {roomTypes.map(type => <option key={type} value={type}>{type === 'All' ? 'All Room Types' : type}</option>)}
              </select>
              <ChevronLeft size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 rotate-[-90deg] text-slate-400 pointer-events-none" />
            </div>

            <div className="relative flex-1 sm:max-w-xs">
              <input 
                type="text" 
                placeholder="Search name or room..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg py-1.5 pl-3 pr-4 text-xs focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
              />
            </div>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">
            {view === 'arrivals' ? `Today: ${arrivingToday.length} arrivals` : `Today: ${departingToday.length} departures`}
          </p>
        </div>

        <div className="overflow-x-auto overflow-y-hidden">
          {/* Desktop Table */}
          <table className="hidden sm:table w-full text-left text-sm min-w-[600px] border-collapse translate-z-0">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-bold tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-6 py-3 whitespace-nowrap">Guest & Booking</th>
                <th className="px-4 py-3 whitespace-nowrap">Room Info</th>
                <th className="px-4 py-3 whitespace-nowrap">Status</th>
                <th className="px-4 py-3 whitespace-nowrap">Cleaning</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredBookings.length > 0 ? filteredBookings.map((b, i) => {
                const room = rooms.find(r => r.id === b.roomId);
                
                return (
                  <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-[10px] shrink-0">
                          {b.guestName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 leading-none truncate">{b.guestName}</p>
                          <p className="text-[10px] text-slate-400 font-medium mt-1">Ref: {b.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-bold text-slate-800 text-xs">Room {room?.number}</p>
                      <p className="text-[10px] text-slate-400 leading-none uppercase truncate">{room?.type}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight ${
                        b.status === 'Checked-in' ? 'bg-emerald-100 text-emerald-700' : 
                        b.status === 'Checked-out' ? 'bg-slate-100 text-slate-400' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 overflow-hidden">
                        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${room?.status === 'Available' ? 'bg-emerald-500' : room?.status === 'Cleaning' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase truncate">
                          {room?.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {view === 'arrivals' ? (
                        <button 
                          onClick={() => handleCheckIn(b.id, b.roomId)}
                          disabled={room?.status !== 'Available'}
                          className="bg-blue-600 text-white px-4 py-1.5 rounded-lg font-semibold text-[10px] uppercase tracking-wide hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap disabled:opacity-50 disabled:pointer-events-none"
                        >
                          Check-in
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleCheckOut(b.id, b.roomId)}
                          className="bg-slate-800 text-white px-4 py-1.5 rounded-lg font-semibold text-[10px] uppercase tracking-wide hover:bg-slate-900 transition-colors shadow-sm whitespace-nowrap"
                        >
                          Check-out
                        </button>
                      )}
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-400 text-sm italic whitespace-nowrap">
                    No {view} scheduled for today.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Mobile Card List */}
          <div className="sm:hidden divide-y divide-slate-100">
            {filteredBookings.length > 0 ? filteredBookings.map((b, i) => {
              const room = rooms.find(r => r.id === b.roomId);
              return (
                <div key={i} className="p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-xs">
                        {b.guestName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 leading-tight">{b.guestName}</h4>
                        <p className="text-[10px] text-slate-400 font-medium">Ref: {b.id}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-tight ${
                      b.status === 'Checked-in' ? 'bg-emerald-100 text-emerald-700' : 
                      b.status === 'Checked-out' ? 'bg-slate-100 text-slate-400' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {b.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-y border-slate-50">
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Room Info</p>
                      <p className="text-xs font-bold text-slate-800">ROOM {room?.number} • {room?.type}</p>
                    </div>
                    <div className="text-right space-y-0.5">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Room Status</p>
                      <div className="flex items-center gap-1.5 justify-end">
                        <div className={`w-1.5 h-1.5 rounded-full ${room?.status === 'Available' ? 'bg-emerald-500' : room?.status === 'Cleaning' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">{room?.status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-1">
                    {view === 'arrivals' ? (
                      <button 
                        onClick={() => handleCheckIn(b.id, b.roomId)}
                        disabled={room?.status !== 'Available'}
                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50 disabled:grayscale"
                      >
                        Complete Check-in
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleCheckOut(b.id, b.roomId)}
                        className="w-full bg-slate-800 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-900 transition-colors shadow-md"
                      >
                        Complete Check-out
                      </button>
                    )}
                  </div>
                </div>
              );
            }) : (
              <div className="p-12 text-center text-slate-400 text-sm italic">
                No {view} scheduled for today.
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
          <p className="text-xs text-slate-400 font-medium">Showing {filteredBookings.length} results</p>
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
    </div>
  );
}

function StatWidget({ label, value, highlight, trend, alert, progress }: any) {
  return (
    <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
      <div className="mt-3">
        <h3 className="text-2xl font-bold text-slate-800 leading-none">{value}</h3>
        {highlight && (
          <p className={`text-[10px] font-bold mt-2 ${trend ? 'text-emerald-600' : alert ? 'text-red-600' : 'text-slate-400'}`}>
            {highlight}
          </p>
        )}
        {progress !== undefined && (
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-blue-500 h-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
          </div>
        )}
      </div>
    </div>
  );
}
