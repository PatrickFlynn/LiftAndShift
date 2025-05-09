'use client';

import { useState } from 'react';

interface CallVolume {
  day: string;
  hour: number;
  incidents: number;
}

interface WeeklyStaffingHeatmapProps {
  callVolumes: CallVolume[];
  onIncidentChange: (day: string, hour: number, incidents: number) => void;
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

export function WeeklyStaffingHeatmap({ callVolumes, onIncidentChange }: WeeklyStaffingHeatmapProps) {
  const [editingCell, setEditingCell] = useState<{ day: string; hour: number; value: string } | null>(null);

  const getCellColor = (incidents: number) => {
    if (incidents === 0) return 'bg-slate-100';
    if (incidents <= 2) return 'bg-green-100';
    if (incidents <= 5) return 'bg-yellow-100';
    if (incidents <= 8) return 'bg-orange-100';
    return 'bg-red-100';
  };

  const handleCellClick = (day: string, hour: number) => {
    const callVolume = callVolumes.find(cv => cv.day === day && cv.hour === hour);
    setEditingCell({ day, hour, value: callVolume?.incidents.toString() || '' });
  };

  const handleValueSubmit = () => {
    if (editingCell) {
      const incidents = parseInt(editingCell.value) || 0;
      onIncidentChange(editingCell.day, editingCell.hour, incidents);
      setEditingCell(null);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-8 gap-1">
        <div className="col-span-1" /> {/* Empty cell for alignment */}
        {DAYS_OF_WEEK.map(day => (
          <div key={day.id} className="text-center text-sm font-medium text-slate-700">
            {day.label}
          </div>
        ))}

        {Array.from({ length: 24 }, (_, hour) => (
          <>
            <div key={`hour-${hour}`} className="text-right text-sm text-slate-500 pr-2">
              {hour}:00
            </div>
            {DAYS_OF_WEEK.map(day => {
              const callVolume = callVolumes.find(cv => cv.day === day.id && cv.hour === hour);
              const incidents = callVolume?.incidents || 0;
              const isEditing = editingCell?.day === day.id && editingCell?.hour === hour;

              return (
                <div
                  key={`${day.id}-${hour}`}
                  onClick={() => handleCellClick(day.id, hour)}
                  className={`${getCellColor(incidents)} p-2 rounded cursor-pointer hover:ring-2 hover:ring-indigo-500`}
                >
                  {isEditing ? (
                    <input
                      type="number"
                      min="0"
                      value={editingCell.value}
                      onChange={(e) => setEditingCell(prev => ({ ...prev!, value: e.target.value }))}
                      onBlur={handleValueSubmit}
                      onKeyDown={(e) => e.key === 'Enter' && handleValueSubmit()}
                      className="w-full px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      autoFocus
                    />
                  ) : (
                    <div className="text-sm font-medium">
                      {incidents > 0 ? incidents : '-'}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center space-x-4 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-slate-100 rounded mr-2" />
          <span>No Incidents</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-100 rounded mr-2" />
          <span>1-2 Incidents</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-yellow-100 rounded mr-2" />
          <span>3-5 Incidents</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-orange-100 rounded mr-2" />
          <span>6-8 Incidents</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-100 rounded mr-2" />
          <span>9+ Incidents</span>
        </div>
      </div>
    </div>
  );
} 