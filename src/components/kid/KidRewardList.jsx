// src/components/kid/KidRewardList.jsx
import React from 'react';
import { toast } from 'react-hot-toast';

export default function KidRewardList({ rewards, currentXp, onClaim }) {
  const handleClaim = (reward) => {
    toast(
      (t) => (
        <div className="flex items-center">
          <span>Claim "{reward.title}" for {reward.cost} XP?</span>
          <button
            onClick={() => {
              onClaim(reward);
              toast.dismiss(t.id);
            }}
            className="ml-4 px-2 py-1 bg-green-500 text-white rounded"
          >
            Confirm
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="ml-2 px-2 py-1 bg-gray-300 rounded"
          >
            Cancel
          </button>
        </div>
      ),
      { duration: 10000 }
    );
  };

  return (
    <div className="space-y-2">
      <h3 className="font-bold text-lg">Rewards</h3>
      {rewards.length === 0 ? (
        <p className="text-gray-500">No rewards available</p>
      ) : (
        <ul className="space-y-2">
          {rewards.map(reward => (
            <li 
              key={reward.id}
              className={`p-3 rounded-lg border ${currentXp >= reward.cost ? 'bg-white' : 'bg-gray-50 opacity-75'}`}
            >
              <div className="flex justify-between">
                <span>{reward.title}</span>
                <span>{reward.cost} XP</span>
              </div>
              <div className="w-full bg-gray-200 h-2 mt-2 rounded-full">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${Math.min(100, (currentXp / reward.cost) * 100)}%` }}
                />
              </div>
              <button
                onClick={() => handleClaim(reward)}
                disabled={currentXp < reward.cost}
                className={`mt-2 w-full py-1 rounded ${currentXp >= reward.cost ? 'bg-green-500 text-white' : 'bg-gray-300 cursor-not-allowed'}`}
              >
                {currentXp >= reward.cost ? 'Claim' : 'Not enough XP'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}