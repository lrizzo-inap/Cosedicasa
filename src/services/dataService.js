// src/services/dataService.js
import { CHORE_STATUS, initialState } from '../data/models';
// Rimuovi import non necessario di validateChore se non usato direttamente qui
// import { validateChore } from '../schemas/validation';
import { calculateNextDate } from './recurrenceService';
import { toast } from 'react-hot-toast';

const DATA_KEY = 'smart_chores_data';

export const loadData = () => {
  // ... (codice esistente loadData)
  try {
    const saved = JSON.parse(localStorage.getItem(DATA_KEY)) || initialState;
    // Assicurati che i log siano sempre un array
    if (saved && !Array.isArray(saved.logs)) {
        saved.logs = [];
    }
    return {
      ...initialState,
      ...saved,
      kids: saved.kids || initialState.kids,
      settings: { ...initialState.settings, ...(saved.settings || {}) },
      logs: saved.logs || [] // Inizializza logs se mancante
    };
  } catch (error) {
    console.error('Data load failed:', error);
    toast.error('Failed to load data. Using defaults.'); // Aggiungi notifica
    return initialState;
  }
};

export const saveData = (data) => {
  // ... (codice esistente saveData)
  try {
    // Assicurati che i log siano sempre un array prima di salvare
    const dataToSave = {
        ...data,
        logs: Array.isArray(data.logs) ? data.logs : []
    };
    localStorage.setItem(DATA_KEY, JSON.stringify({
      ...dataToSave,
      _lastSaved: new Date().toISOString()
    }));
  } catch (error) {
    toast.error('Failed to save data');
    console.error('Data save failed:', error);
  }
};

// Modifica la funzione per accettare un payload più strutturato
export const handleChoreAction = (data, id, action, payload = {}) => {
  // Gestione Claim Ricompensa (usa payload.rewardId e payload.kidId)
  if (action === 'CLAIM_REWARD') {
    const { rewardId, kidId } = payload;
    const kidIndex = data.kids.findIndex(k => k.id === kidId);
    const reward = data.rewards.find(r => r.id === rewardId);

    if (kidIndex === -1 || !reward) {
        console.error("Kid or Reward not found for claiming", payload);
        toast.error("Error claiming reward.");
        return data;
    }

    const kid = data.kids[kidIndex];

    if (kid.xp < reward.cost) {
        toast.error("Not enough XP to claim this reward.");
        return data; // Non fare nulla se non ci sono abbastanza XP
    }

    const newData = { ...data };
    const updatedKid = { ...kid, xp: kid.xp - reward.cost };
    newData.kids = [...data.kids];
    newData.kids[kidIndex] = updatedKid;

    // Aggiungi log per la ricompensa
    const logEntry = {
        type: 'reward_claimed',
        kidId: kid.id,
        xp: -reward.cost, // XP è negativo perché è un costo
        date: new Date().toISOString(),
        rewardId: reward.id,
        description: `Claimed reward: '${reward.title}'`
      };
    // Assicura che i log esistano e siano un array
    newData.logs = [...(Array.isArray(newData.logs) ? newData.logs : []), logEntry];

    toast.success(`Reward '${reward.title}' claimed!`);
    return newData;
  }

  // Gestione Azioni sulle Faccende (usa 'id' come choreId)
  const choreId = id;
  const choreIndex = data.chores.findIndex(c => c.id === choreId);
  if (choreIndex === -1) {
      console.error("Chore not found for action", choreId, action);
      // Non ritornare data qui se l'azione non riguarda una faccenda specifica (es. CLAIM_REWARD già gestito)
      // return data; // Rimosso perché potrebbe interrompere CLAIM_REWARD se chiamato per errore
      // Considera se lanciare un errore o una notifica se una chore action fallisce nel trovare la chore
      return data;
  }

  const chore = data.chores[choreIndex];
  // Trova kidIndex e kid associati alla faccenda
  const kidIndex = data.kids.findIndex(k => k.id === chore.assignedTo);
   if (kidIndex === -1) {
       console.error("Kid not found for chore action", chore);
       toast.error("Associated child not found for this chore.");
       return data;
   }
  const kid = data.kids[kidIndex];


  const newData = { ...data };
  // Inizializza sempre i log se non esistono
  if (!Array.isArray(newData.logs)) {
      newData.logs = [];
  }
  let xpChange = 0;
  let logEntry = null; // Usiamo un oggetto per il log

  switch (action) {
    case 'SUBMIT':
      // Aggiungi validazione Joi qui se necessario, anche se potrebbe essere meglio validare all'input
      // const { isValid } = validateChore(chore);
      // if (!isValid) break;
      newData.chores = [...data.chores];
      newData.chores[choreIndex] = { ...chore, status: CHORE_STATUS.SUBMITTED };
      logEntry = { type: 'chore_submitted', description: `'${chore.title}' submitted` };
      break;

    case 'APPROVE':
      newData.chores = [...data.chores];
      newData.chores[choreIndex] = { ...chore, status: CHORE_STATUS.APPROVED };
      // XP viene assegnato solo al 'COMPLETE' dal bambino
      logEntry = { type: 'chore_approved', description: `'${chore.title}' approved` };
      break;

    case 'DENY_RESET':
      newData.chores = [...data.chores];
      // Resetta lo stato a NEW invece di DENIED_RESET
      newData.chores[choreIndex] = { ...chore, status: CHORE_STATUS.NEW };
      logEntry = { type: 'chore_denied_reset', description: `'${chore.title}' denied, reset to new` };
      toast.info(`Chore '${chore.title}' reset for retry.`); // Notifica più chiara
      break;

    case 'DENY_REMOVE':
      newData.chores = data.chores.filter(c => c.id !== choreId);
      logEntry = { type: 'chore_denied_removed', description: `'${chore.title}' denied and removed` };
      break;

    case 'COMPLETE': // Azione eseguita dal bambino dopo l'approvazione
      xpChange = chore.xpValue;
      const updatedKidComplete = { ...kid, xp: kid.xp + xpChange };
      newData.kids = [...data.kids];
      newData.kids[kidIndex] = updatedKidComplete;
      // Rimuovi la faccenda completata
      newData.chores = data.chores.filter(c => c.id !== choreId);
      // Gestisci la ricorrenza
      handleRecurrence(newData, chore); // Passa newData per modificarlo direttamente
      logEntry = { type: 'chore_completed', xp: xpChange, description: `'${chore.title}' completed` };
      toast.success(`XP collected for '${chore.title}'!`);
      break;

    case 'PENALIZE': // Azione eseguita dal genitore
      // Assicurati che payload.amount sia un numero valido
      const penaltyAmount = Math.abs(parseInt(payload?.amount || 0)); // Usa l'importo dal payload
      if (isNaN(penaltyAmount) || penaltyAmount <= 0) {
          toast.error("Invalid penalty amount specified.");
          return data; // Non fare nulla se l'importo non è valido
      }
      xpChange = -penaltyAmount;
      const penalizedKid = { ...kid, xp: Math.max(0, kid.xp + xpChange) }; // Non andare sotto zero
      newData.kids = [...data.kids];
      newData.kids[kidIndex] = penalizedKid;
      // Rimuovi la faccenda scaduta e penalizzata
      newData.chores = data.chores.filter(c => c.id !== choreId);
      logEntry = { type: 'penalty_applied', xp: xpChange, description: `Penalty applied for overdue '${chore.title}'` };
      toast.error(`Penalty of ${penaltyAmount} XP applied for '${chore.title}'.`);
      break;

     case 'WAIVE_PENALTY': // Azione eseguita dal genitore
        // Rimuovi solo la faccenda, senza cambiare XP
        newData.chores = data.chores.filter(c => c.id !== choreId);
        logEntry = { type: 'penalty_waived', xp: 0, description: `Penalty waived for overdue '${chore.title}'` };
        toast.info(`Penalty waived for '${chore.title}'.`);
        break;

    // Aggiungi altri case se necessario...

    default:
      console.warn(`Unhandled action type: ${action}`);
      return data; // Non modificare i dati per azioni non riconosciute
  }

  // Aggiungi log solo se logEntry è stato definito
  if (logEntry) {
    const finalLogEntry = {
      ...logEntry, // Contiene type e description
      kidId: kid.id, // Associa sempre al bambino della faccenda
      xp: logEntry.xp !== undefined ? logEntry.xp : xpChange, // Usa xp dal logEntry se definito, altrimenti xpChange
      date: new Date().toISOString(),
      choreId: chore ? chore.id : undefined, // Aggiungi choreId se applicabile
    };
    newData.logs = [...newData.logs, finalLogEntry];
  }

  return newData;
};

// Modifica handleRecurrence per accettare e modificare newData
const handleRecurrence = (newData, completedChore) => {
  if (!completedChore.recurrence) return;

  const nextDueDate = calculateNextDate(new Date(completedChore.dueDate), completedChore.recurrence);

  const newChoreInstance = {
    ...completedChore,
    id: Date.now() + Math.random(), // Aggiungi random per robustezza ID
    status: CHORE_STATUS.NEW,
    dueDate: nextDueDate.toISOString(),
    createdAt: new Date().toISOString(),
    // Rimuovi stati specifici dell'istanza precedente
    inGracePeriod: false,
    gracePeriodEnd: undefined,
    _isRecurred: true // Flag per indicare che è un'istanza ricorsiva
  };

   // Aggiungi validazione Joi qui se vuoi essere sicuro prima di aggiungere
   /*
   const { error } = choreSchema.validate(newChoreInstance);
   if (error) {
       console.error("Validation failed for recurring chore instance:", error);
       toast.error("Failed to create next recurring chore.");
       return;
   }
   */

  // Modifica direttamente newData.chores
  newData.chores.push(newChoreInstance);
  console.log(`Generated recurring chore instance for '${completedChore.title}' due ${nextDueDate.toISOString()}`);
};


export const exportData = () => {
  // ... (codice esistente exportData)
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
  // ... (codice esistente importData)
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      // Aggiungi controlli più robusti se necessario
      if (!data.kids || !data.chores || !data.rewards || !data.settings) {
          throw new Error('Invalid data format: Missing core properties');
      }
       // Assicurati che i log siano un array
      if (!Array.isArray(data.logs)) {
        data.logs = [];
      }
      // Qui potresti aggiungere la validazione Joi per ogni elemento importato
      saveData(data);
      toast.success('Data imported successfully!');
      callback?.(data); // Passa i dati caricati al callback se necessario
    } catch (error) {
      toast.error(`Invalid data file: ${error.message}`);
      console.error("Import failed:", error);
    }
  };
  reader.readAsText(file);
};
