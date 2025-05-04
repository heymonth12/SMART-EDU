import Faculty from '../models/faculty.js'
import express from 'express';

const router = express.Router();

// CREATE course
router.post('/create', async (req, res) => {
    try {
        const faculty = await Faculty.create(req.body);
        res.status(201).json({ status: 'success', message: 'Course created', data: faculty });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// READ courses
router.get('/get', async (req, res) => {
    try {
        const faculties = await Faculty.findAll();
        res.status(200).json({ status: 'success', data: faculties });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.get('/find', async (req, res) => {
    try {
        const mail = req.user.mail; // Extract email from req.user

        if (!mail) {
            return res.status(400).json({ status: 'error', message: 'Email not provided' });
        }

        const faculty = await Faculty.findOne({ where: { email: mail } });

        if (!faculty) {
            return res.status(404).json({ status: 'error', message: 'Faculty not found' });
        }

        res.status(200).json({ status: 'success', data: faculty });
    } catch (error) {
        console.error(error);
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

        const [rowsUpdated] = await Faculty.update(values, { where });

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

        const del = await Faculty.destroy({ where });

        if (del === 0) {
            return res.status(404).json({ status: 'error', message: 'No matching record found to delete' });
        }

        res.status(200).json({ status: 'success', message: 'Deletion successful', rowsDeleted: del });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

export default router;
