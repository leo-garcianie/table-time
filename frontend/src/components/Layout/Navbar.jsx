import { Link, useNavigate } from "react-router";
import { User, LogOut, Loader } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (isLoading) {
    return (
      <nav className="bg-light fixed w-full z-99">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center justify-center space-x-2 ml-4"
            >
              <img
                src="/table-time-logo.svg"
                alt="Logo Table Time"
                className="size-8"
              />
              <span className="text-2xl font-semibold text-dark tracking-tighter">
                TableTime
              </span>
            </Link>
          </div>
          <div className="p-2">
            <Loader className="size-5 animate-spin text-primary" />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-light fixed w-full z-99">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center">
          <Link
            to="/"
            className="flex items-center justify-center space-x-2 ml-4"
          >
            <img
              src="/table-time-logo.svg"
              alt="Logo Table Time"
              className="size-8"
            />
            <span className="text-2xl font-semibold text-dark tracking-tighter">
              TableTime
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex justify-center items-center space-x-2">
          <Link
            to="/reservations"
            className="text-dark text-sm font-medium transition-colors hover:bg-gray-100 rounded-md py-1 px-3"
          >
            New Reservation
          </Link>

          {isAuthenticated && user?.role !== "admin" && (
            <Link
              to="/my-reservations"
              className="text-dark text-sm font-medium transition-colors hover:bg-gray-100 rounded-md py-1 px-3"
            >
              My Reservations
            </Link>
          )}

          {user?.role === "admin" && (
            <Link
              to="/dashboard"
              className="text-dark text-sm font-medium transition-colors hover:bg-gray-100 rounded-md py-1 px-3"
            >
              Dashboard
            </Link>
          )}

          {/* User Menu */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 label-navbar text-white font-medium">
                <User className="size-4" />
                <span className="text-sm">{user?.name}</span>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 text-dark hover:text-red-600 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <LogOut className="size-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/login" className="btn-navbar text-white font-semibold">
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
