import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-6">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md">
        <h1 className="text-5xl font-bold text-green-700 mb-4">404</h1>
        <p className="text-gray-600 mb-6">
          The page you are looking for does not exist.
        </p>

        <Link
          to="/"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;