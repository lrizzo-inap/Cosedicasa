// src/App.jsx
import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { loadData, saveData, handleChoreAction, exportData, importData } from './services/dataService';
import { processChores } from './utils/gracePeriod';
import KidView from './components/kid/KidView';
import ParentDashboard from './components/parent/ParentDashboard';
import ErrorBoundary from './components/shared/ErrorBoundary';
import './index.css';

const useAppData = () => {
  const [data, setRawData] = useState(() => {
    const loaded = loadData();
    return {
      ...loaded,
      chores: processChores(loaded.chores, loaded.settings.gracePeriodHours || 2)
    };
  });

  useEffect(() => saveData(data), [data]);

  const updateData = (updater) => {
    setRawData(prev => {
      const newData = typeof updater === 'function' ? updater(prev) : updater;
      return {
        ...newData,
        chores: processChores(newData.chores, newData.settings.gracePeriodHours || 2)
      };
    });
  };

  return { data, updateData };
};

function App() {
  const [isKidView] = useState(window.location.pathname === '/kid');
  const { data, updateData } = useAppData();

  return (
    <ErrorBoundary>
      <div className="app-container">
        <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
        
        {isKidView ? (
          <KidView
            kids={data.kids}
            chores={data.chores}
            rewards={data.rewards}
            onChoreAction={(choreId, action) => 
              updateData(data => handleChoreAction(data, choreId, action))
            }
          />
        ) : (
          <ParentDashboard
            data={data}
            onDataChange={updateData}
            onExport={exportData}
            onImport={(file) => importData(file, () => updateData(loadData()))}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;