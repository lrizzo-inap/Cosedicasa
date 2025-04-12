// src/components/parent/ParentDashboard.jsx
import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import ParentChoreForm from './ParentChoreForm';
import ApprovalQueue from './ApprovalQueue';
import PenaltyReviewQueue from './PenaltyReviewQueue'; // Importa il componente
import RewardTab from './RewardTab';
import XpLogTab from './XpLogTab';
import DataManagement from './DataManagement';
import { CHORE_STATUS } from '../../data/models'; // Importa CHORE_STATUS
import { handleChoreAction as handleActionLogic } from '../../services/dataService'; // Importa la logica separatamente


export default function ParentDashboard({ data, onDataChange, onExport, onImport }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Funzione wrapper per chiamare la logica di dataService con onDataChange
  const handleAction = (id, action, payload = {}) => {
    onDataChange(currentData => handleActionLogic(currentData, id, action, payload));
  };


  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen"> {/* Aggiunto bg e min-h */}
      <h1 className="text-2xl font-bold mb-4 text-center text-blue-800">Parent Dashboard</h1> {/* Aggiunto titolo */}
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mb-4">
          {["Chores", "Approvals & Penalties", "Rewards", "XP Log", "Data"].map((tab) => ( // Rinominato Tab
            <Tab
              key={tab}
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-colors duration-150
                ${selected
                    ? 'bg-white shadow text-blue-700'
                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                }`
              }
            >
              {tab}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels className="mt-2">
          {/* Tab Chores */}
          <Tab.Panel className="p-4 bg-white rounded-lg shadow">
             <h2 className="text-xl font-bold mb-4">Manage Chores</h2>
            <ParentChoreForm
              kids={data.kids}
              // Modifica onSave per usare la logica centralizzata se vuoi,
              // ma l'aggiunta diretta è ok per un form di creazione.
              // Qui assumiamo che ParentChoreForm crei una chore completa
              // che viene poi aggiunta all'array.
              onSave={(newChoreData) => {
                  const choreWithDefaults = {
                      ...newChoreData,
                      id: Date.now() + Math.random(), // Usa ID più robusto
                      status: CHORE_STATUS.NEW,
                      createdAt: new Date().toISOString(),
                      // Assicurati che assignedTo sia presente e valido
                  };
                  // Aggiungere validazione Joi qui prima di salvare sarebbe ideale
                  onDataChange(d => ({...d, chores: [...d.chores, choreWithDefaults]}))
                }
              }
            />
          </Tab.Panel>

          {/* Tab Approvals & Penalties */}
          <Tab.Panel className="space-y-6"> {/* Aggiunto space-y */}
             {/* Messo dentro un contenitore per stile */}
             <div className="p-4 bg-white rounded-lg shadow">
                <ApprovalQueue
                    chores={data.chores} // Passa tutte le chores, il componente filtrerà
                    kids={data.kids}
                    // Passa la funzione handleAction che chiama onDataChange -> handleActionLogic
                    onApprove={(id) => handleAction(id, 'APPROVE')}
                    onDeny={(id, reset) => handleAction(id, reset ? 'DENY_RESET' : 'DENY_REMOVE')}
                />
            </div>
            {/* Aggiungi PenaltyReviewQueue qui sotto */}
            <PenaltyReviewQueue
                chores={data.chores} // Passa tutte le chores, il componente filtrerà
                kids={data.kids}
                // Usa la stessa funzione handleAction per le azioni di penalità
                onPenaltyAction={(id, action, payload) => handleAction(id, action, payload)}
             />
          </Tab.Panel>

          {/* Tab Rewards */}
          <Tab.Panel> {/* Rimosso stile extra, RewardTab ha il suo */}
            <RewardTab
              rewards={data.rewards}
              kids={data.kids}
              onSave={(rewards) => onDataChange(d => ({...d, rewards}))} // OK così
            />
          </Tab.Panel>

          {/* Tab XP Log */}
          <Tab.Panel className="p-4 bg-white rounded-lg shadow">
            <XpLogTab logs={data.logs || []} kids={data.kids} /> {/* Assicura che logs sia un array */}
          </Tab.Panel>

          {/* Tab Data Management */}
          <Tab.Panel> {/* Rimosso stile extra, DataManagement ha il suo */}
            <DataManagement onExport={onExport} onImport={(file) => importData(file, (importedData) => onDataChange(loadData()))} />
             {/* Aggiornato onImport per ricaricare i dati dopo l'import */}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
