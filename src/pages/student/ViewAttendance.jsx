import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { AiOutlineArrowLeft, AiOutlineFileText } from "react-icons/ai";

export default function ViewAttendance() {
  const { classId } = useParams();
  const navigate = useNavigate();

  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const baseURL = "https://student-management-system-pnb9.onrender.com";
  const token = localStorage.getItem("token") || "";
  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (!user.id) throw new Error("User not logged in");

        const attendanceRes = await axios.get(
          `${baseURL}/attendances`,
          axiosConfig
        );

        const filteredAttendance = attendanceRes.data.filter(
          (record) =>
            String(record.classId) === String(classId) &&
            String(record.userId) === String(user.id)
        );

        setAttendanceRecords(filteredAttendance);
      } catch (error) {
        console.error("Failed to fetch attendance records:", error);
        alert("Failed to load attendance data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [classId]);

  if (loading) {
    return (
      <div className="p-6 text-center text-indigo-900 font-semibold">
        Loading...
      </div>
    );
  }

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
        <h1 className="text-3xl font-extrabold border-b-4 border-indigo-600 pb-2 text-center">
          Attendance Records
        </h1>
      </header>

      <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold border-b-2 border-indigo-600 pb-2">
            My Attendance
          </h2>

          <button
            onClick={() => navigate(`/classes/${classId}/leaves/new`)}
            className="flex items-center space-x-1 text-indigo-700 hover:text-indigo-900 font-semibold"
            aria-label="Raise Leave"
          >
            <AiOutlineFileText className="w-6 h-6" />
            <span>Raise Leave</span>
          </button>
        </div>

        {attendanceRecords.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No attendance records available.
          </p>
        ) : (
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-indigo-700 text-white">
              <tr>
                <th className="px-5 py-3 border border-gray-300 text-left">
                  Date
                </th>
                <th className="px-5 py-3 border border-gray-300 text-left">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.map((record) => (
                <tr
                  key={record.id}
                  className="hover:bg-indigo-50 transition-colors duration-200"
                >
                  <td className="px-5 py-3 border border-gray-300">
                    {new Date(record.attendedAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3 border border-gray-300 capitalize">
                    {record.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
