import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Filter, TrendingUp, Sparkles, LogIn, Calendar as CalendarIcon } from 'lucide-react';
import { useData } from '../context/DataContext';
import BookingModal from '../components/BookingModal';
import { SIMULATION_DATE_OBJ, normalizeDate } from '../constants';

export default function RoomsCalendar() {
  const { rooms, bookings } = useData();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoomType, setSelectedRoomType] = useState('All');

  const roomTypes = ['All', ...new Set(rooms.map(r => r.type))];

  const filteredRooms = rooms.filter(r => {
    const matchesSearch = r.number.toString().includes(searchTerm) || r.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedRoomType === 'All' || r.type === selectedRoomType;
    return matchesSearch && matchesType;
  });

  const openBookingModal = (roomId?: string) => {
    setSelectedRoomId(roomId);
    setIsBookingModalOpen(true);
  };

  // Generate 7 days starting from SIMULATION_DATE_OBJ (normalized)
  const today = normalizeDate(SIMULATION_DATE_OBJ);
  const dates = [...Array(7)].map((_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    return {
      date: date,
      day: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
      num: date.getDate().toString(),
      active: i === 0
    };
  });

  const startDate = dates[0].date;
  const endDate = dates[6].date;

  return (
    <div className="flex flex-col gap-6">
      {/* Dynamic Sub-header - Sticky on mobile for quick access */}
      <div className="sticky top-[-16px] lg:static px-4 lg:px-8 py-4 bg-white border-b border-slate-200 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 z-20 shadow-sm -mx-4 lg:mx-0">
        <div className="flex items-center gap-3 flex-1">
          <button 
            onClick={() => openBookingModal()}
            className="shrink-0 bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap"
          >
            + New Booking
          </button>
          
          <div className="relative flex-1 max-w-xs">
            <input 
              type="text" 
              placeholder="Room # or type..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 pl-3 pr-4 text-xs focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="relative shrink-0">
            <select 
              value={selectedRoomType}
              onChange={(e) => setSelectedRoomType(e.target.value)}
              className="appearance-none bg-white px-3 py-1.5 pr-8 rounded-lg border border-slate-200 cursor-pointer text-xs font-semibold text-slate-700 focus:ring-1 focus:ring-blue-500 outline-none"
            >
              {roomTypes.map(type => <option key={type} value={type}>{type === 'All' ? 'All Types' : type}</option>)}
            </select>
            <ChevronLeft size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 rotate-[-90deg] text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 lg:gap-8">
          <div className="flex gap-3 lg:gap-4 overflow-x-auto no-scrollbar">
            <Legend color="bg-emerald-500" label="Avail." />
            <Legend color="bg-blue-500" label="Occ." />
            <Legend color="bg-amber-400" label="Clean" />
            <Legend color="bg-red-500" label="Maint." />
          </div>
        </div>
      </div>

      <div className="flex-1 bg-slate-100/50 p-0 sm:p-4 lg:p-8 sm:rounded-xl border-y sm:border border-slate-200/50">
        {/* Calendar View - Scrollable on mobile to see dates */}
        <div className="overflow-x-auto custom-scrollbar">
          <div className="min-w-[550px] md:min-w-[850px] lg:min-w-[1100px] bg-white border-x sm:border border-slate-200 sm:rounded-lg shadow-sm">
          {/* Calendar Header Row */}
          <div className="flex border-b border-slate-100 bg-slate-50/30 sticky top-0 z-10">
            <div className="w-16 md:w-32 lg:w-40 shrink-0 p-3 lg:p-4 border-r border-slate-100 flex items-center justify-center bg-slate-50 sticky left-0 z-20">
              <span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">R / D</span>
            </div>
            <div className="flex-1 grid grid-cols-7">
              {dates.map((d, i) => (
                <div key={i} className={`p-2 lg:p-3 text-center border-r border-slate-100 flex flex-col items-center justify-center ${d.active ? 'bg-blue-50/50' : ''}`}>
                  <p className={`text-[8px] md:text-[10px] font-bold uppercase tracking-tight ${d.active ? 'text-blue-600' : 'text-slate-400'}`}>{d.day}</p>
                  <p className={`text-sm md:text-lg font-bold ${d.active ? 'text-blue-700' : 'text-slate-700'}`}>{d.num}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="divide-y divide-slate-50">
            {filteredRooms.map(room => {
              const roomBookings = bookings.filter(b => b.roomId === room.id && b.status !== 'Cancelled');
              
              const rowBookings = roomBookings.map(b => {
                const checkIn = normalizeDate(b.checkIn);
                const checkOut = normalizeDate(b.checkOut);
                
                // Calculate start index relative to dates[0] (which is already normalized 'startDate')
                const diffTime = checkIn.getTime() - startDate.getTime();
                const startIdx = Math.round(diffTime / (1000 * 60 * 60 * 24));
                
                // Calculate visible portion in our 7-day window
                const visibleStartIdx = Math.max(0, startIdx);
                const visibleEndIdx = Math.min(7, startIdx + b.nights);
                const visibleSpan = visibleEndIdx - visibleStartIdx;
                
                // Only show if it overlaps with our 7-day window
                if (visibleSpan <= 0) return null;
                
                return {
                  start: visibleStartIdx,
                  span: visibleSpan,
                  guest: b.guestName,
                  sub: b.status,
                  avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(b.guestName)}&background=random`
                };
              }).filter(Boolean);

              return (
                <RoomRow
                  key={room.id}
                  room={`Room ${room.number}`}
                  type={room.type}
                  status={room.status}
                  bookings={rowBookings}
                  onClick={() => openBookingModal(room.id)}
                />
              );
            })}
          </div>
        </div>
      </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
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
  const roomNumber = room.split(' ')[1] || room;
  return (
    <div className="flex h-16 hover:bg-slate-50 transition-colors cursor-pointer group" onClick={onClick}>
      <div className="w-16 md:w-32 lg:w-40 shrink-0 px-2 md:px-4 lg:px-6 border-r border-slate-100 flex flex-col justify-center bg-white sticky left-0 z-10 group-hover:bg-slate-50 transition-colors">
        <span className="text-[10px] md:text-xs font-bold text-slate-800 truncate">
          <span className="md:hidden">#{roomNumber}</span>
          <span className="hidden md:inline">{room}</span>
        </span>
        <span className="hidden md:block text-[8px] lg:text-[9px] text-slate-400 font-medium uppercase truncate">{type}</span>
        <span className="md:hidden text-[7px] text-slate-400 font-bold uppercase truncate">{status[0]}</span>
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
