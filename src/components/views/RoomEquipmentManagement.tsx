import React, { useState } from 'react';
import { useAppContext } from '../../store/AppContext';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { DoorOpen, Monitor, AlertTriangle, CheckCircle, MapPin, Search, Cpu, Users, Zap, SearchX } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Room, Equipment } from '../../types';

export function RoomEquipmentManagement() {
  const { incidents, rooms, equipment, resolveRoomIssue, resolveEquipmentIssue, setCurrentView, locations } = useAppContext();
  const [activeTab, setActiveTab] = useState<'ISSUES' | 'ROOMS' | 'EQUIPMENT'>('ISSUES');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering out room/equipment specific incidents
  const roomEqIncidents = incidents.filter(i => 
    (i.type === 'Room' || i.type === 'Equipment') && 
    (i.status === 'NEW' || i.status === 'IN_PROGRESS')
  );

  const stats = {
    activeRoomIssues: incidents.filter(i => i.type === 'Room' && (i.status === 'NEW' || i.status === 'IN_PROGRESS')).length,
    activeEquipmentIssues: incidents.filter(i => i.type === 'Equipment' && (i.status === 'NEW' || i.status === 'IN_PROGRESS')).length,
    availableRooms: rooms.filter(r => r.status === 'AVAILABLE').length,
    availableEquipment: equipment.filter(e => e.status === 'AVAILABLE').length,
    resolvedIssues: incidents.filter(i => (i.type === 'Room' || i.type === 'Equipment') && (i.status === 'RESOLVED' || i.status === 'CLOSED')).length,
  };

  const getRoomLocationName = (locId: string) => locations.find(l => l.id === locId)?.name || 'Unknown Location';

  return (
    <div className="p-6 h-full flex flex-col gap-6 overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Smart Room & Equipment</h1>
          <p className="text-slate-400 mt-1">Manage physical resources, resolve allocation conflicts, and handle equipment failures.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4 bg-[#101010]/80 border-[#252525]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
              <DoorOpen className="text-red-400" size={18} />
            </div>
            <span className="text-sm font-medium text-slate-400">Room Issues</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.activeRoomIssues}</div>
        </Card>
        
        <Card className="p-4 bg-[#101010]/80 border-[#252525]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <Monitor className="text-orange-400" size={18} />
            </div>
            <span className="text-sm font-medium text-slate-400">Equipment Issues</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.activeEquipmentIssues}</div>
        </Card>

        <Card className="p-4 bg-[#101010]/80 border-[#252525]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <DoorOpen className="text-emerald-400" size={18} />
            </div>
            <span className="text-sm font-medium text-slate-400">Available Rooms</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.availableRooms}</div>
        </Card>

        <Card className="p-4 bg-[#101010]/80 border-[#252525]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Cpu className="text-emerald-400" size={18} />
            </div>
            <span className="text-sm font-medium text-slate-400">Available Equipment</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.availableEquipment}</div>
        </Card>

        <Card className="p-4 bg-[#101010]/80 border-[#252525]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <CheckCircle className="text-blue-400" size={18} />
            </div>
            <span className="text-sm font-medium text-slate-400">Resolved Today</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.resolvedIssues}</div>
        </Card>
      </div>

      <div className="flex gap-4 border-b border-[#252525]">
        <button
          onClick={() => setActiveTab('ISSUES')}
          className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === 'ISSUES' ? 'border-[#7B2CFF] text-[#9B5CFF]' : 'border-transparent text-slate-400 hover:text-white'}`}
        >
          Active Issues & AI Recommendations
        </button>
        <button
          onClick={() => setActiveTab('ROOMS')}
          className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === 'ROOMS' ? 'border-[#7B2CFF] text-[#9B5CFF]' : 'border-transparent text-slate-400 hover:text-white'}`}
        >
          Room Inventory
        </button>
        <button
          onClick={() => setActiveTab('EQUIPMENT')}
          className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === 'EQUIPMENT' ? 'border-[#7B2CFF] text-[#9B5CFF]' : 'border-transparent text-slate-400 hover:text-white'}`}
        >
          Equipment Inventory
        </button>
      </div>

      {activeTab === 'ISSUES' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {roomEqIncidents.length === 0 ? (
            <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-500">
              <CheckCircle size={48} className="mb-4 text-[#252525]" />
              <p>No active room or equipment issues.</p>
            </div>
          ) : (
            roomEqIncidents.map(incident => (
              <Card key={incident.id} className="bg-[#101010]/90 border-[#252525] p-5 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${incident.priority === 'CRITICAL' || incident.priority === 'HIGH' ? 'bg-red-500/20 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-orange-500/20 text-orange-400'}`}>
                      <AlertTriangle size={20} />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold flex items-center gap-2">
                        {incident.title}
                        <Badge variant={incident.priority === 'CRITICAL' || incident.priority === 'HIGH' ? 'critical' : 'warning'}>{incident.priority}</Badge>
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">{getRoomLocationName(incident.locationId)} • {formatDistanceToNow(parseISO(incident.reportedTime))} ago</p>
                    </div>
                  </div>
                </div>
                
                <div className="text-sm text-[#B8B8B8] mb-6 p-3 bg-[#000000]/50 rounded-lg border border-[#252525]">
                  {incident.description}
                  {incident.peopleAffected > 0 && (
                    <div className="flex items-center gap-1 text-xs text-orange-400 mt-2">
                      <Users size={12} /> {incident.peopleAffected} students affected
                    </div>
                  )}
                </div>

                <div className="mt-auto bg-[#7B2CFF]/5 border border-[#7B2CFF]/20 rounded-xl p-4 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#7B2CFF]"></div>
                  <div className="flex items-center gap-2 mb-3">
                    <Zap size={16} className="text-[#9B5CFF]" />
                    <span className="text-sm font-semibold text-[#9B5CFF]">AI Recommendation</span>
                  </div>
                  
                  {incident.type === 'Room' ? (
                    (() => {
                      const altRoom = rooms.find(r => r.status === 'AVAILABLE' && r.capacity >= incident.peopleAffected);
                      return altRoom ? (
                        <>
                          <p className="text-white text-sm mb-3">Move the class to <strong className="text-white">{altRoom.number}</strong> in {getRoomLocationName(altRoom.locationId)}</p>
                          <ul className="text-xs text-slate-400 space-y-1 mb-4">
                            <li className="flex items-center gap-2">✓ Capacity: {altRoom.capacity} students</li>
                            <li className="flex items-center gap-2">✓ Features: {altRoom.features.join(', ')}</li>
                            <li className="flex items-center gap-2">✓ No schedule conflict</li>
                          </ul>
                          <div className="flex gap-2">
                            <button onClick={() => resolveRoomIssue(incident.id, altRoom.id)} className="px-4 py-2 bg-[#7B2CFF] hover:bg-[#6030A0] text-white text-sm font-medium rounded-lg transition-colors">
                              Assign Room
                            </button>
                            <button onClick={() => setCurrentView('map')} className="px-4 py-2 bg-[#252525] hover:bg-[#333333] text-white text-sm font-medium rounded-lg border border-[#333333] transition-colors">
                              View on Map
                            </button>
                          </div>
                        </>
                      ) : (
                        <p className="text-sm text-slate-400">No suitable rooms available. Please check manually.</p>
                      );
                    })()
                  ) : (
                    (() => {
                      const altEquip = equipment.find(e => e.status === 'AVAILABLE' && incident.title.includes(e.category));
                      return altEquip ? (
                        <>
                          <p className="text-white text-sm mb-3">Replace with <strong className="text-white">{altEquip.name}</strong></p>
                          <ul className="text-xs text-slate-400 space-y-1 mb-4">
                            <li className="flex items-center gap-2">✓ Status: Available in Storage</li>
                            <li className="flex items-center gap-2">✓ Compatibility: Verified</li>
                          </ul>
                          <div className="flex gap-2">
                            <button onClick={() => resolveEquipmentIssue(incident.id, altEquip.id)} className="px-4 py-2 bg-[#7B2CFF] hover:bg-[#6030A0] text-white text-sm font-medium rounded-lg transition-colors">
                              Assign Equipment
                            </button>
                          </div>
                        </>
                      ) : (
                        <p className="text-sm text-slate-400">No matching equipment found in inventory.</p>
                      );
                    })()
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {activeTab === 'ROOMS' && (
        <div className="bg-[#101010]/80 border border-[#252525] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#252525] flex justify-between items-center">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder="Search rooms..." 
                className="w-full bg-[#000000]/50 border border-[#252525] rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#7B2CFF]/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Badge variant="success">Available</Badge>
              <Badge variant="warning">In Use</Badge>
              <Badge variant="critical">Maintenance</Badge>
            </div>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-[#000000]/40 text-slate-400 border-b border-[#252525]">
              <tr>
                <th className="px-6 py-3 font-medium">Room</th>
                <th className="px-6 py-3 font-medium">Location</th>
                <th className="px-6 py-3 font-medium">Capacity</th>
                <th className="px-6 py-3 font-medium">Features</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252525]">
              {rooms.filter(r => r.number.toLowerCase().includes(searchQuery.toLowerCase()) || r.department.toLowerCase().includes(searchQuery.toLowerCase())).map(room => (
                <tr key={room.id} className="hover:bg-[#252525]/20 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{room.number}</td>
                  <td className="px-6 py-4 text-slate-400">{getRoomLocationName(room.locationId)}</td>
                  <td className="px-6 py-4 text-slate-400">{room.capacity}</td>
                  <td className="px-6 py-4 text-slate-400">{room.features.join(', ')}</td>
                  <td className="px-6 py-4">
                    <Badge variant={room.status === 'AVAILABLE' ? 'success' : room.status === 'IN_USE' ? 'warning' : 'critical'}>
                      {room.status.replace('_', ' ')}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'EQUIPMENT' && (
        <div className="bg-[#101010]/80 border border-[#252525] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#252525] flex justify-between items-center">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder="Search equipment..." 
                className="w-full bg-[#000000]/50 border border-[#252525] rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#7B2CFF]/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Badge variant="success">Available</Badge>
              <Badge variant="warning">In Use</Badge>
              <Badge variant="critical">Faulty</Badge>
            </div>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-[#000000]/40 text-slate-400 border-b border-[#252525]">
              <tr>
                <th className="px-6 py-3 font-medium">Equipment Name</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Current Location</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252525]">
              {equipment.filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase()) || e.category.toLowerCase().includes(searchQuery.toLowerCase())).map(eq => (
                <tr key={eq.id} className="hover:bg-[#252525]/20 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{eq.name}</td>
                  <td className="px-6 py-4 text-slate-400">{eq.category}</td>
                  <td className="px-6 py-4 text-slate-400">
                    {eq.roomId ? rooms.find(r => r.id === eq.roomId)?.number || eq.roomId : 'Storage / Unassigned'}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={eq.status === 'AVAILABLE' ? 'success' : eq.status === 'IN_USE' ? 'warning' : eq.status === 'FAULTY' ? 'critical' : 'default'}>
                      {eq.status.replace('_', ' ')}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
