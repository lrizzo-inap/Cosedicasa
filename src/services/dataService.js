// src/services/dataService.js
import { CHORE_STATUS, initialState } from '../data/models';
import { validateChore } from '../schemas/validation';
import { calculateNextDate } from './recurrenceService';
import { toast } from 'react-hot-toast';

const DATA_KEY = 'smart_chores_data';

export const loadData = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(DATA_KEY)) || initialState;
    return {
      ...initialState,
      ...saved,
      kids: saved.kids || initialState.kids,
      settings: { ...initialState.settings, ...(saved.settings || {}) }
    };
  } catch (error) {
    console.error('Data load failed:', error);
    return initialState;
  }
};

export const saveData = (data) => {
  try {
    localStorage.setItem(DATA_KEY, JSON.stringify({
      ...data,
      _lastSaved: new Date().toISOString()
    }));
  } catch (error) {
    toast.error('Failed to save data');
    console.error('Data save failed:', error);
  }
};

export const handleChoreAction = (data, choreId, action, payload = null) => {
  const choreIndex = data.chores.findIndex(c => c.id === choreId);
  if (choreIndex === -1) return data;

  const chore = data.chores[choreIndex];
  const kid = data.kids.find(k => k.id === chore.assignedTo);
  if (!kid) return data;

  const newData = { ...data };
  let xpChange = 0;
  let logType = '';

  switch (action) {
    case 'SUBMIT':
      if (!validateChore(chore).isValid) break;
      newData.chores[choreIndex].status = CHORE_STATUS.SUBMITTED;
      logType = 'chore_submitted';
      break;

    case 'APPROVE':
      newData.chores[choreIndex].status = CHORE_STATUS.APPROVED;
      xpChange = chore.xpValue;
      logType = 'chore_approved';
      break;

    case 'DENY_RESET':
      newData.chores[choreIndex].status = CHORE_STATUS.DENIED_RESET;
      logType = 'chore_denied';
      break;

    case 'DENY_REMOVE':
      newData.chores = newData.chores.filter(c => c.id !== choreId);
      logType = 'chore_denied';
      break;

    case 'COMPLETE':
      xpChange = chore.xpValue;
      kid.xp += xpChange;
      newData.chores = newData.chores.filter(c => c.id !== choreId);
      handleRecurrence(newData, chore);
      logType = 'chore_completed';
      break;

    case 'PENALIZE':
      xpChange = -Math.abs(payload?.amount || chore.xpValue);
      kid.xp = Math.max(0, kid.xp + xpChange);
      newData.chores = newData.chores.filter(c => c.id !== choreId);
      logType = 'penalty_applied';
      break;
  }

  if (logType) {
    newData.logs = [...(newData.logs || []), {
      type: logType,
      kidId: kid.id,
      xp: xpChange,
      date: new Date().toISOString(),
      choreId: chore.id,
      description: `${chore.title} ${action.toLowerCase()}`
    }];
  }

  return newData;
};

const handleRecurrence = (data, chore) => {
  if (!chore.recurrence) return;

  const newChore = {
    ...chore,
    id: Date.now(),
    status: CHORE_STATUS.NEW,
    dueDate: calculateNextDate(new Date(chore.dueDate), chore.recurrence).toISOString(),
    createdAt: new Date().toISOString(),
    _isRecurred: true
  };
  
  if (validateChore(newChore).isValid) {
    data.chores.push(newChore);
  }
};

export const exportData = () => {
  const data = loadData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `smart-chores-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const importData = (file, callback) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (!data.kids || !data.chores) throw new Error('Invalid data format');
      saveData(data);
      callback?.();
    } catch (error) {
      toast.error('Invalid data file');
      console.error(error);
    }
  };
  reader.readAsText(file);
};