const jwt = require('jsonwebtoken');
const adminModel = require('../models/admin-model');

// Middleware to verify admin token
const verifyAdminToken = async (req, res, next) => {
    try {
        // Check for token in cookies first (localhost)
        let token = req.cookies.adminToken;
        
        // If no cookie token, check Authorization header (production)
        if (!token) {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7);
            }
        }
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Access denied. No admin token provided.' 
            });
        }

        const decoded = jwt.verify(token, process.env.ADMIN_JWT_KEY || process.env.JWT_KEY);
        
        // Find admin in database
        const admin = await adminModel.findById(decoded.adminId).select('-password');
        
        if (!admin) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid admin token.' 
            });
        }

        if (!admin.isActive) {
            return res.status(401).json({ 
                success: false, 
                message: 'Admin account is disabled.' 
            });
        }

        req.admin = admin;
        next();
    } catch (error) {
        console.error('Admin token verification error:', error);
        return res.status(401).json({ 
            success: false, 
            message: 'Invalid admin token.' 
        });
    }
};

// Middleware to check specific permissions
const checkPermission = (permission) => {
    return (req, res, next) => {
        if (!req.admin) {
            return res.status(401).json({ 
                success: false, 
                message: 'Admin not authenticated.' 
            });
        }

        if (req.admin.role === 'super-admin') {
            return next(); // Super admin has all permissions
        }

        if (!req.admin.permissions[permission]) {
            return res.status(403).json({ 
                success: false, 
                message: 'Insufficient permissions.' 
            });
        }

        next();
    };
};

// Middleware to check if super admin
const requireSuperAdmin = (req, res, next) => {
    if (!req.admin) {
        return res.status(401).json({ 
            success: false, 
            message: 'Admin not authenticated.' 
        });
    }

    if (req.admin.role !== 'super-admin') {
        return res.status(403).json({ 
            success: false, 
            message: 'Super admin access required.' 
        });
    }

    next();
};

module.exports = {
    verifyAdminToken,
    checkPermission,
    requireSuperAdmin
};