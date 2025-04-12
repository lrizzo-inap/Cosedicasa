// src/components/parent/DataManagement.jsx
import React, { useRef } from 'react';
import { toast } from 'react-hot-toast';

export default function DataManagement({ onExport, onImport }) {
  const fileInputRef = useRef(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImport(file);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold">Data Management</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg">
          <h3 className="font-medium mb-2">Export Data</h3>
          <p className="text-sm text-gray-600 mb-3">
            Download a backup of all app data
          </p>
          <button
            onClick={onExport}
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Export to JSON
          </button>
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="font-medium mb-2">Import Data</h3>
          <p className="text-sm text-gray-600 mb-3">
            Restore from a previous backup
          </p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />
          <button
            onClick={handleImportClick}
            className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Import from JSON
          </button>
        </div>
      </div>

      <div className="text-xs text-gray-500 mt-4">
        Note: Importing will overwrite all current data
      </div>
    </div>
  );
}