// src/components/ViewUsersPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

const API_BASE = "https://student-management-system-pnb9.onrender.com";

export default function ViewUsersPage() {
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Create form state
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("student");

  // Edit form state
  const [editingId, setEditingId] = useState(null);
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editPassword, setEditPassword] = useState("");

  // Fetch users
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      alert("Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Create user
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newEmail || !newPassword) {
      alert("Email and password are required");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE}/users`,
        {
          email: newEmail,
          password: newPassword,
          role: newRole,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewEmail("");
      setNewPassword("");
      setNewRole("student");
      fetchUsers();
    } catch (err) {
      console.error("Create error:", err);
      alert(err.response?.data?.message || "Failed to create user");
    }
  };

  // Start editing
  const startEdit = (user) => {
    setEditingId(user.id || user._id);
    setEditEmail(user.email);
    setEditRole(user.role);
    setEditPassword("");
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditEmail("");
    setEditRole("");
    setEditPassword("");
  };

  // Submit edit
  const handleEdit = async (id) => {
    if (!editEmail) {
      alert("Email is required");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const payload = { email: editEmail, role: editRole };
      if (editPassword) payload.password = editPassword;
      await axios.put(`${API_BASE}/users/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      cancelEdit();
      fetchUsers();
    } catch (err) {
      console.error("Update error:", err);
      alert(err.response?.data?.message || "Failed to update user");
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.filter((u) => (u.id || u._id) !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete user");
    }
  };

  // Filter + search
  const filtered = useMemo(() => {
    return users
      .filter((u) => selectedRole === "all" || u.role === selectedRole)
      .filter((u) =>
        u.email.toLowerCase().includes(searchTerm.trim().toLowerCase())
      );
  }, [users, selectedRole, searchTerm]);

  return (
    <div className="min-h-screen bg-neutral-50 p-4 sm:p-8 text-indigo-900">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-extrabold text-center">User Management</h1>

        {/* Create User Form */}
        <form
          onSubmit={handleCreate}
          className="bg-white shadow rounded-lg p-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div className="space-y-2">
            <label className="block font-medium">Email</label>
            <input
              type="email"
              className="w-full border-gray-300 rounded px-3 py-2"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="user@example.com"
            />
          </div>
          <div className="space-y-2">
            <label className="block font-medium">Password</label>
            <input
              type="password"
              className="w-full border-gray-300 rounded px-3 py-2"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-2">
            <label className="block font-medium">Role</label>
            <select
              className="w-full border-gray-300 rounded px-3 py-2"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
            >
              <option value="teacher">Teacher</option>
              <option value="principal">Principal</option>
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded"
            >
              Create User
            </button>
          </div>
        </form>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white shadow rounded-lg p-4 gap-4">
          <div>
            <label className="font-medium mr-2">Filter by Role:</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="border-gray-300 rounded px-3 py-2"
            >
              <option value="all">All</option>
              <option value="teacher">Teachers</option>
              <option value="student">Students</option>
              <option value="principal">Principals</option>
              <option value="admin">Admins</option>
            </select>
          </div>
          <div className="flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by email..."
              className="w-full border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>

        {/* User List */}
        {filtered.length === 0 ? (
          <p className="text-center text-gray-500">No users found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((user) => {
              const uid = user.id || user._id;
              const isEditing = editingId === uid;
              return (
                <div
                  key={uid}
                  className="bg-white shadow rounded-lg p-4 flex flex-col"
                >
                  {isEditing ? (
                    <>
                      <input
                        type="email"
                        className="border-gray-300 rounded px-2 py-1 mb-2"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                      />
                      <input
                        type="text"
                        className="border-gray-300 rounded px-2 py-1 mb-2"
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value)}
                      />
                      <input
                        type="password"
                        className="border-gray-300 rounded px-2 py-1 mb-2"
                        value={editPassword}
                        onChange={(e) => setEditPassword(e.target.value)}
                        placeholder="New password (optional)"
                      />
                      <div className="mt-auto flex space-x-2">
                        <button
                          onClick={() => handleEdit(uid)}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="flex-1 bg-gray-300 hover:bg-gray-400 text-black px-2 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="truncate">
                        <strong>Email:</strong> {user.email}
                      </p>
                      <p className="truncate">
                        <strong>Role:</strong> {user.role}
                      </p>
                      <div className="mt-auto flex space-x-2">
                        <button
                          onClick={() => startEdit(user)}
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteUser(uid)}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
