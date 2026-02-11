import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

export const formatDate = (date, formatStr = 'dd-MMM-yyyy') => {
  return format(new Date(date), formatStr);
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