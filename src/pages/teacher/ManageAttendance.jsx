import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AiOutlinePlus } from "react-icons/ai";
import { AiOutlineArrowLeft } from "react-icons/ai";


export default function ManageAttendance() {
  const { classId } = useParams();
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editedTime, setEditedTime] = useState("");

  const classUrl = "https://6837ad992c55e01d184a8113.mockapi.io/Class";
  const userUrl = "https://683cc42f199a0039e9e35f20.mockapi.io/user";
  const participantUrl = "https://683cc42f199a0039e9e35f20.mockapi.io/Participant";
  const attendanceUrl = "https://68219a21259dad2655afc28a.mockapi.io/Attendance";

  useEffect(() => {
    if (!classId) return;
    fetchAllData();
  }, [classId]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [classesRes, studentsRes, participantsRes, attendanceRes] =
        await Promise.all([
          axios.get(classUrl),
          axios.get(userUrl),
          axios.get(participantUrl),
          axios.get(attendanceUrl),
        ]);

      setClasses(classesRes.data || []);
      setStudents(studentsRes.data.filter((u) => u.role === "student") || []);
      setParticipants(
        participantsRes.data.filter((p) => String(p.classId) === String(classId))
      );
      setAttendance(
        attendanceRes.data.filter((att) => String(att.classId) === String(classId))
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getClassName = () => {
    const found = classes.find((cls) => cls.id === classId);
    return found ? found.name : "Unknown Class";
  };

  const getStudentById = (userId) => students.find((s) => String(s.id) === String(userId));

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const getAttendanceDates = () =>
    Array.from(new Set(attendance.map((rec) => new Date(rec.attendedAt).toDateString())));

  const attendanceDates = getAttendanceDates();

  const attendanceForSelectedDate = selectedDate
    ? attendance.filter((rec) => new Date(rec.attendedAt).toDateString() === selectedDate)
    : [];

  // calculate new attendance id
  const getNextAttendanceId = () => {
    if (attendance.length === 0) return 1;
    const maxId = attendance.reduce((max, item) => {
      const idNum = Number(item.id);
      return idNum > max ? idNum : max;
    }, 0);
    return maxId + 1;
  };

  const saveEditedTime = async (record) => {
    if (!editedTime) {
      alert("Please enter a valid time (HH:mm).");
      return;
    }
    try {
      const originalDate = new Date(record.attendedAt);
      const [hours, minutes] = editedTime.split(":").map(Number);
      originalDate.setHours(hours, minutes);
      await axios.put(`${attendanceUrl}/${record.id}`, {
        ...record,
        attendedAt: originalDate.toISOString(),
      });
      setEditingId(null);
      setEditedTime("");
      fetchAllData();
    } catch (error) {
      console.error("Failed to update attendance time:", error);
      alert("Failed to update attendance time");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this attendance record?")) return;
    try {
      await axios.delete(`${attendanceUrl}/${id}`);
      fetchAllData();
    } catch (error) {
      console.error("Failed to delete attendance:", error);
      alert("Failed to delete attendance");
    }
  };

  const startEdit = (record) => {
    setEditingId(record.id);
    setEditedTime(formatDateTime(record.attendedAt));
  };

  if (loading) return <p className="p-6 text-center">Loading...</p>;

  return (
    <div className="min-h-screen bg-neutral-50 text-indigo-900 p-8 max-w-7xl mx-auto">
      <header className="mb-10 relative">
        <button
          onClick={() => navigate("/teacher")}
          className="absolute top-0 left-0 bg-indigo-600 hover:bg-indigo-800 text-white rounded px-3 py-1 shadow-sm flex items-center space-x-1 transition"
          aria-label="Back to Home"
        >
          <AiOutlineArrowLeft className="w-5 h-5" />
          <span>Home</span>
        </button>
        <h1 className="text-3xl font-extrabold border-b-4 border-indigo-600 pb-2 text-center">
          Attendance Management - {getClassName()}
        </h1>
      </header>

      {/* stat */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <p className="text-sm text-gray-500 uppercase mb-1">Registered Students</p>
          <p className="text-5xl font-extrabold text-indigo-700">{participants.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <p className="text-sm text-gray-500 uppercase mb-1">Attendance Days</p>
          <p className="text-5xl font-extrabold text-indigo-700">{attendanceDates.length}</p>
        </div>
      </section>

      {/* choose date and add new*/}
      {attendanceDates.length > 0 && (
        <section className="flex flex-col md:flex-row md:items-center justify-between bg-white p-5 rounded-lg shadow mb-10 max-w-5/12">
          <div className="mb-4 md:mb-0 flex items-center space-x-4">
            <label htmlFor="attendanceDate" className="font-semibold text-lg">
              Select Attendance Date:
            </label>
            <select
              id="attendanceDate"
              className="border border-gray-300 rounded px-4 py-2 text-indigo-900"
              value={selectedDate || ""}
              onChange={(e) => setSelectedDate(e.target.value)}
            >
              <option value="" disabled>
                -- Choose a date --
              </option>
              {attendanceDates.map((dateStr) => (
                <option key={dateStr} value={dateStr}>
                  {dateStr}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => navigate(`/add-attendance/${classId}/${getNextAttendanceId()}`)}
            className="bg-indigo-700 hover:bg-indigo-900 text-white rounded px-4 h-10 flex items-center justify-center shadow"
            aria-label="Add New Attendance"
          >
            <AiOutlinePlus className="h-6 w-6" />
          </button>
        </section>
      )}

      {/* attecndance table */}
      {selectedDate && (
        <section className="bg-white rounded-lg shadow overflow-x-auto p-6">
          <h2 className="text-xl font-semibold mb-6 text-indigo-800">
            Attendance Records for {selectedDate}
          </h2>

          {attendanceForSelectedDate.length === 0 ? (
            <p className="text-center text-gray-500 py-10 text-lg">
              No attendance records found for this day.
            </p>
          ) : (
            <table className="min-w-full border-collapse border border-gray-300">
              <thead className="bg-indigo-700 text-white">
                <tr>
                  <th className="py-3 px-6 border border-gray-300 text-left">Student</th>
                  <th className="py-3 px-6 border border-gray-300 text-left">Time</th>
                  <th className="py-3 px-6 border border-gray-300 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {attendanceForSelectedDate.map((record) => {
                  const student = getStudentById(record.attendeeId);
                  return (
                    <tr
                      key={record.id}
                      className="hover:bg-indigo-50 transition-colors duration-200"
                    >
                      <td className="py-3 px-6 border border-gray-300">
                        {student ? student.name : "Unknown Student"}
                      </td>
                      <td className="py-3 px-6 border border-gray-300">
                        {editingId === record.id ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="time"
                              className="border rounded px-3 py-1 text-indigo-900"
                              value={editedTime}
                              onChange={(e) => setEditedTime(e.target.value)}
                              style={{ backgroundColor: "transparent", appearance: "none" }}
                            />
                            <button
                              onClick={() => saveEditedTime(record)}
                              className="bg-green-600 hover:bg-green-700 text-white rounded px-3 py-1"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="bg-gray-400 hover:bg-gray-500 text-white rounded px-3 py-1"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          formatDateTime(record.attendedAt)
                        )}
                      </td>
                      <td className="py-3 px-6 border border-gray-300 text-center space-x-2">
                        {editingId !== record.id && (
                          <>
                            <button
                              onClick={() => startEdit(record)}
                              className="border-1 border-indigo-700 text-indigo-700 bg-white rounded px-3 py-1 hover:bg-indigo-50 transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(record.id)}
                              className="bg-red-600 hover:bg-red-700 text-white rounded px-3 py-1"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </section>
      )}
    </div>
  );
}
