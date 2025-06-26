// src/components/AdminCreateUser.jsx
import axios from "axios";
import React, { useState, useEffect } from "react";

const API_BASE = "https://student-management-system-pnb9.onrender.com";

export default function AdminCreateUser() {
  const [role, setRole] = useState("teacher");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const api = axios.create({
    baseURL: API_BASE,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
    },
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching users.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      alert("Email and password are required");
      return;
    }

    try {
      await api.post("/users", { email, password, role });
      alert(
        `${role.charAt(0).toUpperCase() + role.slice(1)} created successfully`
      );
      setEmail("");
      setPassword("");
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert(
        `Error creating ${role}: ${err.response?.data?.message || err.message}`
      );
    }
  };

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      (u.id || u._id).toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      u.role.toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-neutral-50 p-4 sm:p-6 md:p-8 text-indigo-900">
      <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-center border-b-4 border-indigo-600 pb-3">
          Create User
        </h1>

        {/* Form & Table Container */}
        <div className="flex flex-col space-y-6 lg:space-y-0 lg:flex-row lg:space-x-6">
          {/* Create User Form */}
          <form onSubmit={handleSubmit} className="$1lg:w-1/3$2">
            <div className="space-y-2">
              <label className="block font-semibold">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="teacher">Teacher</option>
                <option value="principal">Principal</option>
                <option value="student">Student</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block font-semibold">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div className="space-y-2">
              <label className="block font-semibold">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded mt-4"
            >
              Create {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          </form>

          {/* Users List & Search */}
          <div className="lg:w-2/3 flex flex-col bg-white rounded-lg shadow p-4 sm:p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
              <h2 className="text-xl font-bold">Existing Users</h2>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by ID, email or role…"
                className="w-full sm:w-1/3 border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div className="overflow-x-auto flex-1 hidden lg:block">
              <table className="w-full table-auto min-w-[500px]">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-3 py-2 text-left">ID</th>
                    <th className="px-3 py-2 text-left">Email</th>
                    <th className="px-3 py-2 text-left">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id || u._id}>
                      <td className="border px-3 py-2">{u.id || u._id}</td>
                      <td className="border px-3 py-2">{u.email}</td>
                      <td className="border px-3 py-2">{u.role}</td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="text-center py-4 text-gray-500"
                      >
                        No users match “{searchTerm}”
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Cards for small screens */}
            <div className="lg:hidden flex-1 space-y-4 overflow-auto">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <div
                    key={u.id || u._id}
                    className="bg-white p-4 rounded-lg shadow"
                  >
                    <p>
                      <span className="font-semibold">ID:</span> {u.id || u._id}
                    </p>
                    <p>
                      <span className="font-semibold">Email:</span> {u.email}
                    </p>
                    <p>
                      <span className="font-semibold">Role:</span> {u.role}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No users match “{searchTerm}”
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
