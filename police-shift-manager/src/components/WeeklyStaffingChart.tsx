'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface StaffingLevels {
  [day: string]: {
    [hour: number]: number;
  };
}

interface WeeklyStaffingChartProps {
  staffingLevels: StaffingLevels;
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

const COLORS = {
  MON: '#3B82F6', // blue
  TUE: '#10B981', // green
  WED: '#F59E0B', // amber
  THU: '#EF4444', // red
  FRI: '#8B5CF6', // purple
  SAT: '#EC4899', // pink
  SUN: '#6B7280', // gray
};

interface ChartDataPoint {
  hour: string;
  [key: string]: string | number;
}

export function WeeklyStaffingChart({ staffingLevels }: WeeklyStaffingChartProps) {
  // Transform data for the chart
  const chartData = Array.from({ length: 24 }, (_, hour) => {
    const data: ChartDataPoint = {
      hour: `${hour.toString().padStart(2, '0')}:00`,
    };

    DAYS_OF_WEEK.forEach(day => {
      data[day.label] = staffingLevels[day.id][hour];
    });

    return data;
  });

  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" />
          <YAxis />
          <Tooltip />
          <Legend />
          {DAYS_OF_WEEK.map((day) => (
            <Line
              key={day.id}
              type="monotone"
              dataKey={day.label}
              stroke={COLORS[day.id as keyof typeof COLORS]}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 