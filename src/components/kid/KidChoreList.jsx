// src/components/kid/KidChoreList.jsx
import React from 'react';
import { CHORE_STATUS } from '../../data/models';
import GracePeriodIndicator from '../shared/GracePeriodIndicator';
import { toast } from 'react-hot-toast';

const statusClasses = {
  [CHORE_STATUS.NEW]: 'bg-white',
  [CHORE_STATUS.SUBMITTED]: 'bg-gray-100 opacity-75',
  [CHORE_STATUS.APPROVED]: 'bg-green-100',
  [CHORE_STATUS.DENIED_RESET]: 'bg-red-100',
  [CHORE_STATUS.DENIED_REMOVE]: 'bg-red-100'
};

const statusLabels = {
  [CHORE_STATUS.SUBMITTED]: '⏳ Pending Approval',
  [CHORE_STATUS.APPROVED]: '✅ Approved - Tap to collect XP',
  [CHORE_STATUS.DENIED_RESET]: '❌ Denied - Tap to retry',
  [CHORE_STATUS.DENIED_REMOVE]: '❌ Denied - Tap to dismiss'
};

export default function KidChoreList({ chores, onChoreAction }) {
  return (
    <div className="space-y-2">
      <h3 className="font-bold text-lg">Chores</h3>
      {chores.length === 0 ? (
        <p className="text-gray-500">No chores assigned</p>
      ) : (
        <ul className="space-y-2">
          {chores.map(chore => (
            <li 
              key={chore.id}
              className={`p-3 rounded-lg ${statusClasses[chore.status] || 'bg-white'} transition-all`}
              onClick={() => {
                if (chore.status === CHORE_STATUS.NEW) {
                  onChoreAction(chore.id, 'SUBMIT');
                } else if (chore.status === CHORE_STATUS.APPROVED) {
                  onChoreAction(chore.id, 'COMPLETE');
                } else if (chore.status === CHORE_STATUS.DENIED_RESET) {
                  onChoreAction(chore.id, 'RESET');
                } else if (chore.status === CHORE_STATUS.DENIED_REMOVE) {
                  onChoreAction(chore.id, 'REMOVE');
                }
              }}
            >
              <div className="flex justify-between">
                <span>{chore.title}</span>
                <span>{chore.xpValue} XP</span>
              </div>
              {statusLabels[chore.status] && (
                <div className="text-sm mt-1">{statusLabels[chore.status]}</div>
              )}
              {chore.inGracePeriod && chore.gracePeriodEnd && (
                <GracePeriodIndicator endTime={chore.gracePeriodEnd} />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}