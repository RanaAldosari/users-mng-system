import axios from 'axios'
import React, { useEffect, useState } from 'react'

function ViewUsersPage() {
  const [users, setUsers] = useState([]);
  const [signUps, setSignUps] = useState([]);

  useEffect(() => {
    axios.get("https://68219a91259dad2655afc3cc.mockapi.io/api/users/image")
      .then((res) => 
setUsers(res.data))
      .catch((err) =>
 console.log(err));

    axios.get("https://68219a91259dad2655afc3cc.mockapi.io/api/users/user")
      .then((res) =>
 setSignUps(res.data))
      .catch((err) =>
 console.log(err));
  }, []);

  const deleteUser = (id, type) => {
    const url = type === "admin" ? 
      `https://68219a91259dad2655afc3cc.mockapi.io/api/users/image/${id}` :
      `https://68219a91259dad2655afc3cc.mockapi.io/api/users/user/${id}`;
      
    axios.delete(url).then(() => {
      alert("Deleted");
      window.location.reload();
    });
  };

  return (
    <>
    <div className='p-4 space-y-4'>
      <h1 className='text-xl font-bold'>Users Management</h1>
{/* view teacher */}
      <div>
        <h2 className='font-semibold text-lg'>Teachers:</h2>
    
        {users.filter(user => user.role === 'teacher').map(user => (
          <div key={user.id} className='flex gap-4 items-center'>
            <p>{user.name}</p>
            <button onClick={() => deleteUser(user.id, "admin")} className='bg-red-400 text-white px-2'>Delete</button>
          </div>
        ))}
      </div>
{/* view princple */}
      <div>
        <h2 className='font-semibold text-lg'>Principals:</h2>
            <div className='flex'>
        <h2>Princple@tuwaiq.com</h2>
        <button className='bg-red-400'>Delete</button>
        </div>
        {users.filter(user => user.role === 'principal').map(user => (
          <div key={user.id} className='flex gap-4 items-center'>
            <p>{user.name}</p>
            <button onClick={() => deleteUser(user.id, "admin")} className='bg-red-400 text-white px-2'>Delete</button>
          </div>
        ))}
      </div>
{/* view std =>signup&admin */}
<div>
  <h2 className='font-semibold text-lg'>Students:</h2>
  {[...users.filter(user => user.role === 'student'), ...signUps].map(user => (
    <div key={user.id} className='flex gap-4 items-center'>
      <p>{user.name || user.email}</p>
      <button
        onClick={() => deleteUser(user.id, user.role ? "admin" : "signup")}
        className='bg-red-400 text-white px-2'
      >
        Delete
      </button>
    </div>
  ))}
</div>
</div>
    </>  
  )
}

export default ViewUsersPage;
