import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PaymentTransaction, PaymentMethodType } from '../../types';
import { formatINR, getStatusBadge } from '../../utils/formatters';
import {
  CreditCard,
  Search,
  Filter,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building,
} from 'lucide-react';

export const AdminPayments: React.FC = () => {
  const { payments, addToast, searchQuery } = useApp();

  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredPayments = payments.filter((p) => {
    const matchMethod = methodFilter === 'all' || p.paymentMethod === methodFilter;
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      p.transactionId.toLowerCase().includes(q) ||
      p.customerName.toLowerCase().includes(q) ||
      p.invoiceNumber.toLowerCase().includes(q) ||
      (p.bankReference && p.bankReference.toLowerCase().includes(q));
    return matchMethod && matchStatus && matchSearch;
  });

  const handleExportCSV = () => {
    const headers = 'Transaction ID,Customer,Invoice,Amount,Method,Status,Date,Bank Ref\n';
    const rows = filteredPayments
      .map(
        (p) =>
          `"${p.transactionId}","${p.customerName}","${p.invoiceNumber}",${p.amount},"${p.paymentMethod}","${p.status}","${p.date}","${p.bankReference || ''}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SubsTracker_Transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    addToast({ title: 'Export Generated', message: 'Transaction CSV downloaded successfully.', type: 'success' });
  };

  const totalSettled = filteredPayments
    .filter((p) => p.status === 'success')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Payment Settlements & Ledger</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time transaction reconciliation across UPI e-mandates, corporate cards, and net banking.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-xs transition-colors"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Export CSV Statement</span>
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 font-semibold">Settled Collections</span>
          <p className="text-xl font-extrabold text-slate-900 mt-1 font-mono">{formatINR(totalSettled)}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 font-semibold">Successful Transactions</span>
          <p className="text-xl font-extrabold text-emerald-600 mt-1 font-mono">
            {payments.filter((p) => p.status === 'success').length} / {payments.length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 font-semibold">Failed Mandates (Need Attention)</span>
          <p className="text-xl font-extrabold text-rose-600 mt-1 font-mono">
            {payments.filter((p) => p.status === 'failed').length}
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">All Channels</option>
            <option value="UPI">UPI Mandates</option>
            <option value="Credit Card">Credit Cards</option>
            <option value="Auto-Debit">Auto-Debit (NACH)</option>
            <option value="Net Banking">Net Banking</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">All Statuses</option>
            <option value="success">Successful</option>
            <option value="processing">Processing</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-800">{filteredPayments.length}</span> Records
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-6">Transaction ID</th>
                <th className="py-3.5 px-6">Customer & Account</th>
                <th className="py-3.5 px-6">Payment Method</th>
                <th className="py-3.5 px-6">Settlement Timestamp</th>
                <th className="py-3.5 px-6">Related Invoice</th>
                <th className="py-3.5 px-6 text-right">Settled Amount</th>
                <th className="py-3.5 px-6 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredPayments.map((p) => {
                const badge = getStatusBadge(p.status);
                return (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Txn ID */}
                    <td className="py-3.5 px-6">
                      <p className="font-mono font-bold text-slate-900">{p.transactionId}</p>
                      {p.bankReference && (
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{p.bankReference}</p>
                      )}
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-6 font-bold text-slate-900">
                      {p.customerName}
                    </td>

                    {/* Method */}
                    <td className="py-3.5 px-6">
                      <span className="font-medium text-slate-800 flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-indigo-600" />
                        {p.paymentMethod}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-6 text-slate-600">
                      {p.date}
                    </td>

                    {/* Invoice */}
                    <td className="py-3.5 px-6 font-mono font-semibold text-indigo-600">
                      {p.invoiceNumber}
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-6 text-right font-extrabold text-slate-900 font-mono">
                      {formatINR(p.amount)}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-6 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg}`}>
                        <span className={`w-1 h-1 rounded-full ${badge.dot}`}></span>
                        {badge.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
