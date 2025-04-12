// src/components/parent/ApprovalQueue.jsx
import React from 'react';
import { CHORE_STATUS } from '../../data/models';
import { toast } from 'react-hot-toast';

export default function ApprovalQueue({ chores, kids, onApprove, onDeny }) {
  const pendingChores = chores.filter(c => c.status === CHORE_STATUS.SUBMITTED);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Pending Approvals ({pendingChores.length})</h2>
      {pendingChores.length === 0 ? (
        <p className="text-gray-500">No chores waiting for approval</p>
      ) : (
        <ul className="space-y-3">
          {pendingChores.map(chore => {
            const kid = kids.find(k => k.id === chore.assignedTo);
            return (
              <li key={chore.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between">
                  <div>
                    <span className="font-medium">{chore.title}</span>
                    <span className="ml-2 text-gray-600">
                      ({kid?.name || 'Unknown'})
                    </span>
                  </div>
                  <span className="font-bold">{chore.xpValue} XP</span>
                </div>
                <div className="flex space-x-2 mt-3">
                  <button
                    onClick={() => {
                      onApprove(chore.id);
                      toast.success('Chore approved!');
                    }}
                    className="px-3 py-1 bg-green-500 text-white rounded"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      onDeny(chore.id, true);
                      toast.error('Chore denied (can retry)');
                    }}
                    className="px-3 py-1 bg-yellow-500 text-white rounded"
                  >
                    Deny & Reset
                  </button>
                  <button
                    onClick={() => {
                      onDeny(chore.id, false);
                      toast.error('Chore denied (removed)');
                    }}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Deny & Remove
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}