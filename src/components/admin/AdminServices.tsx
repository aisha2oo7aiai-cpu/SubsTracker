import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Service, ServiceCategory } from '../../types';
import { ServiceIcon } from '../shared/ServiceIcon';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Layers,
  Users,
  CheckCircle,
  X,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';

export const AdminServices: React.FC = () => {
  const { services, addService, updateService, deleteService, setActiveTab, searchQuery } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [localSearch, setLocalSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deletingServiceId, setDeletingServiceId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('SaaS');
  const [iconName, setIconName] = useState('Box');
  const [brandColor, setBrandColor] = useState('#4F46E5');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  const categories = ['All', 'SaaS', 'Cloud', 'Streaming', 'Developer Tools', 'Productivity', 'Security', 'Fitness'];

  const filteredServices = services.filter((s) => {
    const matchCategory = selectedCategory === 'All' || s.category === selectedCategory;
    const q = (searchQuery || localSearch).toLowerCase();
    const matchSearch =
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q);
    return matchCategory && matchSearch;
  });

  const openAddModal = () => {
    setName('');
    setSlug('');
    setDescription('');
    setCategory('SaaS');
    setIconName('Server');
    setBrandColor('#4F46E5');
    setStatus('active');
    setShowAddModal(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setName(service.name);
    setSlug(service.slug);
    setDescription(service.description);
    setCategory(service.category);
    setIconName(service.iconName);
    setBrandColor(service.brandColor);
    setStatus(service.status);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingService) {
      await updateService(editingService.id, {
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        description,
        category,
        iconName,
        brandColor,
        status,
      });
      setEditingService(null);
    } else {
      await addService({
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        description,
        category,
        iconName,
        brandColor,
        status,
      });
      setShowAddModal(false);
    }
  };

  const confirmDelete = async () => {
    if (deletingServiceId) {
      await deleteService(deletingServiceId);
      setDeletingServiceId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Service Catalog Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure product lines, manage subscription tiers, and monitor active subscriber distribution.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all hover:shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-4 justify-between items-center">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Local Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Filter services..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
          >
            <div className="p-6">
              {/* Top Row: Icon & Status */}
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm"
                  style={{ backgroundColor: service.brandColor }}
                >
                  <ServiceIcon name={service.iconName} className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase tracking-wider">
                    {service.category}
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      service.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                    title={service.status}
                  />
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                {service.name}
              </h3>
              <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                {service.description}
              </p>

              {/* Stats Bar */}
              <div className="mt-5 grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[11px] text-slate-400 font-medium block">Active Tiers</span>
                  <p className="text-sm font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-600" />
                    {service.activePlansCount} Plans
                  </p>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[11px] text-slate-400 font-medium block">Subscribers</span>
                  <p className="text-sm font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                    <Users className="w-3.5 h-3.5 text-emerald-600" />
                    {service.subscriberCount} Accounts
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="px-6 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setActiveTab('plans')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>View Plans</span>
                <ExternalLink className="w-3 h-3" />
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(service)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-white rounded-lg transition-colors"
                  title="Edit Service"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeletingServiceId(service.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors"
                  title="Delete Service"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD / EDIT SERVICE MODAL */}
      {(showAddModal || editingService) && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                {editingService ? 'Edit Service' : 'Add New Service Catalog Entry'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingService(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="py-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Service Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. CloudScale Infrastructure"
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="SaaS">SaaS</option>
                    <option value="Cloud">Cloud</option>
                    <option value="Streaming">Streaming</option>
                    <option value="Developer Tools">Developer Tools</option>
                    <option value="Productivity">Productivity</option>
                    <option value="Security">Security</option>
                    <option value="Fitness">Fitness</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Comprehensive service description and architecture SLA guarantees..."
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Icon Style</label>
                  <select
                    value={iconName}
                    onChange={(e) => setIconName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="Server">Server (Infrastructure)</option>
                    <option value="Tv">Tv (Streaming / Video)</option>
                    <option value="Users">Users (CRM / Community)</option>
                    <option value="Terminal">Terminal (DevOps)</option>
                    <option value="Sparkles">Sparkles (AI Copilot)</option>
                    <option value="ShieldCheck">ShieldCheck (Security)</option>
                    <option value="Activity">Activity (Fitness / Health)</option>
                    <option value="MessageSquare">MessageSquare (Chat)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Brand Color Accent</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      className="w-10 h-8 rounded cursor-pointer border border-slate-300"
                    />
                    <span className="font-mono text-slate-600 text-xs">{brandColor}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingService(null);
                  }}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-xs"
                >
                  {editingService ? 'Save Changes' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deletingServiceId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Delete Service?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to remove this service from your catalog? Existing subscriptions will remain intact in historical ledgers.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setDeletingServiceId(null)}
                className="w-1/2 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="w-1/2 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
