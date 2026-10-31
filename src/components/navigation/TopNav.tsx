import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Bell,
  HelpCircle,
  Building,
  ChevronDown,
  User,
  Shield,
  Briefcase,
  Check,
  LogOut,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export const TopNav: React.FC = () => {
  const {
    currentUser,
    switchRole,
    setPortal,
    searchQuery,
    setSearchQuery,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    company,
    setActiveTab,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showCompanyMenu, setShowCompanyMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <header className="h-16 bg-[#faf5f0]/95 backdrop-blur-md border-b border-[#eee5dc] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
        {/* Left: Global Search */}
        <div className="flex items-center gap-4 flex-1 max-w-lg">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-[#66574f] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subscriptions, customers, invoices, plans..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#eee5dc] rounded-[14px] text-xs sm:text-sm text-[#1b1411] placeholder-[#66574f]/70 focus:outline-none focus:ring-2 focus:ring-[#33cc7a]/40 focus:border-[#33cc7a] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#66574f] hover:text-[#1b1411]"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Company Switcher */}
          <div className="relative hidden md:block">
            <button
              onClick={() => {
                setShowCompanyMenu(!showCompanyMenu);
                setShowNotifications(false);
                setShowUserMenu(false);
              }}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#eee5dc] bg-white/70 hover:bg-[#eee5dc] text-xs font-semibold text-[#1b1411] transition-colors"
            >
              <Building className="w-3.5 h-3.5 text-[#1b1411]" />
              <span className="max-w-[130px] truncate">{company.name || 'ApexCloud'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#66574f]" />
            </button>

            {showCompanyMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-[24px] shadow-xl border border-[#eee5dc] p-2 z-40">
                <div className="px-3.5 py-2 border-b border-[#eee5dc]">
                  <p className="text-[11px] font-semibold text-[#66574f] uppercase tracking-wider">Organization</p>
                </div>
                <button
                  onClick={() => setShowCompanyMenu(false)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs text-left hover:bg-[#faf5f0] rounded-xl transition-colors text-[#1b1411]"
                >
                  <div>
                    <p className="font-semibold text-[#1b1411]">{company.name}</p>
                    <p className="text-[11px] text-[#66574f]">GSTIN: {company.taxId}</p>
                  </div>
                  <Check className="w-4 h-4 text-[#33cc7a]" />
                </button>
                <div className="px-3.5 py-2 border-t border-[#eee5dc] bg-[#faf5f0] rounded-b-[20px] mt-1">
                  <p className="text-[11px] text-[#66574f] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#33cc7a]"></span> Production Environment
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Dedicated Active Portal Indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#eee5dc] text-xs font-semibold text-[#1b1411]">
            {currentUser.role === 'admin' ? (
              <>
                <Shield className="w-3.5 h-3.5 text-[#1b1411]" />
                <span>Admin Operations</span>
                <span className="w-2 h-2 rounded-full bg-[#33cc7a] ml-1"></span>
              </>
            ) : currentUser.role === 'staff' ? (
              <>
                <Briefcase className="w-3.5 h-3.5 text-[#1b1411]" />
                <span>Staff Account</span>
                <span className="w-2 h-2 rounded-full bg-[#33cc7a] ml-1"></span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5 text-[#1b1411]" />
                <span>Subscriber Portal</span>
                <span className="w-2 h-2 rounded-full bg-[#1f3954] ml-1"></span>
              </>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
                setShowCompanyMenu(false);
              }}
              className="relative p-2 rounded-full text-[#66574f] hover:text-[#1b1411] hover:bg-[#eee5dc] transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#33cc7a] border-2 border-[#faf5f0]"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-40">
                <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-600">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">No notifications at the moment.</div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationRead(n.id);
                          if (n.linkTab) setActiveTab(n.linkTab);
                          setShowNotifications(false);
                        }}
                        className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors flex items-start gap-3 ${
                          !n.read ? 'bg-indigo-50/30' : ''
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                            !n.read ? 'bg-indigo-600' : 'bg-transparent'
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-900">{n.title}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{n.message}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">{n.timestamp}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Help Center Trigger */}
          <button
            onClick={() => setShowHelpModal(true)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors hidden sm:block"
            title="Platform Guide & Documentation"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
                setShowCompanyMenu(false);
              }}
              className="flex items-center gap-2.5 p-1 pl-2.5 pr-2 rounded-full border border-[#eee5dc] bg-white/70 hover:bg-[#eee5dc] transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-[#1b1411] text-[#faf5f0] flex items-center justify-center font-bold text-xs">
                {currentUser.name.charAt(0)}
              </div>
              <div className="text-left hidden sm:block pr-1">
                <p className="text-xs font-semibold text-[#1b1411] leading-tight">{currentUser.name}</p>
                <p className="text-[10px] text-[#66574f] capitalize">{currentUser.role} Portal</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#66574f] hidden sm:block" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-[24px] shadow-xl border border-[#eee5dc] p-2 z-40">
                <div className="px-4 py-3 border-b border-[#eee5dc]">
                  <p className="text-xs font-bold text-[#1b1411]">{currentUser.name}</p>
                  <p className="text-[11px] text-[#66574f] truncate">{currentUser.email}</p>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#eee5dc] text-[#1b1411] capitalize">
                    {currentUser.role === 'admin' ? (
                      <Shield className="w-3 h-3 text-[#1b1411]" />
                    ) : currentUser.role === 'staff' ? (
                      <Briefcase className="w-3 h-3 text-[#1b1411]" />
                    ) : (
                      <User className="w-3 h-3 text-[#1b1411]" />
                    )}
                    {currentUser.role} Account
                  </div>
                </div>

                {/* Role Specific Actions */}
                <div className="px-3 py-2 border-b border-[#E2DDD0]">
                  <p className="text-[10px] font-semibold text-[#888AB9] uppercase tracking-wider mb-1.5">
                    {currentUser.role === 'admin' ? 'Admin Quick Access' : currentUser.role === 'staff' ? 'Staff Shortcuts' : 'Account Shortcuts'}
                  </p>
                  <div className="space-y-1">
                    {currentUser.role === 'admin' && (
                      <>
                        <button
                          onClick={() => {
                            setActiveTab('settings');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-[#282B4A] hover:bg-[#FAF9F5] transition-colors"
                        >
                          Company & Billing Settings
                        </button>
                        <button
                          onClick={() => {
                            setActiveTab('staff');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-[#282B4A] hover:bg-[#FAF9F5] transition-colors"
                        >
                          Staff Team & Permissions
                        </button>
                        <button
                          onClick={() => {
                            setActiveTab('reports');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-[#282B4A] hover:bg-[#FAF9F5] transition-colors"
                        >
                          Financial Reports & Analytics
                        </button>
                      </>
                    )}
                    {currentUser.role === 'staff' && (
                      <>
                        <button
                          onClick={() => {
                            setActiveTab('my_customers');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-[#282B4A] hover:bg-[#FAF9F5] transition-colors"
                        >
                          My Assigned Customers
                        </button>
                        <button
                          onClick={() => {
                            setActiveTab('tasks');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-[#282B4A] hover:bg-[#FAF9F5] transition-colors"
                        >
                          Pending Tasks & Follow-ups
                        </button>
                      </>
                    )}
                    {currentUser.role === 'customer' && (
                      <>
                        <button
                          onClick={() => {
                            setActiveTab('my_subscriptions');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-[#282B4A] hover:bg-[#FAF9F5] transition-colors"
                        >
                          My Subscriptions
                        </button>
                        <button
                          onClick={() => {
                            setActiveTab('invoices');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-[#282B4A] hover:bg-[#FAF9F5] transition-colors"
                        >
                          Invoices & Receipts
                        </button>
                        <button
                          onClick={() => {
                            setActiveTab('support');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-[#282B4A] hover:bg-[#FAF9F5] transition-colors"
                        >
                          Support & Helpdesk
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      setPortal('auth');
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-[#282B4A] hover:bg-[#FAF9F5] transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#5E629A]" />
                    Switch Portal Account (Sign Out)
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      setPortal('landing');
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign out to Landing Page
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Help & Guide Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">SubsTracker SaaS Architecture</h3>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>
            <div className="py-4 space-y-3 text-xs text-slate-600 leading-relaxed">
              <p>
                <strong className="text-slate-900">3 Comprehensive Workspaces:</strong>
              </p>
              <ul className="list-disc pl-4 space-y-1.5">
                <li>
                  <strong className="text-slate-800">Admin Portal:</strong> Manage corporate services, multi-tier pricing plans, all customers, subscriptions, automated invoices, payment receipts, staff permissions, and Gemini AI strategic revenue audits.
                </li>
                <li>
                  <strong className="text-slate-800">Staff Portal:</strong> Dedicated day-to-day employee operations. Manage assigned customer accounts, send quotations, record authorized offline payments, and track follow-up tasks.
                </li>
                <li>
                  <strong className="text-slate-800">Customer Portal:</strong> Self-service subscriber experience to browse plans, subscribe, download official GST tax invoices, submit support tickets, and manage subscriptions.
                </li>
              </ul>
              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-indigo-900 mt-2">
                <p className="font-semibold">Ready for Python FastAPI Backend:</p>
                <p className="text-[11px] text-indigo-700 mt-0.5">
                  The frontend is decoupled via <code>src/services/api.ts</code>. All state changes persist smoothly in browser storage for instant live demonstration.
                </p>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
