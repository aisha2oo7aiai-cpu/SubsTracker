import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Customer } from '../../types';
import { formatINR, formatDate, getStatusBadge } from '../../utils/formatters';
import {
  Users,
  Search,
  Filter,
  Plus,
  Mail,
  Phone,
  Building,
  Calendar,
  CreditCard,
  Repeat,
  ExternalLink,
  Edit2,
  X,
  FileText,
  UserCheck,
} from 'lucide-react';

export const AdminCustomers: React.FC = () => {
  const { customers, subscriptions, invoices, staff, addCustomer, updateCustomer, setPreviewInvoice, searchQuery } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'lead'>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive' | 'lead'>('active');
  const [assignedStaffId, setAssignedStaffId] = useState(staff[0]?.id || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [notes, setNotes] = useState('');

  const filteredCustomers = customers.filter((c) => {
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.companyName.toLowerCase().includes(q) ||
      (c.city && c.city.toLowerCase().includes(q));
    return matchStatus && matchSearch;
  });

  const openAddModal = () => {
    setEditingCustomer(null);
    setName('');
    setEmail('');
    setPhone('+91 ');
    setCompanyName('');
    setStatus('active');
    setAssignedStaffId(staff[0]?.id || '');
    setAddress('');
    setCity('Mumbai');
    setState('Maharashtra');
    setNotes('');
    setShowAddModal(true);
  };

  const openEditModal = (c: Customer) => {
    setEditingCustomer(c);
    setName(c.name);
    setEmail(c.email);
    setPhone(c.phone);
    setCompanyName(c.companyName);
    setStatus(c.status);
    setAssignedStaffId(c.assignedStaffId || staff[0]?.id || '');
    setAddress(c.address || '');
    setCity(c.city || '');
    setState(c.state || '');
    setNotes(c.notes || '');
    setShowAddModal(true);
  };

  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    const assignedStaff = staff.find((s) => s.id === assignedStaffId);

    if (editingCustomer) {
      await updateCustomer(editingCustomer.id, {
        name,
        email,
        phone,
        companyName,
        status,
        assignedStaffId,
        assignedStaffName: assignedStaff?.name,
        address,
        city,
        state,
        notes,
      });
      if (selectedCustomer?.id === editingCustomer.id) {
        setSelectedCustomer({
          ...selectedCustomer,
          name,
          email,
          phone,
          companyName,
          status,
          assignedStaffId,
          assignedStaffName: assignedStaff?.name,
          address,
          city,
          state,
          notes,
        });
      }
    } else {
      await addCustomer({
        name,
        email,
        phone,
        companyName,
        status,
        assignedStaffId,
        assignedStaffName: assignedStaff?.name,
        address,
        city,
        state,
        country: 'India',
        notes,
      });
    }
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Enterprise Customer Directory</h1>
          <p className="text-xs text-slate-500 mt-1">
            Maintain 360-degree subscriber accounts, assigned account managers, and lifetime financial ledgers.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all hover:shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Register Customer</span>
        </button>
      </div>

      {/* Filter and Count Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex items-center gap-2">
          {(['all', 'active', 'lead', 'inactive'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors ${
                statusFilter === s
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-800">{filteredCustomers.length}</span> of {customers.length} Accounts
        </div>
      </div>

      {/* Customers Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-6">Customer & Company</th>
                <th className="py-3.5 px-6">Contact Channels</th>
                <th className="py-3.5 px-6">Assigned Staff</th>
                <th className="py-3.5 px-6 text-center">Active Subs</th>
                <th className="py-3.5 px-6 text-right">Lifetime Spend</th>
                <th className="py-3.5 px-6 text-center">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredCustomers.map((c) => {
                const badge = getStatusBadge(c.status);
                return (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Name & Company */}
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-xs">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-snug">{c.name}</p>
                          <p className="text-[11px] text-slate-500">{c.companyName}</p>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-6">
                      <p className="text-slate-900 font-medium">{c.email}</p>
                      <p className="text-[11px] text-slate-400">{c.phone}</p>
                    </td>

                    {/* Assigned Staff */}
                    <td className="py-3.5 px-6">
                      <span className="font-medium text-slate-800 flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                        {c.assignedStaffName || 'Unassigned'}
                      </span>
                    </td>

                    {/* Active Subs */}
                    <td className="py-3.5 px-6 text-center font-bold text-slate-900">
                      {c.activeSubscriptionsCount}
                    </td>

                    {/* Lifetime Spend */}
                    <td className="py-3.5 px-6 text-right font-extrabold text-slate-900 font-mono">
                      {formatINR(c.totalSpend)}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-6 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg}`}>
                        <span className={`w-1 h-1 rounded-full ${badge.dot}`}></span>
                        {badge.label}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedCustomer(c)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 rounded-lg font-semibold text-xs transition-colors"
                        >
                          View 360°
                        </button>
                        <button
                          onClick={() => openEditModal(c)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CUSTOMER 360° DETAILS DRAWER MODAL */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-end">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between animate-in slide-in-from-right duration-300">
            <div>
              {/* Drawer Top */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                    Customer Account Record
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">{selectedCustomer.name}</h2>
                  <p className="text-xs text-slate-500">{selectedCustomer.companyName}</p>
                </div>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Info Cards */}
              <div className="py-6 space-y-6 text-xs text-slate-700">
                {/* Contact & Meta */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Email Address</span>
                    <p className="font-semibold text-slate-900 mt-0.5">{selectedCustomer.email}</p>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Phone Number</span>
                    <p className="font-semibold text-slate-900 mt-0.5">{selectedCustomer.phone}</p>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Account Manager</span>
                    <p className="font-semibold text-indigo-600 mt-0.5">
                      {selectedCustomer.assignedStaffName || 'General Queue'}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Customer Since</span>
                    <p className="font-semibold text-slate-900 mt-0.5">{formatDate(selectedCustomer.joinedDate)}</p>
                  </div>
                </div>

                {/* Subscriptions section */}
                <div>
                  <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-1.5">
                    <Repeat className="w-4 h-4 text-indigo-600" />
                    Active Subscriptions
                  </h3>
                  <div className="space-y-2">
                    {subscriptions.filter((s) => s.customerId === selectedCustomer.id).length === 0 ? (
                      <p className="text-slate-400 italic">No active subscriptions on file.</p>
                    ) : (
                      subscriptions
                        .filter((s) => s.customerId === selectedCustomer.id)
                        .map((s) => {
                          const badge = getStatusBadge(s.status);
                          return (
                            <div key={s.id} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                              <div>
                                <p className="font-bold text-slate-900">{s.serviceName}</p>
                                <p className="text-[11px] text-slate-500">{s.planName} • {s.billingCycle}</p>
                                <span className="text-[10px] text-slate-400">Next Billing: {formatDate(s.nextBillingDate)}</span>
                              </div>
                              <div className="text-right">
                                <span className="font-bold text-slate-900 block font-mono">{formatINR(s.amount)}</span>
                                <span className={`inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[10px] font-bold border mt-0.5 ${badge.bg}`}>
                                  {badge.label}
                                </span>
                              </div>
                            </div>
                          );
                        })
                    )}
                  </div>
                </div>

                {/* Invoices section */}
                <div>
                  <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    Recent Invoices
                  </h3>
                  <div className="space-y-2">
                    {invoices.filter((i) => i.customerId === selectedCustomer.id).slice(0, 4).map((inv) => (
                      <div key={inv.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                        <div>
                          <p className="font-mono font-bold text-slate-900">{inv.invoiceNumber}</p>
                          <p className="text-[11px] text-slate-500">Issued: {formatDate(inv.issueDate)}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-slate-900 font-mono">{formatINR(inv.totalAmount)}</span>
                          <button
                            onClick={() => setPreviewInvoice(inv)}
                            className="text-xs text-indigo-600 font-semibold hover:underline"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Account Notes */}
                {selectedCustomer.notes && (
                  <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
                    <span className="font-bold block mb-1">Internal Operations Note:</span>
                    <p className="text-xs leading-relaxed">{selectedCustomer.notes}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between">
              <button
                onClick={() => openEditModal(selectedCustomer)}
                className="px-4 py-2 border border-slate-200 text-slate-700 font-semibold rounded-xl text-xs hover:bg-slate-50 flex items-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit Account Info
              </button>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT CUSTOMER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                {editingCustomer ? 'Edit Customer Details' : 'Register New Customer Account'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomer} className="py-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Vikram Malhotra"
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Company / Entity</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Zenith Media Labs"
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Corporate Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vikram@zenithmedia.in"
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98200 00000"
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Account Lead</label>
                  <select
                    value={assignedStaffId}
                    onChange={(e) => setAssignedStaffId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    {staff.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.roleTitle})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Account Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="active">Active Subscriber</option>
                    <option value="lead">Sales Lead</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Billing City & Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Trade World, Lower Parel, Mumbai"
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notes / Preferences</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Billing terms, customized SLA add-ons, or special requirements..."
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-xs"
                >
                  {editingCustomer ? 'Update Profile' : 'Save Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
