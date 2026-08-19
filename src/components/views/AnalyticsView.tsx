import React from 'react';
import { Card } from '../ui/Card';
import { useAppContext } from '../../store/AppContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend 
} from 'recharts';
import { Activity, ShieldAlert, Wrench, Users, Monitor } from 'lucide-react';
import { format, subDays, parseISO } from 'date-fns';

const COLORS = ['#7B2CFF', '#9B5CFF', '#F97316', '#EF4444', '#10B981', '#3B82F6'];

export function AnalyticsView() {
  const { incidents, equipment, resources, rooms } = useAppContext();

  // 1. Incident Status Distribution for Pie Chart
  const statusCounts = incidents.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusData = Object.keys(statusCounts).map(key => ({
    name: key.replace('_', ' '),
    value: statusCounts[key]
  }));

  // 2. Incident by Type for Bar Chart
  const typeCounts = incidents.reduce((acc, curr) => {
    acc[curr.type] = (acc[curr.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const typeData = Object.keys(typeCounts).map(key => ({
    name: key,
    count: typeCounts[key]
  }));

  // 3. Equipment Status for Pie Chart
  const eqStatusCounts = equipment.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const eqData = Object.keys(eqStatusCounts).map(key => ({
    name: key.replace('_', ' '),
    value: eqStatusCounts[key]
  }));

  // 4. Mock Historical Data for Line Chart (Last 7 days)
  const today = new Date();
  const historicalData = Array.from({ length: 7 }).map((_, i) => {
    const d = subDays(today, 6 - i);
    return {
      date: format(d, 'MMM dd'),
      incidents: Math.floor(Math.random() * 10) + 1,
      resolved: Math.floor(Math.random() * 8) + 1,
    };
  });

  return (
    <div className="p-6 h-full flex flex-col gap-6 overflow-y-auto">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">System Analytics</h1>
        <p className="text-slate-400 mt-1">Real-time data visualization of campus operations, incident trends, and resource utilization.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-[#101010]/80 border-[#252525]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Activity className="text-purple-400" size={18} />
            </div>
            <span className="text-sm font-medium text-slate-400">Total Incidents</span>
          </div>
          <div className="text-3xl font-bold text-white">{incidents.length}</div>
        </Card>
        
        <Card className="p-4 bg-[#101010]/80 border-[#252525]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
              <ShieldAlert className="text-red-400" size={18} />
            </div>
            <span className="text-sm font-medium text-slate-400">Critical Alerts</span>
          </div>
          <div className="text-3xl font-bold text-white">{incidents.filter(i => i.priority === 'CRITICAL').length}</div>
        </Card>

        <Card className="p-4 bg-[#101010]/80 border-[#252525]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <Wrench className="text-orange-400" size={18} />
            </div>
            <span className="text-sm font-medium text-slate-400">Faulty Equipment</span>
          </div>
          <div className="text-3xl font-bold text-white">{equipment.filter(e => e.status === 'FAULTY' || e.status === 'MAINTENANCE').length}</div>
        </Card>

        <Card className="p-4 bg-[#101010]/80 border-[#252525]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Users className="text-emerald-400" size={18} />
            </div>
            <span className="text-sm font-medium text-slate-400">Active Resources</span>
          </div>
          <div className="text-3xl font-bold text-white">{resources.filter(r => r.status === 'BUSY').length}</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incident Volume Trend */}
        <Card className="p-5 bg-[#101010]/90 border-[#252525]">
          <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">7-Day Incident Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#252525" vertical={false} />
                <XAxis dataKey="date" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#101010', borderColor: '#252525', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="incidents" name="New Incidents" stroke="#EF4444" strokeWidth={3} dot={{ r: 4, fill: '#EF4444', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="resolved" name="Resolved" stroke="#10B981" strokeWidth={3} dot={{ r: 4, fill: '#10B981', strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Incident Types Bar Chart */}
        <Card className="p-5 bg-[#101010]/90 border-[#252525]">
          <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">Incidents By Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typeData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#252525" horizontal={false} />
                <XAxis type="number" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} width={100} />
                <RechartsTooltip 
                  cursor={{ fill: '#252525', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: '#101010', borderColor: '#252525', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="count" name="Count" fill="#7B2CFF" radius={[0, 4, 4, 0]}>
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Incident Status Pie Chart */}
        <Card className="p-5 bg-[#101010]/90 border-[#252525]">
          <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">Incident Resolution Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {statusData.map((entry, index) => {
                    let color = '#3B82F6'; // Default
                    if (entry.name === 'NEW') color = '#EF4444';
                    if (entry.name === 'IN PROGRESS') color = '#F97316';
                    if (entry.name === 'RESOLVED') color = '#10B981';
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#101010', borderColor: '#252525', borderRadius: '8px', color: '#fff' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Equipment Status Pie Chart */}
        <Card className="p-5 bg-[#101010]/90 border-[#252525]">
          <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">Equipment Health Status</h3>
          <div className="h-64 flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={eqData}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="#101010"
                  strokeWidth={2}
                >
                  {eqData.map((entry, index) => {
                    let color = '#7B2CFF'; // Default
                    if (entry.name === 'AVAILABLE') color = '#10B981';
                    if (entry.name === 'IN USE') color = '#3B82F6';
                    if (entry.name === 'FAULTY') color = '#EF4444';
                    if (entry.name === 'MAINTENANCE') color = '#F97316';
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#101010', borderColor: '#252525', borderRadius: '8px', color: '#fff' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
