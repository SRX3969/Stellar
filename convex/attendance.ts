// Convex Attendance Backend Service & Simulation Logic

export const attendanceService = {
  calculateProjectedAttendance: (present: number, total: number, missedClasses: number) => {
    const newTotal = total + missedClasses;
    const percentage = Math.round((present / newTotal) * 100);
    return {
      projectedPresent: present,
      projectedTotal: newTotal,
      projectedPercentage: percentage,
      isBelowThreshold: percentage < 75,
    };
  },

  calculateRecoveryConsecutiveClasses: (present: number, total: number, criterion: number = 75) => {
    const reqRatio = criterion / 100;
    const needed = Math.ceil((reqRatio * total - present) / (1 - reqRatio));
    return Math.max(0, needed);
  },
};
