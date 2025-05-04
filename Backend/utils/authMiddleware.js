// Middleware to verify JWT
import { vertoken } from './jwt.js';
import User from '../models/user.js';



export const authMiddleware = async (req, res, next) => {
    try {
        // console.log("hey i am at authmiddleware");
        // console.log("headers ",req.headers)
        const authHeader = req.headers.authorization;
        // console.log(authHeader)

        if (!authHeader) {
            return res.status(401).json({ status: 'error', message: 'Authorization header missing' });
        }
        const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"
        // console.log("this is token " , token)

        if (!token) {
            return res.status(401).json({ status: 'error', message: 'No token found' });
        }
        // Verify token
        const user = await vertoken(token);

        if (!user) {
            return res.status(401).json({ status: 'error', message: 'Invalid token' });
        }

        // Token is valid; attach user info to request
        req.user = user;
        const userDetail = await User.findByPk(req.user.id);
        req.user.name = userDetail.name;
        // console.log("user is ", userDetail.name)
        next();
    } catch (error) {
        return res.status(500).json({ status: 'error', message: 'Internal server error here is the error', error: error.message });
    }
};

export const roleMiddleware = (requiredRoles) => {
    return (req, res, next) => {
        const userRole = req.user.role; 
        // console.log("User Role:", userRole);
        
        if (!userRole || !requiredRoles.includes(userRole)) {
            return res.status(403).json({
                message: `Access denied. Only ${requiredRoles.join(" or ")} can access this route.`,
            });
        }
        next();
    };
};

