// src/components/shared/RecurrenceCalendarPreview.jsx
import React from 'react';
import { format, addDays, addWeeks, addMonths } from 'date-fns';

export default function RecurrenceCalendarPreview({ recurrence, startDate }) {
  if (!recurrence || !startDate) return null;

  const generatePreviewDates = () => {
    const dates = [];
    const now = new Date(startDate);
    
    for (let i = 1; i <= 3; i++) {
      let nextDate;
      switch (recurrence.type) {
        case 'daily':
          nextDate = addDays(now, i * recurrence.interval);
          break;
        case 'weekly':
          nextDate = addWeeks(now, i * recurrence.interval);
          break;
        case 'monthly':
          nextDate = addMonths(now, i * recurrence.interval);
          break;
        default:
          return [];
      }
      dates.push(nextDate);
    }
    return dates;
  };

  const previewDates = generatePreviewDates();

  return (
    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
      <h4 className="font-medium text-sm mb-2">Upcoming Schedule</h4>
      <ul className="space-y-1">
        {previewDates.map((date, i) => (
          <li key={i} className="flex justify-between text-sm">
            <span>Instance #{i + 1}</span>
            <span>{format(date, 'MMM d, yyyy')}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}