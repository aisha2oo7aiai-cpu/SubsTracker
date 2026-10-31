import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AuthView,
  CompanyProfile,
  Customer,
  DiscountCoupon,
  Invoice,
  NotificationItem,
  PaymentTransaction,
  PortalType,
  Quotation,
  Service,
  StaffMember,
  Subscription,
  SubscriptionPlan,
  SupportTicket,
  TaskItem,
  UserProfile,
  UserRole,
} from '../types';
import {
  companyApi,
  customersApi,
  discountsApi,
  invoicesApi,
  notificationsApi,
  paymentsApi,
  plansApi,
  quotationsApi,
  servicesApi,
  staffApi,
  subscriptionsApi,
  supportApi,
  tasksApi,
} from '../services/api';
import { demoUsers } from '../data/mockData';

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface AppContextType {
  // Navigation & Role
  portal: PortalType;
  setPortal: (p: PortalType) => void;
  authView: AuthView;
  setAuthView: (v: AuthView) => void;
  currentUser: UserProfile;
  setCurrentUser: (u: UserProfile) => void;
  switchRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (t: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Data
  company: CompanyProfile;
  services: Service[];
  plans: SubscriptionPlan[];
  customers: Customer[];
  subscriptions: Subscription[];
  quotations: Quotation[];
  invoices: Invoice[];
  payments: PaymentTransaction[];
  staff: StaffMember[];
  coupons: DiscountCoupon[];
  tasks: TaskItem[];
  notifications: NotificationItem[];
  supportTickets: SupportTicket[];

  // Mutators
  addService: (data: Omit<Service, 'id' | 'createdAt' | 'activePlansCount' | 'subscriberCount'>) => Promise<Service>;
  updateService: (id: string, updates: Partial<Service>) => Promise<Service>;
  deleteService: (id: string) => Promise<void>;

  addPlan: (data: Omit<SubscriptionPlan, 'id' | 'subscriberCount'>) => Promise<SubscriptionPlan>;
  updatePlan: (id: string, updates: Partial<SubscriptionPlan>) => Promise<SubscriptionPlan>;
  deletePlan: (id: string) => Promise<void>;

  addCustomer: (data: Omit<Customer, 'id' | 'joinedDate' | 'totalSpend' | 'activeSubscriptionsCount'>) => Promise<Customer>;
  updateCustomer: (id: string, updates: Partial<Customer>) => Promise<Customer>;

  subscribeCustomer: (data: {
    customerId: string;
    customerName: string;
    customerEmail: string;
    serviceId: string;
    serviceName: string;
    serviceCategory: any;
    planId: string;
    planName: string;
    billingCycle: any;
    amount: number;
    paymentMethod: string;
  }) => Promise<{ subscription: Subscription; invoice: Invoice }>;

  pauseSubscription: (id: string, reason?: string) => Promise<void>;
  resumeSubscription: (id: string) => Promise<void>;
  renewSubscription: (id: string) => Promise<void>;
  cancelSubscription: (id: string, reason?: string) => Promise<void>;
  changeSubscriptionPlan: (id: string, planId: string, planName: string, price: number) => Promise<void>;

  addQuotation: (data: Omit<Quotation, 'id' | 'quotationNumber' | 'createdAt'>) => Promise<Quotation>;
  updateQuotationStatus: (id: string, status: Quotation['status']) => Promise<void>;
  convertQuotation: (id: string) => Promise<void>;

  markInvoicePaid: (id: string, paymentMethod: string) => Promise<void>;
  addInvoice: (data: Omit<Invoice, 'id' | 'invoiceNumber'>) => Promise<Invoice>;

  addStaff: (data: Omit<StaffMember, 'id' | 'joinedDate' | 'assignedCustomerCount' | 'performanceScore'>) => Promise<StaffMember>;
  updateStaff: (id: string, updates: Partial<StaffMember>) => Promise<StaffMember>;

  addCoupon: (data: Omit<DiscountCoupon, 'id' | 'usedCount'>) => Promise<DiscountCoupon>;
  toggleCoupon: (id: string) => Promise<void>;

  addTask: (data: Omit<TaskItem, 'id' | 'createdAt'>) => Promise<TaskItem>;
  toggleTask: (id: string) => Promise<void>;

  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;

  addSupportTicket: (data: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt' | 'lastUpdated' | 'status' | 'messages'>, initialMessage: string) => Promise<SupportTicket>;
  replySupportTicket: (ticketId: string, sender: 'customer' | 'staff', text: string) => Promise<void>;

  updateCompany: (updates: Partial<CompanyProfile>) => Promise<void>;

  // Toasts
  toasts: ToastMessage[];
  addToast: (msg: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // Modals & Preview
  previewInvoice: Invoice | null;
  setPreviewInvoice: (inv: Invoice | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [portal, setPortal] = useState<PortalType>('landing');
  const [authView, setAuthView] = useState<AuthView>('login');
  const [currentUser, setCurrentUser] = useState<UserProfile>(demoUsers.admin);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Domain states
  const [company, setCompany] = useState<CompanyProfile>(demoUsers.admin.companyName ? ({} as any) : ({} as any));
  const [services, setServices] = useState<Service[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [coupons, setCoupons] = useState<DiscountCoupon[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);

  const addToast = (msg: Omit<ToastMessage, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    const newToast: ToastMessage = { ...msg, id };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load all data on mount
  useEffect(() => {
    async function loadData() {
      const [c, s, p, cust, subs, q, inv, pmts, stf, cpn, tsk, notif, sup] = await Promise.all([
        companyApi.get(),
        servicesApi.getAll(),
        plansApi.getAll(),
        customersApi.getAll(),
        subscriptionsApi.getAll(),
        quotationsApi.getAll(),
        invoicesApi.getAll(),
        paymentsApi.getAll(),
        staffApi.getAll(),
        discountsApi.getAll(),
        tasksApi.getAll(),
        notificationsApi.getAll(),
        supportApi.getAll(),
      ]);
      setCompany(c);
      setServices(s);
      setPlans(p);
      setCustomers(cust);
      setSubscriptions(subs);
      setQuotations(q);
      setInvoices(inv);
      setPayments(pmts);
      setStaff(stf);
      setCoupons(cpn);
      setTasks(tsk);
      setNotifications(notif);
      setSupportTickets(sup);
    }
    loadData();
  }, []);

  // Quick Role Switcher
  const switchRole = (role: UserRole) => {
    const targetUser = demoUsers[role];
    setCurrentUser(targetUser);
    setActiveTab('overview');
    setSearchQuery('');
    if (role === 'admin') setPortal('admin');
    else if (role === 'staff') setPortal('staff');
    else if (role === 'customer') setPortal('customer');
    addToast({
      title: `Switched to ${role.toUpperCase()} Portal`,
      message: `Logged in as ${targetUser.name}`,
      type: 'info',
    });
  };

  // Services
  const addService = async (data: Omit<Service, 'id' | 'createdAt' | 'activePlansCount' | 'subscriberCount'>) => {
    const created = await servicesApi.create(data);
    setServices((prev) => [created, ...prev]);
    addToast({ title: 'Service Created', message: `${created.name} added successfully.`, type: 'success' });
    return created;
  };

  const updateService = async (id: string, updates: Partial<Service>) => {
    const updated = await servicesApi.update(id, updates);
    setServices((prev) => prev.map((s) => (s.id === id ? updated : s)));
    addToast({ title: 'Service Updated', message: `${updated.name} updated.`, type: 'success' });
    return updated;
  };

  const deleteService = async (id: string) => {
    await servicesApi.delete(id);
    setServices((prev) => prev.filter((s) => s.id !== id));
    addToast({ title: 'Service Deleted', type: 'info' });
  };

  // Plans
  const addPlan = async (data: Omit<SubscriptionPlan, 'id' | 'subscriberCount'>) => {
    const created = await plansApi.create(data);
    setPlans((prev) => [created, ...prev]);
    // Refresh services to update count
    const refreshedServices = await servicesApi.getAll();
    setServices(refreshedServices);
    addToast({ title: 'Plan Created', message: `${created.name} added successfully.`, type: 'success' });
    return created;
  };

  const updatePlan = async (id: string, updates: Partial<SubscriptionPlan>) => {
    const updated = await plansApi.update(id, updates);
    setPlans((prev) => prev.map((p) => (p.id === id ? updated : p)));
    addToast({ title: 'Plan Updated', message: `${updated.name} updated.`, type: 'success' });
    return updated;
  };

  const deletePlan = async (id: string) => {
    await plansApi.delete(id);
    setPlans((prev) => prev.filter((p) => p.id !== id));
    const refreshedServices = await servicesApi.getAll();
    setServices(refreshedServices);
    addToast({ title: 'Plan Deleted', type: 'info' });
  };

  // Customers
  const addCustomer = async (data: Omit<Customer, 'id' | 'joinedDate' | 'totalSpend' | 'activeSubscriptionsCount'>) => {
    const created = await customersApi.create(data);
    setCustomers((prev) => [created, ...prev]);
    addToast({ title: 'Customer Registered', message: `${created.name} (${created.companyName}) created.`, type: 'success' });
    return created;
  };

  const updateCustomer = async (id: string, updates: Partial<Customer>) => {
    const updated = await customersApi.update(id, updates);
    setCustomers((prev) => prev.map((c) => (c.id === id ? updated : c)));
    addToast({ title: 'Customer Details Updated', type: 'success' });
    return updated;
  };

  // Subscriptions
  const subscribeCustomer = async (data: any) => {
    const res = await subscriptionsApi.create(data);
    setSubscriptions((prev) => [res.subscription, ...prev]);
    setInvoices((prev) => [res.invoice, ...prev]);
    const refreshedPayments = await paymentsApi.getAll();
    setPayments(refreshedPayments);
    const refreshedCustomers = await customersApi.getAll();
    setCustomers(refreshedCustomers);
    const refreshedPlans = await plansApi.getAll();
    setPlans(refreshedPlans);
    addToast({
      title: 'Subscription Activated!',
      message: `${data.serviceName} (${data.planName}) is now live. Invoice #${res.invoice.invoiceNumber} paid.`,
      type: 'success',
    });
    return res;
  };

  const pauseSubscription = async (id: string, reason?: string) => {
    const updated = await subscriptionsApi.updateStatus(id, 'paused', reason);
    setSubscriptions((prev) => prev.map((s) => (s.id === id ? updated : s)));
    addToast({ title: 'Subscription Paused', message: `Subscription #${updated.subscriptionCode} paused.`, type: 'info' });
  };

  const resumeSubscription = async (id: string) => {
    const updated = await subscriptionsApi.updateStatus(id, 'active');
    setSubscriptions((prev) => prev.map((s) => (s.id === id ? updated : s)));
    addToast({ title: 'Subscription Resumed', message: `Subscription #${updated.subscriptionCode} is now active.`, type: 'success' });
  };

  const renewSubscription = async (id: string) => {
    const updated = await subscriptionsApi.renew(id);
    setSubscriptions((prev) => prev.map((s) => (s.id === id ? updated : s)));
    addToast({ title: 'Subscription Renewed', message: `Next billing set to ${updated.nextBillingDate}.`, type: 'success' });
  };

  const cancelSubscription = async (id: string, reason?: string) => {
    const updated = await subscriptionsApi.updateStatus(id, 'cancelled', reason);
    setSubscriptions((prev) => prev.map((s) => (s.id === id ? updated : s)));
    addToast({ title: 'Subscription Cancelled', message: `Status updated to cancelled.`, type: 'warning' });
  };

  const changeSubscriptionPlan = async (id: string, planId: string, planName: string, price: number) => {
    const updated = await subscriptionsApi.changePlan(id, planId, planName, price);
    setSubscriptions((prev) => prev.map((s) => (s.id === id ? updated : s)));
    addToast({ title: 'Plan Changed', message: `Updated to ${planName}.`, type: 'success' });
  };

  // Quotations
  const addQuotation = async (data: Omit<Quotation, 'id' | 'quotationNumber' | 'createdAt'>) => {
    const created = await quotationsApi.create(data);
    setQuotations((prev) => [created, ...prev]);
    addToast({ title: 'Quotation Generated', message: `Quotation #${created.quotationNumber} ready.`, type: 'success' });
    return created;
  };

  const updateQuotationStatus = async (id: string, status: Quotation['status']) => {
    const updated = await quotationsApi.updateStatus(id, status);
    setQuotations((prev) => prev.map((q) => (q.id === id ? updated : q)));
    addToast({ title: `Quotation status updated to ${status}`, type: 'info' });
  };

  const convertQuotation = async (id: string) => {
    const res = await quotationsApi.convertToSubscription(id);
    setSubscriptions((prev) => [res.subscription, ...prev]);
    setInvoices((prev) => [res.invoice, ...prev]);
    const refreshedQuotes = await quotationsApi.getAll();
    setQuotations(refreshedQuotes);
    const refreshedPayments = await paymentsApi.getAll();
    setPayments(refreshedPayments);
    addToast({
      title: 'Quotation Converted!',
      message: `Active subscription #${res.subscription.subscriptionCode} generated.`,
      type: 'success',
    });
  };

  // Invoices
  const markInvoicePaid = async (id: string, paymentMethod: string) => {
    const updated = await invoicesApi.markAsPaid(id, paymentMethod);
    setInvoices((prev) => prev.map((i) => (i.id === id ? updated : i)));
    const refreshedPayments = await paymentsApi.getAll();
    setPayments(refreshedPayments);
    const refreshedSubs = await subscriptionsApi.getAll();
    setSubscriptions(refreshedSubs);
    addToast({
      title: 'Payment Confirmed',
      message: `Invoice #${updated.invoiceNumber} marked as PAID via ${paymentMethod}.`,
      type: 'success',
    });
  };

  const addInvoice = async (data: Omit<Invoice, 'id' | 'invoiceNumber'>) => {
    const created = await invoicesApi.create(data);
    setInvoices((prev) => [created, ...prev]);
    addToast({ title: 'Invoice Generated', message: `Invoice #${created.invoiceNumber} created.`, type: 'success' });
    return created;
  };

  // Staff
  const addStaff = async (data: Omit<StaffMember, 'id' | 'joinedDate' | 'assignedCustomerCount' | 'performanceScore'>) => {
    const created = await staffApi.create(data);
    setStaff((prev) => [created, ...prev]);
    addToast({ title: 'Staff Account Created', message: `${created.name} (${created.roleTitle}) added.`, type: 'success' });
    return created;
  };

  const updateStaff = async (id: string, updates: Partial<StaffMember>) => {
    const updated = await staffApi.update(id, updates);
    setStaff((prev) => prev.map((s) => (s.id === id ? updated : s)));
    addToast({ title: 'Staff Member Updated', type: 'success' });
    return updated;
  };

  // Coupons
  const addCoupon = async (data: Omit<DiscountCoupon, 'id' | 'usedCount'>) => {
    const created = await discountsApi.create(data);
    setCoupons((prev) => [created, ...prev]);
    addToast({ title: 'Discount Code Created', message: `Coupon code ${created.code} is active.`, type: 'success' });
    return created;
  };

  const toggleCoupon = async (id: string) => {
    const updated = await discountsApi.toggleActive(id);
    setCoupons((prev) => prev.map((c) => (c.id === id ? updated : c)));
    addToast({ title: `Coupon ${updated.code} is now ${updated.isActive ? 'Active' : 'Disabled'}`, type: 'info' });
  };

  // Tasks
  const addTask = async (data: Omit<TaskItem, 'id' | 'createdAt'>) => {
    const created = await tasksApi.create(data);
    setTasks((prev) => [created, ...prev]);
    addToast({ title: 'Follow-up Task Scheduled', type: 'success' });
    return created;
  };

  const toggleTask = async (id: string) => {
    const updated = await tasksApi.toggleComplete(id);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    addToast({ title: updated.status === 'completed' ? 'Task Completed' : 'Task Reopened', type: 'info' });
  };

  // Notifications
  const markNotificationRead = async (id: string) => {
    await notificationsApi.markAsRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = async () => {
    await notificationsApi.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast({ title: 'All notifications marked as read', type: 'info' });
  };

  // Support
  const addSupportTicket = async (data: any, initialMessage: string) => {
    const created = await supportApi.create(data, initialMessage);
    setSupportTickets((prev) => [created, ...prev]);
    addToast({ title: 'Support Ticket Submitted', message: `Ticket #${created.ticketNumber} opened.`, type: 'success' });
    return created;
  };

  const replySupportTicket = async (ticketId: string, sender: 'customer' | 'staff', text: string) => {
    const updated = await supportApi.addReply(ticketId, sender, text);
    setSupportTickets((prev) => prev.map((t) => (t.id === ticketId ? updated : t)));
    addToast({ title: 'Reply sent', type: 'info' });
  };

  // Company
  const updateCompany = async (updates: Partial<CompanyProfile>) => {
    const updated = await companyApi.update(updates);
    setCompany(updated);
    addToast({ title: 'Company Settings Saved', type: 'success' });
  };

  return (
    <AppContext.Provider
      value={{
        portal,
        setPortal,
        authView,
        setAuthView,
        currentUser,
        setCurrentUser,
        switchRole,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        company,
        services,
        plans,
        customers,
        subscriptions,
        quotations,
        invoices,
        payments,
        staff,
        coupons,
        tasks,
        notifications,
        supportTickets,
        addService,
        updateService,
        deleteService,
        addPlan,
        updatePlan,
        deletePlan,
        addCustomer,
        updateCustomer,
        subscribeCustomer,
        pauseSubscription,
        resumeSubscription,
        renewSubscription,
        cancelSubscription,
        changeSubscriptionPlan,
        addQuotation,
        updateQuotationStatus,
        convertQuotation,
        markInvoicePaid,
        addInvoice,
        addStaff,
        updateStaff,
        addCoupon,
        toggleCoupon,
        addTask,
        toggleTask,
        markNotificationRead,
        markAllNotificationsRead,
        addSupportTicket,
        replySupportTicket,
        updateCompany,
        toasts,
        addToast,
        removeToast,
        previewInvoice,
        setPreviewInvoice,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
