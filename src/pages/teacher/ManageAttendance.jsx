import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { AiOutlinePlus, AiOutlineArrowLeft } from "react-icons/ai";

export default function ManageAttendance() {
  const { classId } = useParams();
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [users, setUsers] = useState([]);       
  const [students, setStudents] = useState([]); 
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editedTime, setEditedTime] = useState("");

  const baseURL = "https://student-management-system-pnb9.onrender.com";

  const token = localStorage.getItem("token") || "";

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    if (!classId) return;
    fetchAllData();
  }, [classId]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [classesRes, usersRes, studentsRes, attendanceRes] = await Promise.all([
        axios.get(`${baseURL}/classes`, axiosConfig),
        axios.get(`${baseURL}/users`, axiosConfig),
        axios.get(`${baseURL}/classes/${classId}/students`, axiosConfig),
        axios.get(`${baseURL}/classes/${classId}/attendance`, axiosConfig),
      ]);

      setClasses(classesRes.data || []);
      setUsers(usersRes.data || []);
      setStudents(studentsRes.data || []);
      setAttendance(attendanceRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch data from server.");
    } finally {
      setLoading(false);
    }
  };

  const getStudentName = (studentId) => {
    const user = users.find((u) => String(u.id) === String(studentId));
    return user ? user.name : "Unknown Student";
  };

  const getClassName = () => {
    const found = classes.find((cls) => String(cls.id) === String(classId));
    return found ? found.name : "Unknown Class";
  };

  const getAttendanceDates = () =>
    Array.from(
      new Set(attendance.map((rec) => new Date(rec.attendedAt).toDateString()))
    );

  const attendanceDates = getAttendanceDates();

  const attendanceForSelectedDate = selectedDate
    ? attendance.filter(
        (rec) =>
          new Date(rec.attendedAt).toDateString() ===
          new Date(selectedDate).toDateString()
      )
    : [];

  const getNextAttendanceId = () => {
    if (attendance.length === 0) return 1;
    const maxId = attendance.reduce((max, item) => {
      const idNum = Number(item.id);
      return idNum > max ? idNum : max;
    }, 0);
    return maxId + 1;
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

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <p className="text-sm text-gray-500 uppercase mb-1">Registered Students</p>
          <p className="text-5xl font-extrabold text-indigo-700">{students.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <p className="text-sm text-gray-500 uppercase mb-1">Attendance Days</p>
          <p className="text-5xl font-extrabold text-indigo-700">{attendanceDates.length}</p>
        </div>
      </section>

      <section className="flex flex-col md:flex-row md:items-center justify-between bg-white p-5 rounded-lg shadow mb-10 max-w-6/12">
        <div className="mb-4 md:mb-0 flex flex-col md:flex-row items-center space-x-4">
          <label htmlFor="attendanceDate" className="font-semibold text-lg">
            Select Attendance Date:
          </label>
          <select
            id="attendanceDate"
            className="border border-gray-300 rounded px-4 py-2 text-indigo-900"
            value={selectedDate || ""}
            onChange={(e) => setSelectedDate(e.target.value)}
            disabled={attendanceDates.length === 0}
          >
            <option value="" disabled>
              {attendanceDates.length === 0
                ? "No attendance dates available"
                : "-- Choose a date --"}
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
                  <th className="py-3 px-6 border border-gray-300 text-left">Status</th>
                  <th className="py-3 px-6 border border-gray-300 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const attendanceRecord = attendanceForSelectedDate.find(
                    (rec) => String(rec.attendeeId) === String(student.id)
                  );

                  const status = attendanceRecord ? attendanceRecord.status : "absent";

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-indigo-50 transition-colors duration-200"
                    >
                      <td className="py-3 px-6 border border-gray-300">
                        {getStudentName(student.id)}
                      </td>
                      <td className="py-3 px-6 border border-gray-300">
                        {editingId === student.id ? (
                          <select
                            value={editedTime}
                            onChange={(e) => setEditedTime(e.target.value)}
                            className="border rounded px-3 py-1 text-indigo-900"
                          >
                            <option value="present">Present</option>
                            <option value="absent">Absent</option>
                            <option value="late">Late</option>
                            <option value="excused">Excused</option>
                          </select>
                        ) : (
                          <span className="text-gray-700">{status}</span>
                        )}
                      </td>
                      <td className="py-3 px-6 border border-gray-300 text-center">
                        {editingId === student.id ? (
                          <div className="flex flex-col md:flex-row items-center justify-center gap-2">
                            <button
                              onClick={async () => {
                                const newRecord = {
                                  classId,
                                  attendeeId: student.id,
                                  status: editedTime,
                                  attendedAt: new Date().toISOString(),
                                };

                                try {
                                  if (attendanceRecord) {
                                    await axios.put(
                                      `${baseURL}/classes/${classId}/attendance/${attendanceRecord.id}`,
                                      newRecord,
                                      axiosConfig
                                    );
                                  } else {
                                    await axios.post(
                                      `${baseURL}/classes/${classId}/attendance`,
                                      newRecord,
                                      axiosConfig
                                    );
                                  }
                                  setEditingId(null);
                                  fetchAllData();
                                } catch (error) {
                                  console.error("Error updating attendance:", error);
                                  alert("Failed to save attendance record.");
                                }
                              }}
                              className="border border-green-600 text-green-600 hover:text-green-700 rounded px-3 py-1 w-16"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="text-gray-400 border border-gray-400 hover:text-gray-500 rounded px-3 py-1 w-16"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingId(student.id);
                              setEditedTime(status);
                            }}
                            className="text-indigo-800 cursor-pointer border border-indigo-800 rounded px-3 py-1 w-34"
                          >
                            Edit
                          </button>
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
