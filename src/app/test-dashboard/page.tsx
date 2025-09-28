'use client';

export default function TestDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Test Dashboard</h1>
      <p className="text-gray-600">This is a simple test page to verify routing works.</p>
      <div className="mt-4">
        <a href="/dashboard" className="text-blue-600 hover:text-blue-800 underline">
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}
