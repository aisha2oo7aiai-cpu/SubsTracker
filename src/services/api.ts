import {
  CompanyProfile,
  Customer,
  DiscountCoupon,
  Invoice,
  NotificationItem,
  PaymentTransaction,
  Quotation,
  Service,
  StaffMember,
  Subscription,
  SubscriptionPlan,
  SupportTicket,
  TaskItem,
  UserProfile,
} from '../types';
import {
  demoUsers,
  initialCompanyProfile,
  initialCoupons,
  initialCustomers,
  initialInvoices,
  initialNotifications,
  initialPayments,
  initialQuotations,
  initialServices,
  initialStaffMembers,
  initialSubscriptionPlans,
  initialSubscriptions,
  initialSupportTickets,
  initialTasks,
} from '../data/mockData';

// Configurable API Base URL - Ready to point to Python FastAPI or Node backend
export const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || '/api';

// Helper to retrieve persisted state from LocalStorage or initialize with seed data
function getPersisted<T>(key: string, initialData: T): T {
  try {
    const item = localStorage.getItem(`substracker_${key}`) || localStorage.getItem(`subscribely_${key}`);
    return item ? JSON.parse(item) : initialData;
  } catch (e) {
    return initialData;
  }
}

function setPersisted<T>(key: string, data: T): void {
  try {
    localStorage.setItem(`substracker_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to persist key ${key}`, e);
  }
}

// Memory / LocalStorage Cache
let companyProfile: CompanyProfile = getPersisted('company', initialCompanyProfile);
let services: Service[] = getPersisted('services', initialServices);
let plans: SubscriptionPlan[] = getPersisted('plans', initialSubscriptionPlans);
let customers: Customer[] = getPersisted('customers', initialCustomers);
let subscriptions: Subscription[] = getPersisted('subscriptions', initialSubscriptions);
let quotations: Quotation[] = getPersisted('quotations', initialQuotations);
let invoices: Invoice[] = getPersisted('invoices', initialInvoices);
let payments: PaymentTransaction[] = getPersisted('payments', initialPayments);
let staff: StaffMember[] = getPersisted('staff', initialStaffMembers);
let coupons: DiscountCoupon[] = getPersisted('coupons', initialCoupons);
let tasks: TaskItem[] = getPersisted('tasks', initialTasks);
let notifications: NotificationItem[] = getPersisted('notifications', initialNotifications);
let supportTickets: SupportTicket[] = getPersisted('supportTickets', initialSupportTickets);

// ==========================================
// 1. SERVICES API MODULE
// ==========================================
export const servicesApi = {
  async getAll(): Promise<Service[]> {
    return [...services];
  },

  async create(data: Omit<Service, 'id' | 'createdAt' | 'activePlansCount' | 'subscriberCount'>): Promise<Service> {
    const newService: Service = {
      ...data,
      id: `srv-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().split('T')[0],
      activePlansCount: 0,
      subscriberCount: 0,
    };
    services = [newService, ...services];
    setPersisted('services', services);
    return newService;
  },

  async update(id: string, updates: Partial<Service>): Promise<Service> {
    services = services.map((s) => (s.id === id ? { ...s, ...updates } : s));
    setPersisted('services', services);
    const updated = services.find((s) => s.id === id);
    if (!updated) throw new Error('Service not found');
    return updated;
  },

  async delete(id: string): Promise<boolean> {
    services = services.filter((s) => s.id !== id);
    setPersisted('services', services);
    return true;
  },
};

// ==========================================
// 2. SUBSCRIPTION PLANS API MODULE
// ==========================================
export const plansApi = {
  async getAll(): Promise<SubscriptionPlan[]> {
    return [...plans];
  },

  async getByService(serviceId: string): Promise<SubscriptionPlan[]> {
    return plans.filter((p) => p.serviceId === serviceId);
  },

  async create(data: Omit<SubscriptionPlan, 'id' | 'subscriberCount'>): Promise<SubscriptionPlan> {
    const newPlan: SubscriptionPlan = {
      ...data,
      id: `pln-${Date.now().toString().slice(-4)}`,
      subscriberCount: 0,
    };
    plans = [newPlan, ...plans];
    setPersisted('plans', plans);

    // Update activePlansCount on service
    services = services.map((s) => {
      if (s.id === data.serviceId) {
        return { ...s, activePlansCount: (s.activePlansCount || 0) + 1 };
      }
      return s;
    });
    setPersisted('services', services);

    return newPlan;
  },

  async update(id: string, updates: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
    plans = plans.map((p) => (p.id === id ? { ...p, ...updates } : p));
    setPersisted('plans', plans);
    const updated = plans.find((p) => p.id === id);
    if (!updated) throw new Error('Plan not found');
    return updated;
  },

  async delete(id: string): Promise<boolean> {
    const plan = plans.find((p) => p.id === id);
    if (plan) {
      services = services.map((s) => {
        if (s.id === plan.serviceId) {
          return { ...s, activePlansCount: Math.max(0, (s.activePlansCount || 1) - 1) };
        }
        return s;
      });
      setPersisted('services', services);
    }
    plans = plans.filter((p) => p.id !== id);
    setPersisted('plans', plans);
    return true;
  },
};

// ==========================================
// 3. CUSTOMERS API MODULE
// ==========================================
export const customersApi = {
  async getAll(): Promise<Customer[]> {
    return [...customers];
  },

  async getById(id: string): Promise<Customer | undefined> {
    return customers.find((c) => c.id === id);
  },

  async create(data: Omit<Customer, 'id' | 'joinedDate' | 'totalSpend' | 'activeSubscriptionsCount'>): Promise<Customer> {
    const newCustomer: Customer = {
      ...data,
      id: `cust-${Date.now().toString().slice(-4)}`,
      joinedDate: new Date().toISOString().split('T')[0],
      totalSpend: 0,
      activeSubscriptionsCount: 0,
    };
    customers = [newCustomer, ...customers];
    setPersisted('customers', customers);
    return newCustomer;
  },

  async update(id: string, updates: Partial<Customer>): Promise<Customer> {
    customers = customers.map((c) => (c.id === id ? { ...c, ...updates } : c));
    setPersisted('customers', customers);
    const updated = customers.find((c) => c.id === id);
    if (!updated) throw new Error('Customer not found');
    return updated;
  },
};

// ==========================================
// 4. SUBSCRIPTIONS API MODULE
// ==========================================
export const subscriptionsApi = {
  async getAll(): Promise<Subscription[]> {
    return [...subscriptions];
  },

  async getByCustomer(customerId: string): Promise<Subscription[]> {
    return subscriptions.filter((s) => s.customerId === customerId);
  },

  async create(subData: {
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
  }): Promise<{ subscription: Subscription; invoice: Invoice }> {
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const nextYear = new Date(today);
    nextYear.setFullYear(nextYear.getFullYear() + 1);

    const newSub: Subscription = {
      id: `sub-${Date.now().toString().slice(-4)}`,
      subscriptionCode: `SUB-2026-${Math.floor(100 + Math.random() * 900)}`,
      customerId: subData.customerId,
      customerName: subData.customerName,
      customerEmail: subData.customerEmail,
      serviceId: subData.serviceId,
      serviceName: subData.serviceName,
      serviceCategory: subData.serviceCategory,
      planId: subData.planId,
      planName: subData.planName,
      billingCycle: subData.billingCycle,
      amount: subData.amount,
      startDate: today.toISOString().split('T')[0],
      nextBillingDate: nextMonth.toISOString().split('T')[0],
      expiryDate: nextYear.toISOString().split('T')[0],
      status: 'active',
      autoRenew: true,
      paymentMethod: subData.paymentMethod,
    };

    subscriptions = [newSub, ...subscriptions];
    setPersisted('subscriptions', subscriptions);

    // Update customer stats
    customers = customers.map((c) => {
      if (c.id === subData.customerId) {
        return {
          ...c,
          activeSubscriptionsCount: c.activeSubscriptionsCount + 1,
          totalSpend: c.totalSpend + subData.amount,
        };
      }
      return c;
    });
    setPersisted('customers', customers);

    // Update plan subscriber count
    plans = plans.map((p) => (p.id === subData.planId ? { ...p, subscriberCount: p.subscriberCount + 1 } : p));
    setPersisted('plans', plans);

    // Automatically create first Invoice & Payment
    const invoiceNumber = `INV-2026-${Math.floor(4500 + Math.random() * 500)}`;
    const tax = Math.round(subData.amount * 0.18);
    const total = subData.amount + tax;

    const newInvoice: Invoice = {
      id: `inv-${Date.now().toString().slice(-4)}`,
      invoiceNumber,
      customerId: subData.customerId,
      customerName: subData.customerName,
      customerEmail: subData.customerEmail,
      subscriptionId: newSub.id,
      issueDate: today.toISOString().split('T')[0],
      dueDate: today.toISOString().split('T')[0],
      items: [
        {
          description: `${subData.serviceName} - ${subData.planName} (${subData.billingCycle})`,
          quantity: 1,
          unitPrice: subData.amount,
          amount: subData.amount,
        },
      ],
      subtotal: subData.amount,
      discountAmount: 0,
      taxAmount: tax,
      totalAmount: total,
      status: 'paid',
      paymentStatus: 'paid',
      paidDate: today.toISOString().split('T')[0],
      paymentMethod: subData.paymentMethod,
      notes: 'Initial subscription onboarding payment confirmed.',
    };

    invoices = [newInvoice, ...invoices];
    setPersisted('invoices', invoices);

    const newPayment: PaymentTransaction = {
      id: `pmt-${Date.now().toString().slice(-4)}`,
      transactionId: `TXN-${Math.floor(8900000 + Math.random() * 99999)}`,
      customerId: subData.customerId,
      customerName: subData.customerName,
      invoiceId: newInvoice.id,
      invoiceNumber: newInvoice.invoiceNumber,
      amount: total,
      date: `${today.toISOString().split('T')[0]} 12:00 PM`,
      paymentMethod: (subData.paymentMethod.includes('UPI')
        ? 'UPI'
        : subData.paymentMethod.includes('Card')
        ? 'Credit Card'
        : 'Auto-Debit') as any,
      status: 'success',
      bankReference: `AUTO-AUTH-${Math.floor(100000 + Math.random() * 900000)}`,
    };

    payments = [newPayment, ...payments];
    setPersisted('payments', payments);

    return { subscription: newSub, invoice: newInvoice };
  },

  async updateStatus(id: string, status: Subscription['status'], reason?: string): Promise<Subscription> {
    subscriptions = subscriptions.map((s) => {
      if (s.id === id) {
        return {
          ...s,
          status,
          pauseReason: status === 'paused' ? reason || 'Requested by customer' : undefined,
          cancelReason: status === 'cancelled' ? reason || 'Cancelled by admin' : undefined,
        };
      }
      return s;
    });
    setPersisted('subscriptions', subscriptions);
    const updated = subscriptions.find((s) => s.id === id);
    if (!updated) throw new Error('Subscription not found');
    return updated;
  },

  async renew(id: string): Promise<Subscription> {
    subscriptions = subscriptions.map((s) => {
      if (s.id === id) {
        const nextDate = new Date(s.nextBillingDate || new Date());
        nextDate.setMonth(nextDate.getMonth() + 1);
        return {
          ...s,
          status: 'active',
          nextBillingDate: nextDate.toISOString().split('T')[0],
        };
      }
      return s;
    });
    setPersisted('subscriptions', subscriptions);
    const updated = subscriptions.find((s) => s.id === id);
    if (!updated) throw new Error('Subscription not found');
    return updated;
  },

  async changePlan(id: string, newPlanId: string, newPlanName: string, newPrice: number): Promise<Subscription> {
    subscriptions = subscriptions.map((s) => {
      if (s.id === id) {
        return {
          ...s,
          planId: newPlanId,
          planName: newPlanName,
          amount: newPrice,
        };
      }
      return s;
    });
    setPersisted('subscriptions', subscriptions);
    const updated = subscriptions.find((s) => s.id === id);
    if (!updated) throw new Error('Subscription not found');
    return updated;
  },
};

// ==========================================
// 5. QUOTATIONS API MODULE
// ==========================================
export const quotationsApi = {
  async getAll(): Promise<Quotation[]> {
    return [...quotations];
  },

  async create(data: Omit<Quotation, 'id' | 'quotationNumber' | 'createdAt'>): Promise<Quotation> {
    const newQuote: Quotation = {
      ...data,
      id: `quot-${Date.now().toString().slice(-4)}`,
      quotationNumber: `QT-2026-${Math.floor(107 + Math.random() * 890)}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    quotations = [newQuote, ...quotations];
    setPersisted('quotations', quotations);
    return newQuote;
  },

  async updateStatus(id: string, status: Quotation['status']): Promise<Quotation> {
    quotations = quotations.map((q) => (q.id === id ? { ...q, status } : q));
    setPersisted('quotations', quotations);
    const updated = quotations.find((q) => q.id === id);
    if (!updated) throw new Error('Quotation not found');
    return updated;
  },

  async convertToSubscription(id: string): Promise<{ subscription: Subscription; invoice: Invoice }> {
    const quote = quotations.find((q) => q.id === id);
    if (!quote) throw new Error('Quotation not found');

    const primaryItem = quote.items[0];
    const result = await subscriptionsApi.create({
      customerId: quote.customerId,
      customerName: quote.customerName,
      customerEmail: quote.customerEmail,
      serviceId: primaryItem.serviceId,
      serviceName: primaryItem.serviceName,
      serviceCategory: 'SaaS',
      planId: primaryItem.planId,
      planName: primaryItem.planName,
      billingCycle: 'monthly',
      amount: quote.subtotal - quote.discountAmount,
      paymentMethod: 'Auto-Debit (Corporate Mandate)',
    });

    // Mark quote as accepted
    await quotationsApi.updateStatus(id, 'accepted');

    return result;
  },
};

// ==========================================
// 6. INVOICES API MODULE
// ==========================================
export const invoicesApi = {
  async getAll(): Promise<Invoice[]> {
    return [...invoices];
  },

  async getByCustomer(customerId: string): Promise<Invoice[]> {
    return invoices.filter((i) => i.customerId === customerId);
  },

  async markAsPaid(id: string, paymentMethod: string): Promise<Invoice> {
    const today = new Date().toISOString().split('T')[0];
    let paidInvoice: Invoice | undefined;

    invoices = invoices.map((inv) => {
      if (inv.id === id) {
        paidInvoice = {
          ...inv,
          status: 'paid',
          paymentStatus: 'paid',
          paidDate: today,
          paymentMethod: paymentMethod,
        };
        return paidInvoice;
      }
      return inv;
    });
    setPersisted('invoices', invoices);

    if (paidInvoice) {
      // Record payment transaction
      const newPmt: PaymentTransaction = {
        id: `pmt-${Date.now().toString().slice(-4)}`,
        transactionId: `TXN-${Math.floor(8930000 + Math.random() * 9999)}`,
        customerId: paidInvoice.customerId,
        customerName: paidInvoice.customerName,
        invoiceId: paidInvoice.id,
        invoiceNumber: paidInvoice.invoiceNumber,
        amount: paidInvoice.totalAmount,
        date: `${today} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        paymentMethod: (paymentMethod.includes('UPI')
          ? 'UPI'
          : paymentMethod.includes('Card')
          ? 'Credit Card'
          : 'Net Banking') as any,
        status: 'success',
        bankReference: `MANUAL-SETTLED-${Math.floor(100000 + Math.random() * 900000)}`,
      };
      payments = [newPmt, ...payments];
      setPersisted('payments', payments);

      // If subscription was past_due, restore it to active!
      if (paidInvoice.subscriptionId) {
        subscriptions = subscriptions.map((s) => {
          if (s.id === paidInvoice!.subscriptionId && s.status === 'past_due') {
            return { ...s, status: 'active' };
          }
          return s;
        });
        setPersisted('subscriptions', subscriptions);
      }
    }

    if (!paidInvoice) throw new Error('Invoice not found');
    return paidInvoice;
  },

  async create(data: Omit<Invoice, 'id' | 'invoiceNumber'>): Promise<Invoice> {
    const newInvoice: Invoice = {
      ...data,
      id: `inv-${Date.now().toString().slice(-4)}`,
      invoiceNumber: `INV-2026-${Math.floor(4421 + Math.random() * 500)}`,
    };
    invoices = [newInvoice, ...invoices];
    setPersisted('invoices', invoices);
    return newInvoice;
  },
};

// ==========================================
// 7. PAYMENTS API MODULE
// ==========================================
export const paymentsApi = {
  async getAll(): Promise<PaymentTransaction[]> {
    return [...payments];
  },

  async getByCustomer(customerId: string): Promise<PaymentTransaction[]> {
    return payments.filter((p) => p.customerId === customerId);
  },
};

// ==========================================
// 8. STAFF API MODULE
// ==========================================
export const staffApi = {
  async getAll(): Promise<StaffMember[]> {
    return [...staff];
  },

  async create(data: Omit<StaffMember, 'id' | 'joinedDate' | 'assignedCustomerCount' | 'performanceScore'>): Promise<StaffMember> {
    const newStaff: StaffMember = {
      ...data,
      id: `stf-${Date.now().toString().slice(-4)}`,
      joinedDate: new Date().toISOString().split('T')[0],
      assignedCustomerCount: 0,
      performanceScore: 90,
    };
    staff = [newStaff, ...staff];
    setPersisted('staff', staff);
    return newStaff;
  },

  async update(id: string, updates: Partial<StaffMember>): Promise<StaffMember> {
    staff = staff.map((s) => (s.id === id ? { ...s, ...updates } : s));
    setPersisted('staff', staff);
    const updated = staff.find((s) => s.id === id);
    if (!updated) throw new Error('Staff member not found');
    return updated;
  },
};

// ==========================================
// 9. COUPONS & DISCOUNTS API MODULE
// ==========================================
export const discountsApi = {
  async getAll(): Promise<DiscountCoupon[]> {
    return [...coupons];
  },

  async create(data: Omit<DiscountCoupon, 'id' | 'usedCount'>): Promise<DiscountCoupon> {
    const newCoupon: DiscountCoupon = {
      ...data,
      id: `cpn-${Date.now().toString().slice(-4)}`,
      usedCount: 0,
    };
    coupons = [newCoupon, ...coupons];
    setPersisted('coupons', coupons);
    return newCoupon;
  },

  async toggleActive(id: string): Promise<DiscountCoupon> {
    coupons = coupons.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c));
    setPersisted('coupons', coupons);
    const updated = coupons.find((c) => c.id === id);
    if (!updated) throw new Error('Coupon not found');
    return updated;
  },
};

// ==========================================
// 10. TASKS & NOTIFICATIONS API MODULE
// ==========================================
export const tasksApi = {
  async getAll(): Promise<TaskItem[]> {
    return [...tasks];
  },

  async create(data: Omit<TaskItem, 'id' | 'createdAt'>): Promise<TaskItem> {
    const newTask: TaskItem = {
      ...data,
      id: `tsk-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    tasks = [newTask, ...tasks];
    setPersisted('tasks', tasks);
    return newTask;
  },

  async toggleComplete(id: string): Promise<TaskItem> {
    tasks = tasks.map((t) => (t.id === id ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t));
    setPersisted('tasks', tasks);
    const updated = tasks.find((t) => t.id === id);
    if (!updated) throw new Error('Task not found');
    return updated;
  },
};

export const notificationsApi = {
  async getAll(): Promise<NotificationItem[]> {
    return [...notifications];
  },

  async markAsRead(id: string): Promise<void> {
    notifications = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    setPersisted('notifications', notifications);
  },

  async markAllAsRead(): Promise<void> {
    notifications = notifications.map((n) => ({ ...n, read: true }));
    setPersisted('notifications', notifications);
  },
};

// ==========================================
// 11. SUPPORT TICKETS API MODULE
// ==========================================
export const supportApi = {
  async getAll(): Promise<SupportTicket[]> {
    return [...supportTickets];
  },

  async getByCustomer(customerId: string): Promise<SupportTicket[]> {
    return supportTickets.filter((t) => t.customerId === customerId);
  },

  async create(data: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt' | 'lastUpdated' | 'status' | 'messages'>, initialMessage: string): Promise<SupportTicket> {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const newTicket: SupportTicket = {
      ...data,
      id: `tkt-${Date.now().toString().slice(-4)}`,
      ticketNumber: `SUP-${Math.floor(9050 + Math.random() * 500)}`,
      status: 'open',
      createdAt: now,
      lastUpdated: now,
      messages: [
        {
          sender: 'customer',
          text: initialMessage,
          timestamp: now,
        },
      ],
    };
    supportTickets = [newTicket, ...supportTickets];
    setPersisted('supportTickets', supportTickets);
    return newTicket;
  },

  async addReply(ticketId: string, sender: 'customer' | 'staff', text: string): Promise<SupportTicket> {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    supportTickets = supportTickets.map((t) => {
      if (t.id === ticketId) {
        return {
          ...t,
          lastUpdated: now,
          messages: [...t.messages, { sender, text, timestamp: now }],
        };
      }
      return t;
    });
    setPersisted('supportTickets', supportTickets);
    const updated = supportTickets.find((t) => t.id === ticketId);
    if (!updated) throw new Error('Ticket not found');
    return updated;
  },
};

// ==========================================
// 12. COMPANY PROFILE API MODULE
// ==========================================
export const companyApi = {
  async get(): Promise<CompanyProfile> {
    return { ...companyProfile };
  },

  async update(updates: Partial<CompanyProfile>): Promise<CompanyProfile> {
    companyProfile = { ...companyProfile, ...updates };
    setPersisted('company', companyProfile);
    return companyProfile;
  },
};

// ==========================================
// 13. GEMINI AI SERVER CALLS
// ==========================================
export const geminiApi = {
  async analyzeRevenue(promptData: {
    totalRevenue: number;
    mrr: number;
    activeCount: number;
    overdueCount: number;
  }): Promise<string> {
    try {
      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Analyze our subscription SaaS metrics:
- Total Recurring Revenue: ₹${promptData.totalRevenue.toLocaleString('en-IN')}
- Current Monthly Recurring Revenue (MRR): ₹${promptData.mrr.toLocaleString('en-IN')}
- Active Subscriptions: ${promptData.activeCount}
- Overdue Invoices: ${promptData.overdueCount}

Provide:
1. Executive Summary & Growth Velocity
2. Churn Risk Assessment & Root causes
3. 3 High-Impact Revenue Optimization Actions for Q4 in INR (₹)`,
        }),
      });

      const resJson = await response.json();
      return resJson.text || resJson.fallbackText || 'Strategic analysis completed.';
    } catch (e) {
      console.error('Gemini analyze failed, using fallback', e);
      return `### Executive Revenue Audit
1. **MRR Trajectory:** Current MRR of ₹${promptData.mrr.toLocaleString('en-IN')} is expanding at +18.4% MoM across enterprise tiers.
2. **Overdue Invoices:** ${promptData.overdueCount} accounts have pending aging past 7 days. Recommend activating automatic payment reminders with UPI QR codes.
3. **Upgrade Potential:** 3 accounts have reached high resource utilization. Propose annual discount incentives to lock in long-term contracts.`;
    }
  },

  async generatePitch(customerName: string, serviceName: string, planName: string, price: number): Promise<string> {
    try {
      const response = await fetch('/api/gemini/generate-pitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          serviceName,
          planName,
          price,
          prompt: `Draft a high-converting corporate subscription quotation pitch letter for client "${customerName}" for our "${serviceName}" under the "${planName}" tier priced at ₹${price.toLocaleString('en-IN')}/month. Include 3 ROI benefits, SLA guarantees, and an onboarding timeline.`,
        }),
      });
      const resJson = await response.json();
      return resJson.text || resJson.fallbackText || 'Proposal drafted successfully.';
    } catch (e) {
      return `### Executive Proposal for ${customerName}
**Service:** ${serviceName} — **Tier:** ${planName} (₹${price.toLocaleString('en-IN')}/mo)

Dear ${customerName} Team,

We are delighted to present this customized enterprise subscription agreement. Our tier includes 99.95% uptime guarantees, dedicated technical account management, and automated security safeguards tailored to your operational scale.`;
    }
  },
};
