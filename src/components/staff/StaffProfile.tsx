import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Shield,
  Briefcase,
  Mail,
  Phone,
  CheckCircle,
  Award,
  Calendar,
} from 'lucide-react';

export const StaffProfile: React.FC = () => {
  const { currentUser, staff, customers } = useApp();

  const currentEmployee = staff.find((s) => s.id === currentUser.staffId) || staff[0];
  const assignedCustomers = customers.filter(
    (c) => c.assignedStaffId === currentUser.staffId || c.assignedStaffName?.includes('Priya')
  );

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Staff Account & Role Profile</h1>
        <p className="text-xs text-slate-500 mt-1">
          Review your operational credentials, assigned customer accounts, and system RBAC privileges.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-md shadow-emerald-600/20">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{currentUser.name}</h2>
              <p className="text-xs text-emerald-600 font-semibold">{currentUser.title || currentEmployee.roleTitle}</p>
              <p className="text-xs text-slate-400 mt-0.5">{currentUser.companyName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Active Staff Member
            </span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-b border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 font-medium block">Email Address</span>
            <p className="font-semibold text-slate-800 mt-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              {currentUser.email}
            </p>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Contact Number</span>
            <p className="font-semibold text-slate-800 mt-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              {currentUser.phone || currentEmployee.phone}
            </p>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Staff ID</span>
            <p className="font-semibold text-slate-800 mt-1 font-mono">
              {currentUser.staffId || currentEmployee.id}
            </p>
          </div>
        </div>

        {/* Operational Throughput */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-b border-slate-100">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-xs font-semibold text-slate-500 block">Managed Client Accounts</span>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{assignedCustomers.length} Enterprise Portfolios</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Primary point of contact for billing renewals</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-xs font-semibold text-slate-500 block">Service Delivery Score</span>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">{currentEmployee.performanceScore}% Uptime</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Top performing customer success tier</p>
          </div>
        </div>

        {/* Granted RBAC Privileges */}
        <div className="pt-6">
          <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-600" />
            Granted Operational Privileges
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-center justify-between">
              <span className="font-medium text-slate-800">Customer Onboarding & Directory</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200">ALLOWED</span>
            </div>
            <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-center justify-between">
              <span className="font-medium text-slate-800">Quotation Creation & Dispatch</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200">ALLOWED</span>
            </div>
            <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-center justify-between">
              <span className="font-medium text-slate-800">Invoice Generation & Reminders</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200">ALLOWED</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <span className="font-medium text-slate-500">Service Catalog Deletion & Bank Settings</span>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">ADMIN ONLY</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
