import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SupportTicket } from '../../types';
import { formatDate } from '../../utils/formatters';
import {
  LifeBuoy,
  Plus,
  MessageSquare,
  Send,
  CheckCircle2,
  Clock,
  X,
  User,
  Shield,
} from 'lucide-react';

export const CustomerSupport: React.FC = () => {
  const { currentUser, supportTickets, addSupportTicket, replySupportTicket } = useApp();

  const myTickets = supportTickets.filter((t) => t.customerId === currentUser.customerId);
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(myTickets[0] || null);

  const [showNewModal, setShowNewModal] = useState(false);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<'Billing' | 'Technical' | 'Plan Change' | 'Account' | 'Other'>('Billing');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [initialMessage, setInitialMessage] = useState('');

  const [replyText, setReplyText] = useState('');

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await addSupportTicket(
      {
        customerId: currentUser.customerId || 'cust-001',
        customerName: currentUser.name,
        subject,
        category,
        priority,
      },
      initialMessage
    );
    setShowNewModal(false);
    setSubject('');
    setInitialMessage('');
    setActiveTicket(created);
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket || !replyText.trim()) return;

    await replySupportTicket(activeTicket.id, 'customer', replyText.trim());
    setReplyText('');
    // Refresh active ticket view
    const updated = supportTickets.find((t) => t.id === activeTicket.id);
    if (updated) setActiveTicket(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Enterprise Support & Concierge</h1>
          <p className="text-xs text-slate-500 mt-1">
            24/7 technical desk for quota scaling, GST billing queries, and account assistance.
          </p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-600/20 transition-all hover:shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>New Support Ticket</span>
        </button>
      </div>

      {/* Two Columns: Ticket List & Message Thread */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Ticket Selector (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block px-2 mb-2">
            My Open Queries ({myTickets.length})
          </span>

          {myTickets.length === 0 ? (
            <p className="text-xs text-slate-400 p-4 text-center italic">No active inquiries.</p>
          ) : (
            myTickets.map((t) => (
              <div
                key={t.id}
                onClick={() => setActiveTicket(t)}
                className={`p-3.5 rounded-xl cursor-pointer transition-all border ${
                  activeTicket?.id === t.id
                    ? 'bg-blue-50/60 border-blue-200 text-blue-900 shadow-xs'
                    : 'bg-white border-transparent hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-mono font-bold text-slate-400">{t.ticketNumber}</span>
                  <span
                    className={`px-2 py-0.2 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      t.status === 'open'
                        ? 'bg-amber-100 text-amber-800'
                        : t.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {t.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="font-bold text-slate-900 text-xs line-clamp-1">{t.subject}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                  <span>{t.category}</span>
                  <span>{t.lastUpdated}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right: Active Ticket Thread (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[520px]">
          {activeTicket ? (
            <>
              {/* Ticket Top bar */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-400">{activeTicket.ticketNumber}</span>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                      {activeTicket.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mt-0.5">{activeTicket.subject}</h3>
                </div>
                <div className="text-right text-[11px] text-slate-400">
                  <span>Opened: {activeTicket.createdAt}</span>
                </div>
              </div>

              {/* Message History */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50">
                {activeTicket.messages.map((m, idx) => {
                  const isMe = m.sender === 'customer';
                  return (
                    <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1">
                        <span className="font-semibold text-slate-700">
                          {isMe ? 'You' : 'Dedicated Account Specialist (Staff)'}
                        </span>
                        <span>•</span>
                        <span>{m.timestamp}</span>
                      </div>
                      <div
                        className={`p-3.5 rounded-2xl text-xs max-w-lg leading-relaxed shadow-xs ${
                          isMe
                            ? 'bg-blue-600 text-white rounded-tr-none'
                            : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Box */}
              <form onSubmit={handleSendReply} className="p-3 border-t border-slate-100 flex items-center gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your message to support..."
                  className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-xs p-8 text-center">
              <LifeBuoy className="w-12 h-12 text-slate-300 mb-2" />
              Select a ticket on the left or click "New Support Ticket".
            </div>
          )}
        </div>
      </div>

      {/* CREATE NEW TICKET MODAL */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Open Support Inquery</h3>
              <button onClick={() => setShowNewModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="py-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Request to scale cloud RAM for Q4 burst"
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500/20 font-semibold"
                  >
                    <option value="Billing">Billing & GST</option>
                    <option value="Plan Change">Plan Upgrade/Change</option>
                    <option value="Technical">Technical Operations</option>
                    <option value="Account">Account Security</option>
                    <option value="Other">General Inquiries</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Urgency</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="low">Low (Standard)</option>
                    <option value="medium">Medium</option>
                    <option value="high">High (Urgent)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Detailed Inquiry</label>
                <textarea
                  rows={4}
                  required
                  value={initialMessage}
                  onChange={(e) => setInitialMessage(e.target.value)}
                  placeholder="Please describe your question or requirement..."
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-xs"
                >
                  Submit Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
