import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

function AdminPageClass() {
  const [className, setClassName] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [studentsList, setStudentsList] = useState([]);
  const [teachersList, setTeachersList] = useState([]);
  const [adminsList, setAdminsList] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const navigate = useNavigate();

  // const BASE_URL = 'https://student-management-system-pnb9.onrender.com/api';
  const BASE_URL = 'https://student-management-system-pnb9.onrender.com';

  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get(`${BASE_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
.then(res => {
      const users = res.data;
      setStudentsList(users.filter(user => user.role === 'student').slice(0, 20)); 
      setTeachersList(users.filter(user => user.role === 'teacher').slice(0, 2));
      setAdminsList(users.filter(user => user.role === 'admin'));
    })
    
    .catch(err => console.error('Error fetching users:', err));
}, [token]);

  const handleStudent = (id) => {
    setSelectedStudents(prev =>
      prev.includes(id)
        ? prev.filter(sid => sid !== id)
        : [...prev, id]
    );
  };

  const CreateClass = async () => {
    if (!className || !teacherId || selectedStudents.length !== 20) {
      alert('All fields are required and you must select exactly 20 students.');
      return;
    }

    try {
// create class
      const classRes = await axios.post(`${BASE_URL}/classes`, {
        name: className
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const classId = classRes.data._id;
// add teachers
      await axios.post(`${BASE_URL}/classes/${classId}/teachers`, {
        teacherIds: [teacherId]
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
// add students
      await axios.post(`${BASE_URL}/classes/${classId}/students`, {
        studentIds: selectedStudents
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert('Class created successfully!');
      navigate('/viewclass');
    } catch (err) {
       console.error('Failed to create class:', err.response?.data || err.message);
      console.error('Failed to create class:', err);
      alert('failed to create class');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4">Create a New Class</h2>
{/* class */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Class Name:</label>
        <input
          type="text"
          className="border px-3 py-2 w-full"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
        />
      </div>
{/* display teacher */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Assign Teacher:</label>
        <select
          value={teacherId}
          onChange={(e) => setTeacherId(e.target.value)}
          className="border px-3 py-2 w-full"
        >
          <option value="">Select Teacher</option>
          {teachersList.map(t => (
            <option key={t._id} value={t._id}>
              {t.name || t.email}
            </option>
          ))}
        </select>
      </div>
{/* display students */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Assign Students:</label>
        <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto border p-2">
          {studentsList.map(student => (
            <label key={student._id} className="flex items-center">
              <input
                type="checkbox"
                value={student._id}
                checked={selectedStudents.includes(student._id)}
                onChange={() => handleStudent(student._id)}
                disabled={
                  !selectedStudents.includes(student._id) &&
                  selectedStudents.length >= 20
                }
                className="mr-2"
              />
              {student.email}
            </label>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {selectedStudents.length}/20 selected
        </p>
      </div>

     

      <button
        onClick={CreateClass}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Create Class
      </button>
    </div>
  );
}

export default AdminPageClass;
