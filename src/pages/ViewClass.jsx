import React, { useEffect, useState } from 'react'
import axios from 'axios'

function ViewClass() {
  const [classes, setClasses] = useState([])

  const api = "https://68219a91259dad2655afc3cc.mockapi.io/api/users/image"

  useEffect(() => {
    axios.get(api)
      .then(res => {
// get class
        const classData = res.data.filter(item => item.role === "class")
        setClasses(classData)
      })
      .catch(err => console.log(err))
  }, [])

  return (
    <>
   <div>
      <h2 className="text-2xl font-bold mb-4">All Classes</h2>
{/* display All class info */}
      {classes.length === 0 ? (
        <p>No classes found.</p>
      ) : (
        <div className="p-4 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 md:grid-cols-3 xl:grid-cols-4">
          {classes.map((classItem, index) => (
            <div key={index} className="border p-4 rounded">
              <h3 className="text-xl">Class Name: {classItem.name}</h3>
              <p><strong>Teacher:</strong> {classItem.teachers?.join(', ')}</p>
              <p><strong>Students:</strong></p>
              <ul className="list-disc list-inside ml-4">
                {classItem.students?.map((email, idx) => (
                  <li key={idx}>{email}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
    </>  
  )
}

export default ViewClass
