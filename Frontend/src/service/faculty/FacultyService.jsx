import React, { useState } from 'react'
import FacultyNavbar from './Faculty-Component/FacultyNavbar'
import Assignment from '../../Pages/Faculty-pages/Assignment';
import Attendance from '../../Pages/Faculty-pages/Attendance';
import Marks from '../../Pages/Faculty-pages/Marks';

const FacultyService = () => {
  const [ActivePage, SetActivePage] = useState("Welcome");

  const handleNavigation = (page) => {
    SetActivePage(page);         
  }

  return (
    <div className="FacultyService flex flex-col">
      <FacultyNavbar onNavigate={handleNavigation} />
      <div className="content mt-8 p-4">
        {ActivePage === "Assignment" &&  <Assignment />}
        {ActivePage === "Marks" &&  <Marks />}
        {ActivePage === "Attendance" &&  <Attendance />}
        {ActivePage === "Welcome" && <h2 className="text-center text-2xl font-extrabold">Welcome to the Faculty Panel!</h2>}
      </div>
    </div>
  )
}

export default FacultyService