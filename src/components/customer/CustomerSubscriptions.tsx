import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Subscription } from '../../types';
import { formatINR, formatDate, getStatusBadge } from '../../utils/formatters';
import {
  Repeat,
  Calendar,
  CreditCard,
  Layers,
  Pause,
  Play,
  XCircle,
  X,
  Check,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export const CustomerSubscriptions: React.FC = () => {
  const {
    currentUser,
    subscriptions,
    plans,
    pauseSubscription,
    resumeSubscription,
    cancelSubscription,
    changeSubscriptionPlan,
    setActiveTab,
  } = useApp();

  const mySubs = subscriptions.filter((s) => s.customerId === currentUser.customerId);

  const [selectedSubForUpgrade, setSelectedSubForUpgrade] = useState<Subscription | null>(null);
  const [targetPlanId, setTargetPlanId] = useState('');
  const [selectedSubForCancel, setSelectedSubForCancel] = useState<Subscription | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  const handleExecuteUpgrade = async () => {
    if (selectedSubForUpgrade && targetPlanId) {
      const p = plans.find((plan) => plan.id === targetPlanId);
      if (p) {
        await changeSubscriptionPlan(selectedSubForUpgrade.id, p.id, p.name, p.price);
        setSelectedSubForUpgrade(null);
      }
    }
  };

  const handleExecuteCancel = async () => {
    if (selectedSubForCancel) {
      await cancelSubscription(selectedSubForCancel.id, cancelReason || 'Customer self-service request');
      setSelectedSubForCancel(null);
      setCancelReason('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Subscriptions & Licenses</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your active enterprise plans, review billing schedules, or change plan capacity tiers.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('explore')}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs"
        >
          <span>Explore Add-on Services</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Subscriptions List */}
      <div className="space-y-4">
        {mySubs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <Repeat className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-900 text-base">No Subscriptions Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven't activated any recurring services yet. Browse our enterprise catalog to get started.
            </p>
            <button
              onClick={() => setActiveTab('explore')}
              className="mt-2 px-5 py-2.5 bg-blue-600 text-white text-xs font-semibold rounded-xl"
            >
              Browse Catalog
            </button>
          </div>
        ) : (
          mySubs.map((sub) => {
            const badge = getStatusBadge(sub.status);
            return (
              <div
                key={sub.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-slate-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                {/* Left: Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-slate-400">{sub.subscriptionCode}</span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg}`}>
                      <span className={`w-1 h-1 rounded-full ${badge.dot}`}></span>
                      {badge.label}
                    </span>
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md uppercase">
                      {sub.serviceCategory}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">{sub.serviceName}</h3>
                  <p className="text-xs text-slate-600">
                    Plan Tier: <strong className="text-slate-900">{sub.planName}</strong> • {sub.billingCycle} billing cycle
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Started {formatDate(sub.startDate)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                      Renews on <strong className="text-slate-800">{formatDate(sub.nextBillingDate)}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                      {sub.paymentMethod}
                    </span>
                  </div>
                </div>

                {/* Right: Price & Actions */}
                <div className="flex flex-col md:items-end gap-3 shrink-0 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-left md:text-right">
                    <span className="text-2xl font-extrabold text-slate-900 font-mono">{formatINR(sub.amount)}</span>
                    <span className="text-xs text-slate-400 capitalize block">/ {sub.billingCycle}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Upgrade / Change Plan */}
                    <button
                      onClick={() => {
                        setSelectedSubForUpgrade(sub);
                        setTargetPlanId(sub.planId);
                      }}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-xl transition-colors"
                    >
                      Change Plan
                    </button>

                    {/* Pause or Resume */}
                    {sub.status === 'active' ? (
                      <button
                        onClick={() => pauseSubscription(sub.id, 'Paused by subscriber')}
                        className="px-3 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold rounded-xl transition-colors"
                      >
                        Pause
                      </button>
                    ) : sub.status === 'paused' ? (
                      <button
                        onClick={() => resumeSubscription(sub.id)}
                        className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold rounded-xl transition-colors"
                      >
                        Resume
                      </button>
                    ) : null}

                    {/* Cancel */}
                    {sub.status !== 'cancelled' && (
                      <button
                        onClick={() => setSelectedSubForCancel(sub)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Cancel Subscription"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* UPGRADE / CHANGE PLAN MODAL */}
      {selectedSubForUpgrade && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Select New Subscription Plan</h3>
              <button onClick={() => setSelectedSubForUpgrade(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-1">
              <p>Service: <strong className="text-slate-900">{selectedSubForUpgrade.serviceName}</strong></p>
              <p>Current: <span className="font-semibold text-blue-600">{selectedSubForUpgrade.planName}</span> ({formatINR(selectedSubForUpgrade.amount)})</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Available Tiers</label>
              <select
                value={targetPlanId}
                onChange={(e) => setTargetPlanId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 font-semibold focus:ring-2 focus:ring-blue-500/20"
              >
                {plans
                  .filter((p) => p.serviceId === selectedSubForUpgrade.serviceId)
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {formatINR(p.price)} / {p.billingCycle}
                    </option>
                  ))}
              </select>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setSelectedSubForUpgrade(null)}
                className="px-4 py-2 border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteUpgrade}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs"
              >
                Confirm Plan Switch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CANCEL SUBSCRIPTION CONFIRMATION MODAL */}
      {selectedSubForCancel && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Cancel Subscription?</h3>
              <button onClick={() => setSelectedSubForCancel(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-600">
              Are you sure you want to cancel your license for <strong>{selectedSubForCancel.serviceName}</strong>? Your service access will remain active until {formatDate(selectedSubForCancel.nextBillingDate)}.
            </p>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Feedback / Reason (Optional)</label>
              <textarea
                rows={2}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Let us know why you are cancelling..."
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-rose-500/20"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedSubForCancel(null)}
                className="px-3.5 py-1.5 border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-50"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleExecuteCancel}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl shadow-xs"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
