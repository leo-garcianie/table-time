import { Link, useNavigate } from "react-router";
import { User, LogOut, Loader, Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

const Navbar = () => {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (isLoading) {
    return (
      <nav className="bg-light fixed w-full z-99">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4">
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
    <nav className="bg-light fixed w-full z-999">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo - Always visible */}
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

        {/* Desktop Navigation */}
        <div className="hidden md:flex justify-center items-center space-x-2">
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

          {/* Desktop User Menu */}
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

        {/* Mobile menu button - Only visible on mobile */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="p-2 text-dark hover:bg-gray-100 rounded-md transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="size-6" />
            ) : (
              <Menu className="size-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu - Only visible when menu is open */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-light border-t border-gray-200 z-999 border-b">
          <div className="px-4 py-2 space-y-1">
            <Link
              to="/reservations"
              className="block text-dark text-sm font-medium transition-colors hover:bg-gray-100 rounded-md py-2 px-3"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              New Reservation
            </Link>

            {isAuthenticated && user?.role !== "admin" && (
              <Link
                to="/my-reservations"
                className="block text-dark text-sm font-medium transition-colors hover:bg-gray-100 rounded-md py-2 px-3"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Reservations
              </Link>
            )}

            {user?.role === "admin" && (
              <Link
                to="/dashboard"
                className="block text-dark text-sm font-medium transition-colors hover:bg-gray-100 rounded-md py-2 px-3"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}

            {/* Mobile User Menu */}
            {isAuthenticated ? (
              <div className="border-t border-gray-200 pt-2">
                <div className="flex items-center label-navbar space-x-2 py-2 px-3">
                  <User className="size-4" />
                  <span className="text-sm  font-medium">
                    {user?.name}
                  </span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 w-full text-left py-2 px-3 text-dark hover:text-red-600 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <LogOut className="size-4" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            ) : (
              <div className="border-t border-gray-200 pt-2">
                <Link
                  to="/login"
                  className="block btn-navbar text-white font-semibold text-center py-2 mx-3 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
