import axios from "axios";
import React, { useEffect, useState } from "react";

const Marks = () => {
  const [showForm, setShowForm] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [marks, setMarks] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    student_rollno: "",
    student_name: "",
    class: "",
    subject: "",
    marks_obtained: "",
    maximum_marks: "",
    exam_type: "mid-sem",
    sub_type: "theory",
  });

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    if (showTable) fetchMarks();
  }, [showTable]);

  const fetchMarks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/marks/get", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      const marksData = res.data;

      const updatedMarks = await Promise.all(
        marksData.map(async (entry) => {
          try {
            const studentRes = await axios.post(
              "http://localhost:5000/student/get",
              { where: { roll_number: entry.student_rollno } },
              { headers: { Authorization: `Bearer ${getToken()}` } }
            );

            const student = studentRes.data[0];
            return {
              ...entry,
              student_name: student?.name || "N/A",
              class: student?.course || "N/A",
            };
          } catch (err) {
            console.error(`Error fetching student for rollno ${entry.student_rollno}`, err);
            return {
              ...entry,
              student_name: "N/A",
              class: "N/A",
            };
          }
        })
      );

      setMarks(updatedMarks);
    } catch (error) {
      console.error("Error fetching marks:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const obtained = parseFloat(formData.marks_obtained);
    const maximum = parseFloat(formData.maximum_marks);
  
    if (obtained > maximum) {
      alert("Marks Obtained cannot be greater than Maximum Marks.");
      return;
    }
  
    try {
      if (editingId) {
        await axios.post(
          "http://localhost:5000/marks/u",
          { values: formData, where: { id: editingId } },
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        alert("Marks updated successfully!");
      } else {
        await axios.post("http://localhost:5000/marks/create", formData, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        alert("Marks added successfully!");
      }
  
      setFormData({
        student_rollno: "",
        student_name: "",
        class: "",
        subject: "",
        marks_obtained: "",
        maximum_marks: "",
        exam_type: "mid-sem",
        sub_type: "theory",
      });
      setEditingId(null);
      setShowForm(false);
      fetchMarks();
    } catch (error) {
      console.error("Error submitting marks:", error);
    }
  };
  

  const handleEdit = (entry) => {
    setFormData(entry);
    setEditingId(entry.id);
    setShowForm(true);
    setShowTable(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      try {
        await axios.delete("http://localhost:5000/marks/d", {
          data: { id },
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        alert("Deleted successfully!");
        fetchMarks();
      } catch (error) {
        console.error("Error deleting marks:", error);
      }
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-12">
        Marks Management
      </h1>

      <div className="flex justify-center gap-8 mb-12">
        <button
          onClick={() => {
            setShowForm(true);
            setShowTable(false);
            setEditingId(null);
            setFormData({
              student_rollno: "",
              student_name: "",
              class: "",
              subject: "",
              marks_obtained: "",
              maximum_marks: "",
              exam_type: "mid-sem",
              sub_type: "theory",
            });
          }}
          className="px-8 py-4 bg-blue-600 text-white rounded-lg shadow hover:scale-105 transform transition"
        >
          Add Marks
        </button>
        <button
          onClick={() => {
            setShowForm(false);
            setShowTable(true);
          }}
          className="px-8 py-4 bg-green-600 text-white rounded-lg shadow hover:scale-105 transform transition"
        >
          View Marks
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Student Name:
              </label>
              <input
                name="student_name"
                value={formData.student_name}
                onChange={handleChange}
                type="text"
                required
                disabled={!!editingId}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Roll Number:
              </label>
              <input
                name="student_rollno"
                value={formData.student_rollno}
                onChange={handleChange}
                type="text"
                required
                disabled={!!editingId}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Class:
              </label>
              <input
                name="class"
                value={formData.class}
                onChange={handleChange}
                type="text"
                required
                disabled={!!editingId}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Subject:
              </label>
              <input
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                type="text"
                required
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Exam Type:
              </label>
              <select
                name="exam_type"
                value={formData.exam_type}
                onChange={handleChange}
                disabled={!!editingId}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
              >
                <option value="mid-sem">Mid Sem</option>
                <option value="end-sem">End Sem</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Sub Type:
              </label>
              <select
                name="sub_type"
                value={formData.sub_type}
                onChange={handleChange}
                disabled={!!editingId}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
              >
                <option value="theory">Theory</option>
                <option value="practical">Practical</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Marks Obtained:
              </label>
              <input
                name="marks_obtained"
                value={formData.marks_obtained}
                onChange={handleChange}
                type="number"
                required
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Maximum Marks:
              </label>
              <input
                name="maximum_marks"
                value={formData.maximum_marks}
                onChange={handleChange}
                type="number"
                required
                disabled={!!editingId}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:scale-105 transform transition"
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
              <th className="p-3 text-left border">Roll Number</th>
              <th className="p-3 text-left border">Name</th>
              <th className="p-3 text-left border">Class</th>
              <th className="p-3 text-left border">Subject</th>
              <th className="p-3 text-left border">Exam Type</th>
              <th className="p-3 text-left border">Sub Type</th>
              <th className="p-3 text-left border">Marks</th>
              <th className="p-3 text-left border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {marks.map((entry) => (
              <tr key={entry.id}>
                <td className="p-3 border">{entry.id}</td>
                <td className="p-3 border">{entry.student_rollno}</td>
                <td className="p-3 border">{entry.student_name}</td>
                <td className="p-3 border">{entry.class}</td>
                <td className="p-3 border">{entry.subject}</td>
                <td className="p-3 border">{entry.exam_type}</td>
                <td className="p-3 border">{entry.sub_type}</td>
                <td className="p-3 border">
                  {entry.marks_obtained}/{entry.maximum_marks}
                </td>
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

export default Marks;
