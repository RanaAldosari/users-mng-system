import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
// create users account => added in viewUsres pg
// princple***
// report***
function AdminPage() {
  const [addTeacher, setAddTeacher] = useState('');
  const [addPrincipal, setAddPrincipal] = useState('');
  const [addStudent, setAddStudent] = useState('');
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

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
      .catch(() => alert('error'));
  };

  return (
    <>
    <div>
      {/* sidebar */}
      <div className="flex gap-2">
        <button onClick={() => navigate("/Viewusers")} className="bg-blue-500 text-white rounded">View Users</button>
        <button onClick={() => navigate("/viewclass")} className="bg-blue-500 text-white rounded">View Classes</button>
        <button onClick={()=>navigate("/leaves-action")} className='bg-blue-500 text-white rounded'>View Leaves</button>
      </div>

      <h1 className="font-bold text-2xl">Add Users:</h1>
{/* add teacher */}
      <div>
        <label>Add Teacher:</label>
        <input
          type="text"
          value={addTeacher}
          onChange={e => setAddTeacher(e.target.value)}
          className="border px-2 py-1"
/>
        <button
          onClick={() => createUser(addTeacher, 'teacher')}
          className="bg-yellow-400 text-white px-4 py-1 rounded"
        >
          + Add
        </button>
      </div>
{/* add princple */}
      <div>
        <label>Add Principal:</label>
        <input
          type="text"
          value={addPrincipal}
          onChange={e => setAddPrincipal(e.target.value)}
          className="border px-2 py-1"
        />
        <button
          onClick={() => createUser(addPrincipal, 'principal')}
          className="bg-yellow-400 text-white px-4 py-1 rounded"
        >
          + Add
        </button>
      </div>
{/* add std */}
      <div>
        <label>Add Student:</label>
        <input
          type="text"
          value={addStudent}
          onChange={e => setAddStudent(e.target.value)}
          className="border px-2 py-1"
        />
        <button
          onClick={() => createUser(addStudent, 'student')}
          className="bg-yellow-400 text-white px-4 py-1 rounded"
        >
          + Add
        </button>
      </div>
    </div>
</>   
  );
}

export default AdminPage;
