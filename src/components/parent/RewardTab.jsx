// src/components/parent/RewardTab.jsx
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function RewardTab({ rewards, kids, onSave }) {
  const [newReward, setNewReward] = useState({
    title: '',
    cost: 50,
    assignedTo: ['all']
  });

  const handleAddReward = () => {
    if (!newReward.title.trim()) {
      toast.error('Reward needs a title');
      return;
    }
    if (newReward.cost < 1) {
      toast.error('XP cost must be positive');
      return;
    }

    onSave([...rewards, {
      ...newReward,
      id: Date.now(),
      createdAt: new Date().toISOString()
    }]);
    setNewReward({
      title: '',
      cost: 50,
      assignedTo: ['all']
    });
    toast.success('Reward added!');
  };

  const toggleKidAssignment = (kidId) => {
    setNewReward(prev => ({
      ...prev,
      assignedTo: prev.assignedTo.includes(kidId)
        ? prev.assignedTo.filter(id => id !== kidId)
        : [...prev.assignedTo, kidId]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-white rounded-lg shadow">
        <h3 className="font-bold text-lg mb-4">Add New Reward</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label>Reward Title</label>
            <input
              type="text"
              value={newReward.title}
              onChange={(e) => setNewReward({...newReward, title: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label>XP Cost</label>
            <input
              type="number"
              min="1"
              value={newReward.cost}
              onChange={(e) => setNewReward({...newReward, cost: parseInt(e.target.value) || 0})}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label>Assign To</label>
            <div className="flex flex-wrap gap-2 mt-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={newReward.assignedTo.includes('all')}
                  onChange={() => {
                    setNewReward({
                      ...newReward,
                      assignedTo: newReward.assignedTo.includes('all') ? [] : ['all']
                    });
                  }}
                  className="mr-1"
                />
                <span>All</span>
              </label>
              {kids.map(kid => (
                <label key={kid.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newReward.assignedTo.includes(kid.id)}
                    onChange={() => toggleKidAssignment(kid.id)}
                    disabled={newReward.assignedTo.includes('all')}
                    className="mr-1"
                  />
                  <span>{kid.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <button
          onClick={handleAddReward}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Reward
        </button>
      </div>

      <div className="p-4 bg-white rounded-lg shadow">
        <h3 className="font-bold text-lg mb-4">Existing Rewards</h3>
        {rewards.length === 0 ? (
          <p className="text-gray-500">No rewards created yet</p>
        ) : (
          <ul className="divide-y">
            {rewards.map(reward => (
              <li key={reward.id} className="py-3">
                <div className="flex justify-between">
                  <span className="font-medium">{reward.title}</span>
                  <span>{reward.cost} XP</span>
                </div>
                <div className="text-sm text-gray-500">
                  Assigned to: {reward.assignedTo.includes('all') 
                    ? 'All kids' 
                    : kids.filter(k => reward.assignedTo.includes(k.id)).map(k => k.name).join(', ')}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}