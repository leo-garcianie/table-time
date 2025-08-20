import { Outlet } from "react-router";
import Navbar from "./Navbar.jsx";

const Layout = () => {
  return (
    <div className="h-screen">
      <Navbar />

      <main className="h-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div
          className="fixed inset-0 -z-10 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(125% 125% at 50% 10%, #ffffff 40%, #5ea500 100%)`,
            backgroundSize: "100% 100%",
          }}
        />
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
