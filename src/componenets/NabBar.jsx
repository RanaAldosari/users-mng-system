import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Navbar() {
    const [user, setUser] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleCheckUser = () => {
            const token = localStorage.getItem("token");
            if (token) {
                const parsedUser = JSON.parse(localStorage.getItem("user"));
                setUser(parsedUser);
            } else {
                setUser(null);
            }
        };
        handleCheckUser();
    }, []);

    const handleLogout = () => {
        toast.success("Logged out successfully!");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/signin");
    };

    if (!user) return null;

    const roleLinks =
        user.role === "admin"
            ? [
                //   { to: "/admin", label: "Dashboard" }

            ]
            : user.role === "teacher"
                ? [
                    { to: "/teacher", label: "Home" },
                ]
                : [
                    { to: "/student", label: "Home" },
                    { to: "/leaves", label: "Manage Leaves" },
                ];

    const isActive = (to) => location.pathname === to;

    return (
        <>
            <ToastContainer position="top-center" />
            <nav className="bg-indigo-900 text-white px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link
                    to="/"
                    className="p-0.5 bg-neutral-100 rounded hover:bg-gray-100 flex items-center"
                >
                    <img src="https://static.srpcdigital.com/styles/1200x600/public/2024-09/784179_0.jpeg.webp" alt="Logo" className="w-32 object-cover" />
                </Link>

                {/* Desktop Links */}
                <ul className="hidden lg:flex space-x-6">
                    {roleLinks.map((link) => (
                        <li key={link.to}>
                            <Link
                                to={link.to}
                                className={`text-lg font-medium transition ${isActive(link.to)
                                        ? "text-blue-300"
                                        : "text-white hover:text-gray-300"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMobileMenuOpen((prev) => !prev)}
                    className="lg:hidden"
                >
                    {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                </button>

                {/* User Info & Logout */}
                <div className="hidden lg:flex items-center space-x-4">
                    <span className="text-sm">{user.fullName}</span>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden bg-indigo-800 text-white p-4 space-y-2">
                    {roleLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`block py-2 px-4 rounded ${isActive(link.to)
                                    ? "bg-blue-700"
                                    : "hover:bg-gray-700 transition-colors"
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <button
                        onClick={() => {
                            setMobileMenuOpen(false);
                            handleLogout();
                        }}
                        className="w-full text-center py-2 bg-red-600 rounded hover:bg-red-700"
                    >
                        Logout
                    </button>
                </div>
            )}
        </>
    );
}
