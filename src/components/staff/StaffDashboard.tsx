import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR, formatDate, getStatusBadge } from '../../utils/formatters';
import {
  Users,
  FileSpreadsheet,
  FileText,
  Clock,
  CheckSquare,
  Plus,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Send,
  Phone,
} from 'lucide-react';

export const StaffDashboard: React.FC = () => {
  const {
    currentUser,
    customers,
    subscriptions,
    quotations,
    invoices,
    tasks,
    setActiveTab,
    setPreviewInvoice,
    addToast,
  } = useApp();

  // Filter items assigned to or managed by current staff
  const assignedCustomers = customers.filter(
    (c) => c.assignedStaffId === currentUser.staffId || c.assignedStaffName?.includes('Priya')
  );

  const pendingQuotes = quotations.filter((q) => q.status === 'sent');
  const awaitingPaymentInvoices = invoices.filter((i) => i.status !== 'paid');
  const urgentTasks = tasks.filter((t) => t.status === 'pending');

  const upcomingRenewals = subscriptions
    .filter((s) => s.status === 'active')
    .sort((a, b) => new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime())
    .slice(0, 4);

  const handleNudgePayment = (inv: any) => {
    addToast({
      title: 'Payment Reminder Dispatched',
      message: `Sent WhatsApp & Email reminder to ${inv.customerName} for ${inv.invoiceNumber}.`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 text-white shadow-md shadow-emerald-700/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-semibold text-emerald-100 uppercase tracking-wider block">Staff Operations Workspace</span>
          <h1 className="text-2xl font-bold mt-1">Hello, {currentUser.name}! 👋</h1>
          <p className="text-xs text-emerald-100 mt-1 max-w-xl">
            You have <strong className="text-white">{urgentTasks.length} pending follow-up tasks</strong> and <strong className="text-white">{awaitingPaymentInvoices.length} invoices</strong> requiring settlement attention today.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('quotations')}
            className="px-4 py-2 bg-white text-emerald-800 rounded-xl font-semibold text-xs hover:bg-emerald-50 transition-colors shadow-xs"
          >
            Create Quote
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className="px-4 py-2 bg-emerald-800/60 hover:bg-emerald-800 text-white rounded-xl font-semibold text-xs border border-emerald-500/40 transition-colors"
          >
            View Checklist
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500">My Assigned Accounts</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{assignedCustomers.length}</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Enterprise Clients</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500">Pending Quotations</span>
          <p className="text-2xl font-extrabold text-indigo-600 mt-1">{pendingQuotes.length}</p>
          <span className="text-[11px] text-indigo-600 font-semibold mt-0.5 block">Awaiting Client Approval</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500">Invoices Awaiting Payment</span>
          <p className="text-2xl font-extrabold text-rose-600 mt-1">{awaitingPaymentInvoices.length}</p>
          <span className="text-[11px] text-rose-600 font-semibold mt-0.5 block">Follow-up Needed</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-500">Tasks Due This Week</span>
          <p className="text-2xl font-extrabold text-amber-600 mt-1">{urgentTasks.length}</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">High Priority Follow-ups</span>
        </div>
      </div>

      {/* Two Columns: Actionable Tasks & Invoices Requiring Follow-up */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Follow-up Tasks (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-600" />
                Tasks & Client Follow-ups
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">High-priority billing and contract actions</p>
            </div>
            <button
              onClick={() => setActiveTab('tasks')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-800"
            >
              Open Board →
            </button>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {urgentTasks.slice(0, 4).map((task) => (
              <div key={task.id} className="py-3 flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-md uppercase tracking-wider ${
                        task.priority === 'high'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {task.priority}
                    </span>
                    <span className="text-slate-400 font-medium">Due {formatDate(task.dueDate)}</span>
                  </div>
                  <p className="font-bold text-slate-900 mt-1 leading-snug">{task.title}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{task.description}</p>
                </div>
                <button
                  onClick={() => setActiveTab('tasks')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 rounded-lg font-semibold text-xs shrink-0"
                >
                  Manage
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Invoices Awaiting Payment (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-rose-600" />
                  Invoices Awaiting Payment
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Collect via phone or UPI e-mandate</p>
              </div>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {awaitingPaymentInvoices.slice(0, 4).map((inv) => (
                <div key={inv.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">{inv.customerName}</p>
                    <p className="text-[11px] text-slate-500 font-mono">{inv.invoiceNumber} • Due {formatDate(inv.dueDate)}</p>
                    <span className={`text-[10px] font-bold mt-0.5 block ${inv.status === 'overdue' ? 'text-rose-600' : 'text-amber-600'}`}>
                      {inv.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-slate-900 font-mono">{formatINR(inv.totalAmount)}</p>
                    <button
                      onClick={() => handleNudgePayment(inv)}
                      className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      <Send className="w-3 h-3" /> Remind
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={() => setActiveTab('invoices')}
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl transition-colors text-center block"
            >
              View Full Billing Ledger
            </button>
          </div>
        </div>
      </div>

      {/* Assigned Customers Quick View */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              My Assigned Client Portfolio ({assignedCustomers.length})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Direct contact and subscription oversight</p>
          </div>
          <button
            onClick={() => setActiveTab('my_customers')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Manage Accounts →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {assignedCustomers.slice(0, 3).map((cust) => (
            <div key={cust.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-slate-900">{cust.name}</h4>
                  <p className="text-[11px] text-slate-500">{cust.companyName}</p>
                </div>
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                  {cust.activeSubscriptionsCount} Active Subs
                </span>
              </div>
              <div className="text-[11px] text-slate-600 space-y-0.5">
                <p>Email: {cust.email}</p>
                <p>Phone: {cust.phone}</p>
                <p className="font-semibold text-slate-800">Total Spend: {formatINR(cust.totalSpend)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
