import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StaffMember, StaffPermissions } from '../../types';
import {
  UserCheck,
  Plus,
  Shield,
  Briefcase,
  Mail,
  Phone,
  Check,
  Edit2,
  X,
  Users,
  Award,
} from 'lucide-react';

export const AdminStaff: React.FC = () => {
  const { staff, addStaff, updateStaff, customers } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPermissionsStaff, setEditingPermissionsStaff] = useState<StaffMember | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [roleTitle, setRoleTitle] = useState('Senior Account Manager');
  const [phone, setPhone] = useState('+91 98000 00000');
  const [permissions, setPermissions] = useState<StaffPermissions>({
    canManageCustomers: true,
    canCreateQuotations: true,
    canGenerateInvoices: true,
    canRecordPayments: false,
    canViewReports: false,
    canManagePlans: false,
    canManageStaff: false,
  });

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    await addStaff({
      name,
      email,
      roleTitle,
      phone,
      status: 'active',
      permissions,
    });
    setShowAddModal(false);
    setName('');
    setEmail('');
  };

  const handleSavePermissions = async () => {
    if (editingPermissionsStaff) {
      await updateStaff(editingPermissionsStaff.id, {
        permissions: editingPermissionsStaff.permissions,
      });
      setEditingPermissionsStaff(null);
    }
  };

  const toggleStaffStatus = async (s: StaffMember) => {
    await updateStaff(s.id, {
      status: s.status === 'active' ? 'inactive' : 'active',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Staff & Team Governance</h1>
          <p className="text-xs text-slate-500 mt-1">
            Assign customer portfolios, audit operational throughput, and configure role-based permissions (RBAC).
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all hover:shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Add Employee Account</span>
        </button>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.map((employee) => (
          <div
            key={employee.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Top Row */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-sm border border-indigo-100">
                    {employee.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{employee.name}</h3>
                    <p className="text-xs text-indigo-600 font-medium">{employee.roleTitle}</p>
                  </div>
                </div>

                <button
                  onClick={() => toggleStaffStatus(employee)}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                    employee.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {employee.status}
                </button>
              </div>

              {/* Contact info */}
              <div className="space-y-1 text-xs text-slate-500 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="flex items-center gap-1.5 text-slate-700">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> {employee.email}
                </p>
                <p className="flex items-center gap-1.5 text-slate-700">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> {employee.phone}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Assigned Accounts</span>
                  <p className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-indigo-600" />
                    {customers.filter((c) => c.assignedStaffId === employee.id).length || employee.assignedCustomerCount} Clients
                  </p>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Performance Score</span>
                  <p className="text-sm font-bold text-emerald-600 mt-0.5 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-emerald-600" />
                    {employee.performanceScore}% Rating
                  </p>
                </div>
              </div>

              {/* Permissions Checklist preview */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                {employee.permissions.canManageCustomers && (
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md font-semibold">Customers</span>
                )}
                {employee.permissions.canCreateQuotations && (
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md font-semibold">Quotes</span>
                )}
                {employee.permissions.canGenerateInvoices && (
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md font-semibold">Invoices</span>
                )}
                {employee.permissions.canRecordPayments && (
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md font-semibold">Collections</span>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setEditingPermissionsStaff(employee)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Configure Permissions</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PERMISSIONS CONFIGURATION MODAL */}
      {editingPermissionsStaff && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Configure Role Permissions</h3>
                <p className="text-[11px] text-slate-500">{editingPermissionsStaff.name} ({editingPermissionsStaff.roleTitle})</p>
              </div>
              <button onClick={() => setEditingPermissionsStaff(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-900 block">Manage Assigned Customers</span>
                  <span className="text-slate-500 text-[11px]">View contact details and log customer interactions</span>
                </div>
                <input
                  type="checkbox"
                  checked={editingPermissionsStaff.permissions.canManageCustomers}
                  onChange={(e) =>
                    setEditingPermissionsStaff({
                      ...editingPermissionsStaff,
                      permissions: { ...editingPermissionsStaff.permissions, canManageCustomers: e.target.checked },
                    })
                  }
                  className="w-4 h-4 rounded text-indigo-600"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-900 block">Create Commercial Quotations</span>
                  <span className="text-slate-500 text-[11px]">Draft custom price proposals for clients</span>
                </div>
                <input
                  type="checkbox"
                  checked={editingPermissionsStaff.permissions.canCreateQuotations}
                  onChange={(e) =>
                    setEditingPermissionsStaff({
                      ...editingPermissionsStaff,
                      permissions: { ...editingPermissionsStaff.permissions, canCreateQuotations: e.target.checked },
                    })
                  }
                  className="w-4 h-4 rounded text-indigo-600"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-900 block">Generate Invoices</span>
                  <span className="text-slate-500 text-[11px]">Issue recurring bills and send payment reminders</span>
                </div>
                <input
                  type="checkbox"
                  checked={editingPermissionsStaff.permissions.canGenerateInvoices}
                  onChange={(e) =>
                    setEditingPermissionsStaff({
                      ...editingPermissionsStaff,
                      permissions: { ...editingPermissionsStaff.permissions, canGenerateInvoices: e.target.checked },
                    })
                  }
                  className="w-4 h-4 rounded text-indigo-600"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-900 block">Record Authorised Payments</span>
                  <span className="text-slate-500 text-[11px]">Record manual bank deposits and mark invoices paid</span>
                </div>
                <input
                  type="checkbox"
                  checked={editingPermissionsStaff.permissions.canRecordPayments}
                  onChange={(e) =>
                    setEditingPermissionsStaff({
                      ...editingPermissionsStaff,
                      permissions: { ...editingPermissionsStaff.permissions, canRecordPayments: e.target.checked },
                    })
                  }
                  className="w-4 h-4 rounded text-indigo-600"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-900 block">Access Financial Reports</span>
                  <span className="text-slate-500 text-[11px]">View MRR, ARR, and cancellation reports</span>
                </div>
                <input
                  type="checkbox"
                  checked={editingPermissionsStaff.permissions.canViewReports}
                  onChange={(e) =>
                    setEditingPermissionsStaff({
                      ...editingPermissionsStaff,
                      permissions: { ...editingPermissionsStaff.permissions, canViewReports: e.target.checked },
                    })
                  }
                  className="w-4 h-4 rounded text-indigo-600"
                />
              </label>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setEditingPermissionsStaff(null)}
                className="px-4 py-2 border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePermissions}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs"
              >
                Save Role Matrix
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD EMPLOYEE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Add Employee Account</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="py-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Employee Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sneha Roy"
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Corporate Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sneha.roy@apexcloud.in"
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role Title</label>
                  <select
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/20 font-semibold"
                  >
                    <option value="Senior Account Manager">Senior Account Manager</option>
                    <option value="Billing & Collections Lead">Billing & Collections Lead</option>
                    <option value="Customer Success Lead">Customer Success Lead</option>
                    <option value="Enterprise Sales Executive">Enterprise Sales Executive</option>
                    <option value="Client Operations Specialist">Client Operations Specialist</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-xs"
                >
                  Provision Employee Login
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
