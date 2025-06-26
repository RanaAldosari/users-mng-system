// src/components/ViewClass.jsx
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

const API_BASE = "https://student-management-system-pnb9.onrender.com";

export default function ViewClass() {
  const [rawClasses, setRawClasses] = useState([]); // step 1: raw /classes response
  const [classes, setClasses] = useState([]); // step 2: enriched with teachers+students
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("token");
  const cacheHeaders = {
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  };
  const headers = { Authorization: `Bearer ${token}`, ...cacheHeaders };

  // Phase 1: fetch all users + raw classes
  useEffect(() => {
    async function fetchRaw() {
      try {
        setLoading(true);
        const [usersRes, classesRes] = await Promise.all([
          axios.get(`${API_BASE}/users`, { headers }),
          axios.get(`${API_BASE}/classes`, { headers }),
        ]);
        console.log("🚀 users:", usersRes.data);
        console.log("🚀 raw classes:", classesRes.data);
        setUsers(usersRes.data);
        setRawClasses(classesRes.data);
      } catch (e) {
        console.error("Error loading users or classes:", e);
        setError("Failed to load users or classes.");
      } finally {
        setLoading(false);
      }
    }
    fetchRaw();
  }, [token]);

  // Phase 2: for each raw class, fetch its teachers & students, then enrich
  useEffect(() => {
    if (rawClasses.length === 0) return;

    async function fetchParticipants() {
      setLoading(true);
      try {
        const teacherReqs = rawClasses.map((c) =>
          axios.get(`${API_BASE}/classes/${c.id}/teachers`, { headers })
        );
        const studentReqs = rawClasses.map((c) =>
          axios.get(`${API_BASE}/classes/${c.id}/students`, { headers })
        );
        const teacherRes = await Promise.all(teacherReqs);
        const studentRes = await Promise.all(studentReqs);

        // log raw payloads
        teacherRes.forEach((r, i) =>
          console.log(`📝 teachers for ${rawClasses[i].id}:`, r.data)
        );
        studentRes.forEach((r, i) =>
          console.log(`📝 students for ${rawClasses[i].id}:`, r.data)
        );

        const enriched = rawClasses.map((c, i) => {
          const rawTeachers = teacherRes[i].data;
          const rawStudents = studentRes[i].data;

          // find the actual array in the payload
          const teachersArray = Array.isArray(rawTeachers)
            ? rawTeachers
            : rawTeachers.teachers ||
              rawTeachers.participants ||
              rawTeachers.data ||
              [];
          const studentsArray = Array.isArray(rawStudents)
            ? rawStudents
            : rawStudents.students ||
              rawStudents.participants ||
              rawStudents.data ||
              [];

          // extract userIds (or fallback to the value itself)
          const teachers = teachersArray.map((p) =>
            p && typeof p === "object" ? p.userId || p.id : p
          );
          const students = studentsArray.map((p) =>
            p && typeof p === "object" ? p.userId || p.id : p
          );

          return { ...c, teachers, students };
        });

        setClasses(enriched);
      } catch (e) {
        console.error("Error loading participants:", e);
        setError("Failed to load class participants.");
      } finally {
        setLoading(false);
      }
    }
    fetchParticipants();
  }, [rawClasses]);

  // Build lookup map userID → email
  const userMap = useMemo(() => {
    const m = {};
    users.forEach((u) => {
      if (u._id) m[u._id] = u.email;
      if (u.id) m[u.id] = u.email;
    });
    return m;
  }, [users]);

  // Filter logic: class name, teacher email, student email
  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return classes;
    return classes.filter((c) => {
      if (c.name.toLowerCase().includes(term)) return true;
      if (
        (c.teachers || []).some((id) =>
          (userMap[id] || "").toLowerCase().includes(term)
        )
      )
        return true;
      return (c.students || []).some((id) =>
        (userMap[id] || "").toLowerCase().includes(term)
      );
    });
  }, [classes, searchTerm, userMap]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <span className="text-gray-500">Loading classes…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <span className="text-red-500">{error}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">All Classes</h2>

        {/* Search Bar */}
        <div className="mb-6 flex justify-center">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by class, teacher, or student…"
            className="w-full sm:w-2/3 md:w-1/2 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {filtered.length === 0 ? (
          <p className="text-gray-600 text-center">No classes match.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((c) => (
              <div
                key={c._id || c.id}
                className="bg-white shadow rounded p-4 border flex flex-col"
              >
                <h3 className="text-lg font-semibold text-green-700 mb-2 truncate">
                  {c.name}
                </h3>

                {/* Teachers */}
                <div className="mb-2">
                  <p className="font-medium">
                    Teacher{c.teachers.length > 1 ? "s" : ""}:
                  </p>
                  {c.teachers.length ? (
                    <ul className="list-disc list-inside text-sm text-gray-700">
                      {c.teachers.map((uid, idx) => (
                        <li key={idx} className="truncate">
                          {userMap[uid] || uid}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">None assigned</p>
                  )}
                </div>

                {/* Students */}
                <div className="flex-1 mb-2">
                  <p className="font-medium">Students:</p>
                  {c.students.length ? (
                    <ul className="list-disc list-inside text-sm text-gray-600 max-h-24 overflow-y-auto">
                      {c.students.map((uid, idx) => (
                        <li key={idx} className="truncate">
                          {userMap[uid] || uid}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">None assigned</p>
                  )}
                </div>

                <p className="text-xs text-gray-500 mt-auto">
                  {c.students.length} student
                  {c.students.length === 1 ? "" : "s"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
