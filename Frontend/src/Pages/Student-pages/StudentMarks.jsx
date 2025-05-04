import axios from 'axios';
import React, { useEffect, useState } from 'react';

const StudentMarks = () => {
  const [profile, setProfile] = useState([]);
  const [marks, setMarks] = useState([]);

  const getToken = () => localStorage.getItem("token");

  const get_details = async () => {
    const res = await axios.get('http://localhost:5000/details/get', {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    setProfile(res.data);
  };

  const get_marks = async () => {
    const res = await axios.get("http://localhost:5000/marks/get", {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    setMarks(res.data);
  };

  useEffect(() => {
    get_details();
    get_marks();
  }, []);

  const rollNo = Number(profile[0]?.roll_number);

  console.log("given rollno  ", rollNo)
  console.log("all marks   ", marks)
  const filteredMarks = rollNo ? marks.filter((mark) => mark.student_rollno === rollNo) : [];
  console.log("required result   ", filteredMarks)

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-center mb-8">My Marks</h2>
      <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-left border">Exam Type</th>
            <th className="p-3 text-left border">Sub Type</th>
            <th className="p-3 text-left border">Subject</th>
            <th className="p-3 text-left border">Marks</th>
          </tr>
        </thead>
        <tbody>
          {filteredMarks.map((mark, index) => {
            const percent = (mark.marks_obtained / mark.maximum_marks) * 100;

            let rowClass = "bg-green-200"; // default
            if (percent < 35) rowClass = "bg-red-500 text-white";
            else if (percent < 45) rowClass = "bg-yellow-400 text-black";

            return (
              <tr key={index} className={rowClass}>
                <td className="p-3 border">{mark.exam_type || 'N/A'}</td>
                <td className="p-3 border">{mark.sub_type || 'N/A'}</td>
                <td className="p-3 border">{mark.subject}</td>
                <td className="p-3 border">{mark.marks_obtained}/{mark.maximum_marks}</td>
              </tr>
            );
          })}
        </tbody>

      </table>
    </div>
  );
};

export default StudentMarks;
