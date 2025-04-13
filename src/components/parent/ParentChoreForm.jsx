import React, { useState } from 'react';
import { validateChore } from '../../schemas/validation';
import RecurrencePreview from '../shared/RecurrencePreview';
import toast from 'react-hot-toast';

const ParentChoreForm = ({ onSave }) => {
  const [chore, setChore] = useState({
    title: '',
    xpValue: 10,
    dueDate: new Date().toISOString().split('T')[0],
    recurrence: null
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const { isValid, error } = validateChore(chore);
    
    if (!isValid) {
      toast.error(`Validation error: ${error}`);
      return;
    }
    
    onSave(chore);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Existing form fields */}
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>Recurrence Type</label>
          <select 
            value={chore.recurrence?.type || ''}
            onChange={(e) => setChore({
              ...chore,
              recurrence: {
                ...chore.recurrence,
                type: e.target.value
              }
            })}
          >
            <option value="">None</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        
        {chore.recurrence?.type && (
          <div>
            <label>Interval</label>
            <input
              type="number"
              min="1"
              value={chore.recurrence?.interval || 1}
              onChange={(e) => setChore({
                ...chore,
                recurrence: {
                  ...chore.recurrence,
                  interval: parseInt(e.target.value)
                }
              })}
            />
          </div>
        )}
      </div>
      
      {chore.recurrence?.type === 'monthly' && (
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={chore.recurrence?.isMonthEnd || false}
            onChange={(e) => setChore({
              ...chore,
              recurrence: {
                ...chore.recurrence,
                isMonthEnd: e.target.checked
              }
            })}
          />
          <span className="ml-2">Always use last day of month</span>
        </label>
      )}
      
      <RecurrencePreview chore={chore} />
      
      <button type="submit" className="btn-primary">
        Save Chore
      </button>
    </form>
  );
};
