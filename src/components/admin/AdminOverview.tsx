import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR, formatDate, getStatusBadge } from '../../utils/formatters';
import { geminiApi } from '../../services/api';
import {
  TrendingUp,
  CreditCard,
  Repeat,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
  Send,
  Loader2,
  X,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const AdminOverview: React.FC = () => {
  const {
    subscriptions,
    invoices,
    payments,
    services,
    customers,
    setActiveTab,
    setPreviewInvoice,
    addToast,
    markInvoicePaid,
  } = useApp();

  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [showAiModal, setShowAiModal] = useState(false);

  // 1. Compute Major KPI Values
  const totalRevenue = payments
    .filter((p) => p.status === 'success')
    .reduce((sum, p) => sum + p.amount, 0);

  const activeSubs = subscriptions.filter((s) => s.status === 'active');
  const mrr = activeSubs.reduce((sum, s) => sum + s.amount, 0);

  const outstandingInvoices = invoices.filter((i) => i.status !== 'paid');
  const outstandingAmount = outstandingInvoices.reduce((sum, i) => sum + i.totalAmount, 0);

  const overdueInvoices = invoices.filter((i) => i.status === 'overdue');

  // Chart Data: Revenue Trajectory (Last 6 Months in INR)
  const revenueChartData = [
    { month: 'May', revenue: 185000, mrr: 160000 },
    { month: 'Jun', revenue: 210000, mrr: 195000 },
    { month: 'Jul', revenue: 242000, mrr: 218000 },
    { month: 'Aug', revenue: 275000, mrr: 246000 },
    { month: 'Sep', revenue: 310000, mrr: 268000 },
    { month: 'Oct', revenue: 345800, mrr: mrr },
  ];

  // Subscription Status Pie Data
  const activeCount = subscriptions.filter((s) => s.status === 'active').length;
  const pausedCount = subscriptions.filter((s) => s.status === 'paused').length;
  const pastDueCount = subscriptions.filter((s) => s.status === 'past_due').length;
  const cancelledCount = subscriptions.filter((s) => s.status === 'cancelled').length;

  const pieData = [
    { name: 'Active', value: activeCount, color: '#10B981' },
    { name: 'Paused', value: pausedCount, color: '#3B82F6' },
    { name: 'Past Due', value: pastDueCount, color: '#EF4444' },
    { name: 'Cancelled', value: cancelledCount, color: '#94A3B8' },
  ];

  // Upcoming Renewals (next 15 days)
  const upcomingRenewals = [...subscriptions]
    .filter((s) => s.status === 'active')
    .sort((a, b) => new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime())
    .slice(0, 5);

  // Recent Transactions
  const recentTransactions = [...payments].slice(0, 5);

  // Gemini AI Strategic Revenue Audit trigger
  const runAiRevenueAudit = async () => {
    setIsAiLoading(true);
    setShowAiModal(true);
    try {
      const insight = await geminiApi.analyzeRevenue({
        totalRevenue,
        mrr,
        activeCount,
        overdueCount: overdueInvoices.length,
      });
      setAiReport(insight);
    } catch (err) {
      setAiReport('Failed to generate audit. Please try again.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSendReminder = (invoiceNumber: string, email: string) => {
    addToast({
      title: 'Payment Reminder Sent',
      message: `Dispatched overdue notice for invoice ${invoiceNumber} to ${email}.`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header with Action Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.035em] text-[#1b1411]">Executive Revenue Overview</h1>
          <p className="text-sm text-[#66574f] mt-1">
            Real-time financial performance, active subscriptions, and cash flow across all services.
          </p>
        </div>

        {/* Gemini AI Audit Button - 8B Primary Green Pill */}
        <button
          onClick={runAiRevenueAudit}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#33cc7a] hover:bg-[#2bb56c] text-[#1b1411] font-semibold text-xs shadow-[0_12px_28px_-12px_rgba(51,204,122,0.65)] hover:-translate-y-0.5 transition-all"
        >
          <Sparkles className="w-4 h-4 text-[#1b1411]" />
          <span>Ask Gemini AI Revenue Audit</span>
        </button>
      </div>

      {/* 4 MAJOR FINANCIAL KPI CARDS - 8B Card Radius (28px) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: Total Revenue */}
        <div className="bg-white p-6 rounded-[28px] border border-[#1b1411]/8 shadow-[0_12px_32px_-16px_rgba(27,20,17,0.06)] hover:border-[#33cc7a]/40 transition-all">
          <div className="flex items-center justify-between text-[#66574f] text-xs font-semibold">
            <span>Total Revenue</span>
            <div className="w-9 h-9 rounded-full bg-[#eee5dc] text-[#1b1411] flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold tracking-tight text-[#1b1411] mt-3 font-mono">{formatINR(totalRevenue)}</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-[#1b1411] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#33cc7a]"></span>
            <span>+24.8% vs last quarter</span>
          </div>
        </div>

        {/* KPI 2: MRR */}
        <div className="bg-white p-6 rounded-[28px] border border-[#1b1411]/8 shadow-[0_12px_32px_-16px_rgba(27,20,17,0.06)] hover:border-[#33cc7a]/40 transition-all">
          <div className="flex items-center justify-between text-[#66574f] text-xs font-semibold">
            <span>Monthly Recurring (MRR)</span>
            <div className="w-9 h-9 rounded-full bg-[#eee5dc] text-[#1b1411] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold tracking-tight text-[#1b1411] mt-3 font-mono">{formatINR(mrr)}</p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-[#1b1411] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#33cc7a]"></span>
            <span>+18.4% MoM expansion</span>
          </div>
        </div>

        {/* KPI 3: Active Subscriptions */}
        <div className="bg-white p-6 rounded-[28px] border border-[#1b1411]/8 shadow-[0_12px_32px_-16px_rgba(27,20,17,0.06)] hover:border-[#33cc7a]/40 transition-all">
          <div className="flex items-center justify-between text-[#66574f] text-xs font-semibold">
            <span>Active Subscriptions</span>
            <div className="w-9 h-9 rounded-full bg-[#eee5dc] text-[#1b1411] flex items-center justify-center">
              <Repeat className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold tracking-tight text-[#1b1411] mt-3 font-mono">{activeCount} / {subscriptions.length}</p>
          <div className="mt-2.5 text-xs text-[#66574f]">
            <span className="font-semibold text-[#1b1411]">{customers.length}</span> enterprise clients
          </div>
        </div>

        {/* KPI 4: Outstanding Payments */}
        <div className="bg-white p-6 rounded-[28px] border border-[#1b1411]/8 shadow-[0_12px_32px_-16px_rgba(27,20,17,0.06)] hover:border-[#33cc7a]/40 transition-all">
          <div className="flex items-center justify-between text-[#66574f] text-xs font-semibold">
            <span>Outstanding Invoices</span>
            <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold tracking-tight text-rose-600 mt-3 font-mono">{formatINR(outstandingAmount)}</p>
          <div className="mt-2.5 flex items-center gap-1 text-xs text-rose-600 font-semibold">
            <span>{outstandingInvoices.length} pending ({overdueInvoices.length} overdue)</span>
          </div>
        </div>
      </div>

      {/* OVERDUE INVOICES ALERT BANNER (If any exist) */}
      {overdueInvoices.length > 0 && (
        <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-rose-900">
                Action Required: {overdueInvoices.length} Invoice(s) Past Due Grace Period
              </p>
              <p className="text-xs text-rose-700 mt-0.5">
                Totaling {formatINR(overdueInvoices.reduce((sum, i) => sum + i.totalAmount, 0))}. Send payment reminders or arrange alternative bank RTGS.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('invoices')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 bg-white border border-rose-200 hover:bg-rose-100 transition-colors"
            >
              View Invoices
            </button>
          </div>
        </div>
      )}

      {/* DATA VISUALIZATIONS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Revenue & MRR Growth AreaChart (8 Cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Revenue & MRR Velocity</h3>
              <p className="text-xs text-slate-500 mt-0.5">Monthly trajectory in Indian Rupees (INR)</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-[#282B4A]"></span> Total Collections
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span> Recurring (MRR)
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#282B4A" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#282B4A" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorMRR" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#94A3B8"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `₹${val / 1000}k`}
                />
                <Tooltip
                  formatter={(val: any) => [formatINR(val), '']}
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #E2DDD0',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Area type="monotone" dataKey="revenue" name="Total Collections" stroke="#282B4A" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="mrr" name="Recurring MRR" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorMRR)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Subscription Status Pie Breakdown (4 Cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Subscription Status</h3>
            <p className="text-xs text-slate-500 mt-0.5">Portfolio distribution across all tiers</p>

            <div className="h-44 w-full mt-2 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={72}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: '10px',
                      border: '1px solid #E2E8F0',
                      fontSize: '11px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-extrabold text-slate-900">{subscriptions.length}</span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Total</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-100 text-xs">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></span>
                <span className="text-slate-600">{d.name}:</span>
                <span className="font-bold text-slate-900 ml-auto">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TWO COLUMN GRID: UPCOMING RENEWALS & RECENT TRANSACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Renewals */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                Upcoming Renewals (Next 14 Days)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Automated e-mandates & scheduled auto-debits</p>
            </div>
            <button
              onClick={() => setActiveTab('subscriptions')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              View All
            </button>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {upcomingRenewals.map((sub) => (
              <div key={sub.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">{sub.customerName}</p>
                  <p className="text-[11px] text-slate-500">
                    {sub.serviceName} • <span className="font-medium text-slate-700">{sub.planName}</span>
                  </p>
                  <span className="text-[10px] text-indigo-600 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" /> Due {formatDate(sub.nextBillingDate)}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-slate-900 font-mono">{formatINR(sub.amount)}</p>
                  <span className="text-[10px] text-slate-400 block">{sub.paymentMethod}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Payment Transactions */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                Recent Financial Settlements
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Verified bank & UPI transaction audit log</p>
            </div>
            <button
              onClick={() => setActiveTab('payments')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              View History
            </button>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {recentTransactions.map((pmt) => {
              const badge = getStatusBadge(pmt.status);
              return (
                <div key={pmt.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">{pmt.customerName}</p>
                    <p className="text-[11px] text-slate-500 font-mono">{pmt.transactionId} • {pmt.paymentMethod}</p>
                    <span className="text-[10px] text-slate-400">{pmt.date}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-slate-900 font-mono">{formatINR(pmt.amount)}</p>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[10px] font-bold border mt-0.5 ${badge.bg}`}>
                      <span className={`w-1 h-1 rounded-full ${badge.dot}`}></span>
                      {badge.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* GEMINI AI STRATEGIC REVENUE AUDIT MODAL */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Gemini Strategic Revenue Audit</h3>
                  <p className="text-[11px] text-slate-500">Autonomous SaaS intelligence analyzing MRR health & churn</p>
                </div>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-6 overflow-y-auto flex-1 text-xs text-slate-700 leading-relaxed space-y-4">
              {isAiLoading ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                  <p className="font-semibold text-slate-800 text-sm">Evaluating Subscription Cohorts...</p>
                  <p className="text-slate-500 text-xs max-w-xs">
                    Synthesizing cash collection velocity, customer retention indices, and invoice aging...
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 whitespace-pre-line font-sans leading-relaxed text-slate-800">
                  {aiReport}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">Model: gemini-3.8-flash</span>
              <button
                onClick={() => setShowAiModal(false)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
