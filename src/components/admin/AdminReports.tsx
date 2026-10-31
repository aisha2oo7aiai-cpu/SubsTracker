import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../utils/formatters';
import {
  BarChart3,
  TrendingUp,
  CreditCard,
  Users,
  Repeat,
  Download,
  Calendar,
  AlertCircle,
  PieChart as PieIcon,
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
  Legend,
} from 'recharts';

export const AdminReports: React.FC = () => {
  const { subscriptions, invoices, payments, customers, addToast } = useApp();

  const [dateRange, setDateRange] = useState<'30d' | '90d' | '12m'>('12m');

  const activeSubs = subscriptions.filter((s) => s.status === 'active');
  const mrr = activeSubs.reduce((sum, s) => sum + s.amount, 0);
  const arr = mrr * 12;
  const arpu = customers.length > 0 ? Math.round(mrr / customers.length) : 0;
  const churnRate = 2.4; // % enterprise benchmark
  const ltv = Math.round(arpu * (100 / churnRate));

  // Payment Method Breakdown
  const methodData = [
    { name: 'UPI Auto-Debit', value: 45, color: '#4F46E5' },
    { name: 'Corporate Cards', value: 30, color: '#10B981' },
    { name: 'Net Banking (RTGS)', value: 18, color: '#3B82F6' },
    { name: 'NACH Mandate', value: 7, color: '#F59E0B' },
  ];

  // Monthly Subscriptions Growth Bar Data
  const growthData = [
    { month: 'May', newSubs: 3, churned: 0, netGrowth: 3 },
    { month: 'Jun', newSubs: 4, churned: 1, netGrowth: 3 },
    { month: 'Jul', newSubs: 5, churned: 0, netGrowth: 5 },
    { month: 'Aug', newSubs: 4, churned: 1, netGrowth: 3 },
    { month: 'Sep', newSubs: 6, churned: 1, netGrowth: 5 },
    { month: 'Oct', newSubs: 5, churned: 0, netGrowth: 5 },
  ];

  // Cancellation reasons breakdown
  const cancellationReasons = [
    { reason: 'Project completed / Migration concluded', count: 4, percent: '44%' },
    { reason: 'Budget re-allocation during fiscal year-end', count: 3, percent: '33%' },
    { reason: 'Feature bandwidth requirement changed', count: 2, percent: '23%' },
  ];

  const handleExportReport = () => {
    addToast({
      title: 'Executive Financial Report',
      message: 'Comprehensive PDF statement generated and dispatched to your email.',
      type: 'success',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Financial Reports & Executive Analytics</h1>
          <p className="text-xs text-slate-500 mt-1">
            Audited MRR, Annualized Run Rate (ARR), Customer Lifetime Value (LTV), and churn mitigation metrics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-800 font-semibold focus:outline-none"
          >
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last Quarter (90 Days)</option>
            <option value="12m">Year-to-Date (FY 2026)</option>
          </select>
          <button
            onClick={handleExportReport}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Financial Audit</span>
          </button>
        </div>
      </div>

      {/* 5 Core SaaS Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">MRR</span>
          <p className="text-xl font-extrabold text-slate-900 mt-1 font-mono">{formatINR(mrr)}</p>
          <span className="text-[10px] text-emerald-600 font-bold mt-1 block">+18.4% MoM</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">ARR (Annualized)</span>
          <p className="text-xl font-extrabold text-slate-900 mt-1 font-mono">{formatINR(arr)}</p>
          <span className="text-[10px] text-emerald-600 font-bold mt-1 block">Contract Run Rate</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">ARPU (Per Account)</span>
          <p className="text-xl font-extrabold text-indigo-600 mt-1 font-mono">{formatINR(arpu)}</p>
          <span className="text-[10px] text-slate-500 mt-1 block">Monthly Average</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Gross Churn Rate</span>
          <p className="text-xl font-extrabold text-emerald-600 mt-1 font-mono">{churnRate}%</p>
          <span className="text-[10px] text-slate-500 mt-1 block">Top Decile SaaS</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 col-span-2 lg:col-span-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Customer LTV</span>
          <p className="text-xl font-extrabold text-slate-900 mt-1 font-mono">{formatINR(ltv, true)}</p>
          <span className="text-[10px] text-indigo-600 font-bold mt-1 block">42-Month Horizon</span>
        </div>
      </div>

      {/* Visual Charts: Growth Velocity & Payment Method Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Net Subscription Growth Bar Chart (8 Cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Subscription Fleet Velocity</h3>
              <p className="text-xs text-slate-500 mt-0.5">New client additions vs voluntary cancellations</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-sm bg-indigo-600"></span> New Activations
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span> Net Retention
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="newSubs" name="New Subscriptions" fill="#4F46E5" radius={[6, 6, 0, 0]} />
                <Bar dataKey="netGrowth" name="Net Growth" fill="#10B981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Payment Channels Pie Chart (4 Cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Payment Channel Breakdown</h3>
            <p className="text-xs text-slate-500 mt-0.5">Share of recurring payment mandates</p>

            <div className="h-44 w-full mt-2 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={methodData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={68}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {methodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => [`${val}%`, 'Share']}
                    contentStyle={{ borderRadius: '10px', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-lg font-extrabold text-slate-900">100%</span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Digital</span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5 pt-4 border-t border-slate-100 text-xs">
            {methodData.map((m) => (
              <div key={m.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }}></span>
                  <span className="text-slate-600">{m.name}</span>
                </div>
                <span className="font-bold text-slate-900">{m.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cancellation Audit Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-1">Voluntary Cancellation Intelligence</h3>
        <p className="text-xs text-slate-500 mb-4">Root causes identified for contract adjustments</p>
        <div className="divide-y divide-slate-100 text-xs">
          {cancellationReasons.map((item, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between">
              <span className="font-medium text-slate-800">{item.reason}</span>
              <div className="flex items-center gap-4">
                <span className="text-slate-500">{item.count} Accounts</span>
                <span className="font-bold text-slate-900 w-12 text-right">{item.percent}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
