// src/components/parent/PenaltyReviewQueue.jsx
import React, { useState, useEffect } from 'react'; // Importa useState, useEffect
import { CHORE_STATUS } from '../../data/models';
import { toast } from 'react-hot-toast';

export default function PenaltyReviewQueue({ chores, kids, onPenaltyAction }) {
  // Stato per tenere traccia degli importi delle penalità per ogni chore
  const [penaltyAmounts, setPenaltyAmounts] = useState({});

  const overdueChores = chores.filter(c =>
    c.inGracePeriod &&
    Date.now() > new Date(c.gracePeriodEnd) &&
    c.status === CHORE_STATUS.NEW // Deve essere ancora NEW per essere penalizzabile
  );

  // Inizializza o aggiorna gli importi di default quando le chores cambiano
  useEffect(() => {
    const initialAmounts = {};
    overdueChores.forEach(chore => {
      // Usa l'ID della chore come chiave
      // Imposta un valore di default (es. 0 o un calcolo) solo se non già presente
      if (penaltyAmounts[chore.id] === undefined) {
         // Metti 0 come default, il genitore deve inserire un valore > 0
         initialAmounts[chore.id] = 0;
         // Oppure usa il vecchio default come placeholder:
         // initialAmounts[chore.id] = Math.floor(chore.xpValue * 1.5);
      } else {
        // Mantieni il valore esistente se già presente
        initialAmounts[chore.id] = penaltyAmounts[chore.id];
      }
    });
    setPenaltyAmounts(prev => ({ ...prev, ...initialAmounts }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chores]); // Dipende da chores per ricalcolare se la lista cambia


  const handleAmountChange = (choreId, value) => {
    const amount = parseInt(value) || 0; // Gestisci input vuoto o non numerico
    setPenaltyAmounts(prev => ({
      ...prev,
      [choreId]: amount >= 0 ? amount : 0 // Non permettere valori negativi qui
    }));
  };


  const handleAction = (choreId, action) => {
    const amount = penaltyAmounts[choreId];

    if (action === 'PENALIZE') {
      if (amount === undefined || amount <= 0) {
          toast.error('Please enter a penalty amount greater than 0.');
          return;
      }
      onPenaltyAction(choreId, action, { amount }); // Passa l'importo nel payload
      // La notifica toast ora è gestita in dataService
    } else if (action === 'WAIVE_PENALTY') {
      onPenaltyAction(choreId, action); // Non serve payload per waive
       // La notifica toast ora è gestita in dataService
    }
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow mt-6"> {/* Aggiunto stile base */}
      <h2 className="text-xl font-bold">Overdue Chores Review ({overdueChores.length})</h2>
      {overdueChores.length === 0 ? (
        <p className="text-gray-500">No overdue chores needing review.</p>
      ) : (
        <ul className="space-y-3">
          {overdueChores.map(chore => {
            const kid = kids.find(k => k.id === chore.assignedTo);
            const currentPenaltyAmount = penaltyAmounts[chore.id] !== undefined ? penaltyAmounts[chore.id] : 0;

            return (
              <li key={chore.id} className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{chore.title}</span>
                    <span className="ml-2 text-sm text-gray-600">
                      ({kid?.name || 'Unknown'})
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{chore.xpValue} XP value</span>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center space-x-2">
                    <label htmlFor={`penalty-${chore.id}`} className="text-sm font-medium">Penalty Amount (XP):</label>
                    <input
                      id={`penalty-${chore.id}`}
                      type="number"
                      min="0" // Permetti 0 ma controlla > 0 al submit
                      // max={kid?.xp || 0} // Rimuovi max basato su XP corrente, la logica lo gestirà
                      value={currentPenaltyAmount}
                      onChange={(e) => handleAmountChange(chore.id, e.target.value)}
                      className="w-20 p-1 border rounded focus:ring-red-500 focus:border-red-500"
                      placeholder="Enter XP"
                    />
                  </div>
                  <div className="flex space-x-2 pt-2">
                    <button
                      onClick={() => handleAction(chore.id, 'PENALIZE')}
                      disabled={currentPenaltyAmount <= 0} // Disabilita se l'importo è 0 o meno
                      className={`px-3 py-1 rounded text-white ${
                        currentPenaltyAmount > 0
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-red-300 cursor-not-allowed'
                      }`}
                    >
                      Apply Penalty
                    </button>
                    <button
                      onClick={() => handleAction(chore.id, 'WAIVE_PENALTY')}
                      className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded"
                    >
                      Waive Penalty
                    </button>
                  </div>
                </div>
                 <p className="text-xs text-gray-500 mt-2">
                    Due: {new Date(chore.dueDate).toLocaleDateString()} - Grace period ended: {new Date(chore.gracePeriodEnd).toLocaleString()}
                 </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
