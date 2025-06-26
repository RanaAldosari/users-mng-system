// src/components/AdminLayout.jsx
import React, { useState } from "react";
import { Link, Outlet } from "react-router";
import { FiMenu, FiX } from "react-icons/fi";

const menuItems = [
  { to: "/Admin", label: "Dashboard" },
  { to: "/Admin", label: "Add Users" },
  { to: "/Admin/AdminCreateClass", label: "Create Class" },
  { to: "/Admin/Viewusers", label: "View Users" },
  { to: "/Admin/viewclass", label: "View Classes" },
  { to: "/Admin/leaves-action", label: "View Leaves" },
];

export default function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50 text-indigo-900 flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 justify-between">
            {/* Left: Brand + Links on lg+ */}
            <div className="flex items-center">
              {/* Brand */}
              <Link to="/Admin" className="text-xl font-bold text-indigo-700">
                Admin Panel
              </Link>
              {/* Desktop Links on lg+ */}
              <div className="hidden lg:flex lg:space-x-6 ml-6">
                {menuItems.map(({ to, label }) => (
                  <Link
                    key={label}
                    to={to}
                    className="text-indigo-700 hover:text-indigo-900 font-medium"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right: Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
                className="p-2 rounded-md text-indigo-700 hover:text-indigo-900 focus:outline-none"
              >
                {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu (< lg) */}
        {menuOpen && (
          <div className="lg:hidden bg-white shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {menuItems.map(({ to, label }) => (
                <Link
                  key={label}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-indigo-700 hover:bg-indigo-50"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-8">
        <Outlet />
      </main>
    </div>
  );
}
