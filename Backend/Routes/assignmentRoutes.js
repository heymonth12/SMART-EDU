import express from "express";
import Assignment from "../models/assignment.js";
import { roleMiddleware} from '../utils/authMiddleware.js'

const router = express.Router();

// CREATE Assignment
router.post("/create",roleMiddleware('faculty'), async (req, res) => {
    try {
        console.log("here is user" ,req)
         

        const assignment = await Assignment.create({...req.body, postedBy : req.user.name});
        res.status(201).json(assignment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    
});
// READ Assignments
router.get("/get", async (req, res) => {
    try {
        console.log("here is user" , req)
        const assignments = await Assignment.findAll({where:{
            postedBy : req.user.name
        }});
        res.status(200).json(assignments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/g", async (req, res) => {
    try { 
        const assignments = await Assignment.findAll();
        res.status(200).json(assignments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// UPDATE Assignment
router.post("/u",roleMiddleware('faculty'), async (req, res) => {    
    try {
        console.log(req.body);

        // Separate `values` and `where` from request body
        const { values, where } = req.body;

        // Update operation
        const [rowsUpdated] = await Assignment.update(values, { where });

        // Check if any rows were updated
        if (rowsUpdated === 0) {
            return res.status(404).json({ message: "No matching record found to update" });
        }

        res.status(200).json({ message: "Update successful", rowsUpdated });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE Assignment
router.delete("/d",roleMiddleware('faculty'), async (req, res) => {
    try {
        const where = req.body;
        const del = await Assignment.destroy({ where });

        if (del === 0) {
            return res.status(404).json({ message: "No records found, check the entered query again" });
        }

        res.status(200).json({ message: "Deletion successful", del });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
