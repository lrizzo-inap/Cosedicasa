import React from 'react';
import { generateRecurrencePreview } from '../../services/recurrenceService';
import { format } from 'date-fns';

const RecurrencePreview = ({ chore }) => {
  const previews = generateRecurrencePreview(chore);
  
  if (!previews.length) return null;

  return (
    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
      <h4 className="font-medium text-sm mb-2">Upcoming Instances:</h4>
      <ul className="space-y-1">
        {previews.map((preview, i) => (
          <li key={preview.id} className="flex justify-between text-sm">
            <span>#{i + 1}</span>
            <span>{format(new Date(preview.dueDate), 'MMM d, yyyy')}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecurrencePreview;
