// src/components/parent/ParentDashboard.jsx
import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import ParentChoreForm from './ParentChoreForm';
import ApprovalQueue from './ApprovalQueue';
import RewardTab from './RewardTab';
import XpLogTab from './XpLogTab';
import DataManagement from './DataManagement';

export default function ParentDashboard({ data, onDataChange, onExport, onImport }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          {["Chores", "Approvals", "Rewards", "XP Log", "Data"].map((tab) => (
            <Tab
              key={tab}
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                ${selected ? 'bg-white shadow' : 'text-blue-100 hover:bg-white/[0.12]'}`
              }
            >
              {tab}
            </Tab>
          ))}
        </Tab.List>
        
        <Tab.Panels className="mt-4">
          <Tab.Panel>
            <ParentChoreForm 
              kids={data.kids} 
              onSave={(chore) => onDataChange(d => ({...d, chores: [...d.chores, chore]}))}
            />
          </Tab.Panel>
          <Tab.Panel>
            <ApprovalQueue 
              chores={data.chores.filter(c => c.status === CHORE_STATUS.SUBMITTED)}
              onApprove={(id) => onDataChange(d => handleChoreAction(d, id, 'APPROVE'))}
              onDeny={(id, reset) => onDataChange(d => 
                handleChoreAction(d, id, reset ? 'DENY_RESET' : 'DENY_REMOVE')
              )}
            />
          </Tab.Panel>
          <Tab.Panel>
            <RewardTab 
              rewards={data.rewards} 
              kids={data.kids}
              onSave={(rewards) => onDataChange(d => ({...d, rewards}))}
            />
          </Tab.Panel>
          <Tab.Panel>
            <XpLogTab logs={data.logs} kids={data.kids} />
          </Tab.Panel>
          <Tab.Panel>
            <DataManagement onExport={onExport} onImport={onImport} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}