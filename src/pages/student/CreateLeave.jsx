import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AiOutlineArrowLeft } from "react-icons/ai";
import Swal from "sweetalert2";

const attendanceUrl = "https://68219a21259dad2655afc28a.mockapi.io/Attendance";
const leaveUrl = "https://68219a21259dad2655afc28a.mockapi.io/Leave";

export default function CreateLeave() {
  const { classId } = useParams();
  const navigate = useNavigate();

  const [absentDates, setAbsentDates] = useState([]);
  const [leaveType, setLeaveType] = useState("sick");
  const [selectedDate, setSelectedDate] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const attendanceRes = await axios.get(attendanceUrl);
        const attendanceData = attendanceRes.data.filter(
          (record) =>
            String(record.classId) === String(classId) &&
            String(record.attendeeId) === String(user.id) &&
            record.status === "absent"
        );

        const filteredAbsentDates = attendanceData.map((att) =>
          new Date(att.attendedAt).toISOString().slice(0, 10)
        );

        setAbsentDates(filteredAbsentDates);

        if (filteredAbsentDates.length > 0) {
          setSelectedDate(filteredAbsentDates[0]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire("Error", "Failed to load data for leave application.", "error");
      }
    };

    fetchData();
  }, [classId, user.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate) {
      Swal.fire("Error", "Please select a date for your leave.", "error");
      return;
    }
    if (!reason.trim()) {
      Swal.fire("Error", "Please provide a reason.", "error");
      return;
    }

    setLoading(true);

    try {
      const now = new Date().toISOString();

      const payload = {
        classId: classId,
        userId: user.id,
        leaveType,
        reason,
        leaveAt: selectedDate,
        status: "pending",
        createdAt: now,
        updatedAt: now,
      };

      await axios.post(leaveUrl, payload);

      Swal.fire("Success", "Leave request submitted successfully.", "success").then(() => {
        navigate("/leaves");
      });
    } catch (error) {
      console.error("Failed to submit leave request:", error);
      Swal.fire("Error", "Failed to submit leave request.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-indigo-900 px-16 py-10">
      <header className="mb-10 relative max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-0 left-0 bg-indigo-600 hover:bg-indigo-800 text-white rounded px-4 py-2 shadow-sm flex items-center space-x-2 transition"
          aria-label="Back"
        >
          <AiOutlineArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <h1 className="text-4xl font-extrabold border-b-4 border-indigo-600 pb-2 text-center">
          Submit Leave Request
        </h1>
      </header>

      <main className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto space-y-8">
        {absentDates.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            No absent days available for leave application.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="leaveAt" className="block mb-2 font-semibold">
                Select Absent Date
              </label>
              <select
                id="leaveAt"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2"
                required
              >
                {absentDates.map((date) => (
                  <option key={date} value={date}>
                    {new Date(date).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="leaveType" className="block mb-2 font-semibold">
                Leave Type
              </label>
              <select
                id="leaveType"
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2"
                required
              >
                <option value="sick">Sick</option>
                <option value="vacation">Vacation</option>
                <option value="personal">Personal</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="reason" className="block mb-2 font-semibold">
                Reason
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                placeholder="Write your reason here..."
                className="w-full border border-gray-300 rounded px-4 py-2 resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-indigo-700 hover:bg-indigo-900 text-white font-semibold py-3 rounded-lg ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Submitting..." : "Submit Leave"}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
