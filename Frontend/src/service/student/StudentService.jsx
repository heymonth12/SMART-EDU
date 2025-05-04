import React, { useState } from 'react'
import SNavbar from './Student-component/SNavbar'
import StudentAssignment from '../../Pages/Student-pages/StudentAssignment';
import StudentMarks from '../../Pages/Student-pages/StudentMarks';
import StudentAttendance from '../../Pages/Student-pages/StudentAttendance';

const StudentService = () => {

  const [ActivePage , setActivePage] = useState("Welcome");

const handleNavigate = (page)=>{
setActivePage(page)
}

  return (
    <div className="StudentService">
      <SNavbar onNavigate={handleNavigate}/>
      {ActivePage === "Assignment" &&  <StudentAssignment />}
        {ActivePage === "Marks" &&  <StudentMarks />}
        {ActivePage === "Attendance" &&  <StudentAttendance />}
        {ActivePage === "Welcome" && <h2 className="text-center text-2xl font-extrabold">Welcome to the E R P !</h2>}
    
    </div>
  )
}

export default StudentService