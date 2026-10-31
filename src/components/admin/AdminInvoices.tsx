import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Invoice } from '../../types';
import { formatINR, formatDate, getStatusBadge } from '../../utils/formatters';
import {
  FileText,
  Plus,
  Printer,
  CheckCircle,
  Download,
  Send,
  CreditCard,
  Search,
  Filter,
  X,
  Eye,
  AlertTriangle,
} from 'lucide-react';

export const AdminInvoices: React.FC = () => {
  const {
    invoices,
    customers,
    markInvoicePaid,
    addInvoice,
    setPreviewInvoice,
    addToast,
    searchQuery,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
  const [showMarkPaidModal, setShowMarkPaidModal] = useState<Invoice | null>(null);
  const [selectedMethod, setSelectedMethod] = useState('UPI Instant Transfer');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form states
  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [description, setDescription] = useState('Enterprise Cloud Bandwidth Add-on');
  const [amount, setAmount] = useState(12000);
  const [dueDays, setDueDays] = useState(15);
  const [notes, setNotes] = useState('Standard net-15 billing terms with GST.');

  const filteredInvoices = invoices.filter((i) => {
    const matchStatus = statusFilter === 'all' || i.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      i.invoiceNumber.toLowerCase().includes(q) ||
      i.customerName.toLowerCase().includes(q) ||
      i.customerEmail.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const handleConfirmPaid = async () => {
    if (showMarkPaidModal) {
      await markInvoicePaid(showMarkPaidModal.id, selectedMethod);
      setShowMarkPaidModal(null);
    }
  };

  const handleSendReminder = (inv: Invoice) => {
    addToast({
      title: 'Payment Reminder Sent',
      message: `Dispatched payment notice for ${inv.invoiceNumber} to ${inv.customerEmail}.`,
      type: 'success',
    });
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === customerId);
    const today = new Date();
    const dueDate = new Date(today);
    dueDate.setDate(dueDate.getDate() + dueDays);

    const taxAmount = Math.round(amount * 0.18);
    const totalAmount = amount + taxAmount;

    await addInvoice({
      customerId,
      customerName: cust?.name || 'Client',
      customerEmail: cust?.email || 'client@corp.in',
      customerAddress: cust?.address || 'Corporate Center, Mumbai',
      issueDate: today.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      items: [
        {
          description,
          quantity: 1,
          unitPrice: amount,
          amount,
        },
      ],
      subtotal: amount,
      discountAmount: 0,
      taxAmount,
      totalAmount,
      status: 'pending',
      paymentStatus: 'pending',
      notes,
    });

    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Tax Invoices & Billing Operations</h1>
          <p className="text-xs text-slate-500 mt-1">
            Automated recurring invoices, GST input credits, printable tax bills, and collection reconciliation.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all hover:shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Create Tax Invoice</span>
        </button>
      </div>

      {/* Filter and Summary Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {(['all', 'paid', 'pending', 'overdue'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-800">{filteredInvoices.length}</span> Invoices
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-6">Invoice Number</th>
                <th className="py-3.5 px-6">Customer & Account</th>
                <th className="py-3.5 px-6">Issue Date</th>
                <th className="py-3.5 px-6">Due Date</th>
                <th className="py-3.5 px-6 text-right">Invoice Amount (INR)</th>
                <th className="py-3.5 px-6 text-center">Payment Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredInvoices.map((inv) => {
                const badge = getStatusBadge(inv.status);
                return (
                  <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Invoice Number */}
                    <td className="py-3.5 px-6 font-mono font-bold text-slate-900">
                      {inv.invoiceNumber}
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-6">
                      <p className="font-bold text-slate-900 leading-snug">{inv.customerName}</p>
                      <p className="text-[11px] text-slate-500">{inv.customerEmail}</p>
                    </td>

                    {/* Issue Date */}
                    <td className="py-3.5 px-6 text-slate-600 font-medium">
                      {formatDate(inv.issueDate)}
                    </td>

                    {/* Due Date */}
                    <td className="py-3.5 px-6">
                      <span className={`font-medium ${inv.status === 'overdue' ? 'text-rose-600 font-bold' : 'text-slate-800'}`}>
                        {formatDate(inv.dueDate)}
                      </span>
                      {inv.paidDate && (
                        <span className="text-[10px] text-emerald-600 block mt-0.5 font-medium">
                          Settled on {formatDate(inv.paidDate)}
                        </span>
                      )}
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-6 text-right font-extrabold text-slate-900 font-mono">
                      {formatINR(inv.totalAmount)}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-6 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg}`}>
                        <span className={`w-1 h-1 rounded-full ${badge.dot}`}></span>
                        {badge.label}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View & Print Modal */}
                        <button
                          onClick={() => setPreviewInvoice(inv)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="View & Print Official PDF"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Send Reminder */}
                        {inv.status !== 'paid' && (
                          <button
                            onClick={() => handleSendReminder(inv)}
                            className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Send Payment Reminder Email"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Mark Paid Action */}
                        {inv.status !== 'paid' && (
                          <button
                            onClick={() => setShowMarkPaidModal(inv)}
                            className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-semibold text-xs transition-colors flex items-center gap-1"
                          >
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            <span>Mark Paid</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MARK AS PAID MODAL */}
      {showMarkPaidModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Record Payment Settlement</h3>
              <button onClick={() => setShowMarkPaidModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-1">
              <p>Invoice: <strong className="font-mono text-slate-900">{showMarkPaidModal.invoiceNumber}</strong></p>
              <p>Customer: <strong className="text-slate-900">{showMarkPaidModal.customerName}</strong></p>
              <p>Amount to Record: <strong className="text-emerald-600 font-mono text-sm">{formatINR(showMarkPaidModal.totalAmount)}</strong></p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Method / Channel</label>
              <select
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/20 font-semibold"
              >
                <option value="UPI Instant Transfer">UPI Instant Transfer (PhonePe / GPay / Paytm)</option>
                <option value="Net Banking (RTGS / NEFT)">Net Banking (RTGS / NEFT Direct)</option>
                <option value="Credit Card (Visa / Mastercard)">Credit Card (Visa / Mastercard)</option>
                <option value="Auto-Debit (NACH / e-Mandate)">Auto-Debit (NACH / e-Mandate)</option>
                <option value="Cheque / DD Deposit">Cheque / DD Deposit</option>
              </select>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setShowMarkPaidModal(null)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPaid}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs"
              >
                Confirm Settlement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE INVOICE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Generate Direct Tax Invoice</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="py-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Customer Account</label>
                <select
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/20 font-semibold"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.companyName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Line Item Description</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Dedicated GPU Nodes & Security Mesh Upgrade"
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Base Amount (₹ INR)</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-mono font-bold focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Term (Days)</label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={dueDays}
                    onChange={(e) => setDueDays(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              {/* Tax preview */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
                <span className="text-slate-600">Total with 18% GST:</span>
                <span className="font-extrabold text-indigo-600 font-mono text-sm">
                  {formatINR(amount + Math.round(amount * 0.18))}
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Invoice Notes / Legal Notice</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-xs"
                >
                  Generate & Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
