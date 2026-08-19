import React from 'react';
import { Card } from '../ui/Card';
import { Settings, Shield, Bell, Database, Palette, Globe, Users, Lock, HardDrive } from 'lucide-react';

export function SettingsView() {
  return (
    <div className="p-6 h-full flex flex-col gap-6 overflow-y-auto max-w-6xl mx-auto w-full">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">System Options</h1>
        <p className="text-slate-400 mt-1">Manage campus configurations, security policies, and administrative preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Profile / Account */}
        <Card className="p-5 bg-[#101010]/80 border-[#252525] hover:bg-[#101010] transition-colors cursor-pointer group">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Users className="text-blue-400" size={20} />
          </div>
          <h3 className="text-white font-medium mb-1">Account & Profiles</h3>
          <p className="text-sm text-slate-400">Manage administrator access, roles, and profile information.</p>
        </Card>

        {/* Security */}
        <Card className="p-5 bg-[#101010]/80 border-[#252525] hover:bg-[#101010] transition-colors cursor-pointer group">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Shield className="text-emerald-400" size={20} />
          </div>
          <h3 className="text-white font-medium mb-1">Security & Privacy</h3>
          <p className="text-sm text-slate-400">Configure SOS policies, access controls, and data protection.</p>
        </Card>

        {/* Notifications */}
        <Card className="p-5 bg-[#101010]/80 border-[#252525] hover:bg-[#101010] transition-colors cursor-pointer group">
          <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Bell className="text-orange-400" size={20} />
          </div>
          <h3 className="text-white font-medium mb-1">Notification Routing</h3>
          <p className="text-sm text-slate-400">Set up SMS, email, and push notification dispatch rules.</p>
        </Card>

        {/* System Connections */}
        <Card className="p-5 bg-[#101010]/80 border-[#252525] hover:bg-[#101010] transition-colors cursor-pointer group">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Database className="text-purple-400" size={20} />
          </div>
          <h3 className="text-white font-medium mb-1">Integrations</h3>
          <p className="text-sm text-slate-400">Manage connections to third-party databases and external APIs.</p>
        </Card>

        {/* Theme / Appearance */}
        <Card className="p-5 bg-[#101010]/80 border-[#252525] hover:bg-[#101010] transition-colors cursor-pointer group">
          <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Palette className="text-pink-400" size={20} />
          </div>
          <h3 className="text-white font-medium mb-1">Appearance</h3>
          <p className="text-sm text-slate-400">Customize dashboard themes, branding, and layout displays.</p>
        </Card>

        {/* Backup / Storage */}
        <Card className="p-5 bg-[#101010]/80 border-[#252525] hover:bg-[#101010] transition-colors cursor-pointer group">
          <div className="w-10 h-10 rounded-lg bg-slate-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <HardDrive className="text-slate-400" size={20} />
          </div>
          <h3 className="text-white font-medium mb-1">Data Management</h3>
          <p className="text-sm text-slate-400">Review storage usage, schedule backups, and export system logs.</p>
        </Card>
      </div>

      {/* Advanced Settings toggle area */}
      <div className="mt-8 pt-6 border-t border-[#252525]">
        <div className="flex items-center justify-between p-4 bg-[#101010]/40 rounded-xl border border-[#252525]">
          <div className="flex items-center gap-4">
            <Lock className="text-slate-500" size={24} />
            <div>
              <h4 className="text-white font-medium">Developer Options</h4>
              <p className="text-sm text-slate-400">Advanced settings for system administrators.</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-[#252525] hover:bg-[#333] text-white rounded-lg text-sm font-medium transition-colors">
            Unlock
          </button>
        </div>
      </div>
    </div>
  );
}
