function PrivateLayout({ children }) {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" />;

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 p-8">
          {children}
        </div>
      </div>
    </>
  );
}
