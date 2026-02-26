import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl font-semibold transition duration-300 shadow-sm"
    >
      Logout
    </button>
  );
}

export default LogoutButton;
