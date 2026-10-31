import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR, formatDate, getStatusBadge } from '../../utils/formatters';
import {
  FileText,
  Printer,
  Download,
  CreditCard,
  Eye,
  CheckCircle,
  AlertCircle,
  Clock,
} from 'lucide-react';

export const CustomerInvoices: React.FC = () => {
  const { currentUser, invoices, setPreviewInvoice, markInvoicePaid } = useApp();

  const myInvoices = invoices.filter((i) => i.customerId === currentUser.customerId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Invoices & Tax Receipts</h1>
        <p className="text-xs text-slate-500 mt-1">
          Review generated GST tax invoices, download PDF records for corporate accounting, or settle open balances.
        </p>
      </div>

      {/* Invoices List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-6">Invoice Number</th>
                <th className="py-3.5 px-6">Billing Description</th>
                <th className="py-3.5 px-6">Issue Date</th>
                <th className="py-3.5 px-6">Payment Due</th>
                <th className="py-3.5 px-6 text-right">Amount (with 18% GST)</th>
                <th className="py-3.5 px-6 text-center">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {myInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No billing statements on file.
                  </td>
                </tr>
              ) : (
                myInvoices.map((inv) => {
                  const badge = getStatusBadge(inv.status);
                  const item = inv.items[0];
                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Invoice No */}
                      <td className="py-3.5 px-6 font-mono font-bold text-slate-900">
                        {inv.invoiceNumber}
                      </td>

                      {/* Description */}
                      <td className="py-3.5 px-6">
                        <p className="font-semibold text-slate-900">{item?.description || 'Recurring Subscription'}</p>
                        <p className="text-[11px] text-slate-400">GST Input Tax Credit Eligible</p>
                      </td>

                      {/* Issue Date */}
                      <td className="py-3.5 px-6 text-slate-600 font-medium">
                        {formatDate(inv.issueDate)}
                      </td>

                      {/* Due Date */}
                      <td className="py-3.5 px-6">
                        <span className={`font-semibold ${inv.status === 'overdue' ? 'text-rose-600' : 'text-slate-800'}`}>
                          {formatDate(inv.dueDate)}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-6 text-right font-extrabold text-slate-900 font-mono">
                        {formatINR(inv.totalAmount)}
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
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setPreviewInvoice(inv)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1"
                            title="View / Print Tax PDF"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span className="text-xs font-semibold">View</span>
                          </button>

                          {inv.status !== 'paid' && (
                            <button
                              onClick={() => markInvoicePaid(inv.id, 'UPI Instant Pay')}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-xs"
                            >
                              Pay Now
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
