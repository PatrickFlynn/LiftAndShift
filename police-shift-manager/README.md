# Police Shift Manager

A modern web application for managing police department shifts, tracking incidents, and analyzing staffing patterns.

## Features

### Shift Management
- Create and manage shifts with specific days and times
- Set staffing requirements for different positions
- Import/export shift data
- Visual representation of shift coverage

### Incident Tracking
- Interactive heatmap for incident visualization
- Track incidents by day and hour
- Color-coded incident volume
- Import/export incident data

### Staffing Analysis
- Analyze staffing patterns
- Identify coverage gaps
- Compare staffing levels with incident volume
- Optimize resource allocation

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks with Local Storage
- **Charts**: Recharts
- **UI Components**: Headless UI

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd police-shift-manager
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
police-shift-manager/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── analysis/          # Staffing analysis page
│   │   ├── incidents/         # Incident tracking page
│   │   ├── shifts/           # Shift management page
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Landing page
│   ├── components/            # Reusable components
│   │   ├── Navbar.tsx        # Navigation component
│   │   ├── WeeklyStaffingHeatmap.tsx
│   │   ├── WeeklyStaffingChart.tsx
│   │   └── DataImportExport.tsx
│   ├── hooks/                # Custom React hooks
│   │   └── usePersistedState.ts
│   └── types/                # TypeScript type definitions
└── public/                   # Static assets
```

## Data Structure

### Shift
```typescript
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
```

### Incident
```typescript
interface CallVolume {
  day: string;
  hour: number;
  incidents: number;
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
