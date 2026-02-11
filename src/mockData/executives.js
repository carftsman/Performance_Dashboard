export const executivesData = [
  {
    id: 1,
    name: "Siva",
    email: "rajesh@company.com",
    role: "executive",
    dailyLogs: [
      {
        date: "2024-01-15",
        assignedTarget: 50,
        achievedOrders: 45,
        balanceToAchieve: 5,
        shopsVisited: 25,
        location: "South Delhi",
        challenges: "Shop owners were busy with inventory"
      },
      {
        date: "2024-01-14",
        assignedTarget: 50,
        achievedOrders: 48,
        balanceToAchieve: 2,
        shopsVisited: 28,
        location: "Central Delhi",
        challenges: "No challenges"
      }
    ],
    weeklyStats: {
      target: 350,
      achieved: 320,
      balance: 30,
      shopsVisited: 180,
      location: "Multiple"
    },
    monthlyStats: {
      target: 1500,
      achieved: 1420,
      balance: 80,
      shopsVisited: 750,
      location: "Delhi Region"
    }
  },
  {
    id: 2,
    name: "Priya Sharma",
    email: "priya@company.com",
    role: "executive",
    dailyLogs: [
      {
        date: "2024-01-15",
        assignedTarget: 60,
        achievedOrders: 55,
        balanceToAchieve: 5,
        shopsVisited: 30,
        location: "Gurgaon",
        challenges: "Traffic delays affected visits"
      }
    ]
  }
];

export const currentExecutive = executivesData[0];