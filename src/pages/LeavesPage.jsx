import axios from "axios";
import React, { useState, useEffect } from "react";

const API_BASE = "https://student-management-system-pnb9.onrender.com";

function AdminCreateUser() {
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
    <div className="min-h-screen bg-neutral-50 px-4 sm:px-8 py-8 text-indigo-900">
      <div className="max-w-3xl mx-auto space-y-10">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-center border-b-4 border-indigo-600 pb-3">
          Create User
        </h1>

        {/* Create User Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow p-4 sm:p-6 space-y-6"
        >
          <div className="space-y-4 sm:space-y-0 sm:flex sm:items-center sm:space-x-4">
            <div className="flex-1">
              <label className="block font-semibold mb-1">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2"
              >
                <option value="teacher">Teacher</option>
                <option value="principal">Principal</option>
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full border border-gray-300 rounded px-4 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded px-4 py-2"
            />
          </div>

          <button
            type="submit"
            className="block w-full sm:inline-block sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-5 py-2 rounded"
          >
            Create {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        </form>

        {/* Search & Existing Users */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <h2 className="text-xl font-bold">Existing Users</h2>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID, email or role…"
              className="border border-gray-300 rounded px-4 py-2 w-full sm:w-1/2"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Role</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id || u._id}>
                    <td className="border px-4 py-2">{u.id || u._id}</td>
                    <td className="border px-4 py-2">{u.email}</td>
                    <td className="border px-4 py-2">{u.role}</td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center py-4 text-gray-500">
                      No users match “{searchTerm}”
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminCreateUser;
