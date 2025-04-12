// src/utils/gracePeriod.js
export const calculateGracePeriod = (dueDate, hours) => {
  const due = new Date(dueDate);
  const graceEnd = new Date(due.getTime() + hours * 60 * 60 * 1000);
  return {
    inGracePeriod: new Date() < graceEnd,
    gracePeriodEnd: graceEnd.toISOString()
  };
};

export const processChores = (chores, graceHours) => {
  return chores.map(chore => {
    if (new Date(chore.dueDate) < new Date() && chore.status === CHORE_STATUS.NEW) {
      return {
        ...chore,
        ...calculateGracePeriod(chore.dueDate, graceHours)
      };
    }
    return chore;
  });
};