import { Location, Resource, Incident, Notification, Route, Room, Equipment } from './types';
import { subMinutes, formatISO } from 'date-fns';

export const mockLocations: Location[] = [
  { id: 'loc_cse', name: 'CSE Department', type: 'ACADEMIC', x: 25, y: 30, width: 15, height: 12, description: 'Computer Science & Engineering. Labs on 1st & 2nd floor.' },
  { id: 'loc_it', name: 'IT Department', type: 'ACADEMIC', x: 45, y: 30, width: 12, height: 12, description: 'Information Technology. Server rooms on ground floor.' },
  { id: 'loc_mech', name: 'Mechanical Engineering', type: 'ACADEMIC', x: 20, y: 55, width: 18, height: 15, description: 'Workshops and heavy machinery labs.' },
  { id: 'loc_elec', name: 'Electrical Engineering', type: 'ACADEMIC', x: 45, y: 55, width: 15, height: 12, description: 'Circuits and Robotics labs.' },
  { id: 'loc_bba', name: 'BBA Department', type: 'ACADEMIC', x: 75, y: 35, width: 12, height: 15, description: 'Bachelor of Business Administration.' },
  { id: 'loc_mba', name: 'MBA Department', type: 'ACADEMIC', x: 75, y: 55, width: 14, height: 15, description: 'Master of Business Administration. Seminar halls on top floor.' },
  { id: 'loc_audi', name: 'Auditorium', type: 'FACILITY', x: 50, y: 80, width: 25, height: 15, description: 'Main campus auditorium. Capacity: 1500.' },
  { id: 'loc_canteen', name: 'Canteen', type: 'FOOD', x: 80, y: 80, width: 12, height: 10, description: 'Student cafeteria and dining area.' },
  { id: 'loc_gate_main', name: 'Main Gate', type: 'GATE', x: 50, y: 95, width: 10, height: 5, description: 'Primary campus entrance and security checkpoint.' },
];

export const mockRooms: Room[] = [
  { id: 'rm_cse_204', number: 'CSE-204', locationId: 'loc_cse', capacity: 60, department: 'Computer Science', features: ['Projector', 'Smart Board'], status: 'IN_USE' },
  { id: 'rm_cse_301', number: 'CSE-301', locationId: 'loc_cse', capacity: 60, department: 'Computer Science', features: ['Projector'], status: 'AVAILABLE' },
  { id: 'rm_cse_lab1', number: 'Lab-1', locationId: 'loc_cse', capacity: 40, department: 'Computer Science', features: ['Computers', 'Projector'], status: 'AVAILABLE' },
  { id: 'rm_it_server', number: 'Server Room', locationId: 'loc_it', capacity: 5, department: 'Information Technology', features: ['Cooling', 'Servers', 'UPS'], status: 'IN_USE' },
  { id: 'rm_it_labA', number: 'Networking Lab A', locationId: 'loc_it', capacity: 35, department: 'Information Technology', features: ['Computers', 'Routers', 'Projector'], status: 'AVAILABLE' },
  { id: 'rm_mech_101', number: 'ME-101', locationId: 'loc_mech', capacity: 80, department: 'Mechanical', features: ['Projector', 'Machinery'], status: 'IN_USE' },
  { id: 'rm_mech_workshop', number: 'Workshop-1', locationId: 'loc_mech', capacity: 100, department: 'Mechanical', features: ['Heavy Machinery', 'Safety Gear'], status: 'MAINTENANCE' },
  { id: 'rm_elec_circuits', number: 'Circuits Lab', locationId: 'loc_elec', capacity: 30, department: 'Electrical', features: ['Oscilloscopes', 'Multimeters', 'Soldering Stations'], status: 'AVAILABLE' },
  { id: 'rm_elec_robotics', number: 'Robotics Lab', locationId: 'loc_elec', capacity: 25, department: 'Electrical', features: ['3D Printers', 'Microcontrollers', 'Smart Board'], status: 'IN_USE' },
  { id: 'rm_bba_lec1', number: 'BBA-L1', locationId: 'loc_bba', capacity: 120, department: 'BBA', features: ['Projector', 'Microphone', 'Tiered Seating'], status: 'AVAILABLE' },
  { id: 'rm_mba_sem1', number: 'Seminar Hall 1', locationId: 'loc_mba', capacity: 150, department: 'MBA', features: ['Projector', 'Smart Board', 'Video Conferencing', 'Speaker System'], status: 'IN_USE' },
  { id: 'rm_audi_main', number: 'Main Hall', locationId: 'loc_audi', capacity: 1500, department: 'General', features: ['Projector', 'Microphone', 'Speaker'], status: 'MAINTENANCE' },
  { id: 'rm_canteen_dining', number: 'Main Dining', locationId: 'loc_canteen', capacity: 300, department: 'Facilities', features: ['Tables', 'Vending Machines', 'Microwaves'], status: 'AVAILABLE' },
];

export const mockEquipment: Equipment[] = [
  { id: 'eq_proj_1', name: 'Epson Projector A1', category: 'Projector', status: 'FAULTY', roomId: 'rm_cse_204' },
  { id: 'eq_proj_2', name: 'Sony Projector B2', category: 'Projector', status: 'AVAILABLE', roomId: 'rm_cse_301' },
  { id: 'eq_proj_3', name: 'Panasonic 4K Projector', category: 'Projector', status: 'IN_USE', roomId: 'rm_mba_sem1' },
  { id: 'eq_proj_4', name: 'Portable Projector Mini', category: 'Projector', status: 'AVAILABLE', roomId: null },
  { id: 'eq_mic_1', name: 'Wireless Mic 01', category: 'Microphone', status: 'FAULTY', roomId: 'rm_audi_main' },
  { id: 'eq_mic_2', name: 'Wireless Mic 02', category: 'Microphone', status: 'AVAILABLE', roomId: null },
  { id: 'eq_mic_3', name: 'Lavalier Mic', category: 'Microphone', status: 'IN_USE', roomId: 'rm_bba_lec1' },
  { id: 'eq_mic_4', name: 'Podium Mic System', category: 'Microphone', status: 'AVAILABLE', roomId: 'rm_mba_sem1' },
  { id: 'eq_pc_batch', name: 'Lab PC Batch 1 (x40)', category: 'Computer', status: 'AVAILABLE', roomId: 'rm_cse_lab1' },
  { id: 'eq_pc_server', name: 'Main Database Server', category: 'Computer', status: 'IN_USE', roomId: 'rm_it_server' },
  { id: 'eq_net_switch', name: 'Cisco 48-Port Switch', category: 'Networking', status: 'AVAILABLE', roomId: 'rm_it_labA' },
  { id: 'eq_smartboard_1', name: 'Samsung Interactive Board', category: 'Smart Board', status: 'IN_USE', roomId: 'rm_cse_204' },
  { id: 'eq_smartboard_2', name: 'LG Interactive Board', category: 'Smart Board', status: 'AVAILABLE', roomId: 'rm_elec_robotics' },
  { id: 'eq_osc_1', name: 'Tektronix Oscilloscope x10', category: 'Lab Equipment', status: 'AVAILABLE', roomId: 'rm_elec_circuits' },
  { id: 'eq_3d_printer', name: 'Prusa i3 MK3S+', category: 'Lab Equipment', status: 'FAULTY', roomId: 'rm_elec_robotics' },
  { id: 'eq_machinery_1', name: 'CNC Lathe Machine', category: 'Machinery', status: 'MAINTENANCE', roomId: 'rm_mech_workshop' },
  { id: 'eq_camera_1', name: 'Logitech PTZ Pro', category: 'Video Conferencing', status: 'IN_USE', roomId: 'rm_mba_sem1' },
  { id: 'eq_speakers_1', name: 'Yamaha PA System', category: 'Speaker', status: 'AVAILABLE', roomId: 'rm_audi_main' },
];

export const mockResources: Resource[] = [
  { id: 'res_med_1', name: 'Medical Team Alpha', type: 'MEDICAL', status: 'AVAILABLE', locationId: 'loc_audi' },
  { id: 'res_sec_1', name: 'Security Team 1', type: 'SECURITY', status: 'BUSY', locationId: 'loc_cse', assignedIncidentId: 'inc_1' },
  { id: 'res_sec_2', name: 'Security Team 2', type: 'SECURITY', status: 'AVAILABLE', locationId: 'loc_gate_main' },
];

const now = new Date();

export const mockIncidents: Incident[] = [
  {
    id: 'inc_eq_1',
    title: 'Projector Failure',
    type: 'Equipment',
    priority: 'HIGH',
    status: 'NEW',
    locationId: 'loc_cse',
    resourceId: null,
    reportedTime: formatISO(subMinutes(now, 5)),
    peopleAffected: 60,
    description: 'Projector unavailable in Room CSE-204 during an ongoing lecture.',
  },
  {
    id: 'inc_rm_1',
    title: 'Auditorium Maintenance',
    type: 'Room',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    locationId: 'loc_audi',
    resourceId: 'res_sec_2',
    reportedTime: formatISO(subMinutes(now, 60)),
    peopleAffected: 0,
    description: 'AC unit leaking in Main Hall. Room marked as maintenance.',
  },
  {
    id: 'inc_1',
    title: 'Unauthorized Access',
    type: 'Security Breach',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    locationId: 'loc_cse',
    resourceId: 'res_sec_1',
    reportedTime: formatISO(subMinutes(now, 15)),
    peopleAffected: 0,
    description: 'Suspicious individual reported entering the CSE block.',
  },
  {
    id: 'inc_2',
    title: 'Medical Emergency',
    type: 'Health',
    priority: 'CRITICAL',
    status: 'NEW',
    locationId: 'loc_mech',
    resourceId: null,
    reportedTime: formatISO(subMinutes(now, 2)),
    peopleAffected: 1,
    description: 'Student injured in the mechanical workshop.',
  }
];

export const mockNotifications: Notification[] = [
  { id: 'notif_1', title: 'Critical Incident', message: 'Medical emergency reported at Sports Ground.', time: formatISO(subMinutes(now, 2)), type: 'ALERT' },
  { id: 'notif_2', title: 'Resource Alert', message: 'Medical Team Beta is unavailable.', time: formatISO(subMinutes(now, 5)), type: 'WARNING' },
  { id: 'notif_3', title: 'Status Update', message: 'Network Outage at CS Block is IN_PROGRESS.', time: formatISO(subMinutes(now, 45)), type: 'INFO' },
  { id: 'notif_4', title: 'Resolved', message: 'Fire Alarm at Cafeteria resolved.', time: formatISO(subMinutes(now, 120)), type: 'SUCCESS' },
];

// Helper to simulate a route
export function calculateMockRoute(fromId: string, toId: string): Route {
  const from = mockLocations.find(l => l.id === fromId)!;
  const to = mockLocations.find(l => l.id === toId)!;
  
  // Very rough distance calculation for dummy purposes
  const dx = Math.abs(from.x - to.x);
  const dy = Math.abs(from.y - to.y);
  const distance = Math.round(Math.sqrt(dx * dx + dy * dy) * 15); // scaled arbitrary distance
  const eta = Math.max(1, Math.round(distance / 80)); // rough walking speed

  return {
    fromId,
    toId,
    distance,
    eta,
    path: [fromId, toId] // simple direct path for dummy data
  };
}
