// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Swal from 'sweetalert2';

// const BASE_URL = 'https://student-management-system-pnb9.onrender.com';

// function LeavesPage({ userId, classId }) {
//   const [leaves, setLeaves] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     const getLeaves = async () => {
//       try {
//         setLoading(true);
// // by id
//         let url = '';
//         if (classId) {
//           url = `${BASE_URL}/classes/${classId}/leaves`;
//         } else if (userId) {
//           url = `${BASE_URL}/users/${userId}/leaves`;
//         } else {
//           Swal.fire('Error', 'Please provide either userId or classId', 'error');
//           setLoading(false);
//           return;
//         }

//         const res = await axios.get(url, {
//           headers: { Authorization: `Bearer ${token}` }
//         });

//         setLeaves(res.data);
//       } catch (error) {
//         console.error('Failed to fetch leaves:', error.response || error.message);
//         Swal.fire('Error', 'Failed to load leaves', 'error');
//       } finally {
//         setLoading(false);
//       }
//     };

//     getLeaves();
//   }, [userId, classId, token]);

//   if (loading) return <p>Loading...</p>;

//   return (
//     <>
//     <div>
//       <h2>Leaves</h2>
//       {leaves.length === 0 ? (
//         <p>No leaves found.</p>
//       ) : (
//         <ul>
//           {leaves.map((leave) => (
//             <li key={leave.id}>
//               Date: {leave.leaveAt} - Type: {leave.leaveType} - Status: {leave.status}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//       </>
//   );
// }

// export default LeavesPage;
