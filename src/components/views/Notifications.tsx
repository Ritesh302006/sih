import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { useAppContext } from '../../store/AppContext';
import { Bell, AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function Notifications() {
  const { notifications } = useAppContext();

  const getIcon = (type: string) => {
    switch (type) {
      case 'ALERT': return <AlertCircle className="text-red-400" size={20} />;
      case 'WARNING': return <AlertTriangle className="text-orange-400" size={20} />;
      case 'SUCCESS': return <CheckCircle className="text-emerald-400" size={20} />;
      case 'INFO':
      default: return <Info className="text-blue-400" size={20} />;
    }
  };

  const getBg = (type: string) => {
    switch (type) {
      case 'ALERT': return 'bg-red-500/10 border-red-500/20';
      case 'WARNING': return 'bg-orange-500/10 border-orange-500/20';
      case 'SUCCESS': return 'bg-emerald-500/10 border-emerald-500/20';
      case 'INFO':
      default: return 'bg-blue-500/10 border-blue-500/20';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
          <Bell size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Notification Center</h2>
          <p className="text-slate-400 text-sm">Recent alerts and system updates.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Notifications</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-800/60">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No notifications.</div>
            ) : (
              notifications.map(notif => (
                <div key={notif.id} className={`p-4 flex items-start gap-4 hover:bg-slate-800/30 transition-colors`}>
                  <div className={`p-2 rounded-full border ${getBg(notif.type)} shrink-0`}>
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium text-slate-200 text-sm">{notif.title}</h4>
                      <span className="text-xs text-slate-500 whitespace-nowrap ml-4">
                        {formatDistanceToNow(new Date(notif.time), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400">{notif.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
