'use client';

import { useState } from 'react';
import { usePersistedState } from '@/hooks/usePersistedState';
import { DataImportExport } from '@/components/DataImportExport';

interface Shift {
  id: string;
  name: string;
  days: string[];
  startTime: string;
  endTime: string;
  positions: {
    [key: string]: number;
  };
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

const POSITIONS = [
  { id: 'patrol', label: 'Patrol Officer' },
  { id: 'sergeant', label: 'Sergeant' },
  { id: 'lieutenant', label: 'Lieutenant' },
  { id: 'captain', label: 'Captain' },
  { id: 'detective', label: 'Detective' },
  { id: 'specialist', label: 'Specialist' },
];

// Helper function to validate shift data
const isValidShift = (data: any): data is Shift => {
  return (
    data &&
    typeof data === 'object' &&
    typeof data.id === 'string' &&
    typeof data.name === 'string' &&
    Array.isArray(data.days) &&
    data.days.every((day: any) => typeof day === 'string') &&
    typeof data.startTime === 'string' &&
    typeof data.endTime === 'string' &&
    typeof data.positions === 'object'
  );
};

export default function ShiftsPage() {
  const [shifts, setShifts] = usePersistedState<Shift[]>('shifts', []);
  const [newShift, setNewShift] = useState<Partial<Shift>>({
    name: '',
    days: [],
    startTime: '08:00',
    endTime: '16:00',
    positions: {},
  });

  const handleDayToggle = (day: string) => {
    setNewShift(prev => ({
      ...prev,
      days: prev.days?.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...(prev.days || []), day],
    }));
  };

  const handlePositionChange = (positionId: string, count: number) => {
    setNewShift(prev => ({
      ...prev,
      positions: {
        ...prev.positions,
        [positionId]: count,
      },
    }));
  };

  const handleAddShift = () => {
    if (!newShift.name || !newShift.days?.length) return;

    const shift: Shift = {
      id: crypto.randomUUID(),
      name: newShift.name,
      days: newShift.days || [],
      startTime: newShift.startTime || '08:00',
      endTime: newShift.endTime || '16:00',
      positions: newShift.positions || {},
    };

    setShifts([...shifts, shift]);
    setNewShift({
      name: '',
      days: [],
      startTime: '08:00',
      endTime: '16:00',
      positions: {},
    });
  };

  const handleDeleteShift = (id: string) => {
    setShifts(shifts.filter(shift => shift.id !== id));
  };

  const handleExport = () => {
    const data = {
      shifts,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `shifts-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (Array.isArray(data.shifts)) {
        const validShifts = data.shifts.filter(isValidShift);
        setShifts(validShifts);
      }
    } catch (error) {
      console.error('Error importing shift data:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Shift Management</h1>
        <p className="text-slate-600">
          Create and manage shifts with specific days, times, and staffing requirements.
        </p>
      </div>

      <div className="mb-8">
        <DataImportExport
          onExport={handleExport}
          onImport={handleImport}
          exportLabel="Export Shifts"
          importLabel="Import Shifts"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* New Shift Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-slate-900 mb-4">Create New Shift</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Shift Name
              </label>
              <input
                type="text"
                value={newShift.name}
                onChange={(e) => setNewShift(prev => ({ ...prev, name: e.target.value }))}
                className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="e.g., Day Shift, Night Shift"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Days
              </label>
              <div className="flex flex-wrap gap-2">
                {DAYS_OF_WEEK.map(day => (
                  <button
                    key={day.id}
                    onClick={() => handleDayToggle(day.id)}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      newShift.days?.includes(day.id)
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={newShift.startTime}
                  onChange={(e) => setNewShift(prev => ({ ...prev, startTime: e.target.value }))}
                  className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  value={newShift.endTime}
                  onChange={(e) => setNewShift(prev => ({ ...prev, endTime: e.target.value }))}
                  className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Staffing Requirements
              </label>
              <div className="space-y-2">
                {POSITIONS.map(position => (
                  <div key={position.id} className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">{position.label}</span>
                    <input
                      type="number"
                      min="0"
                      value={newShift.positions?.[position.id] || 0}
                      onChange={(e) => handlePositionChange(position.id, parseInt(e.target.value) || 0)}
                      className="w-20 rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleAddShift}
              disabled={!newShift.name || !newShift.days?.length}
              className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              Add Shift
            </button>
          </div>
        </div>

        {/* Current Shifts */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-slate-900 mb-4">Current Shifts</h2>
          <div className="space-y-4">
            {shifts.map(shift => (
              <div key={shift.id} className="border border-slate-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium text-slate-900">{shift.name}</h3>
                  <button
                    onClick={() => handleDeleteShift(shift.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
                <div className="text-sm text-slate-600 mb-2">
                  {(shift.days || []).map(day => DAYS_OF_WEEK.find(d => d.id === day)?.label).join(', ')}
                </div>
                <div className="text-sm text-slate-600 mb-2">
                  {shift.startTime} - {shift.endTime}
                </div>
                <div className="text-sm text-slate-600">
                  {Object.entries(shift.positions || {})
                    .filter(([_, count]) => count > 0)
                    .map(([positionId, count]) => {
                      const position = POSITIONS.find(p => p.id === positionId);
                      return `${count} ${position?.label}${count > 1 ? 's' : ''}`;
                    })
                    .join(', ')}
                </div>
              </div>
            ))}
            {shifts.length === 0 && (
              <p className="text-slate-500 text-center py-4">No shifts created yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 