import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { AiOutlineArrowLeft } from "react-icons/ai";

export default function AddAttendance() {
  const { classId } = useParams();
  const navigate = useNavigate();

  const [className, setClassName] = useState("");
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const baseURL = "https://student-management-system-pnb9.onrender.com";
  const token = localStorage.getItem("token") || "";
  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const classRes = await axios.get(`${baseURL}/classes/${classId}`, axiosConfig);
        setClassName(classRes.data?.name || "Unknown Class");

        const studentsRes = await axios.get(
          `${baseURL}/classes/${classId}/students`,
          axiosConfig
        );

        const usersRes = await axios.get(`${baseURL}/users`, axiosConfig);
        const users = usersRes.data;

        const enrolledStudents = studentsRes.data
          .map((student) => {
            const user = users.find((u) => String(u.id) === String(student.userId));
            return user ? { ...student, name: user.name, email: user.email } : null;
          })
          .filter(Boolean);

        setStudents(enrolledStudents);

        const initialAttendance = {};
        enrolledStudents.forEach((stu) => {
          initialAttendance[stu.userId] = "absent";
        });
        setAttendanceData(initialAttendance);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        alert("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [classId]);

  const handleStatusChange = (userId, newStatus) => {
    setAttendanceData((prev) => ({ ...prev, [userId]: newStatus }));
  };

  const handleSaveAttendance = async () => {
    setSaving(true);
    try {
      const attendedAt = new Date().toISOString();

      const promises = Object.entries(attendanceData).map(
        async ([userId, status]) => {
          return axios.post(
            `${baseURL}/attendances`,
            {
              classId,
              userId,
              status,
              attendedAt,
            },
            axiosConfig
          );
        }
      );

      await Promise.all(promises);

      alert("Attendance saved successfully");
      navigate(-1);
    } catch (err) {
      console.error("Failed to save attendance:", err);
      alert("Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6 text-center">Loading...</p>;

  return (
    <div className="min-h-screen bg-neutral-50 text-indigo-900 p-8 max-w-5xl mx-auto">
      <header className="mb-8 relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-0 left-0 bg-indigo-600 hover:bg-indigo-800 text-white rounded px-3 py-1 shadow-sm flex items-center space-x-1 transition"
          aria-label="Back"
        >
          <AiOutlineArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <h2 className="text-xl font-semibold text-center mb-1">{className}</h2>
        <h1 className="text-3xl font-extrabold border-b-4 border-indigo-600 pb-2 text-center">
          Add Attendance for Today
        </h1>
      </header>

      {students.length === 0 ? (
        <p className="text-center text-gray-500 py-10 text-lg">
          No students enrolled in this class.
        </p>
      ) : (
        <>
          <table className="min-w-full border-collapse border border-gray-300 bg-white rounded-lg shadow overflow-hidden">
            <thead className="bg-indigo-700 text-white">
              <tr>
                <th className="py-3 px-6 border border-gray-300 text-left">Student Name</th>
                <th className="py-3 px-6 border border-gray-300 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((stu) => (
                <tr key={stu.userId} className="hover:bg-indigo-50">
                  <td className="py-3 px-6 border border-gray-300">{stu.name || "No Name"}</td>
                  <td className="py-3 px-6 border border-gray-300">
                    <select
                      value={attendanceData[stu.userId]}
                      onChange={(e) => handleStatusChange(stu.userId, e.target.value)}
                      className="border border-gray-300 rounded px-3 py-1 text-indigo-900"
                    >
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      <option value="late">Late</option>
                      <option value="excused">Excused</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 flex justify-center">
            <button
              disabled={saving}
              onClick={handleSaveAttendance}
              className="bg-indigo-700 hover:bg-indigo-900 text-white rounded px-6 py-2 font-semibold transition"
            >
              {saving ? "Saving..." : "Save Attendance"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
