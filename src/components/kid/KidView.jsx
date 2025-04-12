// src/components/kid/KidView.jsx
import React from 'react';
import KidColumn from './KidColumn';
import { CHORE_STATUS } from '../../data/models';

export default function KidView({ kids, chores, rewards, onChoreAction }) {
  const getVisibleChores = (kidId) => {
    return chores.filter(c => 
      c.assignedTo === kidId &&
      (c.status !== CHORE_STATUS.COMPLETED || 
       (c.inGracePeriod && Date.now() < new Date(c.gracePeriodEnd)))
    );
  };

  return (
    <div className="p-4 overflow-x-auto h-screen">
      <div className="flex min-w-max space-x-6 pb-4">
        {kids.map(kid => (
          <KidColumn
            key={kid.id}
            kid={kid}
            chores={getVisibleChores(kid.id)}
            rewards={rewards.filter(r => 
              r.assignedTo.includes(kid.id) || 
              r.assignedTo.includes('all')
            )}
            onChoreAction={onChoreAction}
          />
        ))}
      </div>
    </div>
  );
}