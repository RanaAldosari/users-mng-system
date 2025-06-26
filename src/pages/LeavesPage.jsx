import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function LeavesPage() {
  const [leaves, setLeaves] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios
      .get(
        'https://student-management-system-pnb9.onrender.com/classes/class_01JYKNKV20W2HN5YTV7X93EGZN/leaves',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setLeaves(res.data);
      })
      .catch((err) => {
        console.error('Error when fetching leaves:', err);
      });
  }, []);

  const filteredLeaves = leaves.filter((leave) =>
    leave.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      await axios.put(
        `https://student-management-system-pnb9.onrender.com/leaves/${leaveId}`,
        { 
          status: decision === 'accept' ? 'approved' : 'rejected',
          ...(decision === 'reject' && { rejectReason: reason })
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      setLeaves((prevLeaves) =>
        prevLeaves.map((leave) =>
          leave._id === leaveId
            ? { ...leave, status: decision === 'accept' ? 'approved' : 'rejected', rejectReason: reason }
            : leave
        )
      );

      Swal.fire('Success!', `Leave has been ${decision === 'accept' ? 'accepted' : 'rejected'}.`, 'success');
    } catch (error) {
      console.error( error);
    //   Swal.fire('Error', 'Failed to update leave status. Please try again.', 'error');
    }
  };

  return (
    <>
  
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Leaves</h1>

      <input
        type="text"
        placeholder="Search by User ID..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 mb-4 w-full"
      />

      {filteredLeaves.length === 0 ? (
        <p>No matching leaves found.</p>
      ) : (
        filteredLeaves.map((leave, index) => (
          <div
            key={index}
            className="border p-4 mb-4 rounded shadow-sm bg-white"
          >
            <p><strong>User ID:</strong> {leave.user}</p>
            <p><strong>Class ID:</strong> {leave.classId}</p>
            <p><strong>Date:</strong> {new Date(leave.leaveAt).toLocaleDateString()}</p>
            <p><strong>Type:</strong> {leave.leaveType}</p>
            <p><strong>Status:</strong> {leave.status}</p>
            {leave.rejectReason && <p><strong>Reject Reason:</strong> {leave.rejectReason}</p>}

            <div className="mt-2 space-x-2">
              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => handleDecision(leave._id, 'reject')}
              >
                Reject
              </button>
              <button
                className="bg-green-500 text-white px-3 py-1 rounded"
                onClick={() => handleDecision(leave._id, 'accept')}
              >
                Accept
              </button>
            </div>
          </div>
))
      )}
    </div>
      </>
  );
}

export default LeavesPage;
