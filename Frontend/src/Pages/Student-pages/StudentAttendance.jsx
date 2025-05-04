import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StudentAttendance = () => {
  const [attendance, setAttendance] = useState([]);
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

  const getAttendance = async () => {
    try {
      const res = await axios.get("http://localhost:5000/attendance/get", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setAttendance(res.data);
    } catch (err) {
      console.error("Error fetching attendance:", err);
    }
  };

  useEffect(() => {
    getDetails();
    getAttendance();
  }, []);
  console.log(profile);
  const rollNo = profile[0]?.roll_number;

  const filteredAttendance = rollNo
    ? attendance.filter((entry) => {
      // Match attendance for the current student
      return entry.student_rollno?.toString() === rollNo.toString();
    })
    : [];

  // Group and compute attendance by subject
  const groupedData = Object.values(
    filteredAttendance.reduce((acc, entry) => {
      const key = entry.subject;
      if (!acc[key]) {
        acc[key] = {
          subject: entry.subject,
          class_section: entry.class_section,
          present: 0,
          total: 0,
        };
      }
      acc[key].total += 1;
      if (entry.status.toLowerCase() === 'present') {
        acc[key].present += 1;
      }
      return acc;
    }, {})
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-center mb-8">My Attendance</h2>
      <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-left border">Subject</th>
            <th className="p-3 text-left border">Class & Section</th>
            <th className="p-3 text-left border">Total Classes</th>
            <th className="p-3 text-left border">Classes Attended</th>
            <th className="p-3 text-left border">Attendance (%)</th>
          </tr>
        </thead>
        <tbody>
          {groupedData.map((entry, index) => {
            const percentage = ((entry.present / entry.total) * 100).toFixed(2);
            let rowClass = "";
            if (percentage < 50) rowClass = "bg-red-100 text-white";
            else if (percentage < 75) rowClass = "bg-yellow-100 text-black";
            else rowClass = "bg-green-100 text-black";

            return (
              <tr key={index} className={rowClass}>
                <td className="p-3 border">{entry.subject}</td>
                <td className="p-3 border">{entry.class_section}</td>
                <td className="p-3 border">{entry.total}</td>
                <td className="p-3 border">{entry.present}</td>
                <td className="p-3 border">{percentage}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default StudentAttendance;
