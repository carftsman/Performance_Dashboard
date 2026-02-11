export const ROLES = {
  EXECUTIVE: 'executive',
  TEAM_LEAD: 'teamlead',
  MANAGEMENT: 'management'
};

export const PERIOD_TYPES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly'
};

export const TABLE_COLUMNS = {
  EXECUTIVE: [
    { key: 'date', label: 'Date' },
    { key: 'assignedTarget', label: 'Assigned Target' },
    { key: 'achievedOrders', label: 'Achieved Orders' },
    { key: 'balanceToAchieve', label: 'Balance to Achieve' },
    { key: 'shopsVisited', label: 'Shops Visited' },
    { key: 'location', label: 'Location' }
  ],
  TEAM_LEAD: [
    { key: 'name', label: 'Executive Name' },
    { key: 'target', label: 'Target' },
    { key: 'achieved', label: 'Achieved' },
    { key: 'balance', label: 'Balance' },
    { key: 'challenges', label: 'Challenges/Questions' }
  ],
  MANAGEMENT: [
    { key: 'team', label: 'Team/Executive' },
    { key: 'target', label: 'Target' },
    { key: 'achieved', label: 'Achieved' },
    { key: 'balance', label: 'Balance' }
  ]
};