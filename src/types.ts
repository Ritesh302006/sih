export type Priority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type IncidentStatus = 'NEW' | 'IN_PROGRESS' | 'WAITING' | 'RESOLVED' | 'CLOSED';
export type ResourceStatus = 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE';
export type ResourceType = 'SECURITY' | 'MEDICAL' | 'MAINTENANCE' | 'IT' | 'ELECTRICAL' | 'FIRE';

export interface Location {
  id: string;
  name: string;
  type: 'ACADEMIC' | 'FACILITY' | 'FOOD' | 'GATE' | 'OPEN_SPACE' | 'ADMIN';
  x: number; // 0-100 percentage
  y: number; // 0-100 percentage
  width?: number; // For rendering 2D buildings
  height?: number; // For rendering 2D buildings
  description?: string;
}

export interface Room {
  id: string;
  number: string; // e.g. CSE-204
  locationId: string;
  capacity: number;
  department: string;
  features: string[]; // e.g. Projector, Smart Board
  status: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE';
}

export interface Equipment {
  id: string;
  name: string;
  category: 'Projector' | 'Computer' | 'Microphone' | 'Speaker' | 'Smart Board' | 'Lab Equipment' | 'Other';
  status: 'AVAILABLE' | 'IN_USE' | 'FAULTY' | 'RESERVED';
  roomId: string | null;
}

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  status: ResourceStatus;
  locationId: string;
  assignedIncidentId?: string | null;
}

export interface Incident {
  id: string;
  title: string;
  type: string;
  priority: Priority;
  status: IncidentStatus;
  locationId: string;
  resourceId?: string | null;
  reportedTime: string;
  peopleAffected: number;
  description: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'ALERT' | 'INFO' | 'WARNING' | 'SUCCESS';
}

export interface Route {
  fromId: string;
  toId: string;
  distance: number; // in meters
  eta: number; // in minutes
  path: string[]; // array of location IDs forming the route
}
