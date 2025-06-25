import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ViewClass() {
  const [classes, setClasses] = useState([]);
  const [users, setUsers] = useState([]);
  const BASE_URL = "https://student-management-system-pnb9.onrender.com";
  const token = localStorage.getItem("token");

  useEffect(() => {
    const getData = async () => {
      try {

        const usersRes = await axios.get(`${BASE_URL}/users`, {
          headers: {
     Authorization: `Bearer ${token}` 
    }
        });
        setUsers(usersRes.data);

        const classRes = await axios.get(`${BASE_URL}/classes`, {
          headers: {
 Authorization: `Bearer ${token}` 
}
        });
        setClasses(classRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    getData();
  }, [token]);

  const getUserEmailById = (id) => {
    const user = users.find(userid => userid._id === id);
    return user ? user.email : "Unknown";
  };

  return (
    <>
   
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">All Classes</h2>

      {classes.length === 0 ? (
        <p className="text-gray-600">No classes found.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {classes.map((classItem) => (
            <div key={classItem._id} className="bg-white shadow rounded p-4 border">
              <h3 className="text-lg font-semibold text-green-700 mb-2">Class: {classItem.name}</h3>
{/* display teacher */}
              <p className="font-medium mb-1">Teacher:</p>
              <ul className="list-disc list-inside text-sm text-gray-700 mb-3">
                {(classItem.teachers || []).map((id, idx) => (
                  <li key={idx}>{getUserEmailById(id)}</li>
                ))}
              </ul>
{/* display std */}
              <p className="font-medium mb-1"> Students:</p>
              <ul className="list-disc list-inside text-sm text-gray-600 max-h-32 overflow-y-auto">
                {(classItem.students || []).map((id, idx) => (
                  <li key={idx}>{getUserEmailById(id)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
     </>
  );
}

export default ViewClass;
