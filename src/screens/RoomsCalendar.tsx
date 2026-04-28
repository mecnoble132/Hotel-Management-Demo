import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Filter, TrendingUp, Sparkles, LogIn, Calendar as CalendarIcon } from 'lucide-react';
import { useData } from '../context/DataContext';
import BookingModal from '../components/BookingModal';

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

      <div className="flex-1 bg-slate-100/50 p-4 lg:p-8 rounded-xl border border-slate-200/50">
        {/* Desktop Calendar View - Keep horizontal scroll for this specific component */}
        <div className="hidden lg:block overflow-x-auto custom-scrollbar">
          <div className="min-w-[1100px] bg-white border border-slate-200 rounded-lg shadow-sm">
          {/* Calendar Header Row */}
          <div className="flex border-b border-slate-100 bg-slate-50/30">
            <div className="w-40 shrink-0 p-4 border-r border-slate-100 flex items-center justify-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Rooms / Dates</span>
            </div>
            <div className="flex-1 grid grid-cols-7">
              {dates.map((d, i) => (
                <div key={i} className={`p-3 text-center border-r border-slate-100 flex flex-col items-center justify-center ${d.active ? 'bg-blue-50/50' : ''}`}>
                  <p className={`text-[10px] font-bold uppercase tracking-tight ${d.active ? 'text-blue-600' : 'text-slate-400'}`}>{d.day}</p>
                  <p className={`text-lg font-bold ${d.active ? 'text-blue-700' : 'text-slate-700'}`}>{d.num}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="divide-y divide-slate-50">
            {filteredRooms.map(room => {
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
      </div>

      {/* Mobile Status List View */}
        <div className="lg:hidden space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Today's Room Status</h3>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase">Week 43</span>
          </div>
          
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
            {filteredRooms.map(room => {
              const currentBooking = bookings.find(b => b.roomId === room.id && b.status === 'Checked-in');
              
              return (
                <div 
                  key={room.id} 
                  onClick={() => openBookingModal(room.id)}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group"
                >
                  <div className={`absolute top-0 right-0 w-16 h-16 -mr-8 -mt-8 rotate-45 opacity-10 ${
                    room.status === 'Available' ? 'bg-emerald-500' :
                    room.status === 'Occupied' ? 'bg-blue-500' :
                    room.status === 'Cleaning' ? 'bg-amber-500' : 'bg-red-500'
                  }`}></div>
                  
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-xl font-bold text-slate-800 leading-none">{room.number}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{room.type}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-tight ${
                      room.status === 'Available' ? 'bg-emerald-100 text-emerald-700' :
                      room.status === 'Occupied' ? 'bg-blue-100 text-blue-700' :
                      room.status === 'Cleaning' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {room.status}
                    </span>
                  </div>

                  {currentBooking ? (
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-50">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-500 uppercase">
                        {currentBooking.guestName.split(' ')[0][0]}
                      </div>
                      <p className="text-[10px] font-bold text-slate-600 truncate">{currentBooking.guestName}</p>
                    </div>
                  ) : room.status === 'Cleaning' ? (
                    <div className="flex items-center gap-1.5 pt-2 border-t border-slate-50">
                      <Sparkles size={12} className="text-amber-500" />
                      <p className="text-[10px] font-bold text-amber-600 uppercase tracking-tighter italic">Cleaning...</p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 pt-2 border-t border-slate-50 text-slate-300">
                      <CalendarIcon size={12} />
                      <p className="text-[10px] font-bold uppercase tracking-tighter text-slate-300">Available</p>
                    </div>
                  )}
                </div>
              );
            })}
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
