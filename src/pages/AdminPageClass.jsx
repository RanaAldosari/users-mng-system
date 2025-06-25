import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
//will be create class
function AdminPageClass() {
  const [className, setClassName] = useState("")
  const [teacherId, setTeacherId] = useState("")
  const [studentsList, setStudentsList] = useState([])
  const [teachersList, setTeachersList] = useState([])
  const [selectedStudents, setSelectedStudents] = useState([])
  const navigate = useNavigate()

  const apiUsers = "https://68219a91259dad2655afc3cc.mockapi.io/api/users/user"
  const apiTeachers = "https://68219a91259dad2655afc3cc.mockapi.io/api/users/image"

  useEffect(() => {
    axios.get(apiUsers)
      .then(res => setStudentsList(res.data))
      .catch(err => console.log(err))

    axios.get(apiTeachers)
      .then(res => {
        const teachersOnly = res.data.filter(user => user.role === "teacher")
        setTeachersList(teachersOnly)
      })
      .catch(err => console.log(err))
  }, [])

  const handleStudent = (id) => {
    setSelectedStudents(item =>
      item.includes(id)
        ? item.filter(sid => sid !== id)
        : [...item, id]
    )
  }

  const CreateClass = () => {
    if (!className || !teacherId || selectedStudents.length === 0) {
      alert("all fields are requied")
      return
    }

    const selectedStudentNames = studentsList
      .filter(s => selectedStudents.includes(s.id))
      .map(s => s.email)

    const selectedTeacher = teachersList.find(t => t.id === teacherId)

    const classData = {
      name: className,
      role: "class",
      students: selectedStudentNames,
      teachers: [selectedTeacher.name]
    }

    axios.post(apiTeachers, classData)
      .then(() => {
        alert("Class created successfully!")
        navigate("/viewclass")
      })
      .catch(err => {
        console.error(err)
        alert("Failed to create class,please try again")
      })
  }

  return (
    <>
    <div>
      <h2 className="text-xl font-bold">Create a New Class</h2>

      {/* Class name */}
      <div>
        <label>Class Name:</label>
        <input
          type="text"
          className="border px-2 py-1 w-full"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
        />
      </div>

      {/* Select teacher */}
      <div>
        <label>Assign Teacher:</label>
        <select
          value={teacherId}
          onChange={(e) => setTeacherId(e.target.value)}
          className="border px-2 py-1 w-full"
        >
          <option value="">Select Teacher</option>
          {teachersList.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      {/* Select Students */}
      <div>
        <label>Assign Students:</label>
        <div className="grid grid-cols-2 gap-2">
          {studentsList.map(student => (
            <label key={student.id} className="flex items-center">
              <input
                type="checkbox"
                value={student.id}
                checked={selectedStudents.includes(student.id)}
                onChange={() => handleStudent(student.id)}
                className="mr-2"
              />
              {student.email}
            </label>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={CreateClass}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Create Class
      </button>
    </div>
      </>
  )
}

export default AdminPageClass
