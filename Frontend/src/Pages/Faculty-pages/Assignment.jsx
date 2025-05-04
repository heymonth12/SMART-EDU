import axios from "axios";
import React, { useEffect, useState } from "react";

const Assignment = () => {
  const [showForm, setShowForm] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    subject: "",
    class: "",
  });

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    if (showTable) fetchAssignments();
  }, [showTable]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchAssignments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/assignment/get", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setAssignments(res.data);
    } catch (err) {
      console.error("Error fetching assignments:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await axios.post(
          "http://localhost:5000/assignment/u",
          { values: formData, where: { id: editingId } },
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        alert("Assignment updated successfully!");
      } else {
        await axios.post("http://localhost:5000/assignment/create", formData, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        alert("Assignment created successfully!");
      }

      setFormData({
        title: "", 
        description: "",
        deadline: "",
        subject: "",
        class: "",
      });
      setEditingId(null);
      setShowForm(false);
      fetchAssignments();
    } catch (err) {
      console.error("Error submitting assignment:", err);
    }
  };

  const handleEdit = (entry) => {
    setFormData(entry);
    setEditingId(entry.id);
    setShowForm(true);
    setShowTable(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      try {
        await axios.delete("http://localhost:5000/assignment/d", {
          data: { id },
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        alert("Deleted successfully!");
        fetchAssignments();
      } catch (err) {
        console.error("Error deleting assignment:", err);
      }
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">Assignment Management</h2>

      <div className="flex justify-center gap-8 mb-8">
        <button
          onClick={() => {
            setShowForm(true);
            setShowTable(false);
            setEditingId(null);
            setFormData({
              title: "", 
              description: "",
              deadline: "",
              subject: "",
              class: "",
            });
          }}
          className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-all"
        >
          Add Assignment
        </button>
        <button
          onClick={() => {
            setShowForm(false);
            setShowTable(true);
          }}
          className="px-8 py-4 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-all"
        >
          View Assignments
        </button>
      </div>

      {showForm ? (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Assignment Title:</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                type="text"
                required
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Due Date:</label>
              <input
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                type="date"
                required
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Subject:</label>
              <input
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                type="text"
                required
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>  
              <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter assignment details"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:scale-105 transform transition-all"
          >
            {editingId ? "Update" : "Submit"}
          </button>
        </form>
      ) : (
        <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left border">ID</th>
              <th className="p-3 text-left border">Title</th>
              <th className="p-3 text-left border">Subject</th>
              <th className="p-3 text-left border">Description</th>
              <th className="p-3 text-left border">Due Date</th>
              <th className="p-3 text-left border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((entry) => (
              <tr key={entry.id}>
                <td className="p-3 border">{entry.id}</td>
                <td className="p-3 border">{entry.title}</td>
                <td className="p-3 border">{entry.subject}</td>
                <td className="p-3 border">{entry.description}</td>
                <td className="p-3 border">{entry.deadline}</td>
                <td className="p-3 border flex gap-2">
                  <button
                    onClick={() => handleEdit(entry)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-md shadow-md hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md shadow-md hover:bg-red-700"
                  >
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

export default Assignment;
