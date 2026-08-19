import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { useAppContext } from '../../store/AppContext';
import { Badge } from '../ui/Badge';
import { ShieldCheck, UserCheck, UserX, AlertTriangle, MapPin } from 'lucide-react';

export function ResourceManagement() {
  const { resources, locations, incidents } = useAppContext();
  const [filter, setFilter] = useState('ALL');

  const filteredResources = resources.filter(res => {
    if (filter !== 'ALL' && res.status !== filter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Resource Management</h2>
          <p className="text-slate-400 text-sm">Monitor and deploy campus response teams.</p>
        </div>
        <div className="flex gap-2">
          <select 
            className="bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-lg px-3 py-2 focus:ring-1 focus:ring-purple-500 outline-none"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="AVAILABLE">Available</option>
            <option value="BUSY">Busy</option>
            <option value="UNAVAILABLE">Unavailable</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredResources.map(res => {
          const loc = locations.find(l => l.id === res.locationId);
          const assignedInc = res.assignedIncidentId ? incidents.find(i => i.id === res.assignedIncidentId) : null;
          
          let statusGlow = 'none';
          if (res.status === 'AVAILABLE') statusGlow = 'green';
          else if (res.status === 'BUSY') statusGlow = 'blue';
          else statusGlow = 'red';

          return (
            <Card key={res.id} glow={statusGlow as any} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="bg-slate-900 p-2 rounded-lg text-slate-300 border border-slate-800">
                    <ShieldCheck size={20} />
                  </div>
                  <Badge 
                    variant={
                      res.status === 'AVAILABLE' ? 'success' : 
                      res.status === 'BUSY' ? 'info' : 'critical'
                    }
                  >
                    {res.status}
                  </Badge>
                </div>
                <CardTitle className="mt-3 text-lg">{res.name}</CardTitle>
                <p className="text-xs text-slate-500">{res.type} TEAM</p>
              </CardHeader>
              <CardContent className="pt-0 flex-1 flex flex-col">
                <div className="space-y-3 mt-2 flex-1">
                  <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-950/50 p-2 rounded border border-slate-800/50">
                    <MapPin size={14} className="text-slate-500"/>
                    <span className="truncate">Current: {loc?.name}</span>
                  </div>
                  
                  {res.status === 'BUSY' && assignedInc && (
                    <div className="bg-blue-900/10 border border-blue-500/20 p-3 rounded-lg mt-4">
                      <div className="text-xs text-blue-400 mb-1 font-medium flex items-center gap-1">
                        <AlertTriangle size={12} /> Assigned To
                      </div>
                      <div className="text-sm text-slate-200 font-medium truncate">{assignedInc.title}</div>
                      <div className="text-xs text-slate-500 truncate mt-1">
                        {locations.find(l => l.id === assignedInc.locationId)?.name}
                      </div>
                    </div>
                  )}

                  {res.status === 'UNAVAILABLE' && (
                    <div className="bg-red-900/10 border border-red-500/20 p-3 rounded-lg mt-4 flex items-center gap-2">
                      <UserX size={16} className="text-red-400" />
                      <span className="text-sm text-red-400">Team offline or off-shift.</span>
                    </div>
                  )}
                  
                  {res.status === 'AVAILABLE' && (
                    <div className="bg-emerald-900/10 border border-emerald-500/20 p-3 rounded-lg mt-4 flex items-center gap-2">
                      <UserCheck size={16} className="text-emerald-400" />
                      <span className="text-sm text-emerald-400">Ready for deployment.</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
