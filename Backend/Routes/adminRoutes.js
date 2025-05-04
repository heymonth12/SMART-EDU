import Admin from '../models/admin.js';
import express from 'express';

const router = express.Router();    

// CREATE admin
router.post('/create', async (req, res) => {
    try {
        const admin = await Admin.create(req.body);
        res.status(201).json({ status: 'success', message: 'Admin created', data: admin });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// READ all admins
router.get('/get', async (req, res) => {
    try {
        const admins = await Admin.findAll();
        res.status(200).json({ status: 'success', data: admins });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// UPDATE admin
router.post('/u', async (req, res) => {
    try {
        const { values, where } = req.body;

        if (!values || !where) {
            return res.status(400).json({ status: 'error', message: 'Invalid request. Provide values and where clause.' });
        }

        const [rowsUpdated] = await Admin.update(values, { where });

        if (rowsUpdated === 0) {
            return res.status(404).json({ status: 'error', message: 'No matching record found to update' });
        }

        res.status(200).json({ status: 'success', message: 'Update successful', rowsUpdated });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// DELETE admin
router.delete('/d', async (req, res) => {
    try {
        const where = req.body;

        if (!where) {
            return res.status(400).json({ status: 'error', message: 'Invalid request. Provide where clause.' });
        }

        const del = await Admin.destroy({ where });

        if (del === 0) {
            return res.status(404).json({ status: 'error', message: 'No matching record found to delete' });
        }

        res.status(200).json({ status: 'success', message: 'Deletion successful', rowsDeleted: del });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

export default router;
