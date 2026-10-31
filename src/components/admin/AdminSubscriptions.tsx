import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Subscription, SubscriptionStatus } from '../../types';
import { formatINR, formatDate, getStatusBadge } from '../../utils/formatters';
import {
  Repeat,
  Search,
  Filter,
  Play,
  Pause,
  RefreshCw,
  XCircle,
  MoreVertical,
  CheckCircle2,
  Calendar,
  Layers,
  X,
  CreditCard,
  Edit2,
} from 'lucide-react';

export const AdminSubscriptions: React.FC = () => {
  const {
    subscriptions,
    plans,
    pauseSubscription,
    resumeSubscription,
    renewSubscription,
    cancelSubscription,
    changeSubscriptionPlan,
    searchQuery,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);
  const [showPlanChangeModal, setShowPlanChangeModal] = useState<Subscription | null>(null);
  const [targetPlanId, setTargetPlanId] = useState('');
  const [pauseReason, setPauseReason] = useState('');
  const [showPauseModal, setShowPauseModal] = useState<Subscription | null>(null);
  const [showCancelModal, setShowCancelModal] = useState<Subscription | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  const filteredSubs = subscriptions.filter((s) => {
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      s.subscriptionCode.toLowerCase().includes(q) ||
      s.customerName.toLowerCase().includes(q) ||
      s.serviceName.toLowerCase().includes(q) ||
      s.planName.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const handleExecutePause = async () => {
    if (showPauseModal) {
      await pauseSubscription(showPauseModal.id, pauseReason || 'Manual administrative pause');
      setShowPauseModal(null);
      setPauseReason('');
    }
  };

  const handleExecuteCancel = async () => {
    if (showCancelModal) {
      await cancelSubscription(showCancelModal.id, cancelReason || 'Contract terminated by admin');
      setShowCancelModal(null);
      setCancelReason('');
    }
  };

  const handleExecutePlanChange = async () => {
    if (showPlanChangeModal && targetPlanId) {
      const plan = plans.find((p) => p.id === targetPlanId);
      if (plan) {
        await changeSubscriptionPlan(showPlanChangeModal.id, plan.id, plan.name, plan.price);
        setShowPlanChangeModal(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Subscription Fleet Operations</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage active service agreements, execute automated renewals, and process tier adjustments.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
            {subscriptions.filter((s) => s.status === 'active').length} Active
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
            {subscriptions.filter((s) => s.status === 'paused').length} Paused
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200">
            {subscriptions.filter((s) => s.status === 'past_due').length} Past Due
          </span>
        </div>
      </div>

      {/* Filter and Count Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {(['all', 'active', 'paused', 'past_due', 'cancelled'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-800">{filteredSubs.length}</span> Records
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-6">Subscription ID</th>
                <th className="py-3.5 px-6">Customer</th>
                <th className="py-3.5 px-6">Service & Plan Tier</th>
                <th className="py-3.5 px-6">Next Billing</th>
                <th className="py-3.5 px-6 text-right">Recurring Fee</th>
                <th className="py-3.5 px-6 text-center">Status</th>
                <th className="py-3.5 px-6 text-right">Lifecycle Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredSubs.map((sub) => {
                const badge = getStatusBadge(sub.status);
                return (
                  <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Sub ID */}
                    <td className="py-3.5 px-6 font-mono font-bold text-slate-900">
                      {sub.subscriptionCode}
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-6">
                      <p className="font-bold text-slate-900 leading-snug">{sub.customerName}</p>
                      <p className="text-[11px] text-slate-500">{sub.customerEmail}</p>
                    </td>

                    {/* Service & Plan */}
                    <td className="py-3.5 px-6">
                      <p className="font-semibold text-slate-900">{sub.serviceName}</p>
                      <p className="text-[11px] text-indigo-600 font-medium">{sub.planName}</p>
                    </td>

                    {/* Next Billing */}
                    <td className="py-3.5 px-6">
                      <span className="font-medium text-slate-800 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {formatDate(sub.nextBillingDate)}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5 capitalize">
                        {sub.billingCycle} Cycle
                      </span>
                    </td>

                    {/* Recurring Fee */}
                    <td className="py-3.5 px-6 text-right font-extrabold text-slate-900 font-mono">
                      {formatINR(sub.amount)}
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
                        {/* Renew */}
                        {sub.status === 'active' && (
                          <button
                            onClick={() => renewSubscription(sub.id)}
                            className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Advance Next Billing Cycle"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Pause or Resume */}
                        {sub.status === 'active' ? (
                          <button
                            onClick={() => setShowPauseModal(sub)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Pause Subscription"
                          >
                            <Pause className="w-3.5 h-3.5" />
                          </button>
                        ) : sub.status === 'paused' ? (
                          <button
                            onClick={() => resumeSubscription(sub.id)}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors font-bold"
                            title="Resume Subscription"
                          >
                            <Play className="w-3.5 h-3.5" />
                          </button>
                        ) : null}

                        {/* Change Plan */}
                        <button
                          onClick={() => {
                            setShowPlanChangeModal(sub);
                            setTargetPlanId(sub.planId);
                          }}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Upgrade / Change Plan"
                        >
                          <Layers className="w-3.5 h-3.5" />
                        </button>

                        {/* Cancel */}
                        {sub.status !== 'cancelled' && (
                          <button
                            onClick={() => setShowCancelModal(sub)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Cancel Subscription"
                          >
                            <XCircle className="w-3.5 h-3.5" />
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

      {/* MODAL: PAUSE SUBSCRIPTION */}
      {showPauseModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Pause Subscription</h3>
              <button onClick={() => setShowPauseModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600">
              Temporarily freeze recurring billing for <strong>{showPauseModal.customerName}</strong> ({showPauseModal.serviceName}).
            </p>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Hold</label>
              <textarea
                rows={2}
                value={pauseReason}
                onChange={(e) => setPauseReason(e.target.value)}
                placeholder="Client requested temporary holiday freeze..."
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowPauseModal(null)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50"
              >
                Back
              </button>
              <button
                onClick={handleExecutePause}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
              >
                Confirm Pause
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CANCEL SUBSCRIPTION */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Cancel Agreement</h3>
              <button onClick={() => setShowCancelModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600">
              Terminate subscription for <strong>{showCancelModal.customerName}</strong>. Auto-debits will cease immediately.
            </p>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Cancellation Reason</label>
              <textarea
                rows={2}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Migration completed or budget reallocated..."
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-rose-500/20"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCancelModal(null)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50"
              >
                Back
              </button>
              <button
                onClick={handleExecuteCancel}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl"
              >
                Terminate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CHANGE / UPGRADE PLAN */}
      {showPlanChangeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Modify Subscription Tier</h3>
              <button onClick={() => setShowPlanChangeModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-1">
              <p>Customer: <strong className="text-slate-900">{showPlanChangeModal.customerName}</strong></p>
              <p>Current Tier: <span className="font-semibold text-indigo-600">{showPlanChangeModal.planName}</span> ({formatINR(showPlanChangeModal.amount)})</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Select New Tier</label>
              <select
                value={targetPlanId}
                onChange={(e) => setTargetPlanId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/20 font-semibold"
              >
                {plans
                  .filter((p) => p.serviceId === showPlanChangeModal.serviceId)
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {formatINR(p.price)} / {p.billingCycle}
                    </option>
                  ))}
              </select>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setShowPlanChangeModal(null)}
                className="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleExecutePlanChange}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs"
              >
                Apply Plan Upgrade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
