'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Police Shift Manager</h1>
        <p className="text-xl text-slate-600">
          Manage shifts, track incidents, and analyze staffing patterns
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <Link
          href="/shifts"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Shift Management</h2>
          <p className="text-slate-600">
            Create and manage officer shifts with specific days, times, and staffing requirements.
          </p>
        </Link>

        <Link
          href="/incidents"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Incident Tracking</h2>
          <p className="text-slate-600">
            Track and visualize incidents by day and hour using an interactive heatmap.
          </p>
        </Link>

        <Link
          href="/analysis"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Staffing Analysis</h2>
          <p className="text-slate-600">
            Analyze staffing patterns, identify gaps, and optimize resource allocation.
          </p>
        </Link>
      </div>
    </div>
  );
} 