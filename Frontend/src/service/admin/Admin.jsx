import React, { useState } from 'react';
import Navbar from './adminComoponents/Navbar'
import Student from '../../Pages/Admin-pages/Student';
import Campus from "../../Pages/Admin-pages/Campus";
import Faculty from "../../Pages/Admin-pages/Faculty";
import Course from "../../Pages/Admin-pages/Course";
import Subject from "../../Pages/Admin-pages/Subject";

const Admin = () => {

  const [activePage , setActivePage] = useState("Welcome");

  const handleNavigation = (page)=>{
    setActivePage(page)
  }

  return (
   <div className="admin flex flex-col">
     <Navbar onNavigate={handleNavigation} />

     <div className="content mt-8 p-4">
        {activePage === "Campus" && <Campus />}
        {activePage === "Faculty" && <Faculty />}
        {activePage === "Course" && <Course />}
        {activePage === "Subject" && <Subject />}
        {activePage === "Student" && <Student />}
        {activePage === "Welcome" && <h2 className="text-center text-2xl font-extrabold">Welcome to the Admin Panel!</h2>}
      </div>
   </div>
  )
}

export default Admin