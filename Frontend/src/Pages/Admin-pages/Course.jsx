import React, { useState, useEffect } from "react";
import axios from "axios";

const Course = () => {
  const [showForm, setShowForm] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    fees: "",
    subjects: "",
  });
  const [editingId, setEditingId] = useState(null);

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    if (showTable) fetchCourses();
  }, [showTable]);

  // Fetch courses from API
  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/course/get", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setCourses(res.data.data); // API ka response { status: 'success', data: [...] } hai
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Create / Update Course
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        fees: parseFloat(formData.fees), // Ensure fees is a number
        subjects: formData.subjects.split(",").map((s) => s.trim()), // Convert subjects string to array
      };

      if (editingId) {
        await axios.post(
          "http://localhost:5000/course/u",
          { values: payload, where: { id: editingId } },
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        alert("Course updated successfully!");
      } else {
        await axios.post("http://localhost:5000/course/create", payload, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        alert("Course created successfully!");
      }

      setShowForm(false);
      setEditingId(null);
      fetchCourses();
    } catch (error) {
      console.error("Error saving course:", error);
    }
  };

  const handleEdit = (course) => {
    setFormData({
      name: course.name,
      duration: course.duration,
      fees: course.fees.toString(),
      subjects: course.subjects.join(", "), // Convert array to string
    });
    setEditingId(course.id);
    setShowForm(true);
    setShowTable(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await axios.delete("http://localhost:5000/course/d", {
          data: { id },
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        alert("Course deleted successfully!");
        fetchCourses();
      } catch (error) {
        console.error("Error deleting course:", error);
      }
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1
        className="text-4xl font-extrabold text-center text-gray-800 mb-12"
      >
        Course Management
      </h1>
 
      <div className="flex justify-center gap-8 mb-12">
        <button
          onClick={() => { setShowForm(true); setShowTable(false); setEditingId(null); setFormData({ name: "", duration: "", fees: "", subjects: "" }); }}
          className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300"
        >
          Create
        </button>
        <button
          onClick={() => { setShowForm(false); setShowTable(true); }}
          className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300"
        >
          View
        </button>
      </div>

      {/* Form for Create / Update */}
      {showForm && (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Course Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Duration:</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Fees:</label>
              <input
                type="number"
                name="fees"
                value={formData.fees}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Subjects:</label>
              <textarea
                name="subjects"
                value={formData.subjects}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter subjects separated by commas"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300"
          >
            {editingId ? "Update" : "Submit"}
          </button>
        </form>
      )}

      {/* Table for Viewing Courses */}
      {showTable && (
        <table className="mt-8 w-full border-collapse bg-white shadow-lg rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left border">ID</th>
              <th className="p-3 text-left border">Name</th>
              <th className="p-3 text-left border">Duration</th>
              <th className="p-3 text-left border">Fees</th>
              <th className="p-3 text-left border">Subjects</th>
              <th className="p-3 text-left border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td className="p-3 border">{course.id}</td>
                <td className="p-3 border">{course.name}</td>
                <td className="p-3 border">{course.duration}</td>
                <td className="p-3 border">₹{course.fees}</td>
                <td className="p-3 border">{course.subjects.join(", ")}</td>
                <td className="p-3 border flex gap-4">
                  <button onClick={() => handleEdit(course)} className="px-4 py-2 bg-yellow-500 text-white rounded-md shadow-md hover:bg-yellow-600 transition-all">Edit</button>
                  <button onClick={() => handleDelete(course.id)} className="px-4 py-2 bg-red-600 text-white rounded-md shadow-md hover:bg-red-700 transition-all">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Course;
