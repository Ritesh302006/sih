import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { useAppContext } from '../../store/AppContext';
import { Activity, AlertTriangle, ShieldCheck, Users, MapPin } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { formatDistanceToNow } from 'date-fns';

export function Dashboard() {
  const { incidents, resources, locations, setCurrentView, setSelectedIncidentId } = useAppContext();

  const totalIncidents = incidents.length;
  const criticalIncidents = incidents.filter(i => i.priority === 'CRITICAL' && i.status !== 'RESOLVED' && i.status !== 'CLOSED').length;
  const activeIncidents = incidents.filter(i => i.status === 'NEW' || i.status === 'IN_PROGRESS').length;
  const resolvedIncidents = incidents.filter(i => i.status === 'RESOLVED' || i.status === 'CLOSED').length;
  
  const availableResources = resources.filter(r => r.status === 'AVAILABLE').length;
  const busyResources = resources.filter(r => r.status === 'BUSY').length;
  const totalAffected = incidents.reduce((acc, curr) => acc + curr.peopleAffected, 0);

  const stats = [
    { label: 'Active Incidents', value: activeIncidents, icon: Activity, glow: 'blue', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Critical Alert', value: criticalIncidents, icon: AlertTriangle, glow: 'red', color: 'text-red-400', bg: 'bg-red-500/10' },
    { label: 'Available Teams', value: availableResources, icon: ShieldCheck, glow: 'green', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'People Affected', value: totalAffected, icon: Users, glow: 'orange', color: 'text-orange-400', bg: 'bg-orange-500/10' },
  ] as const;

  const recentIncidents = [...incidents].sort((a, b) => new Date(b.reportedTime).getTime() - new Date(a.reportedTime).getTime()).slice(0, 5);

  const handleIncidentClick = (id: string) => {
    setSelectedIncidentId(id);
    setCurrentView('incidents');
  };

  return (
    <div className="space-y-6 relative h-full">
      {/* Full Page Background Video specifically for Dashboard */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-80">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover"
          src="https://labs.google/fx/api/og-video/shared/3a06d6de-f17d-4440-ac82-dc3c68178e11"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#000000]/60 via-[#101010]/80 to-[#000000]" />
      </div>

      <div className="relative z-10 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h2 className="text-3xl font-bold text-white drop-shadow-lg">Dashboard Overview</h2>
            <p className="text-slate-300 text-base drop-shadow-md mt-1">Real-time status of JMIT Campus operations.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className={`relative rounded-2xl p-5 border border-[#252525] bg-[#101010]/60 backdrop-blur-md shadow-xl overflow-hidden ${stat.glow === 'blue' ? 'shadow-[0_0_15px_rgba(59,130,246,0.1)]' : stat.glow === 'red' ? 'shadow-[0_0_15px_rgba(239,68,68,0.1)]' : stat.glow === 'green' ? 'shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'shadow-[0_0_15px_rgba(249,115,22,0.1)]'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-1">{stat.label}</p>
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col relative rounded-2xl border border-[#252525] bg-[#101010]/60 backdrop-blur-md shadow-xl overflow-hidden">
          <div className="flex flex-row items-center justify-between py-4 px-6 border-b border-[#252525]/50">
            <h3 className="font-semibold text-lg text-white">Recent Activity</h3>
            <button 
              className="text-sm text-purple-400 hover:text-purple-300 font-medium"
              onClick={() => setCurrentView('incidents')}
            >
              View All
            </button>
          </div>
          <div className="flex-1 p-0">
            <div className="divide-y divide-[#252525]/50">
              {recentIncidents.map(incident => {
                const location = locations.find(l => l.id === incident.locationId)?.name;
                return (
                  <div 
                    key={incident.id} 
                    className="p-4 hover:bg-black/30 transition-colors cursor-pointer flex flex-col sm:flex-row gap-4 items-start sm:items-center"
                    onClick={() => handleIncidentClick(incident.id)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-slate-200">{incident.title}</h4>
                        {incident.priority === 'CRITICAL' && <Badge variant="critical">Critical</Badge>}
                        {incident.priority === 'HIGH' && <Badge variant="high">High</Badge>}
                        {incident.status === 'NEW' && <Badge variant="info">New</Badge>}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-400">
                        <span className="flex items-center gap-1"><MapPin size={14}/> {location}</span>
                        <span>•</span>
                        <span>{formatDistanceToNow(new Date(incident.reportedTime), { addSuffix: true })}</span>
                      </div>
                    </div>
                    <div>
                      {incident.status === 'RESOLVED' ? (
                        <Badge variant="success">Resolved</Badge>
                      ) : incident.status === 'IN_PROGRESS' ? (
                        <Badge variant="info">In Progress</Badge>
                      ) : incident.status === 'WAITING' ? (
                        <Badge variant="warning">Waiting</Badge>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col relative rounded-2xl border border-[#252525] bg-[#101010]/60 backdrop-blur-md shadow-xl overflow-hidden">
          <div className="py-4 px-6 border-b border-[#252525]/50">
            <h3 className="font-semibold text-lg text-white">Mini Map</h3>
          </div>
          <div className="flex-1 p-4 flex flex-col">
            <div className="relative w-full h-64 bg-[#000000]/50 rounded-lg border border-[#252525] overflow-hidden group cursor-pointer" onClick={() => setCurrentView('map')}>
              {/* Very basic mini map visualization */}
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              
              {locations.map(loc => {
                // Check if there is an active incident here
                const hasIncident = incidents.find(i => i.locationId === loc.id && i.status !== 'RESOLVED' && i.status !== 'CLOSED');
                const hasResource = resources.find(r => r.locationId === loc.id && r.status === 'AVAILABLE');
                
                let dotColor = 'bg-slate-600';
                let glow = '';
                let zIndex = 10;
                
                if (hasIncident) {
                  dotColor = hasIncident.priority === 'CRITICAL' ? 'bg-red-500' : 'bg-orange-500';
                  glow = hasIncident.priority === 'CRITICAL' ? 'shadow-[0_0_10px_rgba(239,68,68,0.8)]' : '';
                  zIndex = 30;
                } else if (hasResource) {
                  dotColor = 'bg-emerald-500';
                  zIndex = 20;
                }

                return (
                  <div 
                    key={loc.id}
                    className={`absolute w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2 ${dotColor} ${glow}`}
                    style={{ left: `${loc.x}%`, top: `${loc.y}%`, zIndex }}
                  />
                );
              })}

              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-slate-950/60 backdrop-blur-sm transition-all">
                <span className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium text-sm">Open Full Map</span>
              </div>
            </div>
            
            <div className="mt-4 space-y-2 text-sm text-slate-400">
              <div className="flex justify-between items-center">
                <span>Total Active Resources</span>
                <span className="font-medium text-slate-200">{busyResources} deployed</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Standby Resources</span>
                <span className="font-medium text-slate-200">{availableResources} ready</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Incident Resolution Rate</span>
                <span className="font-medium text-emerald-400">{Math.round((resolvedIncidents / Math.max(1, totalIncidents)) * 100)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
