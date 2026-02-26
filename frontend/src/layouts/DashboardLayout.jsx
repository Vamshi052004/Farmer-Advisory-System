function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6">
        <h2 className="text-xl font-bold text-green-700 mb-8">
          🌾 AgriSmart
        </h2>

        <nav className="space-y-4 text-gray-600">
          <a href="/dashboard" className="block hover:text-green-600">Dashboard</a>
          <a href="/crop-advisory" className="block hover:text-green-600">Crop Advisory</a>
          <a href="/weather" className="block hover:text-green-600">Weather</a>
          <a href="/profile" className="block hover:text-green-600">Profile</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        {children}
      </main>

    </div>
  );
}

export default DashboardLayout;
