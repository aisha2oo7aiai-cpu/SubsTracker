import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils/formatters';
import {
  CheckSquare,
  Plus,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  X,
  User,
} from 'lucide-react';

export const StaffTasks: React.FC = () => {
  const { tasks, addTask, toggleTask, customers, currentUser } = useApp();

  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('pending');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('high');
  const [dueDays, setDueDays] = useState(3);

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'all') return true;
    return t.status === filter;
  });

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === customerId);
    const d = new Date();
    d.setDate(d.getDate() + dueDays);

    await addTask({
      title,
      description,
      assignedStaffId: currentUser.staffId || 'stf-001',
      assignedStaffName: currentUser.name,
      customerId,
      customerName: cust?.name,
      dueDate: d.toISOString().split('T')[0],
      priority,
      status: 'pending',
    });

    setShowAddModal(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Tasks & Follow-up Checklist</h1>
          <p className="text-xs text-slate-500 mt-1">
            Organize customer outreach, overdue invoice resolutions, and renewal touchpoints.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 transition-all hover:shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Task</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
        <div className="flex items-center gap-2">
          {(['pending', 'completed', 'all'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors ${
                filter === f
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {f} ({tasks.filter((t) => (f === 'all' ? true : t.status === f)).length})
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.map((t) => (
          <div
            key={t.id}
            className={`bg-white p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
              t.status === 'completed'
                ? 'border-slate-200 bg-slate-50/50 opacity-70'
                : 'border-slate-200 shadow-xs hover:border-slate-300'
            }`}
          >
            <div className="flex items-start gap-3.5 flex-1">
              <button
                onClick={() => toggleTask(t.id)}
                className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-colors shrink-0 ${
                  t.status === 'completed'
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'border-slate-300 hover:border-emerald-500 bg-white'
                }`}
              >
                {t.status === 'completed' && <CheckCircle2 className="w-4 h-4" />}
              </button>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                      t.priority === 'high'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {t.priority}
                  </span>
                  {t.customerName && (
                    <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                      Client: {t.customerName}
                    </span>
                  )}
                  <span className="text-[11px] text-slate-400">Due {formatDate(t.dueDate)}</span>
                </div>

                <p
                  className={`text-sm font-bold text-slate-900 ${
                    t.status === 'completed' ? 'line-through text-slate-400' : ''
                  }`}
                >
                  {t.title}
                </p>
                <p className="text-xs text-slate-500 leading-relaxed">{t.description}</p>
              </div>
            </div>

            <button
              onClick={() => toggleTask(t.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
                t.status === 'completed'
                  ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              {t.status === 'completed' ? 'Re-open' : 'Mark Done'}
            </button>
          </div>
        ))}
      </div>

      {/* ADD TASK MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Create Follow-up Action</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="py-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Call Vikram regarding failed UPI mandate"
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Related Customer</label>
                <select
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500/20 font-semibold"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.companyName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Due In (Days)</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={dueDays}
                    onChange={(e) => setDueDays(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Action Description</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Specific follow-up instructions, customer objection notes, or payment links..."
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-xs"
                >
                  Schedule Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
