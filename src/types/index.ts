export type UserRole = 'admin' | 'staff' | 'customer';

export type PortalType = 'landing' | 'auth' | 'admin' | 'staff' | 'customer';

export type AuthView = 'login' | 'register_company' | 'register_customer' | 'forgot_password' | 'reset_password';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  companyName?: string;
  title?: string;
  phone?: string;
  customerId?: string; // If customer role
  staffId?: string; // If staff role
}

export interface CompanyProfile {
  name: string;
  legalEntity: string;
  taxId: string; // GSTIN in India
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  currency: string;
  currencySymbol: string;
  logoUrl?: string;
  gracePeriodDays: number;
  autoRetryAttempts: number;
  invoicePrefix: string;
}

export type ServiceCategory = 'SaaS' | 'Cloud' | 'Streaming' | 'Fitness' | 'Developer Tools' | 'Productivity' | 'Security';

export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: ServiceCategory;
  iconName: string;
  brandColor: string;
  activePlansCount: number;
  subscriberCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export type BillingCycle = 'monthly' | 'quarterly' | 'annual';

export interface PlanFeature {
  name: string;
  included: boolean;
}

export interface SubscriptionPlan {
  id: string;
  serviceId: string;
  name: string;
  tagline: string;
  price: number; // in INR
  billingCycle: BillingCycle;
  features: string[];
  discountPercent?: number;
  isPopular?: boolean;
  status: 'active' | 'archived';
  subscriberCount: number;
  maxUsers?: number;
  storageGb?: number;
}

export type SubscriptionStatus = 'active' | 'paused' | 'past_due' | 'cancelled';

export interface Subscription {
  id: string;
  subscriptionCode: string; // e.g. SUB-2026-001
  customerId: string;
  customerName: string;
  customerEmail: string;
  serviceId: string;
  serviceName: string;
  serviceCategory: ServiceCategory;
  planId: string;
  planName: string;
  billingCycle: BillingCycle;
  amount: number; // in INR
  startDate: string;
  nextBillingDate: string;
  expiryDate: string;
  status: SubscriptionStatus;
  autoRenew: boolean;
  paymentMethod: string;
  lastBilledAmount?: number;
  pauseReason?: string;
  cancelReason?: string;
}

export type QuotationStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';

export interface QuotationItem {
  serviceId: string;
  serviceName: string;
  planId: string;
  planName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Quotation {
  id: string;
  quotationNumber: string; // e.g. QT-2026-104
  customerId: string;
  customerName: string;
  customerEmail: string;
  companyName: string;
  items: QuotationItem[];
  subtotal: number;
  discountAmount: number;
  taxRate: number; // e.g. 18% GST
  taxAmount: number;
  totalAmount: number;
  validityDate: string;
  status: QuotationStatus;
  createdAt: string;
  notes?: string;
  assignedStaffName?: string;
}

export type InvoiceStatus = 'paid' | 'pending' | 'overdue';

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g. INV-2026-4401
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerAddress?: string;
  subscriptionId?: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  status: InvoiceStatus;
  paymentStatus: InvoiceStatus;
  paidDate?: string;
  paymentMethod?: string;
  notes?: string;
}

export type PaymentMethodType = 'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking' | 'Auto-Debit';
export type PaymentStatus = 'success' | 'processing' | 'failed';

export interface PaymentTransaction {
  id: string;
  transactionId: string; // e.g. TXN-8932401
  customerId: string;
  customerName: string;
  invoiceId: string;
  invoiceNumber: string;
  amount: number;
  date: string;
  paymentMethod: PaymentMethodType;
  status: PaymentStatus;
  bankReference?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  status: 'active' | 'inactive' | 'lead';
  totalSpend: number; // in INR
  activeSubscriptionsCount: number;
  assignedStaffId?: string;
  assignedStaffName?: string;
  joinedDate: string;
  avatar?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  notes?: string;
}

export interface StaffPermissions {
  canManageCustomers: boolean;
  canCreateQuotations: boolean;
  canGenerateInvoices: boolean;
  canRecordPayments: boolean;
  canViewReports: boolean;
  canManagePlans: boolean;
  canManageStaff: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  roleTitle: string;
  phone: string;
  status: 'active' | 'inactive';
  joinedDate: string;
  assignedCustomerCount: number;
  performanceScore: number;
  permissions: StaffPermissions;
  avatar?: string;
}

export interface DiscountCoupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number; // e.g. 15 for 15% or 2000 for ₹2000
  applicableServiceId?: string; // 'all' or specific serviceId
  applicableServiceName?: string;
  minPurchaseAmount?: number;
  maxUses: number;
  usedCount: number;
  validUntil: string;
  isActive: boolean;
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  assignedStaffId: string;
  assignedStaffName: string;
  customerId?: string;
  customerName?: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed';
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'billing' | 'subscription' | 'quote' | 'system' | 'ai';
  timestamp: string;
  read: boolean;
  linkTab?: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  customerId: string;
  customerName: string;
  subject: string;
  category: 'Billing' | 'Technical' | 'Account' | 'Plan Change' | 'Other';
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  lastUpdated: string;
  messages: {
    sender: 'customer' | 'staff';
    text: string;
    timestamp: string;
  }[];
}
