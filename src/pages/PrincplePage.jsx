import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const api = axios.create({
  baseURL: 'https://student-management-system-pnb9.onrender.com',
});

function PrincipalPage() {
  const [leaves, setLeaves] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token'); 
    api.get('/classes/class_01JYKNKV20W2HN5YTV7X93EGZN/leaves', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setLeaves(res.data))
      .catch(err => {
        console.error('Error fetching leaves:', err);
        Swal.fire('Error', 'Failed to fetch leave requests.', 'error');
      });

    api.get('/classes/class_01JYKNKV20W2HN5YTV7X93EGZM/reports',{
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setReports(res.data))
      .catch(err => {
        console.error('Error fetching reports:', err);
        Swal.fire('Error', 'Failed to fetch teacher reports.', 'error');
      });
  }, []);

  const filteredLeaves = leaves.filter((leave) =>
    leave.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

// hendel with leave
  const handleDecision = async (leaveId, decision) => {
    let reason = '';

    if (decision === 'reject') {
      const { value: inputReason } = await Swal.fire({
        title: 'Please enter reason for rejection',
        input: 'textarea',
        inputPlaceholder: 'Type your reason here...',
        inputAttributes: {
          'aria-label': 'Reason for rejection',
        },
        showCancelButton: true,
        confirmButtonText: 'Submit',
      });

      if (!inputReason) {
        Swal.fire('Cancelled', 'Rejection reason is required', 'info');
        return;
      }
      reason = inputReason;
    } else {
      const result = await Swal.fire({
        title: `Are you sure you want to accept this leave?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: `Yes, accept`,
        cancelButtonText: 'Cancel',
      });

      if (!result.isConfirmed) {
        return;
      }
    }

    try {
      const token = localStorage.getItem('token');

      await api.put(
        `/leaves/${leaveId}`,
        {
          status: decision === 'accept' ? 'approved' : 'rejected',
          ...(decision === 'reject' && { rejectReason: reason }),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLeaves(prevLeaves =>
        prevLeaves.map(leave =>
          leave._id === leaveId
            ? { ...leave, status: decision === 'accept' ? 'approved' : 'rejected', rejectReason: reason }
            : leave
        )
      );

      Swal.fire('Success!', `Leave has been ${decision === 'accept' ? 'accepted' : 'rejected'}.`, 'success');
    } catch (error) {
      console.error('Error updating leave:', error);
      Swal.fire('Error', 'Failed to update leave status. Please try again.', 'error');
    }
  };

  return (
    <>
  <div className="min-h-screen bg-neutral-50 text-indigo-900 p-8 max-w-4xl mx-auto space-y-10">
      <h1 className="text-3xl font-extrabold border-b-4 border-indigo-600 pb-2 text-center">
        Principal Panel
      </h1>
{/* leave */}
   <section>
  <h2 className="text-2xl font-semibold mb-4">Leave Requests</h2>

  <input
    type="text"
    placeholder="Search by User ID..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="border p-2 mb-4 w-full"
  />

  {filteredLeaves.length === 0 ? (
    <p className="text-gray-500">No matching leave requests found.</p>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredLeaves.map(leave => (
        <div
          key={leave._id}
          className="bg-white rounded-lg shadow p-5 flex flex-col justify-between"
        >
          <div className="space-y-1">
            <p><strong>User ID:</strong> {leave.user}</p>
            <p><strong>Class ID:</strong> {leave.classId}</p>
            <p><strong>Date:</strong> {new Date(leave.leaveAt).toLocaleDateString()}</p>
            <p><strong>Type:</strong> {leave.leaveType}</p>
            <p><strong>Status:</strong> {leave.status}</p>
            {leave.rejectReason && <p><strong>Reject Reason:</strong> {leave.rejectReason}</p>}
          </div>

          <div className="mt-4 flex gap-4 justify-center">
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded"
              onClick={() => handleDecision(leave._id, 'accept')}
              disabled={leave.status === 'approved'}
            >
              Accept
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded"
              onClick={() => handleDecision(leave._id, 'reject')}
              disabled={leave.status === 'rejected'}
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  )}
</section>

{/* report */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Reports</h2>
        {reports.length === 0 ? (
          <p className="text-gray-500">No reports submitted.</p>
        ) : (
          <div className="space-y-4">
  {reports.map(report => (
  <div key={report.id} className="bg-white rounded-lg shadow p-5">
    <h3 className="text-xl font-bold mb-1">{report.title}</h3>
    <p className="mb-2">{report.content}</p>
    <p><strong>Teacher ID:</strong> {report.teacherId}</p>
    <p><strong>Class ID:</strong> {report.classId}</p>
    <p className="text-sm text-gray-500">
      <span className="font-semibold">Submitted on:</span>{' '}
      {new Date(report.createdAt).toLocaleString()}
    </p>
  </div>
))}
 </div>
        )}
      </section>
    </div>
     </>
  );
}

export default PrincipalPage;
