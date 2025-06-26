import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { AiOutlineFileText } from "react-icons/ai";

export default function StudentHome() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (user.role !== "student") {
    return <Navigate to="/login" replace />;
  }

  const [stats, setStats] = useState({
    totalClasses: 0,
    presentDays: 0,
    absentDays: 0,
    lateDays: 0,
  });
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const participantRes = await axios.get(
          "https://683cc42f199a0039e9e35f20.mockapi.io/Participant"
        );
        const allParticipants = participantRes.data.filter(
          (p) => p.userId === user.id
        );

        const classRes = await axios.get(
          "https://6837ad992c55e01d184a8113.mockapi.io/Class"
        );
        const enrolledClasses = classRes.data.filter((c) =>
          allParticipants.some((p) => p.classId === c.id)
        );

        const attendanceRes = await axios.get(
          "https://68219a21259dad2655afc28a.mockapi.io/Attendance"
        );
        const attendanceRecords = attendanceRes.data.filter(
          (a) => a.attendeeId === user.id
        );

        const presentDays = attendanceRecords.filter(
          (a) => a.status === "present"
        ).length;
        const absentDays = attendanceRecords.filter(
          (a) => a.status === "absent"
        ).length;
        const lateDays = attendanceRecords.filter(
          (a) => a.status === "late"
        ).length;

        setStats({
          totalClasses: enrolledClasses.length,
          presentDays,
          absentDays,
          lateDays,
        });

        setClasses(enrolledClasses);
      } catch (error) {
        console.error("Error fetching data:", error);
        setStats({
          totalClasses: 0,
          presentDays: 0,
          absentDays: 0,
          lateDays: 0,
        });
        setClasses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.id]);

  if (loading) {
    return (
      <p className="p-6 text-center text-indigo-900 font-semibold">Loading...</p>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-indigo-900 p-8 max-w-7xl mx-auto space-y-10">
      <h1 className="text-3xl font-extrabold border-b-4 border-indigo-600 pb-2 text-center">
        Welcome, Student !
      </h1>

      {/* Statistics Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <p className="text-sm text-gray-500 uppercase mb-1">Total Classes</p>
          <p className="text-5xl font-extrabold text-indigo-700">{stats.totalClasses}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <p className="text-sm text-gray-500 uppercase mb-1">Present Days</p>
          <p className="text-5xl font-extrabold text-green-500">{stats.presentDays}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <p className="text-sm text-gray-500 uppercase mb-1">Absent Days</p>
          <p className="text-5xl font-extrabold text-red-500">{stats.absentDays}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <p className="text-sm text-gray-500 uppercase mb-1">Late Days</p>
          <p className="text-5xl font-extrabold text-yellow-500">{stats.lateDays}</p>
        </div>
      </section>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate(`/leaves`)}
          className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-800 text-white rounded shadow-sm transition"
        >
          <AiOutlineFileText className="mr-2 w-5 h-5" />
          Manage Leaves
        </button>
      </div>

      {/* Classes Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 border-b-2 border-indigo-600 pb-2">
          My Classes
        </h2>
        {classes.length === 0 ? (
          <p className="text-center text-gray-500">No classes available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {classes.map((cls) => (
              <div
                key={cls.id}
                className="bg-white rounded-lg shadow p-5 hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold mb-3">{cls.name}</h3>
                <Link
                  to={`/classes/${cls.id}/student`}
                  className="inline-flex items-center px-4 py-2 bg-indigo-700 hover:bg-indigo-900 text-white rounded shadow-sm transition"
                >
                  View Details
                </Link>

                <Link
                  to={`/classes/${cls.id}/attendance/student`}
                  className="ml-4 inline-flex items-center px-4 py-2 bg-white border-2 border-indigo-700 text-indigo-700 rounded shadow-sm transition hover:bg-indigo-50"
                >
                  View Attendance
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
