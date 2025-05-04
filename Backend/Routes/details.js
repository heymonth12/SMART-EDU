import express from "express";

import Faculty from "../models/faculty.js";
import Student from "../models/student.js";

const router = express.Router();

router.get("/get", async (req, res) => {
  if (req.user.role == "faculty") {
    try {
      const mail = req.user.mail; // Extract email from req.user

      if (!mail) {
        return res
          .status(400)
          .json({ status: "error", message: "Email not provided" });
      }

      const faculty = await Faculty.findOne({ where: { email: mail } });

      if (!faculty) {
        return res
          .status(404)
          .json({ status: "error", message: "Faculty not found" });
      }

      res.status(200).json({ status: "success", data: faculty });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "error", message: error.message });
    }
  }
  if (req.user.role == "student") {
    try {
      const mail = req.user.mail; // Extract email from req.user

      if (!mail) {
        return res
          .status(400)
          .json({ status: "error", message: "Email not provided" });
      }

      const students = await Student.findAll({ where: { email: mail } });
      res.status(200).json(students);
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "error", message: error.message });
    }
  }
});
export default router;