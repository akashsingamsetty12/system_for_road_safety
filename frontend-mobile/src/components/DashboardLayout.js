import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import StatCard from './StatCard';
import Card from './Card';
import DataTable from './DataTable';
import Badge from './Badge';
import Button from './Button';
import Toast from './Toast';

export default function DashboardLayout() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toast, setToast] = useState(null);

  const stats = [
    { label: 'Total Detections', value: '1,245', change: 12, color: 'blue', icon: 'chart-line' },
    { label: 'Critical Issues', value: '45', change: -8, color: 'red', icon: 'alert-circle' },
    { label: 'Avg Severity', value: '6.8/10', change: 3, color: 'orange', icon: 'gauge' },
    { label: 'Resolved', value: '928', change: 18, color: 'green', icon: 'check-circle' },
  ];

  const tableData = [
    { id: 1, location: 'MG Road', severity: 'Critical', issues: 85, status: 'Active' },
    { id: 2, location: 'Brigade Road', severity: 'High', issues: 42, status: 'Monitoring' },
    { id: 3, location: 'Commercial Street', severity: 'Medium', issues: 28, status: 'Resolved' },
    { id: 4, location: 'Residency Road', severity: 'Low', issues: 12, status: 'Monitoring' },
  ];

  const columns = [
    { key: 'location', label: 'Location' },
    {
      key: 'severity',
      label: 'Severity',
      render: (value) => <Badge label={value} variant={value.toLowerCase()} />,
    },
    { key: 'issues', label: 'Issues Detected' },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const variantMap = {
          Active: 'danger',
          Monitoring: 'warning',
          Resolved: 'success',
        };
        return <Badge label={value} variant={variantMap[value] || 'default'} />;
      },
    },
  ];

  const showTab = (tabName) => {
    setActiveTab(tabName);
    setToast({ message: `Switched to ${tabName}`, type: 'info' });
  };
      },
    },
  ];

  const showTab = (tabName) => {
    setActiveTab(tabName);
    setToast({ message: `Switched to ${tabName}`, type: 'info' });
  };

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={showTab} />
      <div className="flex-1 ml-64 transition-all duration-300">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="animate-fade-in">
            <Header
              title="Dashboard"
              subtitle="Real-time road detection monitoring system"
              actions={[
                { label: 'Export Report', variant: 'secondary' },
                { label: 'Refresh', variant: 'primary' },
              ]}
            />
            <div className="px-8 py-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                  <StatCard key={idx} {...stat} />
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card variant="elevated" className="lg:col-span-2 min-h-96 flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg mx-auto mb-4"></div>
                    <p className="text-slate-500 text-lg font-medium">Detection Analytics</p>
                    <p className="text-slate-400 text-sm mt-1">Chart integration coming soon</p>
                  </div>
                </Card>
                <Card variant="elevated" className="bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
                  <div className="space-y-1 mb-4">
                    <h3 className="font-bold text-slate-900 text-lg">Today's Alerts</h3>
                    <p className="text-sm text-slate-500">Priority notifications</p>
                  </div>
                  <div className="space-y-3 mt-4">
                    <div className="p-4 bg-red-100/50 rounded-lg border border-red-200">
                      <p className="text-red-900 text-sm font-bold">5 Critical Areas</p>
                      <p className="text-red-700 text-xs mt-0.5">Require immediate attention</p>
                    </div>
                    <div className="p-4 bg-orange-100/50 rounded-lg border border-orange-200">
                      <p className="text-orange-900 text-sm font-bold">12 High Priority</p>
                      <p className="text-orange-700 text-xs mt-0.5">Monitor closely</p>
                    </div>
                    <div className="p-4 bg-green-100/50 rounded-lg border border-green-200">
                      <p className="text-green-900 text-sm font-bold">98% System Health</p>
                      <p className="text-green-700 text-xs mt-0.5">All systems operational</p>
                    </div>
                  </div>
                </Card>
              </div>
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Active Detection Areas</h2>
                  <p className="text-slate-500 text-sm mt-1">Real-time monitoring across locations</p>
                </div>
                <DataTable
                  columns={columns}
                  data={tableData}
                  actions={(row) => [
                    <Button key="view" variant="ghost" size="sm" className="text-blue-600">View Details</Button>,
                    <Button key="edit" variant="ghost" size="sm" className="text-slate-600">Edit</Button>,
                  ]}
                />
              </div>
            </div>
          </div>
        )}
        {/* Map Tab */}
        {activeTab === 'map' && (
          <div className="animate-fade-in">
            <Header title="Map View" subtitle="Interactive geolocation mapping of detected issues" />
            <div className="px-8 py-8">
              <Card variant="elevated" className="h-[600px] flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg mx-auto mb-4"></div>
                  <p className="text-slate-900 text-2xl font-bold">Map Component</p>
                  <p className="text-slate-500 mt-2">Leaflet integration coming soon</p>
                </div>
              </Card>
            </div>
          </div>
        )}
        {/* Statistics Tab */}
        {activeTab === 'stats' && (
          <div className="animate-fade-in">
            <Header title="Statistics" subtitle="Detailed analytics, trends and reports" />
            <div className="px-8 py-8 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card variant="elevated">
                  <h3 className="font-bold text-slate-900 mb-6">Detection by Severity</h3>
                  <div className="space-y-5">
                    {[
                      { label: 'Critical', value: 45, percent: 75, color: 'bg-red-500' },
                      { label: 'High', value: 128, percent: 50, color: 'bg-orange-500' },
                      { label: 'Medium', value: 89, percent: 33, color: 'bg-yellow-500' },
                      { label: 'Low', value: 56, percent: 15, color: 'bg-green-500' },
                    ].map((item, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between mb-2">
                          <span className="text-slate-700 font-medium text-sm">{item.label}</span>
                          <span className="text-slate-900 font-bold">{item.value}</span>
                        </div>
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percent}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card variant="elevated">
                  <h3 className="font-bold text-slate-900 mb-6">Key Metrics</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Total Potholes', value: '1,245' },
                      { label: 'Areas Monitored', value: '47' },
                      { label: 'Active Alerts', value: '23' },
                      { label: 'System Uptime', value: '99.8%' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center pb-4 border-b border-slate-200 last:border-0">
                        <span className="text-slate-600 font-medium">{item.label}</span>
                        <span className="text-2xl font-bold text-slate-900">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}
        {/* Other Tabs */}
        {(activeTab === 'images' || activeTab === 'videos' || activeTab === 'reports' || activeTab === 'settings') && (
          <div className="animate-fade-in">
            <Header title={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} />
            <div className="px-8 py-8">
              <Card variant="elevated" className="h-96 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="text-center">
                  <div className="w-16 h-16 bg-slate-400 rounded-lg mx-auto mb-4"></div>
                  <p className="text-slate-900 text-xl font-bold capitalize">{activeTab} Module</p>
                  <p className="text-slate-500 mt-1">Coming soon</p>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

      <div className="flex-1 ml-64 transition-all duration-300">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="animate-fade-in">
            <Header
              title="Dashboard"
              subtitle="Real-time road detection monitoring system"
              actions={[
                { label: 'Export Report', variant: 'secondary' },
                { label: '↻ Refresh', variant: 'primary' },
              ]}
            />

            <div className="px-8 py-8 space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-in-left">
                {stats.map((stat, idx) => (
                  <StatCard key={idx} {...stat} />
                ))}
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart Area */}
                <Card variant="elevated" className="lg:col-span-2 min-h-96 flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg mx-auto mb-4"></div>
                    <p className="text-slate-500 text-lg font-medium">Detection Analytics</p>
                    <p className="text-slate-400 text-sm mt-1">Chart integration coming soon</p>
                  </div>
                </Card>

                {/* Alert Box */}
                <Card variant="elevated" className="bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
                  <div className="space-y-1 mb-4">
                    <h3 className="font-bold text-slate-900 text-lg">Today's Alerts</h3>
                    <p className="text-sm text-slate-500">Priority notifications</p>
                  </div>
                  <div className="space-y-3 mt-4">
                    <div className="p-4 bg-red-100/50 rounded-lg border border-red-200">
                      <p className="text-red-900 text-sm font-bold">5 Critical Areas</p>
                      <p className="text-red-700 text-xs mt-0.5">Require immediate attention</p>
                    </div>
                    <div className="p-4 bg-orange-100/50 rounded-lg border border-orange-200">
                      <p className="text-orange-900 text-sm font-bold">12 High Priority</p>
                      <p className="text-orange-700 text-xs mt-0.5">Monitor closely</p>
                    </div>
                    <div className="p-4 bg-green-100/50 rounded-lg border border-green-200">
                      <p className="text-green-900 text-sm font-bold">98% System Health</p>
                      <p className="text-green-700 text-xs mt-0.5">All systems operational</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Data Table Section */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Active Detection Areas</h2>
                  <p className="text-slate-500 text-sm mt-1">Real-time monitoring across all tracked locations</p>
                </div>
                <DataTable
                  columns={columns}
                  data={tableData}
                  actions={(row) => [
                    <Button key="view" variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                      View Details
                    </Button>,
                    <Button key="edit" variant="ghost" size="sm" className="text-slate-600 hover:text-slate-700">
                      Edit
                    </Button>,
                  ]}
                />
              </div>
            </div>
          </div>
        )}

        {/* Map Tab */}
        {activeTab === 'map' && (
          <div className="animate-fade-in">
            <Header title="Map View" subtitle="Interactive geolocation mapping of detected issues" />
            <div className="px-8 py-8">
              <Card variant="elevated" className="h-[600px] flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-lg mx-auto mb-4"></div>
                  <p className="text-slate-900 text-2xl font-bold">Map Component</p>
                  <p className="text-slate-500 mt-2">Leaflet integration and GPS mapping coming soon</p>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'stats' && (
          <div className="animate-fade-in">
            <Header title="Statistics" subtitle="Detailed analytics, trends and historical reports" />
            <div className="px-8 py-8 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Severity Distribution */}
                <Card variant="elevated">
                  <h3 className="font-bold text-slate-900 mb-6">Detection by Severity</h3>
                  <div className="space-y-5">
                    {[
                      { label: 'Critical', value: 45, percent: 75, color: 'bg-red-500' },
                      { label: 'High', value: 128, percent: 50, color: 'bg-orange-500' },
                      { label: 'Medium', value: 89, percent: 33, color: 'bg-yellow-500' },
                      { label: 'Low', value: 56, percent: 15, color: 'bg-green-500' },
                    ].map((item, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between mb-2">
                          <span className="text-slate-700 font-medium text-sm">{item.label}</span>
                          <span className="text-slate-900 font-bold">{item.value}</span>
                        </div>
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${item.color} rounded-full transition-all duration-300`}
                            style={{ width: `${item.percent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Quick Stats */}
                <Card variant="elevated">
                  <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <span>⚡</span> Key Metrics
                  </h3>">Key Metrics  {[
                      { label: 'Total Potholes', value: '1,245', icon: '🛣️' },
                      { label: 'Areas Monitored', value: '47', icon: '📍' },
                      { label: 'Active Alerts', value: '23', icon: '🔔' },
                      { label: 'System Uptime', value: '99.8%', icon: '✅' },
                    ].map((item, idx) => ( },
                      { label: 'Areas Monitored', value: '47' },
                      { label: 'Active Alerts', value: '23' },
                      { label: 'System Uptime', value: '99.8%' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center pb-4 border-b border-slate-200 last:border-0 last:pb-0">
                        <span className="text-slate-600 font-medium">{item.label}</span
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Other Tabs */}
        {(activeTab === 'images' || activeTab === 'videos' || activeTab === 'reports' || activeTab === 'settings') && (
          <div className="animate-fade-in">
            <Header title={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} />
            <div className="px-8 py-8">
              <Card variant="elevated" className="h-96 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="text-center">
                  <p className="text-7xl mb-4">
                    {activeTab === 'images' && '🖼️'}
                    {activeTab === 'videos' && '🎥'}
                    {activeTab === 'reports' && '📋'}
                    {activeTab === 'settings' && '⚙️'}
                  <div className="w-16 h-16 bg-slate-400 rounded-lg mx-auto mb-4"></div
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
