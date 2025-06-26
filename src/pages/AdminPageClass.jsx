// src/components/AdminPageClass.jsx
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const API_BASE = "https://student-management-system-pnb9.onrender.com";

export default function AdminPageClass() {
  const [className, setClassName] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [studentsList, setStudentsList] = useState([]);
  const [teachersList, setTeachersList] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [studentSearch, setStudentSearch] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${API_BASE}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const users = res.data;
        setStudentsList(users.filter((u) => u.role === "student"));
        setTeachersList(users.filter((u) => u.role === "teacher"));
      })
      .catch((err) => console.error("Error fetching users:", err));
  }, [token]);

  const handleStudentToggle = (id) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const createClass = async () => {
    if (!className || !teacherId || selectedStudents.length === 0) {
      alert("Please fill all fields and select at least one student.");
      return;
    }
    try {
      const { data: cls } = await axios.post(
        `${API_BASE}/classes`,
        { name: className },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await axios.post(
        `${API_BASE}/classes/${cls.id}/teachers`,
        { teacherIds: [teacherId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await axios.post(
        `${API_BASE}/classes/${cls.id}/students`,
        { studentIds: selectedStudents },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Class created successfully!");
      navigate("/Admin/viewclass");
    } catch (err) {
      console.error(err);
      alert("Failed to create class.");
    }
  };

  // filter students by search term
  const filteredStudents = studentsList.filter((u) => {
    const term = studentSearch.toLowerCase();
    return (
      (u.email || "").toLowerCase().includes(term) ||
      (u.id || u._id || "").toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-neutral-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Create New Class
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Class Name & Teacher */}
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Class Name</label>
              <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-indigo-500"
                placeholder="Enter class name"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Assign Teacher</label>
              <select
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-indigo-500"
              >
                <option value="">Choose a teacher</option>
                {teachersList.map((t) => (
                  <option key={t.id || t._id} value={t.id || t._id}>
                    {t.email}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={createClass}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded mt-4"
            >
              Create Class
            </button>
          </div>

          {/* Right: Student Selection */}
          <div className="space-y-2">
            <label className="block font-medium mb-1">Select Students</label>
            {/* Search input */}
            <input
              type="text"
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              placeholder="Search students..."
              className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:border-indigo-500"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto border p-2 rounded">
              {filteredStudents.map((student) => (
                <label
                  key={student.id || student._id}
                  className="flex items-center space-x-2 p-1 rounded hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(
                      student.id || student._id
                    )}
                    onChange={() =>
                      handleStudentToggle(student.id || student._id)
                    }
                    className="text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="text-sm truncate">{student.email}</span>
                </label>
              ))}
            </div>
            <p className="text-sm text-gray-500">
              {selectedStudents.length} student
              {selectedStudents.length !== 1 && "s"} selected
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
