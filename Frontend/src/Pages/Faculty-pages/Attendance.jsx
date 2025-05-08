import React, { useState, useEffect } from "react";
import axios from "axios";

const Attendance = () => {
  const [filters, setFilters] = useState({
    campus: "",
    course: "",
    semester: "",
    subject: "",
    date: new Date().toISOString().split("T")[0], // Default to today
  });

  const [options, setOptions] = useState({
    campus: [],
    course: [],
    semester: [],
    subject: [],
  });

  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [facultyCampus, setFacultyCampus] = useState("");

  const getToken = () => localStorage.getItem("token");

  // Fetch Faculty Details
  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const res = await axios.get("http://localhost:5000/faculty/find", {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        
        if (res.data?.data?.campus) {
          setFacultyCampus(res.data.data.campus);
          setOptions((prev) => ({
            ...prev,
            campus: res.data.data.campus.split(",").map((item) => item.trim()),
          }));
        }
      } catch (error) {
        console.error("Error fetching faculty:", error);
      }
    };

    fetchFaculty();
  }, []);

  // Fetch Courses for Faculty's Campus
  useEffect(() => {
    if (!facultyCampus) return;

    const fetchCampus = async () => {
      try {
        const res = await axios.post(
          "http://localhost:5000/campus/find",
          { where: { name: facultyCampus } },
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
          console.log(facultyCampus)
        if (res.data[0]?.course) {
          setOptions((prev) => ({
            ...prev,
            course: res.data[0].course.map((item) => item.trim()),
          }));
        }
      } catch (error) {
        console.error("Error fetching campuses:", error);
      }
    };

    fetchCampus();
  }, [facultyCampus]);

  // Fetch Subjects when Course Changes
  useEffect(() => {
    if (!filters.course) return;

    const fetchCourse = async () => {
      try {
        const res = await axios.post(
          "http://localhost:5000/course/find",
          { where: { name: filters.course } },
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );

        const subjects = res.data.data[0]?.subjects || [];
        setOptions((prev) => ({ ...prev, subject: subjects }));
      } catch (error) {
        console.error("Error fetching course subjects:", error);
      }
    };

    fetchCourse();
  }, [filters.course]);

  // Fetch Students and Set Default Attendance
  const fetchStudents = async () => {
    try {
      const { subject, date, ...studentFilter } = filters;
      const res = await axios.post(
        "http://localhost:5000/student/get",
        { where: studentFilter },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );

      setStudents(res.data);

      // Initialize attendance to absent
      const attendanceMap = {};
      res.data.forEach((student) => {
        attendanceMap[student.roll_number] = "absent";
      });

      setAttendance(attendanceMap);

      // Send default absent records to DB
      await Promise.all(
        res.data.map((student) =>
          axios.post(
            "http://localhost:5000/attendance/create",
            {
              student_rollno: student.roll_number,
              student_name: student.name,
              subject_code: filters.subject,
              subject: filters.subject,
              date: filters.date,
              status: "absent",
            },
            { headers: { Authorization: `Bearer ${getToken()}` } }
          )
        )
      );
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  // Handle Toggle Attendance
  const toggleAttendance = async (student) => {
    const newStatus = attendance[student.roll_number] === "present" ? "absent" : "present";

    setAttendance((prev) => ({
      ...prev,
      [student.roll_number]: newStatus,
    }));

    try {
      await axios.put(
        "http://localhost:5000/attendance/u",
        {
          values: { status: newStatus },
          where: { student_rollno: student.roll_number, subject_code: filters.subject, date: filters.date },
        },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
    } catch (error) {
      console.error("Error updating attendance:", error);
    }
  };

  // Reset Everything (Save Attendance)
  const resetState = () => {
    setFilters({
      campus: "",
      course: "",
      semester: "",
      subject: "",
      date: new Date().toISOString().split("T")[0],
    });
    setStudents([]);
    setAttendance({});
  };

  return (
    <div>
      <h2 className="text-xl text-blue-950 font-extrabold text-center mb-6">
        ATTENDANCE
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-10 gap-4">
        <input
          type="date"
          value={filters.date}
          onChange={(e) => setFilters((prev) => ({ ...prev, date: e.target.value }))}
          className="p-1 border rounded-md"
        />

         {/* Select Campus */}
         <select
            value={filters.campus}
            onChange={(e) => setFilters((prev) => ({ ...prev, campus: e.target.value }))}
            className="p-1 border rounded-md"
          >
            <option value="">--select campus--</option>
            {options.campus.map((campus, index) => (
              <option key={index} value={campus}>
                {campus}
              </option>
            ))}
          </select>

<select
          value={filters.course}
          onChange={(e) => setFilters((prev) => ({ ...prev, course: e.target.value }))}
          className="p-1 border rounded-md"
        >
          <option value="">--select course--</option>
          {options.course.map((course, index) => (
            <option key={index} value={course}>
              {course}
            </option>
          ))}
        </select>

        <select
          value={filters.subject}
          onChange={(e) => setFilters((prev) => ({ ...prev, subject: e.target.value }))}
          className="p-1 border rounded-md"
        >
          <option value="">--select subject--</option>
          {options.subject.map((subject, index) => (
            <option key={index} value={subject}>
              {subject}
            </option>
          ))}
        </select>

        

          {/* Select Semester */}
          <select
            value={filters.semester}
            onChange={(e) => setFilters((prev) => ({ ...prev, semester: e.target.value }))}
            className="p-1 border rounded-md"
          >
            <option value="">--select semester--</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>


        <button className="bg-blue-700 text-white font-bold rounded-lg" onClick={fetchStudents}>
          SUBMIT
        </button>

        <button className="bg-red-600 text-white font-bold rounded-lg" onClick={resetState}>
          SAVE ATTENDANCE
        </button>
      </div>

      <div className="mt-6">
        <ul>
          {students.map((student) => (
            <li key={student.roll_number} className="flex justify-between p-2 border-b">
              <button
                className={`p-2 rounded-md font-bold ${
                  attendance[student.roll_number] === "present" ? "bg-green-500" : "bg-red-500"
                } text-white`}
                onClick={() => toggleAttendance(student)}
              >
                {attendance[student.roll_number] === "present" ? "Present" : "Absent"}
              </button>
              <span>{student.name}</span>
              <span>{student.roll_number}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Attendance;
