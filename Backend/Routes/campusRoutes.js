import { Op } from "sequelize"; // Import Op
import express from "express";
import Campus from "../models/campus.js";
import { roleMiddleware } from "../utils/authMiddleware.js";

const router = express.Router();

// CREATE Campus
router.post("/create", async (req, res) => {
  try {
    const campus = await Campus.create(req.body);
    res.status(201).json(campus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ Campuses
router.get("/get", async (req, res) => {
  try {
    const campuses = await Campus.findAll();
    const campus = campuses.map((campus) => campus.dataValues);

    console.log(campus);
    res.status(200).json(campus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/find", async (req, res) => {
  const { where } = req.body;
  console.log("Incoming where:", where);

  if (where?.name) {
    where.name = { [Op.in]: where.name.split(",").map((name) => name.trim()) }; // ✅ Yaha `[Op.in]` laga diya
  }

  console.log("Updated where:", where); // ✅ Debugging ke liye

  try {
    const campuses = await Campus.findAll({ where });
    res.status(200).json(campuses);
  } catch (error) {
    console.log("Error aa gya reeee:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/u", async (req, res) => {
  try {
    console.log(req.body);

    // Separate `values` and `where` from request body
    const { values, where } = req.body;

    if (!values || !where) {
      return res
        .status(400)
        .json({
          status: "error",
          message: "Invalid request. Provide values and where clause.",
        });
    }

    console.log("step 2 ", values, where);

    // Update operation
    const [rowsUpdated] = await Campus.update(values, { where });
    console.log("step 3 ", rowsUpdated);
    // Check if any rows were updated
    if (rowsUpdated === 0) {
      return res
        .status(404)
        .json({ message: "No matching record found to update" });
    }

    res.status(200).json({ message: "Update successful", rowsUpdated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/d", async (req, res) => {
  try {
    const where = req.body;
    const del = await Campus.destroy({ where });

    if (del === 0) {
      res
        .status(404)
        .json({ message: "no records found check entered query again" });
    }

    res.status(200).json({ message: "deletion successful", del });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
export default router;
