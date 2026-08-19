import React, { createContext, useContext, useState } from 'react';
import { Incident, Resource, Location, Notification, Room, Equipment, Route } from '../types';
import { mockIncidents as initialIncidents, mockResources as initialResources, mockLocations as initialLocations, mockNotifications as initialNotifications, mockRooms as initialRooms, mockEquipment as initialEquipment, calculateMockRoute } from '../mockData';

interface AppState {
  currentView: 'dashboard' | 'incidents' | 'map' | 'resources' | 'notifications' | 'student' | 'facilities' | 'analytics' | 'settings';
  incidents: Incident[];
  resources: Resource[];
  locations: Location[];
  notifications: Notification[];
  rooms: Room[];
  equipment: Equipment[];
  selectedIncidentId: string | null;
  selectedResourceId: string | null;
  activeRoute: Route | null;
  
  setCurrentView: (view: AppState['currentView']) => void;
  setSelectedIncidentId: (id: string | null) => void;
  setSelectedResourceId: (id: string | null) => void;
  setActiveRoute: (route: Route | null) => void;
  
  assignResource: (incidentId: string, resourceId: string) => void;
  updateIncidentStatus: (incidentId: string, status: Incident['status']) => void;
  generateRouteForIncident: (incidentId: string) => void;
  
  createSOSIncident: (lat: number, lng: number) => string;
  cancelIncident: (incidentId: string) => void;

  resolveRoomIssue: (incidentId: string, newRoomId: string) => void;
  resolveEquipmentIssue: (incidentId: string, newEquipmentId: string) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentView, setCurrentView] = useState<AppState['currentView']>('dashboard');
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [locations, setLocations] = useState<Location[]>(initialLocations);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [equipment, setEquipment] = useState<Equipment[]>(initialEquipment);
  
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);
  const [activeRoute, setActiveRoute] = useState<Route | null>(null);

  const createSOSIncident = (lat: number, lng: number) => {
    const locId = `loc_sos_${Date.now()}`;
    const newLoc: Location = {
      id: locId,
      name: `GPS: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      type: 'OPEN_SPACE',
      x: 45 + (Math.random() * 10 - 5),
      y: 50 + (Math.random() * 10 - 5),
    };
    setLocations(prev => [...prev, newLoc]);

    const incidentId = `inc_sos_${Date.now()}`;
    const newIncident: Incident = {
      id: incidentId,
      title: 'Emergency SOS',
      type: 'Medical/Security',
      priority: 'CRITICAL',
      status: 'NEW',
      locationId: locId,
      reportedTime: new Date().toISOString(),
      peopleAffected: 1,
      description: 'Student (STU-8492 - Alex Johnson) initiated SOS from mobile device. Immediate response required.',
    };
    setIncidents(prev => [newIncident, ...prev]);

    setNotifications(prev => [{
      id: `notif_${Date.now()}`,
      title: 'CRITICAL: SOS Activated',
      message: 'A student has triggered an SOS alarm.',
      time: new Date().toISOString(),
      type: 'ALERT'
    }, ...prev]);

    return incidentId;
  };

  const cancelIncident = (incidentId: string) => {
    setIncidents(prev => prev.filter(i => i.id !== incidentId));
    setNotifications(prev => [{
      id: `notif_${Date.now()}`,
      title: 'SOS Cancelled',
      message: 'The SOS alarm was cancelled by the user.',
      time: new Date().toISOString(),
      type: 'INFO'
    }, ...prev]);
  };

  const resolveRoomIssue = (incidentId: string, newRoomId: string) => {
    const incident = incidents.find(i => i.id === incidentId);
    const room = rooms.find(r => r.id === newRoomId);
    if (!incident || !room) return;

    setRooms(prev => prev.map(r => r.id === newRoomId ? { ...r, status: 'IN_USE' } : r));
    updateIncidentStatus(incidentId, 'RESOLVED');

    setNotifications(prev => [{
      id: `notif_${Date.now()}`,
      title: 'Room Changed',
      message: `Class moved to ${room.number}. Issue resolved.`,
      time: new Date().toISOString(),
      type: 'INFO'
    }, ...prev]);
  };

  const resolveEquipmentIssue = (incidentId: string, newEquipmentId: string) => {
    const incident = incidents.find(i => i.id === incidentId);
    const equip = equipment.find(e => e.id === newEquipmentId);
    if (!incident || !equip) return;

    setEquipment(prev => prev.map(e => e.id === newEquipmentId ? { ...e, status: 'IN_USE' } : e));
    updateIncidentStatus(incidentId, 'RESOLVED');

    setNotifications(prev => [{
      id: `notif_${Date.now()}`,
      title: 'Equipment Replaced',
      message: `${equip.name} has been assigned to resolve the issue.`,
      time: new Date().toISOString(),
      type: 'INFO'
    }, ...prev]);
  };

  const assignResource = (incidentId: string, resourceId: string) => {
    setIncidents(prev => prev.map(inc => inc.id === incidentId ? { ...inc, resourceId } : inc));
    setResources(prev => prev.map(res => {
      // Free up old resource if any, assign new
      if (res.id === resourceId) return { ...res, status: 'BUSY', assignedIncidentId: incidentId };
      if (res.assignedIncidentId === incidentId) return { ...res, status: 'AVAILABLE', assignedIncidentId: null };
      return res;
    }));
    generateRouteForIncident(incidentId);
    
    // Add notification
    const resName = resources.find(r => r.id === resourceId)?.name || 'Resource';
    setNotifications(prev => [{
      id: `notif_${Date.now()}`,
      title: 'Resource Assigned',
      message: `${resName} assigned to incident.`,
      time: new Date().toISOString(),
      type: 'INFO'
    }, ...prev]);
  };

  const updateIncidentStatus = (incidentId: string, status: Incident['status']) => {
    setIncidents(prev => prev.map(inc => inc.id === incidentId ? { ...inc, status } : inc));
    if (status === 'RESOLVED' || status === 'CLOSED') {
      // Free up resources
      setResources(prev => prev.map(res => res.assignedIncidentId === incidentId ? { ...res, status: 'AVAILABLE', assignedIncidentId: null } : res));
      if (selectedIncidentId === incidentId) setActiveRoute(null);
    }
  };

  const generateRouteForIncident = (incidentId: string) => {
    const incident = incidents.find(i => i.id === incidentId);
    if (!incident) return;
    
    // If it has a resource, route from resource to incident
    if (incident.resourceId) {
      const resource = resources.find(r => r.id === incident.resourceId);
      if (resource) {
        const route = calculateMockRoute(resource.locationId, incident.locationId);
        setActiveRoute(route);
        return;
      }
    }
    
    // Else recommend nearest available resource
    const availableResources = resources.filter(r => r.status === 'AVAILABLE');
    if (availableResources.length > 0) {
      const incidentLoc = locations.find(l => l.id === incident.locationId);
      if (incidentLoc) {
        // Find closest
        let closest = availableResources[0];
        let minDistance = Infinity;
        availableResources.forEach(res => {
          const resLoc = locations.find(l => l.id === res.locationId);
          if (resLoc) {
            const dx = resLoc.x - incidentLoc.x;
            const dy = resLoc.y - incidentLoc.y;
            const dist = dx * dx + dy * dy;
            if (dist < minDistance) {
              minDistance = dist;
              closest = res;
            }
          }
        });
        
        const route = calculateMockRoute(closest.locationId, incident.locationId);
        setActiveRoute(route);
      }
    } else {
      setActiveRoute(null);
    }
  };

  const value = {
    currentView,
    incidents,
    resources,
    locations,
    notifications,
    rooms,
    equipment,
    selectedIncidentId,
    selectedResourceId,
    activeRoute,
    setCurrentView,
    setSelectedIncidentId,
    setSelectedResourceId,
    setActiveRoute,
    assignResource,
    updateIncidentStatus,
    generateRouteForIncident,
    createSOSIncident,
    cancelIncident,
    resolveRoomIssue,
    resolveEquipmentIssue,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
