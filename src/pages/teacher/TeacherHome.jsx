import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router";
import axios from "axios";
import { AiOutlineUsergroupAdd, AiOutlineUnorderedList } from "react-icons/ai";

const baseURL = "https://student-management-system-pnb9.onrender.com";

export default function TeacherHome() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (user.role !== "teacher") {
    return <Navigate to="/login" replace />;
  }

  const [stats, setStats] = useState({ totalClasses: 0 });
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classesRes = await axios.get(`${baseURL}/classes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const allClasses = classesRes.data;

        setStats({ totalClasses: allClasses.length });
        setClasses(allClasses);
      } catch (error) {
        console.error("Error fetching data:", error);
        setStats({ totalClasses: 0 });
        setClasses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

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

      <section className="bg-white rounded-lg shadow p-6 flex flex-col items-center max-w-xs mx-auto">
        <p className="text-sm text-gray-500 uppercase mb-1">Total Classes</p>
        <p className="text-5xl font-extrabold text-indigo-700">{stats.totalClasses}</p>
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
                  to={`/class/${cls.id}`}
                  className="inline-flex items-center px-4 py-2 bg-indigo-700 hover:bg-indigo-900 text-white rounded shadow-sm transition"
                >
                  <AiOutlineUnorderedList className="mr-2 text-white text-lg" />
                  View Participants
                </Link>

                <Link
                  to={`/attendance/add/${cls.id}/new`}
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
