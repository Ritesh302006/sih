import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Menu, Bell, Settings } from 'lucide-react';
import { useAppContext } from '../store/AppContext';
import { AIChatbot } from './AIChatbot';

export function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { notifications, setCurrentView, currentView } = useAppContext();
  
  const unreadCount = notifications.length;

  return (
    <div className="flex h-screen bg-transparent text-slate-100 overflow-hidden font-sans selection:bg-purple-500/30">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col min-w-0 overflow-hidden relative ${currentView === 'dashboard' ? 'bg-transparent' : 'bg-black/40'}`}>
        
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Top Header */}
        <header className={`h-16 border-b border-[#252525] backdrop-blur-md flex items-center justify-between px-4 lg:px-8 relative z-40 shrink-0 ${currentView === 'dashboard' ? 'bg-black/50' : 'bg-[#000000]/90'}`}>
          <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0 mr-4">
            <button 
              className="p-2 -ml-2 rounded-lg hover:bg-white/10 text-white lg:hidden transition-colors shrink-0"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="font-semibold text-base sm:text-lg text-white truncate">Campus Command Center</h1>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-4 shrink-0">
            <button
              onClick={() => setCurrentView(currentView === 'student' ? 'dashboard' : 'student')}
              className="text-[10px] sm:text-xs font-semibold px-2 sm:px-4 py-1.5 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors whitespace-nowrap"
            >
              {currentView === 'student' ? 'Admin View' : 'Student SOS'}
            </button>

            <button 
              className="relative p-2 rounded-full hover:bg-white/10 text-white transition-colors"
              onClick={() => setCurrentView('settings')}
              title="Options"
            >
              <Settings size={20} />
            </button>

            <button 
              className="relative p-2 rounded-full hover:bg-white/10 text-white transition-colors"
              onClick={() => setCurrentView('notifications')}
              title="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)] border border-black" />
              )}
            </button>
            <div className="flex items-center gap-2 pl-4 border-l border-white/20">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-sm font-bold text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                {currentView === 'student' ? 'ST' : 'CM'}
              </div>
            </div>
          </div>
        </header>

        {/* Main scrollable area */}
        <main className="flex-1 overflow-auto p-4 lg:p-8 z-10">
          {children}
        </main>

        {currentView !== 'student' && <AIChatbot />}
      </div>
    </div>
  );
}

