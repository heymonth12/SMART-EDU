import React, { useState, useEffect } from "react";
import axios from "axios";

const Campus = () => {
  const [showForm, setShowForm] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [campuses, setCampuses] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    contact: "",
    email: "",
    course: "",
  });
  const [editingId, setEditingId] = useState(null);

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    if (showTable) fetchCampuses();
  }, [showTable]);

  // Fetch campuses from API
  const fetchCampuses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/campus/get", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setCampuses(res.data);
      console.log(res + " here");
    } catch (error) {
      console.error("Error fetching campuses:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Create / Update Campus
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        course: formData.course.split(",").map((c) => c.trim()),
      };

      if (editingId) {
        await axios.post(
          "http://localhost:5000/campus/u",
          { values: payload, where: { id: editingId } },
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        alert("Campus updated successfully!");
      } else {
        await axios.post("http://localhost:5000/campus/create", payload, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        alert("Campus created successfully!");
      }

      setShowForm(false);
      setEditingId(null);
      fetchCampuses();
    } catch (error) {
      console.error("Error saving campus:", error);
    }
  };

  const handleEdit = (campus) => {
    setFormData({
      name: campus.name,
      location: campus.location,
      contact: campus.contact,
      email: campus.email,
      course: campus.course.join(", "),
    });//
    console.log("type of bastard",typeof(formData.course))
    setEditingId(campus.id);
    setShowForm(true);
    setShowTable(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this campus?")) {
      try {
        await axios.delete("http://localhost:5000/campus/d", {
          data: { id },
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        alert("Campus deleted successfully!");
        fetchCampuses();
      } catch (error) {
        console.error("Error deleting campus:", error);
      }
    }
  };
  console.log("campus ",campuses);
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-12">
        Campus Management
      </h1>

      <div className="flex justify-center gap-8 mb-12">
        <button
          onClick={() => { setShowForm(true); setShowTable(false); setEditingId(null); setFormData({ name: "", location: "", contact: "", email: "", course: "" }); }}
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
              <label className="block text-sm font-medium text-gray-700">Campus Name:</label>
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
              <label className="block text-sm font-medium text-gray-700">Location:</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Number:</label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
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
              <label className="block text-sm font-medium text-gray-700">Courses Available:</label>
              <textarea
                name="course"
                value={formData.course}
                onChange={handleChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter courses separated by commas"
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

      {/* Table for Viewing Campuses */}
      {showTable && (
        <table className="mt-8 w-full border-collapse bg-white shadow-lg rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left border">ID</th>
              <th className="p-3 text-left border">Name</th>
              <th className="p-3 text-left border">Location</th>
              <th className="p-3 text-left border">Contact</th>
              <th className="p-3 text-left border">Email</th>
              <th className="p-3 text-left border">Courses</th>
              <th className="p-3 text-left border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {campuses.map((campus) => (
              <tr key={campus.id}>
                <td className="p-3 border">{campus.id}</td>
                <td className="p-3 border">{campus.name}</td>
                <td className="p-3 border">{campus.location}</td>
                <td className="p-3 border">{campus.contact}</td>
                <td className="p-3 border">{campus.email}</td>
                <td className="p-3 border">{campus.course.join(", ")}</td>
                <td className="p-3 border flex gap-4">
                  <button onClick={() => handleEdit(campus)} className="px-4 py-2 bg-yellow-500 text-white rounded-md">Edit</button>
                  <button onClick={() => handleDelete(campus.id)} className="px-4 py-2 bg-red-600 text-white rounded-md">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Campus;
