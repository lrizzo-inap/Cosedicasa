export const calculateNextDate = (startDate, recurrence) => {
  const date = new Date(startDate);
  
  switch (recurrence.type) {
    case 'daily':
      date.setDate(date.getDate() + recurrence.interval);
      break;
    case 'weekly':
      date.setDate(date.getDate() + (7 * recurrence.interval));
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + recurrence.interval);
      if (recurrence.isMonthEnd) {
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        date.setDate(lastDay);
      }
      break;
  }
  
  return date;
};

export const generateRecurrencePreview = (chore, count = 3) => {
  if (!chore.recurrence) return [];
  
  const instances = [];
  let currentDate = new Date(chore.dueDate);
  
  for (let i = 0; i < count; i++) {
    currentDate = calculateNextDate(currentDate, chore.recurrence);
    instances.push({
      ...chore,
      id: `${chore.id}-preview-${i}`,
      dueDate: currentDate.toISOString(),
      _isPreview: true
    });
  }
  
  return instances;
};