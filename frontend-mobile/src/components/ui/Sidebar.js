import React, { useState } from 'react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'chart-bar' },
    { id: 'stats', label: 'Statistics', icon: 'chart-line' },
    { id: 'map', label: 'Map View', icon: 'map' },
    { id: 'images', label: 'Images', icon: 'image' },
    { id: 'videos', label: 'Videos', icon: 'video' },
    { id: 'reports', label: 'Reports', icon: 'document-text' },
    { id: 'settings', label: 'Settings', icon: 'cog' },
  ];

  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-white border-r border-slate-200 transition-all duration-300 flex flex-col ${
        collapsed ? 'w-20' : 'w-64'
      } z-50 shadow-sm`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              RA
            </div>
            <h1 className="text-lg font-bold text-slate-900">Road AI</h1>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium text-sm ${
              activeTab === item.id
                ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
            title={collapsed ? item.label : ''}
          >
            <span className="text-lg">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>
      
      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-200">
          <p className="text-xs text-slate-500 text-center">v1.0.0</p>
        </div>
      )}
    </div>
  );
}
