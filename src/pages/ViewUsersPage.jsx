import axios from 'axios'
import React, { useEffect, useState } from 'react'

function ViewUsersPage() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const token = localStorage.getItem("token")
    // get all users
    axios.get("https://student-management-system-pnb9.onrender.com/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        console.log("Users fetched:", res.data)
        setUsers(res.data)
      })
      .catch(err => {
        console.log("Error fetching users:", err)
      })
  }, [])
// delete user by id
  const deleteUser = (id) => {
    const token = localStorage.getItem("token")
    const url = `https://student-management-system-pnb9.onrender.com/users/${id}`

    axios.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(() => {
      alert("Deleted")
      setUsers(userDel =>
 userDel.filter(user => user.id !== id))
    }).catch(err => {
      console.error("Failed to delete user:", err)
      alert("Failed to delete user")
    })
  }

  const teachers = users.filter(teacherid => teacherid.role === 'teacher').slice(0, 2)
  const principals = users.filter(princpleid => princpleid.role === 'principal').slice(0, 1)
  // const students = users.filter(u => u.role === 'student').slice(0, 20).sort((a,b)=>)
const extractNumber = (email) => {
  const match = email.match(/\d+/);
  return match ? Number(match[0]) : 0;
};
const students = users
  .filter(stdid => stdid.role === 'student')
  .sort((a, b) => extractNumber(a.email) - extractNumber(b.email))
  .slice(0, 20);


  return (
    <>
  
    <div className='p-4 space-y-4'>
      <h1 className='text-xl font-bold'>Users Management</h1>

      <div>
        <h2 className='font-semibold text-lg'>Teachers:</h2>
        {teachers.length === 0 && <p>No teachers found.</p>}
        {teachers.map(user => (
          <div key={user.id} className='flex gap-4 items-center'>
            <p>{user.name || user.email || "No name"}</p>
            <button onClick={() => deleteUser(user.id)} className='bg-red-400 text-white px-2'>Delete</button>
          </div>
        ))}
      </div>

      <div>
        <h2 className='font-semibold text-lg'>Principals:</h2>
        {principals.length === 0 && <p>No principals found.</p>}
        {principals.map(user => (
          <div key={user.id} className='flex gap-4 items-center'>
            <p>{user.name || user.email || "No name"}</p>
            <button onClick={() => deleteUser(user.id)} className='bg-red-400 text-white px-2'>Delete</button>
          </div>
        ))}
      </div>

      <div>
        <h2 className='font-semibold text-lg'>Students:</h2>
        {students.length === 0 && <p>No students found.</p>}
      {students.map(student => (
  <div key={student.id} className='flex gap-4 items-center'>
    <p>{student.email}</p>
    <button onClick={() => deleteUser(student.id)} className='bg-red-400 text-white px-2'>Delete</button>
  </div>
))}

      </div>
    </div>
      </>
  )
}

export default ViewUsersPage
