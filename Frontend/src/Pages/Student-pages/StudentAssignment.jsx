import axios from "axios";
import React, { useEffect, useState } from "react";

const StudentAssignment = () => {
  const [assignments ,setAssignments] = useState([]); 
  const [profile, setProfile] = useState([]);

  const getToken = () => localStorage.getItem("token");

  const getDetails = async () => {
    try {
      const res = await axios.get('http://localhost:5000/details/get', {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setProfile(res.data);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  const getAssigment = async () => {
    try {
      const res = await axios.get("http://localhost:5000/assignment/g", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setAssignments(res.data);
    } catch (err) {
      console.error("Error fetching attendance:", err);
    }
  };

  useEffect(() => {
    getDetails(); 
    getAssigment();
  }, []);

  console.log(assignments);
  console.log(profile);
  
// if profile[0] ?. campus , semester , section == assignment[1 to n ]. campus , semester , section  then show else no need 

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Heading */}
      <h1
        className="text-4xl font-extrabold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-800 to-gray-900"
      >
        Student Assignments
      </h1>

      {/* Assignment Table */}
      <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-left border">ID</th>
            <th className="p-3 text-left border">Title</th>
            <th className="p-3 text-left border">Subject</th>
            <th className="p-3 text-left border">Class & Section</th>
            <th className="p-3 text-left border">Posted By</th>
            <th className="p-3 text-left border">Deadline</th>
            <th className="p-3 text-left border">Content</th>
          </tr>
        </thead>
        <tbody>
        {assignments
  .filter((assignment) => {
    if (!profile[0]) return false;

    const profileCampus = profile[0].campus?.trim().toLowerCase();
    const assignmentCampus = assignment.campus?.trim().toLowerCase();

    const profileSemester = profile[0].semester?.toString();
    const assignmentSemester = assignment.semester?.toString();

    const profileSection = profile[0].section?.trim().toLowerCase();
    const assignmentSection = assignment.section?.trim().toLowerCase();

    return (
      profileCampus === assignmentCampus &&
      profileSemester === assignmentSemester &&
      profileSection === assignmentSection
    );
  })
  .map((assignment) => (
    <tr key={assignment.id}>
      <td className="p-3 border">{assignment.id}</td>
      <td className="p-3 border">{assignment.title}</td>
      <td className="p-3 border">{assignment.subject}</td>
      <td className="p-3 border">{profile[0]?.course} , SECTION - '{assignment.section}'</td>
      <td className="p-3 border">{assignment.postedBy}</td>
      <td className="p-3 border">
        {new Date(assignment.deadline).toLocaleString()}
      </td>
      <td className="p-3 border">{assignment.description}</td>
    </tr>
  ))}


</tbody>

      </table>
    </div>
  );
};

export default StudentAssignment;
