import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Filter, TrendingUp, Sparkles, LogIn, Calendar as CalendarIcon } from 'lucide-react';
import { useData } from '../context/DataContext';
import BookingModal from '../components/BookingModal';

export default function RoomsCalendar() {
  const { rooms, bookings } = useData();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | undefined>(undefined);

  const openBookingModal = (roomId?: string) => {
    setSelectedRoomId(roomId);
    setIsBookingModalOpen(true);
  };

  const dates = [
    { day: 'MON', num: '23', accent: 'bg-blue-50/50', active: true },
    { day: 'TUE', num: '24', accent: '' },
    { day: 'WED', num: '25', accent: '' },
    { day: 'THU', num: '26', accent: '' },
    { day: 'FRI', num: '27', accent: '' },
    { day: 'SAT', num: '28', accent: 'bg-slate-50' },
    { day: 'SUN', num: '29', accent: 'bg-slate-50' },
  ];

  return (
    <div className="flex flex-col h-full -m-4 lg:-m-8">
      {/* Dynamic Sub-header */}
      <div className="px-4 lg:px-8 py-4 bg-white border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 z-10 shadow-sm">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={() => openBookingModal()}
            className="flex-1 sm:flex-none bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap"
          >
            + New Booking
          </button>
          <div className="flex bg-slate-50 border border-slate-200 rounded-lg p-0.5">
            <button className="px-3 py-1 text-xs font-bold bg-white text-slate-800 shadow-sm rounded-md">D</button>
            <button className="px-3 py-1 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">W</button>
            <button className="px-3 py-1 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">M</button>
          </div>
        </div>

        <div className="flex items-center justify-between w-full sm:w-auto gap-4 lg:gap-8">
          <div className="flex gap-3 lg:gap-4 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            <Legend color="bg-emerald-500" label="Avail." />
            <Legend color="bg-blue-500" label="Occ." />
            <Legend color="bg-amber-400" label="Clean" />
            <Legend color="bg-red-500" label="Maint." />
          </div>
          <button className="text-slate-400 hover:text-slate-600 shrink-0">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-slate-100/50 p-4 lg:p-8 custom-scrollbar">
        <div className="min-w-[800px] lg:min-w-[1100px] bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
          {/* Calendar Header Row */}
          <div className="flex border-b border-slate-100 bg-slate-50/30">
            <div className="w-32 lg:w-40 shrink-0 p-4 border-r border-slate-100 flex items-center justify-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Rooms / Dates</span>
            </div>
            <div className="flex-1 grid grid-cols-7">
              {dates.map((d, i) => (
                <div key={i} className={`p-3 text-center border-r border-slate-100 flex flex-col items-center justify-center ${d.active ? 'bg-blue-50/50' : ''}`}>
                  <p className={`text-[9px] lg:text-[10px] font-bold uppercase tracking-tight ${d.active ? 'text-blue-600' : 'text-slate-400'}`}>{d.day}</p>
                  <p className={`text-base lg:text-lg font-bold ${d.active ? 'text-blue-700' : 'text-slate-700'}`}>{d.num}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="divide-y divide-slate-50">
            {rooms.map(room => {
              const roomBookings = bookings.filter(b => b.roomId === room.id && b.status !== 'Cancelled');
              return (
                <RoomRow
                  key={room.id}
                  room={`Room ${room.number}`}
                  type={room.type}
                  status={room.status}
                  bookings={roomBookings.map(b => ({
                    start: 0, // Simplified for demo
                    span: b.nights || 1,
                    guest: b.guestName,
                    sub: b.status,
                    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(b.guestName)}&background=random`
                  }))}
                  onClick={() => openBookingModal(room.id)}
                />
              );
            })}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 pb-8">
          <StatCard label="Occupancy" value={`${((rooms.filter(r => r.status === 'Occupied').length / rooms.length) * 100).toFixed(1)}%`} trend="+2.4% ↑" icon={TrendingUp} iconColor="text-emerald-500" />
          <StatCard label="Laundry Load" value={rooms.filter(r => r.status === 'Cleaning').length.toString()} trend="Pending cleans" icon={Sparkles} iconColor="text-amber-500" />
          <StatCard label="Departures" value="08" trend="Rooms to inspect" icon={LogIn} iconColor="text-blue-500" rotate />
        </div>
      </div>

      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
        selectedRoomId={selectedRoomId}
      />
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-2 h-2 rounded-full ${color}`}></div>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{label}</span>
    </div>
  );
}

function RoomRow({ room, type, status, bookings, onClick }: any) {
  return (
    <div className="flex h-16 hover:bg-slate-50 transition-colors cursor-pointer" onClick={onClick}>
      <div className="w-32 lg:w-40 shrink-0 px-4 lg:px-6 border-r border-slate-100 flex flex-col justify-center">
        <span className="text-[11px] lg:text-xs font-bold text-slate-800 truncate">{room}</span>
        <span className="text-[8px] lg:text-[9px] text-slate-400 font-medium uppercase truncate">{type} • {status}</span>
      </div>
      <div className="flex-1 grid grid-cols-7 relative">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="border-r border-slate-50 h-full"></div>
        ))}
        
        {bookings.length > 0 ? bookings.map((b: any, i: number) => {
          const bgColor = 'bg-blue-500';
          
          return (
            <div
              key={i}
              className={`absolute top-1.5 bottom-1.5 rounded shadow-sm flex items-center gap-2 px-2 lg:px-3 overflow-hidden ${bgColor}`}
              style={{
                left: `${(b.start / 7) * 100}%`,
                width: `${Math.min((b.span / 7) * 100, 100)}%`,
                margin: '0 4px'
              }}
            >
              {b.avatar && (
                <img src={b.avatar} className="w-5 h-5 lg:w-6 lg:h-6 rounded-full border border-white/20 shrink-0" alt="" />
              )}
              <div className="min-w-0">
                <p className="text-[8px] lg:text-[9px] font-bold uppercase truncate leading-none text-white">
                  {b.guest}
                </p>
                {b.sub && (
                  <p className="hidden xs:block text-[max(6px,7px)] lg:text-[8px] opacity-70 truncate mt-0.5 leading-none text-slate-100">
                    {b.sub}
                  </p>
                )}
              </div>
            </div>
          );
        }) : (
          status === 'Cleaning' && (
            <div className="absolute inset-y-1.5 left-0 right-0 mx-1 bg-amber-100 border border-amber-200 rounded flex items-center px-3 gap-2">
              <Sparkles size={12} className="text-amber-500" />
              <span className="text-[8px] font-bold text-amber-700 uppercase">Cleaning in progress</span>
            </div>
          )
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, trend, icon: Icon, iconColor, rotate }: any) {
  return (
    <div className="bg-white p-4 lg:p-5 rounded-lg border border-slate-200 shadow-sm flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <p className="text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <Icon className={`${iconColor} ${rotate ? 'rotate-180' : ''}`} size={14} />
      </div>
      <h4 className="text-xl lg:text-2xl font-bold text-slate-800">{value}</h4>
      <p className="text-[9px] lg:text-[10px] font-bold text-slate-500 mt-2">{trend}</p>
    </div>
  );
}
