import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useState } from "react";

function DashboardLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Navbar toggleSidebar={() => setIsOpen(!isOpen)} />

      <div className="flex min-h-screen bg-gray-50">
        <Sidebar isOpen={isOpen} />

        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>
    </>
  );
}

export default DashboardLayout;