import React, { useState, useEffect } from "react";
import axios from "axios";

const Subject = () => {
  const [showForm, setShowForm] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    credits: "",
  });

  useEffect(() => {
    if (showTable) fetchSubjects();
  }, [showTable]);

  // 🔥 Get Token Function
  const getToken = () => localStorage.getItem("token");

  // Fetch Subjects (With Token)
  const fetchSubjects = async () => {
    try {
      const res = await axios.get("http://localhost:5000/subject/get", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      console.log('sujects ',res.data)
      setSubjects(res.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
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
          "http://localhost:5000/subject/u",
          { values: formData, where: { id: editingId } },
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        alert("Subject updated successfully!");
      } else {
        // 🔥 Create Request with Token
        await axios.post(
          "http://localhost:5000/subject/create",
          formData,
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        alert("Subject created successfully!");
      }

      setShowForm(false);
      setEditingId(null);
      fetchSubjects();
    } catch (error) {
      console.error("Error saving subject:", error);
    }
  };

  const handleEdit = (subject) => {
    setFormData(subject);
    setEditingId(subject.id);
    setShowForm(true);
    setShowTable(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      try {
        await axios.delete("http://localhost:5000/subject/d", {
          data: { id },
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        alert("Subject deleted successfully!");
        fetchSubjects();
      } catch (error) {
        console.error("Error deleting subject:", error);
      }
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-12" 
          style={{ backgroundImage: "linear-gradient(to right, #4facfe, #00f2fe)", WebkitBackgroundClip: "text", color: "transparent" }}>
        Subject Management
      </h1>
      <div className="flex justify-center gap-8 mb-12">
        <button onClick={() => { setShowForm(true); setShowTable(false); setEditingId(null); setFormData({ name: "", code: "", credits: "" }); }} 
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
              <input type={key === "credits" ? "number" : "text"} name={key} value={formData[key]} onChange={handleChange} 
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
            {subjects.map((subject) => (
              <tr key={subject.id}>
                {Object.keys(formData).map((key) => (
                  <td key={key} className="p-3 border">{subject[key]}</td>
                ))}
                <td className="p-3 border flex gap-4">
                  <button onClick={() => handleEdit(subject)} 
                          className="px-4 py-2 bg-yellow-500 text-white rounded-md shadow-md hover:bg-yellow-600 transition-all">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(subject.id)} 
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

export default Subject;
