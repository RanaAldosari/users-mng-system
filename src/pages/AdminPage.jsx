import axios from 'axios';
import React, { useState, useEffect } from 'react';

function AdminPage() {
  const [addTeacher, setAddTeacher] = useState('');
  const [addPrincipal, setAddPrincipal] = useState('');
  const [addStudent, setAddStudent] = useState('');
  const [users, setUsers] = useState([]);

  const api = 'https://68219a91259dad2655afc3cc.mockapi.io/api/users/image';

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get(api).then(res => setUsers(res.data));
  };

  const createUser = (name, role) => {
    if (!name.trim()) {
      alert("Name is required");
      return;
    }

    axios.post(api, { name, role })
      .then(() => {
        alert(`${role} added successfully`);
        fetchUsers();
        if (role === 'teacher') setAddTeacher('');
        if (role === 'student') setAddStudent('');
        if (role === 'principal') setAddPrincipal('');
      })
      .catch(() => alert('Error adding user.'));
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-8 text-indigo-900">
      <div className="max-w-3xl mx-auto space-y-10">
        <h1 className="text-3xl font-extrabold text-center border-b-4 border-indigo-600 pb-3">
          Add Users
        </h1>

        {/* Add Teacher */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-xl font-bold">Add Teacher</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={addTeacher}
              onChange={e => setAddTeacher(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-4 py-2"
              placeholder="Enter teacher name"
            />
            <button
              onClick={() => createUser(addTeacher, 'teacher')}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-5 py-2 rounded"
            >
      Add
            </button>
          </div>
        </div>

        {/* Add Principal */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-xl font-bold">Add Principal</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={addPrincipal}
              onChange={e => setAddPrincipal(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-4 py-2"
              placeholder="Enter principal name"
            />
            <button
              onClick={() => createUser(addPrincipal, 'principal')}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-5 py-2 rounded"
            >
     Add
            </button>
          </div>
        </div>

        {/* Add Student */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-xl font-bold">Add Student</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={addStudent}
              onChange={e => setAddStudent(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-4 py-2"
              placeholder="Enter student name"
            />
            <button
              onClick={() => createUser(addStudent, 'student')}
              className="bg-yellow-500 hover:bg-yellow-600  text-white font-semibold px-5 py-2 rounded"
            >
        Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
