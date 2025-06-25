import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { AiOutlineUsergroupAdd, AiOutlineUnorderedList } from "react-icons/ai";

export default function TeacherHome() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (user.role !== "teacher") {
    return <Navigate to="/login" replace />;
  }

  const [stats, setStats] = useState({ totalClasses: 0, totalStudents: 0 });
  const [classes, setClasses] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classesRes = await axios.get(
          "https://6837ad992c55e01d184a8113.mockapi.io/Class"
        );
        const allClasses = classesRes.data;

        const participantsRes = await axios.get(
          "https://683cc42f199a0039e9e35f20.mockapi.io/Participant"
        );
        const allParticipants = participantsRes.data;

        const usersRes = await axios.get(
          "https://683cc42f199a0039e9e35f20.mockapi.io/user"
        );
        const users = usersRes.data;

        const studentIds = new Set(
          users.filter((u) => u.role === "student").map((u) => u.id)
        );

        const participatingStudents = new Set(
          allParticipants
            .filter((p) => studentIds.has(p.userId))
            .map((p) => p.userId)
        );

        setStats({
          totalClasses: allClasses.length,
          totalStudents: participatingStudents.size,
        });

        setClasses(allClasses);
        setParticipants(allParticipants);
      } catch (error) {
        console.error("Error fetching data:", error);
        setStats({ totalClasses: 0, totalStudents: 0 });
        setClasses([]);
        setParticipants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <p className="p-6 text-center text-indigo-900 font-semibold">Loading...</p>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-indigo-900 p-8 max-w-7xl mx-auto space-y-10">
      <h1 className="text-3xl font-extrabold border-b-4 border-indigo-600 pb-2 text-center">
        Welcome, Teacher!
      </h1>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <p className="text-sm text-gray-500 uppercase mb-1">Total Classes</p>
          <p className="text-5xl font-extrabold text-indigo-700">{stats.totalClasses}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <p className="text-sm text-gray-500 uppercase mb-1">Total Students</p>
          <p className="text-5xl font-extrabold text-indigo-700">{stats.totalStudents}</p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6 border-b-2 border-indigo-600 pb-2">
          All Classes
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
                  to={`/classes/${cls.id}/teacher`}
                  className="inline-flex items-center px-4 py-2 bg-indigo-700 hover:bg-indigo-900 text-white rounded shadow-sm transition"
                >
                  <AiOutlineUnorderedList className="mr-2 text-white text-lg" />
                  View Participants
                </Link>

                <Link
                  to={`/classes/${cls.id}/attendance/teacher`}
                  className="ml-4 inline-flex items-center px-4 py-2 bg-white border-2 border-indigo-700 text-indigo-700 rounded shadow-sm transition hover:bg-indigo-50"
                >
                  <AiOutlineUsergroupAdd className="mr-2 text-indigo-700 text-lg" />
                  Manage Attendance
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
