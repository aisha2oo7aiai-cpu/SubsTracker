import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Compass,
  Layers,
  Repeat,
  FileText,
  CreditCard,
  LifeBuoy,
  User,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const CustomerSidebar: React.FC = () => {
  const { activeTab, setActiveTab, currentUser, invoices } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  const myPendingInvoices = invoices.filter(
    (i) => i.customerId === currentUser.customerId && i.status !== 'paid'
  ).length;

  const navItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'explore', label: 'Explore Services', icon: <Compass className="w-4 h-4" /> },
    { id: 'plans', label: 'Browse Plans', icon: <Layers className="w-4 h-4" /> },
    { id: 'my_subscriptions', label: 'My Subscriptions', icon: <Repeat className="w-4 h-4" /> },
    {
      id: 'invoices',
      label: 'Invoices',
      icon: <FileText className="w-4 h-4" />,
      badge: myPendingInvoices > 0 ? myPendingInvoices : undefined,
    },
    { id: 'payments', label: 'Payment History', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'support', label: 'Help & Support', icon: <LifeBuoy className="w-4 h-4" /> },
    { id: 'profile', label: 'My Profile', icon: <User className="w-4 h-4" /> },
  ];

  return (
    <aside
      className={`bg-[#1b1411] text-[#faf5f0] border-r border-[#2e241f] flex flex-col justify-between transition-all duration-300 select-none z-20 shrink-0 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div>
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#2e241f]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-[#33cc7a] text-[#1b1411] flex items-center justify-center font-extrabold text-base shadow-sm shrink-0">
              S
            </div>
            {!collapsed && (
              <div className="truncate">
                <span className="font-extrabold text-sm text-[#faf5f0] tracking-tight block">SubsTracker</span>
                <span className="text-[10px] font-semibold text-[#b8aba3] uppercase tracking-widest block -mt-0.5">
                  Subscriber Portal
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-full text-[#b8aba3] hover:text-[#faf5f0] hover:bg-white/10 transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5 overflow-y-auto max-h-[calc(100vh-140px)]">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-full text-xs font-semibold transition-all relative group ${
                  isActive
                    ? 'bg-[#33cc7a] text-[#1b1411] shadow-[0_4px_16px_-4px_rgba(51,204,122,0.5)]'
                    : 'text-[#b8aba3] hover:text-[#faf5f0] hover:bg-white/5'
                } ${collapsed ? 'justify-center px-0' : ''}`}
              >
                <span className={`shrink-0 ${isActive ? 'text-[#1b1411]' : 'text-[#b8aba3] group-hover:text-[#faf5f0]'}`}>
                  {item.icon}
                </span>

                {!collapsed && <span className="truncate">{item.label}</span>}

                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-[#1b1411] text-[#33cc7a]'
                        : 'bg-[#33cc7a] text-[#1b1411]'
                    } ${collapsed ? 'absolute top-1 right-2 w-2 h-2 p-0 rounded-full bg-[#33cc7a]' : 'ml-auto'}`}
                  >
                    {!collapsed && item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile Info */}
      <div className="p-3 border-t border-[#2e241f] bg-[#2e241f]/70">
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : 'px-2 py-1'}`}>
          <div className="w-8 h-8 rounded-full bg-[#faf5f0] text-[#1b1411] flex items-center justify-center font-bold text-xs shrink-0">
            <User className="w-4 h-4 text-[#1b1411]" />
          </div>
          {!collapsed && (
            <div className="truncate">
              <p className="text-xs font-bold text-[#faf5f0] truncate">{currentUser.name}</p>
              <p className="text-[10px] text-[#b8aba3] truncate">{currentUser.companyName || 'Subscriber'}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
