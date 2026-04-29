const now = new Date();
export const SIMULATION_DATE_OBJ = now;
export const SIMULATION_DATE = now.toLocaleDateString('en-CA');

export const normalizeDate = (date: Date | string) => {
  if (typeof date === 'string' && !date.includes('T') && date.includes('-')) {
    const [y, m, d_num] = date.split('-').map(Number);
    return new Date(y, m - 1, d_num);
  }
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatTime = (date: Date) => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};
