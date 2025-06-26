import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AiOutlineArrowLeft } from "react-icons/ai";

export default function ClassDetails() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [classDetails, setClassDetails] = useState(null);
  const [students, setStudents] = useState([]); // بيانات التسجيل للطلاب في الصف (studentId + classId)
  const [users, setUsers] = useState([]); // بيانات كل المستخدمين (بها الاسم والايميل)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // جلب بيانات الصف
        const classRes = await axios.get(
          `https://6837ad992c55e01d184a8113.mockapi.io/Class/${classId}`
        );
        setClassDetails(classRes.data);

        // جلب الطلاب المسجلين لهذا الصف
        const studentsRes = await axios.get(
          "https://685cc514769de2bf085dc721.mockapi.io/students"
        );
        // فلترة الطلاب حسب classId
        const filteredStudents = studentsRes.data.filter(
          (s) => String(s.classId) === String(classId)
        );
        setStudents(filteredStudents);

        // جلب بيانات المستخدمين (اللي فيها الاسم والايميل)
        const usersRes = await axios.get(
          "https://6837ad992c55e01d184a8113.mockapi.io/users"
        );
        setUsers(usersRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [classId]);

  // دالة ترجع بيانات المستخدم (اسم وإيميل) حسب studentId (اللي هو user.id)
  const getUserByStudentId = (studentId) => {
    return users.find((user) => String(user.id) === String(studentId)) || null;
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-indigo-900 font-semibold">Loading...</div>
    );
  }

  if (!classDetails) {
    return (
      <div className="p-6 text-center text-red-600 font-semibold">
        Class not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-indigo-900 p-8 max-w-7xl mx-auto space-y-8">
      <header className="mb-8 relative">
        <button
          onClick={() => navigate("/teacher")}
          className="absolute top-0 left-0 bg-indigo-600 hover:bg-indigo-800 text-white rounded px-3 py-1 shadow-sm flex items-center space-x-1 transition"
          aria-label="Back to Home"
        >
          <AiOutlineArrowLeft className="w-5 h-5" />
          <span>Home</span>
        </button>
        <h1 className="text-3xl font-extrabold border-b-4 border-indigo-700 pb-3 text-center">
          Class Details
        </h1>
      </header>

      {/* تفاصيل الصف */}
      <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-5 border-b-2 border-indigo-600 pb-2">
          General Information
        </h2>
        <ul className="space-y-3 text-lg">
          <li>
            <strong className="inline-block w-36">ID:</strong> {classDetails.id}
          </li>
          <li>
            <strong className="inline-block w-36">Name:</strong> {classDetails.name}
          </li>
          <li>
            <strong className="inline-block w-36">Description:</strong> {classDetails.description}
          </li>
          <li>
            <strong className="inline-block w-36">Location:</strong> {classDetails.location}
          </li>
          <li>
            <strong className="inline-block w-36">Capacity:</strong> {classDetails.capacity}
          </li>
          <li>
            <strong className="inline-block w-36">Start Date:</strong> {classDetails.dateStartAt}
          </li>
          <li>
            <strong className="inline-block w-36">End Date:</strong> {classDetails.dateEndAt}
          </li>
          <li>
            <strong className="inline-block w-36">Start Time:</strong> {classDetails.timeStartAt}
          </li>
          <li>
            <strong className="inline-block w-36">End Time:</strong> {classDetails.timeEndAt}
          </li>
        </ul>
      </div>

      {/* جدول الطلاب */}
      <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-5 border-b-2 border-indigo-600 pb-2">
          Registered Students
        </h2>
        {students.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No students are registered for this class.
          </p>
        ) : (
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-indigo-700 text-white">
              <tr>
                <th className="px-5 py-3 border border-gray-300 text-left">Name</th>
                <th className="px-5 py-3 border border-gray-300 text-left">Email</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => {
                const user = getUserByStudentId(student.studentId);
                return (
                  <tr
                    key={student.id}
                    className="hover:bg-indigo-50 transition-colors duration-200"
                  >
                    <td className="px-5 py-3 border border-gray-300">
                      {user ? user.name : "Unknown"}
                    </td>
                    <td className="px-5 py-3 border border-gray-300">
                      {user ? user.email : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
