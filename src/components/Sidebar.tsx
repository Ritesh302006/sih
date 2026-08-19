import React from 'react';
import { LayoutDashboard, AlertTriangle, Map, Users, Bell, Navigation, Settings, BarChart2, X, Monitor, Video } from 'lucide-react';
import { useAppContext } from '../store/AppContext';
import { cn } from '../lib/utils';
import { Badge } from './ui/Badge';

export function Sidebar({ onClose }: { onClose: () => void }) {
  const { currentView, setCurrentView, incidents, notifications } = useAppContext();
  
  const activeIncidentsCount = incidents.filter(i => i.status === 'NEW' || i.status === 'IN_PROGRESS').length;
  const criticalCount = incidents.filter(i => i.priority === 'CRITICAL' && i.status !== 'RESOLVED' && i.status !== 'CLOSED').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'incidents', label: 'Incidents', icon: AlertTriangle, badge: criticalCount > 0 ? criticalCount : undefined, badgeVariant: 'critical' as const },
    { id: 'map', label: 'Campus Map', icon: Map },
    { id: 'resources', label: 'Resources', icon: Users },
    { id: 'facilities', label: 'Rooms & Equip', icon: Monitor },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: notifications.length > 0 ? notifications.length : undefined },
  ] as const;

  return (
    <div className="h-full bg-[#000000] border-r border-[#252525] flex flex-col relative z-20">
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800/60">
        <div className="flex items-center gap-2 text-purple-400 font-bold text-xl tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)]">
            <Navigation size={18} className="text-purple-400" />
          </div>
          Nexus<span className="text-slate-100">JMIT</span>
        </div>
        <button className="lg:hidden p-1 text-slate-400 hover:text-white" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-3">Main Menu</div>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id as any);
                onClose();
              }}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                isActive 
                  ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-[inset_0_0_15px_rgba(168,85,247,0.1)]' 
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent'
              )}
            >
              <Icon size={18} className={isActive ? 'text-purple-400' : 'text-slate-500'} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge !== undefined && (
                <Badge variant={item.badgeVariant || 'default'} className="ml-auto">
                  {item.badge}
                </Badge>
              )}
            </button>
          );
        })}

        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-8 mb-2 px-3">System</div>
        <button 
          onClick={() => {
            setCurrentView('analytics');
            onClose();
          }}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
            currentView === 'analytics'
              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-[inset_0_0_15px_rgba(168,85,247,0.1)]' 
              : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent'
          )}
        >
          <BarChart2 size={18} className={currentView === 'analytics' ? 'text-purple-400' : 'text-slate-500'} />
          <span className="flex-1 text-left">Analytics</span>
        </button>
        <button 
          onClick={() => {
            setCurrentView('settings');
            onClose();
          }}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
            currentView === 'settings'
              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-[inset_0_0_15px_rgba(168,85,247,0.1)]' 
              : 'text-slate-400 hover:bg-[#101010] hover:text-slate-200 border border-transparent'
          )}
        >
          <Settings size={18} className={currentView === 'settings' ? 'text-purple-400' : 'text-slate-500'} />
          <span className="flex-1 text-left">Options</span>
        </button>
      </div>

      <div className="p-4 border-t border-slate-800/60">
        <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span className="text-xs font-medium text-slate-300">System Status</span>
          </div>
          <div className="text-xs text-slate-500">All campus systems operational. Response network active.</div>
        </div>
      </div>
    </div>
  );
}
