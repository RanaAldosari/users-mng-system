import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AiOutlineArrowLeft } from "react-icons/ai";

export default function StClassDetails() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [classDetails, setClassDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token") || "";
  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        const classRes = await axios.get(
          `https://student-management-system-pnb9.onrender.com/classes/${classId}`,
          axiosConfig
        );
        setClassDetails(classRes.data);
      } catch (error) {
        console.error("Error fetching class details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClassDetails();
  }, [classId]);

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
          onClick={() => navigate(-1)}
          className="absolute top-0 left-0 bg-indigo-600 hover:bg-indigo-800 text-white rounded px-3 py-1 shadow-sm flex items-center space-x-1 transition"
          aria-label="Back to Home"
        >
          <AiOutlineArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <h1 className="text-3xl font-extrabold border-b-4 border-indigo-700 pb-3 text-center">
          Class Details
        </h1>
      </header>

      {/* Class Details Section */}
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
    </div>
  );
}
