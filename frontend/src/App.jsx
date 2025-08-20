import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";

import Layout from "./components/Layout/Layout.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Reservation from "./pages/Reservation.jsx";
import MyReservations from "./pages/MyReservations.jsx";
import Dashboard from "./pages/Dashboard.jsx";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return <p>Loading...</p>;
  }
  return isAuthenticated ? <Navigate to="/" /> : children;
};

const PrivateRoute = ({ children, roles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return <p>Loading...</p>;
  }
  // If not authenticated -> login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  // If it has not roles
  if (roles && roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route
              path="/reservations"
              element={
                <PrivateRoute>
                  <Reservation />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-reservations"
              element={
                <PrivateRoute>
                  <MyReservations />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute roles={["admin"]}>
                  <Dashboard />
                </PrivateRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
