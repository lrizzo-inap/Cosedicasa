// src/components/parent/PenaltyReviewQueue.jsx
import React from 'react';
import { CHORE_STATUS } from '../../data/models';
import { toast } from 'react-hot-toast';

export default function PenaltyReviewQueue({ chores, kids, onPenaltyAction }) {
  const overdueChores = chores.filter(c => 
    c.inGracePeriod && 
    Date.now() > new Date(c.gracePeriodEnd) &&
    c.status === CHORE_STATUS.NEW
  );

  const handleAction = (choreId, action, penaltyAmount) => {
    onPenaltyAction(choreId, action, penaltyAmount);
    toast.success(action === 'PENALIZE' 
      ? `Penalty applied (-${penaltyAmount} XP)`
      : 'Penalty waived');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Overdue Chores</h2>
      {overdueChores.length === 0 ? (
        <p>No overdue chores needing review</p>
      ) : (
        <ul className="space-y-3">
          {overdueChores.map(chore => {
            const kid = kids.find(k => k.id === chore.assignedTo);
            return (
              <li key={chore.id} className="p-4 bg-red-50 rounded-lg">
                <div className="flex justify-between">
                  <div>
                    <span className="font-medium">{chore.title}</span>
                    <span className="ml-2 text-gray-600">
                      ({kid?.name || 'Unknown'})
                    </span>
                  </div>
                  <span className="font-bold">{chore.xpValue} XP</span>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center space-x-2">
                    <span>Penalty Amount:</span>
                    <input
                      type="number"
                      min="0"
                      max={kid?.xp || 0}
                      defaultValue={Math.floor(chore.xpValue * 1.5)}
                      className="w-20 p-1 border rounded"
                    />
                    <span>XP</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAction(
                        chore.id, 
                        'PENALIZE', 
                        Math.floor(chore.xpValue * 1.5)
                      )}
                      className="px-3 py-1 bg-red-500 text-white rounded"
                    >
                      Apply Penalty
                    </button>
                    <button
                      onClick={() => handleAction(chore.id, 'WAIVE')}
                      className="px-3 py-1 bg-gray-500 text-white rounded"
                    >
                      Waive Penalty
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}