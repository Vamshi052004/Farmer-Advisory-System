import LogoutButton from "./LogoutButton";

function Navbar({ toggleSidebar }) {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-8 shadow-sm">

      <div className="flex items-center gap-4">
        {/* Hamburger */}
        <button
          onClick={toggleSidebar}
          className="text-2xl md:hidden"
        >
          ☰
        </button>

        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-green-700">
          🌾 Farmer Advisory System
        </h2>
      </div>

      <LogoutButton />
    </header>
  );
}

export default Navbar;