import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

// API
const api = axios.create({
  baseURL: 'https://student-management-system-pnb9.onrender.com',
});

function PrincipalPage() {
  const [leaves, setLeaves] = useState([]);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      api.get(`/users/${userId}/leaves`).then(res => setLeaves(res.data));
      api.get(`/users/${userId}/teachers`).then(res => setReports(res.data));
    }
  }, []);

  const handleAccept = (leaveId) => {
    const userId = localStorage.getItem('userId');
    api.put(`/users/${userId}/leaves/${leaveId}/accept`).then(() => {
      Swal.fire({ icon: 'success', title: 'Accepted!', timer: 1500, showConfirmButton: false });
      setLeaves(prev => prev.filter(l => l.id !== leaveId));
    });
  };

  const handleReject = (leaveId) => {
    Swal.fire({
      title: 'Reject Reason',
      input: 'text',
      showCancelButton: true,
      confirmButtonText: 'Send',
    }).then(result => {
      if (result.isConfirmed) {
        const userId = localStorage.getItem('userId');
        api.put(`/users/${userId}/leaves/${leaveId}/reject`, { reason: result.value }).then(() => {
          Swal.fire({ icon: 'info', title: 'Rejected', timer: 1500, showConfirmButton: false });
          setLeaves(prev => prev.filter(l => l.id !== leaveId));
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-indigo-900 p-8 max-w-4xl mx-auto space-y-10">
      <h1 className="text-3xl font-extrabold border-b-4 border-indigo-600 pb-2 text-center">
        Principal Panel
      </h1>
{/* get leaves */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Leave Requests</h2>
        {leaves.length === 0 ? (
          <p className="text-gray-500">No leave requests available.</p>
        ) : (
          <div className="space-y-4">
            {leaves.map(leave => (
              <div
                key={leave.id}
                className="bg-white rounded-lg shadow p-5 flex flex-col gap-3"
              >
                <p><span className="font-bold">Date:</span> {leave.leaveAt}</p>
                <p><span className="font-bold">Type:</span> {leave.leaveType}</p>
                <div className="flex gap-4">
{/* handel leaves */}
                  <button
                    onClick={() => handleAccept(leave.id)}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(leave.id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Teacher Reports</h2>
        {reports.length === 0 ? (
          <p className="text-gray-500">No reports submitted.</p>
        ) : (
          <div className="space-y-4">
            {reports.map(report => (
              <div
                key={report.id}
                className="bg-white rounded-lg shadow p-5"
              >
                <h3 className="text-xl font-bold mb-2">{report.title}</h3>
                <p>{report.content}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default PrincipalPage;
