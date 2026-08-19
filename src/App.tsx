/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useAppContext } from './store/AppContext';
import { Layout } from './components/Layout';
import { Dashboard, CampusMap, IncidentManagement, ResourceManagement, Notifications, StudentPortal, RoomEquipmentManagement, AnalyticsView, SettingsView } from './components/views';

function AppContent() {
  const { currentView } = useAppContext();

  return (
    <Layout>
      {currentView === 'dashboard' && <Dashboard />}
      {currentView === 'map' && <CampusMap />}
      {currentView === 'incidents' && <IncidentManagement />}
      {currentView === 'resources' && <ResourceManagement />}
      {currentView === 'notifications' && <Notifications />}
      {currentView === 'student' && <StudentPortal />}
      {currentView === 'facilities' && <RoomEquipmentManagement />}
      {currentView === 'analytics' && <AnalyticsView />}
      {currentView === 'settings' && <SettingsView />}
    </Layout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
