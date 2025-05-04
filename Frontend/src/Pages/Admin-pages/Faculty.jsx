import React, { useState, useEffect } from "react";
import axios from "axios";

const Faculty = () => {
  const [showForm, setShowForm] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [faculties, setFaculties] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    type: "guest",
    post: "",
    campus: "",
    subject: "",    
  });
  const [editingId, setEditingId] = useState(null);

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    if (showTable) fetchFaculties();
  }, [showTable]);

  const fetchFaculties = async () => {
    try {
      const res = await axios.get("http://localhost:5000/faculty/get", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      console.log(res.data)
      setFaculties(res.data.data);
    } catch (error) {
      console.error("Error fetching faculties:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.post(
          "http://localhost:5000/faculty/u",
          { values: formData, where: { id: editingId } },
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        alert("Faculty updated successfully!");
      } else {
        await axios.post("http://localhost:5000/faculty/create", formData, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        alert("Faculty created successfully!");
      }
      setShowForm(false);
      setEditingId(null);
      fetchFaculties();
    } catch (error) {
      console.error("Error saving faculty:", error);
    }
  };

  const handleEdit = (faculty) => {
    setFormData(faculty);
    setEditingId(faculty.id);
    setShowForm(true);
    setShowTable(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this faculty member?")) {
      try {
        await axios.delete("http://localhost:5000/faculty/d", {
          data: { id },
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        alert("Faculty deleted successfully!");
        fetchFaculties();
      } catch (error) {
        console.error("Error deleting faculty:", error);
      }
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1
        className="text-4xl font-extrabold text-center text-gray-800 mb-12"
        // style={{ backgroundImage: "linear-gradient(to right, #4facfe, #00f2fe)" }}
      >
        Faculty Management
      </h1>

      <div className="flex justify-center gap-8 mb-12">
        <button
          onClick={() => { setShowForm(true); setShowTable(false); setEditingId(null); setFormData({ name: "", email: "", phone: "", type: "guest", post: "" }); }}
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

      {showForm && (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name:</label>
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
              <label className="block text-sm font-medium text-gray-700">Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone:</label>
              <input
                type="number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Campus:</label>
              <input
                type="text"
                name="campus"
                value={formData.campus}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Subject:</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Post:</label>
              <input
                type="text"
                name="post"
                value={formData.post}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Type:</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="guest">Guest</option>
                <option value="permanent">Permanent</option>
              </select>
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

      {showTable && (
        <table className="mt-8 w-full border-collapse bg-white shadow-md rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left border">ID</th>
              <th className="p-3 text-left border">Name</th>
              <th className="p-3 text-left border">Email</th>
              <th className="p-3 text-left border">Phone</th>
              <th className="p-3 text-left border">Post</th>
              <th className="p-3 text-left border">Type</th>
              <th className="p-3 text-left border">Campus</th>
              <th className="p-3 text-left border">Subject</th>
              <th className="p-3 text-left border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {faculties.map((faculty) => (
              <tr key={faculty.id}>
                <td className="p-3 border">{faculty.id}</td>
                <td className="p-3 border">{faculty.name}</td>
                <td className="p-3 border">{faculty.email}</td>
                <td className="p-3 border">{faculty.phone}</td>
                <td className="p-3 border">{faculty.post}</td>
                <td className="p-3 border">{faculty.type}</td>
                <td className="p-3 border">{faculty.campus}</td>
                <td className="p-3 border">{faculty.subject}</td>
                <td className="p-3 border flex gap-4">
                  <button onClick={() => handleEdit(faculty)} className="px-4 py-2 bg-yellow-500 text-white rounded-md shadow-md hover:bg-yellow-600 transition-all">Edit</button>
                  <button onClick={() => handleDelete(faculty.id)} className="px-4 py-2 bg-red-600 text-white rounded-md shadow-md hover:bg-red-700 transition-all">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Faculty;
