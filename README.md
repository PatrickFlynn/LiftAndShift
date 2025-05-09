# Police Department Shift Manager

A modern web application for managing police department shifts, employees, and staffing optimization.

## Features

- Create and manage employee profiles with positions and squad assignments
- Define and manage shifts with specific days and times
- Visualize shift coverage with interactive charts
- Analyze staffing levels and identify coverage gaps
- Get recommendations for optimizing shift distribution

## Tech Stack

- Next.js 13 with App Router
- React 18
- TypeScript
- Tailwind CSS for styling
- Prisma for database management
- SQLite database
- Recharts for data visualization

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `/src/app/*` - Next.js 13 app router pages
- `/src/components/*` - React components
- `/src/utils/*` - Utility functions
- `/prisma/*` - Database schema and migrations

## Key Components

### Employees Management
- Create, edit, and delete employee profiles
- Assign employees to positions and squads
- Track employee shift assignments

### Shifts Management
- Create and manage shift schedules
- Define shift times and days of the week
- Visualize shift coverage

### Coverage Analysis
- Interactive charts showing staffing levels
- Identify coverage gaps and peak times
- Get recommendations for optimization

## Database Schema

The application uses the following main models:

- `Employee`: Store employee information and relationships
- `Position`: Define different job positions
- `Squad`: Group employees into squads
- `Shift`: Define shift schedules
- `ShiftAssignment`: Track which employees are assigned to which shifts

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - feel free to use this project for any purpose.