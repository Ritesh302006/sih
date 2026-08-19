import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { useAppContext } from '../../store/AppContext';
import { Location, Priority } from '../../types';
import { MapPin, ShieldCheck, AlertTriangle, Crosshair, Navigation, Search, GraduationCap, Coffee, Mic, DoorOpen, Trees, RefreshCw, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';

export function CampusMap() {
  const { locations, incidents, resources, selectedIncidentId, activeRoute, setSelectedIncidentId, setCurrentView, generateRouteForIncident } = useAppContext();
  const [zoom, setZoom] = useState(1.5); // Default slightly zoomed in
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMapLocationId, setSelectedMapLocationId] = useState<string | null>(null);
  const [isMyLocationActive, setIsMyLocationActive] = useState(false);

  // My location (simulated near the gate)
  const myLocation = { x: 55, y: 85 };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-[#DC2626] shadow-[0_0_15px_rgba(220,38,38,0.8)]';
      case 'HIGH': return 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.6)]';
      case 'MEDIUM': return 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]';
      case 'LOW': return 'bg-emerald-500';
      default: return 'bg-[#252525]';
    }
  };

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'ACADEMIC': return <GraduationCap size={14} className="text-[#9B5CFF]" />;
      case 'FOOD': return <Coffee size={14} className="text-[#9B5CFF]" />;
      case 'FACILITY': return <Mic size={14} className="text-[#9B5CFF]" />;
      case 'GATE': return <DoorOpen size={14} className="text-[#9B5CFF]" />;
      case 'OPEN_SPACE': return <Trees size={14} className="text-[#9B5CFF]" />;
      default: return <MapPin size={14} className="text-[#9B5CFF]" />;
    }
  };

  const filteredLocations = useMemo(() => {
    if (!searchQuery) return locations;
    return locations.filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [locations, searchQuery]);

  // SVG route path string for active incident route
  const activeIncidentRoutePath = useMemo(() => {
    if (!activeRoute || activeRoute.path.length < 2) return null;
    const points = activeRoute.path.map(id => {
      const loc = locations.find(l => l.id === id);
      return loc ? `${loc.x},${loc.y}` : null;
    }).filter(Boolean);
    
    if (points.length < 2) return null;
    return `M ${points.join(' L ')}`;
  }, [activeRoute, locations]);

  // SVG route path for user navigation
  const userRoutePath = useMemo(() => {
    if (!isMyLocationActive || !selectedMapLocationId) return null;
    const targetLoc = locations.find(l => l.id === selectedMapLocationId);
    if (!targetLoc) return null;
    return `M ${myLocation.x},${myLocation.y} L ${targetLoc.x},${targetLoc.y}`;
  }, [isMyLocationActive, selectedMapLocationId, locations]);


  const selectedIncident = incidents.find(i => i.id === selectedIncidentId);
  const selectedLocation = selectedMapLocationId ? locations.find(l => l.id === selectedMapLocationId) : (selectedIncident ? locations.find(l => l.id === selectedIncident.locationId) : null);

  const handleLocationClick = (locId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const incidentForLoc = incidents.find(i => i.locationId === locId && i.status !== 'RESOLVED' && i.status !== 'CLOSED');
    if (incidentForLoc) {
      setSelectedIncidentId(incidentForLoc.id);
      setSelectedMapLocationId(null);
    } else {
      setSelectedMapLocationId(locId);
      setSelectedIncidentId(null);
    }
  };

  const resetMap = () => {
    setZoom(1.5);
    setSearchQuery('');
    setSelectedIncidentId(null);
    setSelectedMapLocationId(null);
    setIsMyLocationActive(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] gap-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Campus Map</h2>
          <p className="text-[#B8B8B8] text-sm">Interactive campus navigation & resource tracking</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <Input 
            placeholder="Search departments, canteens..." 
            className="pl-9 bg-[#101010] border-[#252525] focus:border-[#7B2CFF]"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-1 gap-4 overflow-hidden flex-col lg:flex-row">
        {/* Main Map Area */}
        <Card className="flex-1 relative overflow-hidden flex flex-col border-[#252525] bg-[#000000]">
          {/* Map controls */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 bg-[#101010]/90 p-2 rounded-lg border border-[#252525] backdrop-blur-md shadow-lg">
            <button className="p-2 hover:bg-[#252525] rounded text-white transition-colors tooltip" title="Zoom In" onClick={() => setZoom(z => Math.min(z + 0.5, 4))}>+</button>
            <button className="p-2 hover:bg-[#252525] rounded text-white transition-colors tooltip" title="Zoom Out" onClick={() => setZoom(z => Math.max(z - 0.5, 0.5))}>-</button>
            <button className={`p-2 rounded transition-colors ${isMyLocationActive ? 'bg-[#7B2CFF] text-white' : 'hover:bg-[#252525] text-white'}`} title="My Location" onClick={() => setIsMyLocationActive(!isMyLocationActive)}><Crosshair size={16}/></button>
            <button className="p-2 hover:bg-[#252525] rounded text-white transition-colors tooltip" title="Reset Map" onClick={resetMap}><RefreshCw size={16}/></button>
          </div>

          <div 
            className="flex-1 relative overflow-auto hide-scrollbar cursor-grab active:cursor-grabbing bg-[#050505]"
            onClick={() => { setSelectedIncidentId(null); setSelectedMapLocationId(null); }}
          >
            <div 
              className="absolute inset-0 transition-transform duration-300 origin-center"
              style={{ transform: `scale(${zoom})`, width: '100%', height: '100%', minWidth: '1000px', minHeight: '800px' }}
            >
              {/* Grid Background */}
              <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#7B2CFF 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

              {/* 2D Map Paths (Corridors/Roads) */}
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none z-0" preserveAspectRatio="none">
                 <path d="M 50,95 L 50,30 M 50,80 L 80,80 M 50,30 L 25,30 M 50,55 L 20,55 M 50,55 L 75,55" fill="none" stroke="#252525" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                 <path d="M 50,95 L 50,30 M 50,80 L 80,80 M 50,30 L 25,30 M 50,55 L 20,55 M 50,55 L 75,55" fill="none" stroke="#101010" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

              {/* Route SVGs */}
              {(activeIncidentRoutePath || userRoutePath) && (
                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible" preserveAspectRatio="none">
                  {activeIncidentRoutePath && (
                    <path d={activeIncidentRoutePath} fill="none" stroke="currentColor" className="text-cyan-400 opacity-60" strokeWidth="0.5" strokeDasharray="1 1">
                      <animate attributeName="stroke-dashoffset" values="2;0" dur="1s" repeatCount="indefinite" />
                    </path>
                  )}
                  {userRoutePath && (
                    <path d={userRoutePath} fill="none" stroke="currentColor" className="text-[#9B5CFF] opacity-80" strokeWidth="0.6" strokeDasharray="1.5 1.5">
                      <animate attributeName="stroke-dashoffset" values="3;0" dur="1s" repeatCount="indefinite" />
                    </path>
                  )}
                </svg>
              )}

              {/* My Location Marker */}
              {isMyLocationActive && (
                 <div
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center z-30"
                    style={{ left: `${myLocation.x}%`, top: `${myLocation.y}%` }}
                  >
                    <div className="w-4 h-4 rounded-full bg-[#7B2CFF] border-2 border-white shadow-[0_0_15px_rgba(123,44,255,0.8)] relative flex items-center justify-center">
                       <div className="absolute inset-0 rounded-full bg-[#7B2CFF] animate-ping opacity-50"></div>
                    </div>
                    <div className="absolute top-full mt-1 bg-[#101010] text-[10px] px-2 py-0.5 rounded whitespace-nowrap border border-[#252525] text-[#9B5CFF] font-medium">
                      You are here
                    </div>
                  </div>
              )}

              {/* Locations */}
              {filteredLocations.map(loc => {
                const isSelectedLoc = selectedLocation?.id === loc.id;
                const locIncidents = incidents.filter(i => i.locationId === loc.id && i.status !== 'RESOLVED' && i.status !== 'CLOSED');
                const hasIncident = locIncidents.length > 0;
                const highestPriorityIncident = hasIncident ? locIncidents.reduce((prev, current) => 
                  (current.priority === 'CRITICAL' || (current.priority === 'HIGH' && prev.priority !== 'CRITICAL')) ? current : prev
                , locIncidents[0]) : null;

                const hasResource = resources.some(r => r.locationId === loc.id && r.status === 'AVAILABLE');

                return (
                  <div
                    key={loc.id}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center transition-all z-20 group cursor-pointer ${!hasIncident && !isSelectedLoc && searchQuery && !loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ? 'opacity-20' : 'opacity-100'}`}
                    style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                    onClick={(e) => handleLocationClick(loc.id, e)}
                  >
                    {/* 2D Building Shape */}
                    {loc.width && loc.height && !hasIncident && (
                       <div 
                         className={`absolute -z-10 rounded border transition-colors duration-300 backdrop-blur-sm flex items-center justify-center overflow-hidden
                           ${isSelectedLoc ? 'bg-[#7B2CFF]/20 border-[#7B2CFF] shadow-[0_0_20px_rgba(123,44,255,0.3)]' : 
                             loc.type === 'ACADEMIC' ? 'bg-[#7B2CFF]/10 border-[#7B2CFF]/30' : 
                             loc.type === 'FOOD' ? 'bg-orange-500/10 border-orange-500/30' : 
                             'bg-[#101010]/80 border-[#252525]'}`}
                         style={{ width: `${loc.width * 8}px`, height: `${loc.height * 8}px` }}
                       >
                          <span className="text-[10px] font-bold text-white/10 uppercase tracking-widest rotate-[-15deg] whitespace-nowrap pointer-events-none">
                            {loc.type}
                          </span>
                       </div>
                    )}

                    {/* Location icon/marker */}
                    {hasIncident ? (
                       <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#101010] text-white animate-pulse ${getPriorityColor(highestPriorityIncident!.priority)}`}>
                         <AlertTriangle size={12} />
                       </div>
                    ) : (
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 shadow-lg ${isSelectedLoc ? 'bg-[#7B2CFF]/20 border-[#7B2CFF] text-[#9B5CFF]' : 'bg-[#101010] border-[#252525] text-[#B8B8B8] group-hover:border-[#7B2CFF]/50'}`}>
                         {getLocationIcon(loc.type)}
                       </div>
                    )}
                    
                    {/* Label - Made persistently visible for better map clarity */}
                    <div className={`absolute top-full mt-2 bg-[#101010]/80 backdrop-blur-md text-xs font-medium px-3 py-1 rounded-md whitespace-nowrap border shadow-lg transition-all ${isSelectedLoc || hasIncident ? 'opacity-100 border-[#7B2CFF] text-white bg-[#101010]' : 'opacity-100 border-[#252525]/80 text-[#B8B8B8] group-hover:border-[#7B2CFF]/50 group-hover:text-white'}`}>
                      {loc.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Info Panel */}
        {(selectedIncident || selectedMapLocationId) ? (
          <Card className="w-full lg:w-96 flex flex-col shrink-0 border-[#7B2CFF]/30 shadow-[0_0_30px_rgba(123,44,255,0.1)] bg-[#101010]">
            <CardHeader className="bg-gradient-to-b from-[#7B2CFF]/10 to-transparent border-b border-[#252525]">
              <div className="flex justify-between items-start">
                <div>
                  {selectedIncident ? (
                    <>
                      <Badge variant={selectedIncident.priority.toLowerCase() as any} className="mb-2">
                        {selectedIncident.priority} PRIORITY
                      </Badge>
                      <CardTitle className="text-xl text-white">{selectedIncident.title}</CardTitle>
                    </>
                  ) : (
                    <>
                      <Badge className="mb-2 bg-[#252525] text-[#9B5CFF] border-[#252525]">
                        {selectedLocation?.type}
                      </Badge>
                      <CardTitle className="text-xl text-white">{selectedLocation?.name}</CardTitle>
                    </>
                  )}
                </div>
                <button className="text-[#B8B8B8] hover:text-white bg-[#252525]/50 hover:bg-[#252525] p-1.5 rounded-full transition-colors" onClick={() => { setSelectedIncidentId(null); setSelectedMapLocationId(null); }}>
                  <X size={16} />
                </button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-5 space-y-6">
              
              {selectedIncident ? (
                <>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center py-2 border-b border-[#252525]">
                      <span className="text-[#B8B8B8]">Location</span>
                      <span className="font-medium text-white flex items-center gap-1">
                        <MapPin size={14} className="text-[#9B5CFF]"/>
                        {selectedLocation?.name}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-[#252525]">
                      <span className="text-[#B8B8B8]">Status</span>
                      <span className="font-medium text-white">{selectedIncident.status}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-[#252525]">
                      <span className="text-[#B8B8B8]">Affected People</span>
                      <span className="font-medium text-white">{selectedIncident.peopleAffected}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-[#B8B8B8] mb-2">Description</h4>
                    <p className="text-sm text-white bg-[#000000] p-3 rounded-lg border border-[#252525]">
                      {selectedIncident.description}
                    </p>
                  </div>

                  {/* Routing / Assignment Info */}
                  <div className="bg-[#000000]/50 rounded-xl p-4 border border-[#252525] space-y-3">
                    {selectedIncident.resourceId ? (
                      <>
                        <div className="flex items-center gap-2 text-emerald-400 mb-2">
                          <ShieldCheck size={16} />
                          <span className="text-sm font-medium">Resource Assigned</span>
                        </div>
                        <div className="text-sm text-white">
                          {resources.find(r => r.id === selectedIncident.resourceId)?.name} is responding.
                        </div>
                        {activeRoute && (
                          <div className="text-xs text-[#B8B8B8] bg-[#101010] p-2 rounded mt-2 border border-[#252525]">
                            ETA: {activeRoute.eta} mins ({activeRoute.distance}m away)
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 text-orange-400 mb-2">
                          <AlertTriangle size={16} />
                          <span className="text-sm font-medium">Unassigned</span>
                        </div>
                        {activeRoute ? (
                          <div className="space-y-3">
                            <div className="text-sm text-white">
                              Recommended Resource:<br/>
                              <span className="font-medium text-[#9B5CFF]">{resources.find(r => r.id === activeRoute.fromId)?.name}</span>
                            </div>
                            <div className="text-xs text-[#B8B8B8] flex items-center justify-between bg-[#101010] p-2 rounded border border-[#252525]">
                              <span>ETA: {activeRoute.eta} mins</span>
                              <span>Distance: {activeRoute.distance}m</span>
                            </div>
                            <Button className="w-full bg-[#7B2CFF] hover:bg-[#6030A0] text-white" size="sm" onClick={() => {
                               setCurrentView('incidents');
                            }}>Review & Assign</Button>
                          </div>
                        ) : (
                          <Button className="w-full border-[#7B2CFF] text-[#9B5CFF] hover:bg-[#7B2CFF]/10" variant="outline" size="sm" onClick={handleRouteClick}>
                            <Navigation size={14} className="mr-2" />
                            Find Nearest Resource
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center py-2 border-b border-[#252525]">
                      <span className="text-[#B8B8B8]">Coordinates</span>
                      <span className="font-mono text-white text-xs">{selectedLocation?.x}°, {selectedLocation?.y}°</span>
                    </div>
                  </div>

                  {selectedLocation?.description && (
                    <div>
                      <h4 className="text-sm font-semibold text-[#B8B8B8] mb-2">Facility Details</h4>
                      <p className="text-sm text-white bg-[#000000] p-3 rounded-lg border border-[#252525]">
                        {selectedLocation.description}
                      </p>
                    </div>
                  )}

                  <div className="pt-4 border-t border-[#252525]">
                     <Button 
                       className="w-full bg-[#7B2CFF] hover:bg-[#6030A0] text-white" 
                       onClick={() => setIsMyLocationActive(true)}
                       disabled={isMyLocationActive && !!userRoutePath}
                     >
                        <Navigation size={16} className="mr-2" />
                        {isMyLocationActive && userRoutePath ? 'Navigation Active' : 'Get Directions from My Location'}
                     </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="w-full lg:w-80 flex flex-col shrink-0 bg-[#101010] border-[#252525]">
            <CardHeader className="border-b border-[#252525] pb-4">
              <CardTitle className="text-lg text-white">Map Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm pt-4">
              <p className="text-[#B8B8B8]">Select a building or an incident marker on the map to view details and routing options.</p>
              
              <div className="space-y-3 mt-6 bg-[#000000] p-4 rounded-xl border border-[#252525]">
                <h4 className="font-medium text-white mb-2">Legend</h4>
                <div className="grid grid-cols-1 gap-3">
                   <div className="flex items-center gap-3 text-[#B8B8B8]">
                     <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#101010] border border-[#252525]">
                        <GraduationCap size={12} className="text-[#9B5CFF]"/>
                     </div>
                     <span>Academic Department</span>
                   </div>
                   <div className="flex items-center gap-3 text-[#B8B8B8]">
                     <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#101010] border border-[#252525]">
                        <Coffee size={12} className="text-[#9B5CFF]"/>
                     </div>
                     <span>Food / Canteen</span>
                   </div>
                   <div className="flex items-center gap-3 text-[#B8B8B8]">
                     <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#DC2626] border border-[#101010]">
                        <AlertTriangle size={12} className="text-white"/>
                     </div>
                     <span>Critical Incident</span>
                   </div>
                   <div className="flex items-center gap-3 text-[#B8B8B8]">
                     <div className="w-2 h-2 rounded-full bg-[#7B2CFF] shadow-[0_0_8px_rgba(123,44,255,0.8)] ml-2" />
                     <span className="ml-2">Your Location</span>
                   </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
