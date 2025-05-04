import Course from '../models/course.js';
import express from 'express';
import { roleMiddleware} from '../utils/authMiddleware.js'

const router = express.Router();

// CREATE course
router.post('/create', async (req, res) => {
    try {
        const course = await Course.create(req.body);
        res.status(201).json({ status: 'success', message: 'Course created', data: course });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// READ courses
router.get('/get', async (req, res) => {
    try {
        const courses = await Course.findAll();
        res.status(200).json({ status: 'success', data: courses });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

//find particular
router.post('/find', async (req, res) => {
    try {
        const {where} = req.body;
        const courses = await Course.findAll({where});
        res.status(200).json({ status: 'success', data: courses });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// UPDATE course
router.post('/u', async (req, res) => {
    try {
        const { values, where } = req.body;

        if (!values || !where) {
            return res.status(400).json({ status: 'error', message: 'Invalid request. Provide values and where clause.' });
        }

        const [rowsUpdated] = await Course.update(values, { where });

        if (rowsUpdated === 0) {
            return res.status(404).json({ status: 'error', message: 'No matching record found to update' });
        }

        res.status(200).json({ status: 'success', message: 'Update successful', rowsUpdated });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// DELETE course
router.delete('/d', async (req, res) => {
    try {
        const where = req.body;

        // console.log('WHERE CLAUSE:', where);

        if (!where) {
            return res.status(400).json({ status: 'error', message: 'Invalid request. Provide where clause.' });
        }

        const del = await Course.destroy({ where });

        if (del === 0) {
            return res.status(404).json({ status: 'error', message: 'No matching record found to delete' });
        }

        res.status(200).json({ status: 'success', message: 'Deletion successful', rowsDeleted: del });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

export default router;
