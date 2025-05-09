'use client';

import { Shift, POSITIONS } from '@/types';

interface CoverageAnalysisProps {
  shifts: Shift[];
}

interface TimeSlot {
  time: string;
  total: number;
  [key: string]: number | string;
}

export function CoverageAnalysis({ shifts }: CoverageAnalysisProps) {
  const generateTimeSlots = () => {
    const timeSlots: TimeSlot[] = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const slot: TimeSlot = { time, total: 0 };
        POSITIONS.forEach(pos => {
          slot[pos.name] = 0;
        });
        timeSlots.push(slot);
      }
    }
    return timeSlots;
  };

  const isTimeInRange = (time: string, startTime: string, endTime: string) => {
    const [timeHour, timeMinute] = time.split(':').map(Number);
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    const timeValue = timeHour * 60 + timeMinute;
    const startValue = startHour * 60 + startMinute;
    const endValue = endHour * 60 + endMinute;

    if (endValue > startValue) {
      return timeValue >= startValue && timeValue <= endValue;
    } else {
      // Handle overnight shifts
      return timeValue >= startValue || timeValue <= endValue;
    }
  };

  const calculateCoverage = () => {
    const timeSlots = generateTimeSlots();
    
    shifts.forEach(shift => {
      timeSlots.forEach(slot => {
        if (isTimeInRange(slot.time, shift.startTime, shift.endTime)) {
          shift.positionCounts.forEach(pc => {
            const position = POSITIONS.find(p => p.id === pc.positionId);
            if (position) {
              slot[position.name] = (slot[position.name] as number) + pc.count;
              slot.total += pc.count;
            }
          });
        }
      });
    });

    return timeSlots;
  };

  const analyzeCoverage = () => {
    const timeSlots = calculateCoverage();
    const gaps: { time: string; total: number }[] = [];
    const peaks: { time: string; total: number }[] = [];
    let minCoverage = Infinity;
    let maxCoverage = -Infinity;

    timeSlots.forEach(slot => {
      if (slot.total < minCoverage) {
        minCoverage = slot.total;
      }
      if (slot.total > maxCoverage) {
        maxCoverage = slot.total;
      }

      if (slot.total === 0) {
        gaps.push({ time: slot.time, total: 0 });
      }
      if (slot.total > 5) { // Arbitrary threshold for "peak"
        peaks.push({ time: slot.time, total: slot.total });
      }
    });

    return {
      minCoverage,
      maxCoverage,
      gaps,
      peaks,
      averageCoverage: timeSlots.reduce((sum, slot) => sum + slot.total, 0) / timeSlots.length
    };
  };

  const analysis = analyzeCoverage();

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Coverage Analysis</h3>
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700">Overall Statistics</h4>
          <div className="mt-2 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Minimum Coverage</p>
              <p className="text-lg font-semibold">{analysis.minCoverage}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Maximum Coverage</p>
              <p className="text-lg font-semibold">{analysis.maxCoverage}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Average Coverage</p>
              <p className="text-lg font-semibold">{analysis.averageCoverage.toFixed(1)}</p>
            </div>
          </div>
        </div>

        {analysis.gaps.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700">Coverage Gaps</h4>
            <div className="mt-2">
              <p className="text-sm text-gray-500">Times with no staff:</p>
              <ul className="mt-1 list-disc list-inside">
                {analysis.gaps.map(gap => (
                  <li key={gap.time} className="text-sm text-gray-600">{gap.time}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {analysis.peaks.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700">Peak Coverage</h4>
            <div className="mt-2">
              <p className="text-sm text-gray-500">Times with high staff levels:</p>
              <ul className="mt-1 list-disc list-inside">
                {analysis.peaks.map(peak => (
                  <li key={peak.time} className="text-sm text-gray-600">
                    {peak.time} ({peak.total} staff)
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div>
          <h4 className="text-sm font-medium text-gray-700">Recommendations</h4>
          <ul className="mt-2 list-disc list-inside space-y-1">
            {analysis.gaps.length > 0 && (
              <li className="text-sm text-gray-600">
                Consider adding shifts during times with no coverage
              </li>
            )}
            {analysis.peaks.length > 0 && (
              <li className="text-sm text-gray-600">
                Review peak coverage times to ensure efficient resource allocation
              </li>
            )}
            {analysis.averageCoverage < 3 && (
              <li className="text-sm text-gray-600">
                Overall coverage may be insufficient, consider adding more shifts
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
} 