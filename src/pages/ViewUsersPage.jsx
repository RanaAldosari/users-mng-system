import axios from 'axios';
import React, { useEffect, useState } from 'react';

function ViewUsersPage() {
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState('all');

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get("https://student-management-system-pnb9.onrender.com/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        setUsers(res.data);
      })
      .catch(err => {
        console.log("Error fetching users:", err);
      });
  }, []);
// delete user by id
  const deleteUser = (id) => {
    const token = localStorage.getItem("token");
    axios.delete(`https://student-management-system-pnb9.onrender.com/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(() => {
      alert("User deleted successfully.");
      setUsers(prev => prev.filter(user => user.id !== id));
    }).catch(err => {
      console.error("Failed to delete user:", err);
      alert("Failed to delete user");
    });
  };

  const extractNumber = (email) => {
    const match = email.match(/\d+/);
    return match ? Number(match[0]) : 0;
  };

const filteredUsers = users
  .filter(user => selectedRole === 'all' || user.role === selectedRole)
  .sort((a, b) => {
    if (selectedRole === 'student') {
      return extractNumber(a.email) - extractNumber(b.email);
    }
    return 0;
  })
  .slice(
    0,
    selectedRole === 'teacher' ? 2 : selectedRole === 'principal' ? 1 : users.length
  );

  return (
    <>
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">User Management</h1>
{/* filter based on role type */}
      <div className="mb-4">
        <label className="font-medium mr-2">Filter by Role:</label>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">All</option>
          <option value="teacher">Teachers</option>
          <option value="student">Students</option>
          <option value="principal">Principals</option>
        </select>
      </div>
{/*  */}
      {filteredUsers.length === 0 ? (
        <p className="text-gray-500">No users found for selected role.</p>
      ) : (
        filteredUsers.map((user) => (
          <div
            key={user.id}
            className="flex justify-between items-center p-3 border rounded bg-white shadow-sm"
          >
            <div>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
            </div>
            <button
              onClick={() => deleteUser(user.id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
      </>
  );
}

export default ViewUsersPage;
