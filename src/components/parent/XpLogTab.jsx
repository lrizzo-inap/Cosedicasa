// src/components/parent/XpLogTab.jsx
import React from 'react';
import { format } from 'date-fns';

export default function XpLogTab({ logs, kids }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">XP History</h2>
        <div className="text-sm">
          Total entries: {logs.length}
        </div>
      </div>
      
      <div className="overflow-y-auto max-h-[60vh]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Date</th>
              <th className="text-left p-2">Child</th>
              <th className="text-left p-2">Action</th>
              <th className="text-right p-2">XP</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.date} className="border-b hover:bg-gray-50">
                <td className="p-2 text-sm">
                  {format(new Date(log.date), 'MMM d, yyyy - h:mm a')}
                </td>
                <td className="p-2">
                  {kids.find(k => k.id === log.kidId)?.name || 'Unknown'}
                </td>
                <td className="p-2">
                  {log.description}
                </td>
                <td className={`p-2 text-right font-mono ${
                  log.xp > 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {log.xp > 0 ? '+' : ''}{log.xp}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}