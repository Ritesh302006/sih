import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { useAppContext } from '../../store/AppContext';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Search, MapPin, Clock, Users, ShieldAlert, CheckCircle, Navigation } from 'lucide-react';
import { format } from 'date-fns';

export function IncidentManagement() {
  const { incidents, locations, resources, selectedIncidentId, setSelectedIncidentId, setCurrentView, assignResource, updateIncidentStatus } = useAppContext();
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const filteredIncidents = incidents.filter(inc => {
    if (filter !== 'ALL' && inc.status !== filter && inc.priority !== filter) return false;
    if (search && !inc.title.toLowerCase().includes(search.toLowerCase()) && !inc.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const selectedIncident = incidents.find(i => i.id === selectedIncidentId);

  const handleNavigateToMap = (id: string) => {
    setSelectedIncidentId(id);
    setCurrentView('map');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
      {/* List Panel */}
      <Card className="flex-1 flex flex-col bg-slate-900/50">
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
          <div>
            <CardTitle>Incident Management</CardTitle>
            <p className="text-sm text-slate-400 mt-1">Track, manage, and assign resources.</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select 
              className="bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-lg px-3 py-2 focus:ring-1 focus:ring-purple-500 outline-none"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="ALL">All Incidents</option>
              <option value="CRITICAL">Critical Only</option>
              <option value="NEW">New Only</option>
              <option value="IN_PROGRESS">In Progress</option>
            </select>
            <div className="relative flex-1 sm:w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <Input 
                placeholder="Search ID or Title" 
                className="pl-9"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-0">
          <div className="divide-y divide-slate-800/60">
            {filteredIncidents.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No incidents match your criteria.</div>
            ) : (
              filteredIncidents.map(inc => {
                const loc = locations.find(l => l.id === inc.locationId);
                const isSelected = selectedIncidentId === inc.id;
                
                return (
                  <div 
                    key={inc.id}
                    className={`p-4 cursor-pointer transition-colors border-l-2 ${
                      isSelected 
                        ? 'bg-purple-900/20 border-purple-500' 
                        : 'bg-transparent border-transparent hover:bg-slate-800/40'
                    }`}
                    onClick={() => setSelectedIncidentId(inc.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-500">{inc.id}</span>
                        <h4 className="font-medium text-slate-200">{inc.title}</h4>
                      </div>
                      <Badge variant={inc.priority.toLowerCase() as any}>{inc.priority}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-slate-400 mt-2">
                      <div className="flex items-center gap-1"><MapPin size={14}/> {loc?.name}</div>
                      <div className="flex items-center gap-1"><Clock size={14}/> {format(new Date(inc.reportedTime), 'HH:mm')}</div>
                      <div className="flex items-center gap-1"><ShieldAlert size={14}/> {inc.status}</div>
                      {inc.resourceId ? (
                        <div className="flex items-center gap-1 text-emerald-400"><CheckCircle size={14}/> Assigned</div>
                      ) : (
                        <div className="flex items-center gap-1 text-orange-400">Unassigned</div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detail Panel */}
      {selectedIncident ? (
        <Card className="w-full lg:w-[450px] flex flex-col shrink-0 glow-purple">
          <CardHeader className="bg-slate-900/80 border-b border-slate-800">
            <div className="flex justify-between items-center mb-4">
              <Badge variant={selectedIncident.status === 'NEW' ? 'info' : selectedIncident.status === 'RESOLVED' ? 'success' : 'default'}>
                {selectedIncident.status}
              </Badge>
              <span className="text-xs font-mono text-slate-500">{selectedIncident.id}</span>
            </div>
            <CardTitle className="text-xl mb-1">{selectedIncident.title}</CardTitle>
            <p className="text-sm text-slate-400">{selectedIncident.type}</p>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto p-5 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-xs text-slate-500 block mb-1">Priority</span>
                <span className={`font-semibold ${selectedIncident.priority === 'CRITICAL' ? 'text-red-400' : 'text-orange-400'}`}>
                  {selectedIncident.priority}
                </span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-xs text-slate-500 block mb-1">Affected People</span>
                <span className="font-semibold text-slate-200">{selectedIncident.peopleAffected}</span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-400 mb-2">Location & Time</h4>
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="text-purple-400 shrink-0 mt-0.5" size={16} />
                  <div>
                    <div className="text-sm font-medium text-slate-200">{locations.find(l => l.id === selectedIncident.locationId)?.name}</div>
                    <Button variant="ghost" size="sm" className="mt-2 h-7 px-2 text-xs" onClick={() => handleNavigateToMap(selectedIncident.id)}>
                      <Navigation size={12} className="mr-1" /> View on Map
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
                  <Clock className="text-slate-500 shrink-0" size={16} />
                  <div className="text-sm text-slate-300">
                    Reported at {format(new Date(selectedIncident.reportedTime), 'MMM d, yyyy HH:mm')}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-400 mb-2">Description</h4>
              <p className="text-sm text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
                {selectedIncident.description}
              </p>
            </div>

            {/* Resource Assignment */}
            <div>
              <h4 className="text-sm font-semibold text-slate-400 mb-2">Resource Assignment</h4>
              {selectedIncident.resourceId ? (
                <div className="bg-emerald-900/20 border border-emerald-500/30 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-emerald-400 flex items-center gap-2">
                        <CheckCircle size={16} /> Assigned
                      </div>
                      <div className="text-sm text-slate-300 mt-1">
                        {resources.find(r => r.id === selectedIncident.resourceId)?.name}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => updateIncidentStatus(selectedIncident.id, 'RESOLVED')}>
                      Mark Resolved
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                  <div className="text-sm text-slate-400 mb-3">No resource assigned yet.</div>
                  <div className="space-y-2">
                    {resources.filter(r => r.status === 'AVAILABLE').slice(0,3).map(res => (
                      <div key={res.id} className="flex items-center justify-between bg-slate-900 p-2 rounded border border-slate-800">
                        <span className="text-sm text-slate-300">{res.name}</span>
                        <Button size="sm" onClick={() => assignResource(selectedIncident.id, res.id)}>Assign</Button>
                      </div>
                    ))}
                    {resources.filter(r => r.status === 'AVAILABLE').length === 0 && (
                      <div className="text-sm text-red-400 flex items-center gap-2"><ShieldAlert size={14}/> No available resources!</div>
                    )}
                  </div>
                </div>
              )}
            </div>

          </CardContent>
        </Card>
      ) : (
        <Card className="w-full lg:w-[450px] flex items-center justify-center bg-slate-900/30 border-dashed border-slate-800 shrink-0">
          <div className="text-center text-slate-500 p-8">
            <ShieldAlert size={48} className="mx-auto mb-4 opacity-50" />
            <p>Select an incident from the list to view details and manage response.</p>
          </div>
        </Card>
      )}
    </div>
  );
}
