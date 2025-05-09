'use client';

import { useState } from 'react';
import { usePersistedState } from '@/hooks/usePersistedState';
import { WeeklyStaffingHeatmap } from '@/components/WeeklyStaffingHeatmap';
import { DataImportExport } from '@/components/DataImportExport';

interface CallVolume {
  day: string;
  hour: number;
  incidents: number;
}

const DAYS_OF_WEEK = [
  { id: 'MON', label: 'Monday' },
  { id: 'TUE', label: 'Tuesday' },
  { id: 'WED', label: 'Wednesday' },
  { id: 'THU', label: 'Thursday' },
  { id: 'FRI', label: 'Friday' },
  { id: 'SAT', label: 'Saturday' },
  { id: 'SUN', label: 'Sunday' },
];

// Helper function to validate call volume data
const isValidCallVolume = (data: any): data is CallVolume => {
  return (
    data &&
    typeof data === 'object' &&
    typeof data.day === 'string' &&
    typeof data.hour === 'number' &&
    typeof data.incidents === 'number'
  );
};

export default function IncidentsPage() {
  const [callVolumes, setCallVolumes] = usePersistedState<CallVolume[]>('callVolumes', []);

  const handleIncidentChange = (day: string, hour: number, incidents: number) => {
    const existingIndex = callVolumes.findIndex(cv => cv.day === day && cv.hour === hour);
    
    if (existingIndex >= 0) {
      const updatedVolumes = [...callVolumes];
      updatedVolumes[existingIndex] = { ...updatedVolumes[existingIndex], incidents };
      setCallVolumes(updatedVolumes);
    } else {
      setCallVolumes([...callVolumes, { day, hour, incidents }]);
    }
  };

  const handleExport = () => {
    const data = {
      callVolumes,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `incidents-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (Array.isArray(data.callVolumes)) {
        const validVolumes = data.callVolumes.filter(isValidCallVolume);
        setCallVolumes(validVolumes);
      }
    } catch (error) {
      console.error('Error importing incident data:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Incident Management</h1>
        <p className="text-slate-600">
          Track and manage incidents by day and hour. Click on cells to enter incident counts.
        </p>
      </div>

      <div className="mb-8">
        <DataImportExport
          onExport={handleExport}
          onImport={handleImport}
          exportLabel="Export Incidents"
          importLabel="Import Incidents"
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-slate-900 mb-4">Incident Heatmap</h2>
        <WeeklyStaffingHeatmap
          callVolumes={callVolumes}
          onIncidentChange={handleIncidentChange}
        />
      </div>
    </div>
  );
} 