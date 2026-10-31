export function formatINR(amount: number, compact: boolean = false): string {
  if (isNaN(amount)) return '₹0';
  if (compact) {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    }
    if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}k`;
    }
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch (e) {
    return dateStr;
  }
}

export function getStatusBadge(status: string) {
  switch (status.toLowerCase()) {
    case 'active':
    case 'paid':
    case 'success':
    case 'accepted':
    case 'resolved':
      return {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500',
        label: status.charAt(0).toUpperCase() + status.slice(1),
      };
    case 'pending':
    case 'processing':
    case 'draft':
    case 'open':
    case 'in_progress':
      return {
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
        dot: 'bg-amber-500',
        label: status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' '),
      };
    case 'overdue':
    case 'past_due':
    case 'failed':
    case 'rejected':
      return {
        bg: 'bg-rose-50 text-rose-700 border-rose-200',
        dot: 'bg-rose-500',
        label: status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' '),
      };
    case 'paused':
      return {
        bg: 'bg-blue-50 text-blue-700 border-blue-200',
        dot: 'bg-blue-500',
        label: 'Paused',
      };
    case 'cancelled':
    case 'expired':
    case 'inactive':
      return {
        bg: 'bg-slate-100 text-slate-700 border-slate-200',
        dot: 'bg-slate-400',
        label: status.charAt(0).toUpperCase() + status.slice(1),
      };
    default:
      return {
        bg: 'bg-slate-100 text-slate-700 border-slate-200',
        dot: 'bg-slate-400',
        label: status,
      };
  }
}
