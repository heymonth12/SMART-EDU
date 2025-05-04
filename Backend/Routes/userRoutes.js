import User from '../models/user.js';
import Faculty from '../models/faculty.js';
import Student from '../models/student.js';
import Admin from '../models/admin.js';
import express from 'express';
import { gentoken } from '../utils/jwt.js';
import { authMiddleware } from '../utils/authMiddleware.js';
import { sendOTP } from '../utils/emailService.js';
import crypto from 'crypto';
import redis from 'redis';

const router = express.Router();
const redisClient = redis.createClient();
redisClient.connect();

const hashpassword = (password) => {
    const secret = process.env.PASSWORD_SECRET;
    if (!secret) {
        throw new Error('Server misconfiguration: Password secret is missing');
    }
    return crypto.createHmac('sha512', secret).update(password).digest('hex');
};

router.post('/register', async (req, res) => {  
    try {
        const { email, password, username } = req.body;

        const [faculty, student, admin] = await Promise.all([
            Faculty.findOne({ where: { email } }),
            Student.findOne({ where: { email } }),
            Admin.findOne({ where: { email } }),
        ]);

        let role = null;
        if (faculty) {
            role = 'faculty';
        } else if (student) {
            role = 'student';
        } else if (admin) {
            role = 'admin';
        } else {
            return res.status(403).json({
                status: 'error',
                message: 'Unauthorized: You are not registered in the organization',
            });
        }

        const hashedPassword = hashpassword(password);

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({
                status: 'error',
                message: 'User with this email already exists.',
            });
        }

        const newUser = await User.create({
            email,
            password: hashedPassword,
            name:username,
            role,
        });

        const token = gentoken({ id: newUser.id, role: newUser.role , mail:newUser.email });

        res.status(201).json({
            status: 'success',
            message: 'User registered successfully',
            data: {
                email: newUser.email,
                username: newUser.username,
                role: newUser.role,
                token:token,
            },
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
            error: error.message,
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'No user found or invalid credentials',
            });
        }

        const hp = hashpassword(password);

        const isMatch = crypto.timingSafeEqual(Buffer.from(hp), Buffer.from(user.password));
        if (!isMatch) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid password',
            });
        }

        const token = gentoken({ id: user.id, role: user.role , mail:user.email});
       

        res.status(200).json({
            status: 'success',
            message: 'Login successful!',
            data: {
                email: user.email,
                username: user.username,
                role: user.role,
            },
            token:token
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
            error: error.message,
        });
    }
});


router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found.' });
        }
           
        res.status(200).json({
            status: 'success',
            message: 'Profile fetched successfully!',
            data: {
                email: user.email,
                username: user.username,
                role: user.role,
            },
        });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
});

router.post('/fp', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found with this email' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);

        await redisClient.set(`otp:${email}`, otp, 'EX', 300);

        const sent = await sendOTP(email, otp);
        if (!sent) {
            return res.status(500).json({ message: 'Failed to send OTP. Please try again later.' });
        }

        return res.status(200).json({ message: 'OTP sent successfully to your email!' });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
            error: error.message,
        });
    }
});

router.post('/fp/verify', async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        const storedOtp = await redisClient.get(`otp:${email}`);


        if (!storedOtp) {
            return res.status(400).json({ message: 'OTP expired or invalid!' });
        }

        if (storedOtp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP!' });
        }

        const hashedPassword = hashpassword(newPassword);

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }

        user.password = hashedPassword;
        await user.save();

        await redisClient.del(email);
        res.status(200).json({ message: 'Password updated successfully!' });

    } catch (error) {
        res.status(500).json({ message: 'Something went wrong!' });
    }
});

export default router;
