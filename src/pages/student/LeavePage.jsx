import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const leaveUrl = "https://student-management-system-pnb9.onrender.com/leaves";

export default function LeavePage() {
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token") || "";
  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    const fetchLeaves = async () => {
      setLoading(true);
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (!user.id) {
          alert("User not logged in.");
          setLoading(false);
          return;
        }

        const res = await axios.get(leaveUrl, axiosConfig);
        const userLeaves = res.data.filter(
          (leave) => String(leave.userId) === String(user.id)
        );
        setLeaves(userLeaves);
      } catch (error) {
        console.error("Failed to load leave data:", error);
        alert("Failed to load leave data.");
      } finally {
        setLoading(false);
      }
    };
    fetchLeaves();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-indigo-900 font-semibold">Loading...</div>
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
          Leave Requests
        </h1>
      </header>

      {leaves.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          You have no leave requests currently.
        </p>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-300 bg-white rounded-lg shadow">
          <thead className="bg-indigo-700 text-white">
            <tr>
              <th className="px-5 py-3 border border-gray-300 text-left">Date</th>
              <th className="px-5 py-3 border border-gray-300 text-left">Type</th>
              <th className="px-5 py-3 border border-gray-300 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave) => (
              <tr
                key={leave.id}
                className="hover:bg-indigo-50 transition-colors duration-200"
              >
                <td className="px-5 py-3 border border-gray-300">
                  {new Date(leave.leaveAt).toLocaleDateString()}
                </td>
                <td className="px-5 py-3 border border-gray-300 capitalize">
                  {leave.leaveType || "N/A"}
                </td>
                <td className="px-5 py-3 border border-gray-300">
                  {leave.status === "accepted" ? (
                    <span className="text-green-600 font-semibold">Accepted</span>
                  ) : leave.status === "rejected" ? (
                    <span className="text-red-600 font-semibold">Rejected</span>
                  ) : (
                    <span className="text-yellow-500 font-semibold">Pending</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
