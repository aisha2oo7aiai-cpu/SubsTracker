import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR, formatDate, getStatusBadge } from '../../utils/formatters';
import {
  Compass,
  Repeat,
  FileText,
  CreditCard,
  Clock,
  ArrowRight,
  ShieldCheck,
  LifeBuoy,
  CheckCircle2,
} from 'lucide-react';

export const CustomerOverview: React.FC = () => {
  const { currentUser, subscriptions, invoices, payments, setActiveTab, setPreviewInvoice } = useApp();

  const mySubs = subscriptions.filter((s) => s.customerId === currentUser.customerId);
  const myActiveSubs = mySubs.filter((s) => s.status === 'active');
  const myInvoices = invoices.filter((i) => i.customerId === currentUser.customerId);
  const myPayments = payments.filter((p) => p.customerId === currentUser.customerId);

  const pendingInvoice = myInvoices.find((i) => i.status !== 'paid');

  const totalSpent = myPayments
    .filter((p) => p.status === 'success')
    .reduce((sum, p) => sum + p.amount, 0);

  // Next upcoming renewal
  const nextRenewalSub = myActiveSubs.sort(
    (a, b) => new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime()
  )[0];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-800 rounded-2xl p-6 text-white shadow-lg shadow-indigo-700/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-semibold text-blue-100 uppercase tracking-wider block">Customer Experience Portal</span>
          <h1 className="text-2xl font-bold mt-1">Welcome back, {currentUser.name}! 👋</h1>
          <p className="text-xs text-blue-100 mt-1 max-w-xl">
            You currently have <strong className="text-white">{myActiveSubs.length} active enterprise subscriptions</strong> under {currentUser.companyName}.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('explore')}
          className="px-4 py-2 bg-white text-indigo-900 rounded-xl font-semibold text-xs hover:bg-blue-50 transition-colors shadow-xs flex items-center gap-1.5"
        >
          <Compass className="w-4 h-4 text-indigo-600" />
          <span>Explore Services Catalog</span>
        </button>
      </div>

      {/* 3 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Active Plans */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Active Subscriptions</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Repeat className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{myActiveSubs.length} Live Plans</p>
          <button
            onClick={() => setActiveTab('my_subscriptions')}
            className="text-xs text-blue-600 font-semibold hover:underline mt-2 block"
          >
            Manage plans & renewal →
          </button>
        </div>

        {/* Card 2: Upcoming Payment */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Next Auto-Renewal</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          {nextRenewalSub ? (
            <>
              <p className="text-2xl font-extrabold text-slate-900 mt-2 font-mono">{formatINR(nextRenewalSub.amount)}</p>
              <p className="text-xs text-slate-500 mt-1">
                Due on <strong className="text-slate-800">{formatDate(nextRenewalSub.nextBillingDate)}</strong> ({nextRenewalSub.serviceName})
              </p>
            </>
          ) : (
            <p className="text-sm font-semibold text-slate-500 mt-3">No upcoming renewals scheduled</p>
          )}
        </div>

        {/* Card 3: Total Spend */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Cumulative Spend</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2 font-mono">{formatINR(totalSpent)}</p>
          <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> All tax invoices verified
          </p>
        </div>
      </div>

      {/* Pending Bill Notice if unpaid invoice exists */}
      {pendingInvoice && (
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-amber-900">
              Tax Invoice #{pendingInvoice.invoiceNumber} Pending ({formatINR(pendingInvoice.totalAmount)})
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              Due on {formatDate(pendingInvoice.dueDate)}. Settle now via UPI or Corporate Net Banking.
            </p>
          </div>
          <button
            onClick={() => setPreviewInvoice(pendingInvoice)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs"
          >
            Review & Pay Invoice
          </button>
        </div>
      )}

      {/* Two Column Grid: Current Plans & Recent Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Subscriptions */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">My Active Services</h3>
              <p className="text-xs text-slate-500 mt-0.5">Subscriptions linked to your company account</p>
            </div>
            <button
              onClick={() => setActiveTab('my_subscriptions')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              View Details
            </button>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {mySubs.length === 0 ? (
              <div className="py-8 text-center text-slate-400">
                You haven't subscribed to any services yet.
              </div>
            ) : (
              mySubs.map((sub) => {
                const badge = getStatusBadge(sub.status);
                return (
                  <div key={sub.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">{sub.serviceName}</p>
                      <p className="text-[11px] text-slate-500">{sub.planName} • {sub.billingCycle}</p>
                      <span className="text-[10px] text-slate-400">Renews on {formatDate(sub.nextBillingDate)}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-slate-900 font-mono">{formatINR(sub.amount)}</p>
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

        {/* Recent Payment Receipts */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recent Payment Receipts</h3>
              <p className="text-xs text-slate-500 mt-0.5">Automated debit settlements & invoices</p>
            </div>
            <button
              onClick={() => setActiveTab('payments')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              All Receipts
            </button>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {myPayments.length === 0 ? (
              <div className="py-8 text-center text-slate-400">No payment records found.</div>
            ) : (
              myPayments.slice(0, 4).map((pmt) => (
                <div key={pmt.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900 font-mono">{pmt.transactionId}</p>
                    <p className="text-[11px] text-slate-500">{pmt.invoiceNumber} • {pmt.paymentMethod}</p>
                    <span className="text-[10px] text-slate-400">{pmt.date}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-slate-900 font-mono">{formatINR(pmt.amount)}</p>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-200 mt-0.5 inline-block">
                      CONFIRMED
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
