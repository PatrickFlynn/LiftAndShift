export interface Position {
  id: string;
  name: string;
}

export interface PositionCount {
  positionId: string;
  count: number;
}

export interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  daysOfWeek: string[];
  positionCounts: PositionCount[];
}

export const POSITIONS: Position[] = [
  { id: 'officer', name: 'Officer' },
  { id: 'sergeant', name: 'Sergeant' },
  { id: 'lieutenant', name: 'Lieutenant' }
]; 