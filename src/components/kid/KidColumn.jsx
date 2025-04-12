// src/components/kid/KidColumn.jsx
import React from 'react';
import KidChoreList from './KidChoreList';
import KidRewardList from './KidRewardList';

export default function KidColumn({ kid, chores, rewards, onChoreAction }) {
  return (
    <div className={`w-72 p-4 rounded-lg ${kid.color} mr-4 flex-shrink-0`}>
      <div className="flex items-center mb-4">
        <span className="text-4xl mr-3">{kid.avatar}</span>
        <div>
          <h2 className="text-xl font-bold">{kid.name}</h2>
          <div className="text-lg">XP: {kid.xp}</div>
        </div>
      </div>

      <div className="space-y-4">
        <KidChoreList
          chores={chores}
          onChoreAction={onChoreAction} // Passa direttamente onChoreAction
        />
        <KidRewardList
          rewards={rewards}
          currentXp={kid.xp}
          // Modifica onClaim per passare un payload con rewardId e kidId
          onClaim={(reward) => onChoreAction(null, 'CLAIM_REWARD', {
              rewardId: reward.id,
              kidId: kid.id,
              // Non passare reward.cost qui, handleChoreAction lo troverà
          })}
        />
      </div>
    </div>
  );
}
