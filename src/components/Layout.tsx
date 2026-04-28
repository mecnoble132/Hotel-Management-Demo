import React from 'react';
import { LayoutDashboard, Calendar, BookOpenCheck, Key, CreditCard, Bell, HelpCircle, Search, Menu, Settings, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const SidebarItem = ({ icon: Icon, label, active, onClick }: SidebarItemProps) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-6 py-3 transition-all duration-200 border-l-4 ${
      active
        ? 'bg-slate-800 text-blue-400 border-blue-500 font-bold'
        : 'text-slate-400 border-transparent hover:bg-slate-800 hover:text-white'
    }`}
  >
    <Icon size={18} />
    <span className="text-[13px] font-medium tracking-tight">{label}</span>
  </button>
);

interface LayoutProps {
  children: React.ReactNode;
  activeScreen: string;
  setActiveScreen: (screen: string) => void;
  user: {
    name: string;
    role: string;
    avatar: string;
  };
}

export default function Layout({ children, activeScreen, setActiveScreen, user }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-[#f1f5f9]">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen w-60 bg-[#0f172a] text-slate-300 flex flex-col z-[70] transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-slate-800 mb-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight font-headline">
              GrandStay<span className="text-blue-500">OS</span>
            </h1>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 mt-2 overflow-y-auto custom-scrollbar">
          <SidebarItem
            icon={LayoutDashboard}
            label="Dashboard"
            active={activeScreen === 'dashboard'}
            onClick={() => { setActiveScreen('dashboard'); setIsSidebarOpen(false); }}
          />
          <SidebarItem
            icon={Calendar}
            label="Rooms & Calendar"
            active={activeScreen === 'calendar'}
            onClick={() => { setActiveScreen('calendar'); setIsSidebarOpen(false); }}
          />
          <SidebarItem
            icon={BookOpenCheck}
            label="Bookings"
            active={activeScreen === 'bookings'}
            onClick={() => { setActiveScreen('bookings'); setIsSidebarOpen(false); }}
          />
          <SidebarItem
            icon={Key}
            label="Check-in / Out"
            active={activeScreen === 'checkinout'}
            onClick={() => { setActiveScreen('checkinout'); setIsSidebarOpen(false); }}
          />
          <SidebarItem
            icon={CreditCard}
            label="Payments"
            active={activeScreen === 'payments'}
            onClick={() => { setActiveScreen('payments'); setIsSidebarOpen(false); }}
          />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white text-xs shrink-0">
              {user.name.split(' ').map((n: string) => n[0]).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-white truncate">{user.name}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider truncate">{user.role}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-60 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 z-40">
          <div className="flex items-center gap-3 lg:gap-4 flex-1">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-slate-500 lg:hidden">
              <Menu size={20} />
            </button>
            <h2 className="text-base lg:text-lg font-semibold text-slate-800 tracking-tight truncate">
              {activeScreen.charAt(0).toUpperCase() + activeScreen.slice(1).replace(/([A-Z])/g, ' $1')}
            </h2>
            <div className="hidden sm:block w-px h-6 bg-slate-200 mx-1 lg:mx-2"></div>
            <span className="hidden sm:inline text-slate-400 text-xs lg:text-sm italic whitespace-nowrap">Monday, Oct 23, 2023</span>
          </div>

          <div className="flex items-center gap-3 lg:gap-6">
            <div className="hidden md:flex items-center gap-2 text-slate-500 text-xs font-medium">
              <Search className="text-slate-400" size={14} />
              <span>Search...</span>
            </div>
            <div className="flex items-center gap-2 lg:gap-4 border-l border-slate-200 pl-3 lg:pl-6">
              <button className="text-slate-400 hover:text-slate-600 transition-colors hidden sm:block">
                <Bell size={18} />
              </button>
              <button className="text-slate-400 hover:text-slate-600 transition-colors hidden sm:block">
                <Settings size={18} />
              </button>
              <div className="hidden sm:block w-px h-6 bg-slate-200"></div>
              <button className="bg-blue-600 text-white px-3 lg:px-4 py-1.5 rounded-lg text-xs lg:text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap">
                <span className="hidden xs:inline">+ New Booking</span>
                <span className="xs:hidden">+</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-4 lg:p-8 flex-1 relative overflow-y-auto custom-scrollbar pb-32 lg:pb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeScreen}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Mobile Bottom Nav */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex items-center justify-around px-2 z-[60] shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
          <BottomNavItem 
            icon={LayoutDashboard} 
            label="Home"
            active={activeScreen === 'dashboard'} 
            onClick={() => setActiveScreen('dashboard')} 
          />
          <BottomNavItem 
            icon={Calendar} 
            label="Rooms"
            active={activeScreen === 'calendar'} 
            onClick={() => setActiveScreen('calendar')} 
          />
          <BottomNavItem 
            icon={BookOpenCheck} 
            label="Bookings"
            active={activeScreen === 'bookings'} 
            onClick={() => setActiveScreen('bookings')} 
          />
          <BottomNavItem 
            icon={Key} 
            label="FrontDesk"
            active={activeScreen === 'checkinout'} 
            onClick={() => setActiveScreen('checkinout')} 
          />
          <BottomNavItem 
            icon={CreditCard} 
            label="Finance"
            active={activeScreen === 'payments'} 
            onClick={() => setActiveScreen('payments')} 
          />
        </div>
      </div>
    </div>
  );
}

function BottomNavItem({ icon: Icon, label, active, onClick }: { icon: any; label: string; active: boolean; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all ${active ? 'text-blue-600' : 'text-slate-400'}`}
    >
      <div className={`p-1.5 rounded-lg transition-colors ${active ? 'bg-blue-50' : ''}`}>
        <Icon size={20} />
      </div>
      <span className={`text-[9px] font-bold uppercase tracking-tight transition-colors ${active ? 'text-blue-600' : 'text-slate-400'}`}>{label}</span>
    </button>
  );
}
