function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

export default PublicLayout;