import React, { useState, useEffect } from "react";
import axios from "axios";

const Student = () => {
  const [showForm, setShowForm] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [students, setStudents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    roll_number: "",
    course: "",
    year_of_admission: "",
    campus: "",
  });

  useEffect(() => {
    if (showTable) fetchStudents();
  }, [showTable]);

  // 🔥 Get Token Function
  const getToken = () => localStorage.getItem("token");

  // Fetch Students (With Token)
  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/student/all", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      console.log(res.data)
      setStudents(res.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // 🔥 Update Request with Token
        await axios.post(
          "http://localhost:5000/student/u",
          { values: formData, where: { id: editingId } },
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        alert("Student updated successfully!");
      } else {
        // 🔥 Create Request with Token
        await axios.post(
          "http://localhost:5000/student/create",
          formData,
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        alert("Student added successfully!");
      }

      setShowForm(false);
      setEditingId(null);
      fetchStudents();
    } catch (error) {
      console.error("Error saving student:", error);
    }
  };

  const handleEdit = (student) => {
    setFormData(student);
    setEditingId(student.id);
    setShowForm(true);
    setShowTable(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await axios.delete("http://localhost:5000/student/d", {
          data: { id },
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        alert("Student deleted successfully!");
        fetchStudents();
      } catch (error) {
        console.error("Error deleting student:", error);
      }
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-12" 
          style={{ backgroundImage: "linear-gradient(to right, #4facfe, #00f2fe)", WebkitBackgroundClip: "text", color: "transparent" }}>
        Student Management
      </h1>
      <div className="flex justify-center gap-8 mb-12">
        <button onClick={() => { setShowForm(true); setShowTable(false); setEditingId(null); setFormData({ name: "", email: "", phone: "", roll_number: "", course: "", year_of_admission: "", campus: "" }); }} 
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300">
          Create
        </button>
        <button onClick={() => { setShowForm(false); setShowTable(true); }} 
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300">
          View
        </button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          {Object.keys(formData).map((key) => (
            <div key={key} className="mb-4">
              <label className="block text-sm font-medium text-gray-700">{key.replace("_", " ").toUpperCase()}:</label>
              <input type={key === "year_of_admission" ? "number" : "text"} name={key} value={formData[key]} onChange={handleChange} 
                     className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
          ))}
          <button type="submit" className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300">
            {editingId ? "Update" : "Submit"}
          </button>
        </form>
      )}
      {showTable && (
        <table className="mt-8 w-full border-collapse bg-white shadow-md rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              {Object.keys(formData).map((key) => (
                <th key={key} className="p-3 text-left border">{key.replace("_", " ").toUpperCase()}</th>
              ))}
              <th className="p-3 text-left border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                {Object.keys(formData).map((key) => (
                  <td key={key} className="p-3 border">{student[key]}</td>
                ))}
                <td className="p-3 border flex gap-4">
                  <button onClick={() => handleEdit(student)} 
                          className="px-4 py-2 bg-yellow-500 text-white rounded-md shadow-md hover:bg-yellow-600 transition-all">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(student.id)} 
                          className="px-4 py-2 bg-red-600 text-white rounded-md shadow-md hover:bg-red-700 transition-all">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Student;
