'use client';

import { useState } from 'react';
import { usePersistedState } from '@/hooks/usePersistedState';
import { Shift } from '@/types/shift';
import { WeeklyStaffingChart } from '@/components/WeeklyStaffingChart';

interface CallVolume {
  day: string;
  hour: number;
  calls: number;
  crimes: number;
  other: number;
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
  { id: 'officer', label: 'Officer' },
  { id: 'sergeant', label: 'Sergeant' },
  { id: 'lieutenant', label: 'Lieutenant' },
];

export default function AnalysisPage() {
  const [shifts, setShifts] = usePersistedState<Shift[]>('shifts', []);
  const [callVolumes, setCallVolumes] = usePersistedState<CallVolume[]>('callVolumes', []);
  const [selectedPosition, setSelectedPosition] = useState('officer');

  // Calculate staffing levels for each hour of each day
  const calculateStaffingLevels = () => {
    const staffingLevels: { [day: string]: { [hour: number]: number } } = {};

    // Initialize staffing levels for all days and hours
    DAYS_OF_WEEK.forEach(day => {
      staffingLevels[day.id] = {};
      for (let hour = 0; hour < 24; hour++) {
        staffingLevels[day.id][hour] = 0;
      }
    });

    // Calculate staffing levels based on shifts
    shifts.forEach(shift => {
      if (shift.position === selectedPosition) {
        const [startHour] = shift.startTime.split(':').map(Number);
        const [endHour] = shift.endTime.split(':').map(Number);
        
        for (let hour = startHour; hour < endHour; hour++) {
          staffingLevels[shift.day][hour] = (staffingLevels[shift.day][hour] || 0) + 1;
        }
      }
    });

    return staffingLevels;
  };

  // Analyze staffing gaps and peak hours
  const analyzeStaffing = () => {
    const staffingLevels = calculateStaffingLevels();
    const gaps: { day: string; hour: number }[] = [];
    const peakHours: { day: string; hour: number; incidents: number }[] = [];

    DAYS_OF_WEEK.forEach(day => {
      for (let hour = 0; hour < 24; hour++) {
        const staffCount = staffingLevels[day.id][hour] || 0;
        const callVolume = callVolumes.find(cv => cv.day === day.id && cv.hour === hour);
        const totalIncidents = callVolume ? callVolume.calls + callVolume.crimes + callVolume.other : 0;

        // Identify gaps (no staff during hours with incidents)
        if (staffCount === 0 && totalIncidents > 0) {
          gaps.push({ day: day.id, hour });
        }

        // Identify peak hours (high incident volume)
        if (totalIncidents >= 5) {
          peakHours.push({ day: day.id, hour, incidents: totalIncidents });
        }
      }
    });

    return { gaps, peakHours };
  };

  const { gaps, peakHours } = analyzeStaffing();
  const staffingLevels = calculateStaffingLevels();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Staffing Analysis</h1>
        <p className="text-slate-600">
          Analyze staffing levels, identify gaps, and track peak hours.
        </p>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Select Position
        </label>
        <select
          value={selectedPosition}
          onChange={(e) => setSelectedPosition(e.target.value)}
          className="block w-full max-w-xs rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          {POSITIONS.map(position => (
            <option key={position.id} value={position.id}>
              {position.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-slate-900 mb-4">Staffing Trends</h2>
          <WeeklyStaffingChart staffingLevels={staffingLevels} />
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-slate-900 mb-4">Staffing Gaps</h2>
            {gaps.length > 0 ? (
              <div className="space-y-2">
                {gaps.map(({ day, hour }) => (
                  <div key={`${day}-${hour}`} className="flex items-center justify-between p-3 bg-red-50 rounded-md">
                    <div>
                      <span className="font-medium text-red-900">
                        {DAYS_OF_WEEK.find(d => d.id === day)?.label}
                      </span>
                      <span className="text-red-600 ml-2">
                        {hour}:00
                      </span>
                    </div>
                    <span className="text-red-600">No Coverage</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500">No staffing gaps identified.</p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-slate-900 mb-4">Peak Hours</h2>
            {peakHours.length > 0 ? (
              <div className="space-y-2">
                {peakHours.map(({ day, hour, incidents }) => (
                  <div key={`${day}-${hour}`} className="flex items-center justify-between p-3 bg-orange-50 rounded-md">
                    <div>
                      <span className="font-medium text-orange-900">
                        {DAYS_OF_WEEK.find(d => d.id === day)?.label}
                      </span>
                      <span className="text-orange-600 ml-2">
                        {hour}:00
                      </span>
                    </div>
                    <span className="text-orange-600">{incidents} incidents</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500">No peak hours identified.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 