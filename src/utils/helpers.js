import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

export const parseAsUTC = (dateString) => {
  if (!dateString) return null;
  if (dateString instanceof Date) return dateString;
  
  let s = String(dateString).trim();
  
  // If it's a numeric timestamp
  if (/^\d+$/.test(s)) {
    return new Date(Number(s));
  }
  
  // If it has timezone offset/designator (Z, +xx:xx, etc.)
  if (s.endsWith('Z') || /[+-]\d{2}:?\d{2}$/.test(s)) {
    return new Date(s);
  }
  
  // If it's a datetime string without timezone (e.g. "2026-06-24 11:24:38" or "2026-06-24T11:24:38")
  if (/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}/.test(s)) {
    s = s.replace(' ', 'T');
    if (!s.endsWith('Z')) {
      s += 'Z';
    }
  }
  
  return new Date(s);
};

export const formatDate = (date, formatStr = 'dd-MMM-yyyy') => {
  const parsed = parseAsUTC(date);
  return parsed ? format(parsed, formatStr) : 'N/A';
};

export const calculateBalance = (target, achieved) => {
  return Math.max(0, target - achieved);
};

export const getWeekRange = (date = new Date()) => {
  return {
    start: format(startOfWeek(date), 'dd MMM'),
    end: format(endOfWeek(date), 'dd MMM yyyy')
  };
};

export const getMonthRange = (date = new Date()) => {
  return {
    start: format(startOfMonth(date), 'dd MMM'),
    end: format(endOfMonth(date), 'dd MMM yyyy')
  };
};

export const aggregateData = (dailyData, period) => {
  if (period === 'daily') return dailyData;
  
  const aggregated = {
    assignedTarget: 0,
    achievedOrders: 0,
    shopsVisited: 0,
    location: 'Multiple'
  };
  
  dailyData.forEach(entry => {
    aggregated.assignedTarget += entry.assignedTarget;
    aggregated.achievedOrders += entry.achievedOrders;
    aggregated.shopsVisited += entry.shopsVisited;
  });
  
  aggregated.balanceToAchieve = calculateBalance(
    aggregated.assignedTarget,
    aggregated.achievedOrders
  );
  
  return aggregated;
};