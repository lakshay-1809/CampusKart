const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('./models/user-model');
const adminModel = require('./models/admin-model');
const complaintModel = require('./models/complaint-model');
const { verifyAdminToken, checkPermission, requireSuperAdmin } = require('./middleware/admin-auth');
const saltRounds = 10;
const cookieParser = require('cookie-parser');
const cors = require("cors");
const requestModel = require('./models/request-model');
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URL, {
  serverSelectionTimeoutMS: 30000, // 30 seconds
  socketTimeoutMS: 45000, // 45 seconds
})
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

mongoose.connection.on("error", (err) => {
    console.error("Error connecting to MongoDB:", err);
});
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://campuskart1.netlify.app",
        "https://campuskart1.netlify.app/"
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// ===== ADMIN AUTHENTICATION ROUTES =====

// Admin Login - Secret route
app.post("/admin/auth/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "Username and password are required" 
            });
        }

        // Find admin by username or email
        const  admin = await adminModel.findOne({
            $or: [{ username: username }, { email: username }]
        });

        if (!admin) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid credentials" 
            });
        }

        if (!admin.isActive) {
            return res.status(401).json({ 
                success: false, 
                message: "Admin account is disabled" 
            });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid credentials" 
            });
        }

        // Update last login
        admin.lastLogin = new Date();
        await admin.save();

        // Generate JWT token
        const token = jwt.sign(
            { adminId: admin._id, username: admin.username, role: admin.role },
            process.env.ADMIN_JWT_KEY,
            { expiresIn: '24h' }
        );

        // Set secure cookie
        res.cookie('adminToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        res.json({
            success: true,
            message: "Login successful",
            admin: {
                id: admin._id,
                username: admin.username,
                email: admin.email,
                role: admin.role,
                permissions: admin.permissions,
                lastLogin: admin.lastLogin
            }
        });

    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ 
            success: false, 
            message: "Server error" 
        });
    }
});

// Admin Logout
app.post("/admin/auth/logout", verifyAdminToken, (req, res) => {
    res.clearCookie('adminToken');
    res.json({ 
        success: true, 
        message: "Logout successful" 
    });
});

// Verify Admin Token
app.get("/admin/auth/verify", verifyAdminToken, (req, res) => {
    res.json({
        success: true,
        admin: {
            id: req.admin._id,
            username: req.admin.username,
            email: req.admin.email,
            role: req.admin.role,
            permissions: req.admin.permissions,
            lastLogin: req.admin.lastLogin
        }
    });
});

// ===== ADMIN MANAGEMENT ROUTES =====

// Get Dashboard Stats
app.get("/admin/dashboard/stats", verifyAdminToken, checkPermission('viewAnalytics'), async (req, res) => {
    try {
        const [totalUsers, totalRequests, activeRequests, completedRequests, totalComplaints, activeUsers] = await Promise.all([
            userModel.countDocuments(),
            requestModel.countDocuments(),
            requestModel.countDocuments({ status: 'active' }),
            requestModel.countDocuments({ status: 'completed' }),
            complaintModel.countDocuments(),
            userModel.countDocuments({ isActive: true })
        ]);

        // Get recent activity
        const recentUsers = await userModel.find().sort({ createdAt: -1 }).limit(5).select('name email type createdAt');
        const recentRequests = await requestModel.find().sort({ createdAt: -1 }).limit(5).populate('userId', 'name email');

        res.json({
            success: true,
            stats: {
                totalUsers,
                totalRequests,
                activeRequests,
                completedRequests,
                totalComplaints,
                activeUsers,
                recentUsers,
                recentRequests
            }
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// ===== USER ROUTES =====

app.post("/api/register", async (req, res) => {
    try {
        const { name, email, password, type } = req.body;

        let user = await userModel.findOne({ email: email });
        if (user) return res.status(500).send("User already exists");

        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) {
                console.error("Error generating salt:", err);
                return res.status(500).send("Error generating salt");
            }
            bcrypt.hash(password, salt, async function (err, hash) {
                if (err) {
                    console.error("Error hashing password:", err);
                    return res.status(500).send("Error hashing password");
                }
                try {
                    const user = await userModel.create({
                        name,
                        email,
                        password: hash,
                        type
                    });
                    const token = jwt.sign({ email: email, userId: user._id }, process.env.JWT_KEY);
                    const isProduction = process.env.NODE_ENV === 'production';
                    
                    // Set cookie for same-domain requests (localhost)
                    if (!isProduction) {
                        res.cookie("token", token, { 
                            httpOnly: true, 
                            secure: false,
                            sameSite: 'lax',
                            maxAge: 24 * 60 * 60 * 1000
                        });
                    }
                    
                    // Always return token in response for cross-domain compatibility
                    res.send({ status: "ok", token: token });
                } catch (err) {
                    console.error("Error creating user:", err);
                    res.status(500).send("Error creating user");
                }
            });
        });
    } catch (err) {
        console.error("Error in registration:", err);
        res.status(500).send("Error in registration");
    }
});
app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await userModel.findOne({ email: email });
        if (!user) return res.status(500).send("User not found");

        // Check if user account is active
        if (!user.isActive) {
            return res.status(403).json({ 
                error: "Account has been blocked. Please contact support.",
                status: "blocked" 
            });
        }

        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                console.error("Error comparing passwords:", err);
                return res.status(500).send("Error comparing passwords");
            }
            if (result) {
                const token = jwt.sign({ email: user.email, userId: user._id }, process.env.JWT_KEY);
                const isProduction = process.env.NODE_ENV === 'production';
                
                // Set cookie for same-domain requests (localhost)
                if (!isProduction) {
                    res.cookie("token", token, { 
                        httpOnly: true, 
                        secure: false,
                        sameSite: 'lax',
                        maxAge: 24 * 60 * 60 * 1000
                    });
                }
                
                // Always return token in response for cross-domain compatibility
                res.json({ status: "success", user: token, token: token });
            } else {
                res.status(401).send("Invalid password");
            }
        });
    } catch (err) {
        console.error("Error in login:", err);
        res.status(500).send("Error in login");
    }
});
app.get("/api/logout", (req, res) => {
    res.clearCookie("token");
    res.send("Logged out");
});
app.get("/api/user", isloggedin, async (req, res) => {
    try {
        const user = await userModel.
            findById(req.user.userId)
            .populate("requests");
        if (!user) return res.status(404).send("User not found");
        res.json({
            name: user.name,
            email: user.email,
            type: user.type
        });
    } catch (error) {
        console.error(error);
    }
})
app.get("/api/requests", isloggedin, async (req, res) => {
    let user = await userModel.findById(req.user.userId);
    let requests = await requestModel.find({ userId: user._id });
    res.json(requests);
})
app.post("/api/requests", isloggedin, async (req, res) => {
    let user = await userModel.findById(req.user.userId);
    let { title, description, price } = req.body;

    let request = await requestModel.create({
        userId: user._id,
        title,
        description,
        price
    })
    user.requests.push(request._id);
    await user.save();
    res.send("Request created successfully");
})
app.get("/api/userexist", isloggedin, async (req, res) => {
    if (req.user.userId) {
        res.send({ status: "ok" });
    }
})
app.get("/api/allrequests", isloggedin, async (req, res) => {
    try {
        let requests = await requestModel.find().populate('userId');
        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get("/api/requests/:id", isloggedin, async (req, res) => {
    let request = await requestModel.findById(req.params.id).populate('userId');
    if (!request) {
        return res.status(404).send("Request not found");
    }
    request.status = "accepted";
    await request.save();
    res.json(request);
});
async function isloggedin(req, res, next) {
    // Check for token in cookies first (localhost)
    let token = req.cookies.token;
    
    // If no cookie token, check Authorization header (production)
    if (!token) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        }
    }
    
    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        const data = jwt.verify(token, process.env.JWT_KEY);
        
        // Check if user is active
        const user = await userModel.findById(data.userId);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        
        if (!user.isActive) {
            res.clearCookie("token");
            return res.status(403).json({ error: "Account has been blocked. Please contact support." });
        }
        
        req.user = data;
        next();
    } catch (error) {
        return res.status(400).json({ error: "Invalid token." });
    }
}

// ===== ADMIN USER MANAGEMENT ROUTES =====

// Get All Users
app.get("/admin/users", verifyAdminToken, checkPermission('manageUsers'), async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', type = '' } = req.query;
        
        let query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }
        if (type) {
            query.type = type;
        }

        const users = await userModel.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await userModel.countDocuments(query);

        res.json({
            success: true,
            users,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Block/Unblock User
app.patch("/admin/users/:userId/toggle-status", verifyAdminToken, checkPermission('manageUsers'), async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await userModel.findById(userId);
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.isActive = !user.isActive;
        await user.save();

        res.json({
            success: true,
            message: `User ${user.isActive ? 'unblocked' : 'blocked'} successfully`,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isActive: user.isActive
            }
        });
    } catch (error) {
        console.error('Toggle user status error:', error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Delete User
app.delete("/admin/users/:userId", verifyAdminToken, requireSuperAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await userModel.findByIdAndDelete(userId);
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Also delete related requests and complaints
        await requestModel.deleteMany({ userId: userId });
        await complaintModel.deleteMany({ reportedUser: userId });

        res.json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// ===== ADMIN REQUEST MANAGEMENT ROUTES =====

// Get All Requests
app.get("/admin/requests", verifyAdminToken, checkPermission('manageRequests'), async (req, res) => {
    try {
        const { page = 1, limit = 10, status = '', search = '' } = req.query;
        
        let query = {};
        if (status) {
            query.status = status;
        }
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const requests = await requestModel.find(query)
            .populate('userId', 'name email type')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await requestModel.countDocuments(query);

        res.json({
            success: true,
            requests,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error('Get requests error:', error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Mark Request as Completed
app.patch("/admin/requests/:requestId/complete", verifyAdminToken, checkPermission('manageRequests'), async (req, res) => {
    try {
        const { requestId } = req.params;
        const request = await requestModel.findByIdAndUpdate(
            requestId,
            { status: 'completed' },
            { new: true }
        ).populate('userId', 'name email');

        if (!request) {
            return res.status(404).json({ success: false, message: "Request not found" });
        }

        res.json({
            success: true,
            message: "Request marked as completed",
            request
        });
    } catch (error) {
        console.error('Complete request error:', error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Delete Request (for inappropriate content)
app.delete("/admin/requests/:requestId", verifyAdminToken, checkPermission('manageRequests'), async (req, res) => {
    try {
        const { requestId } = req.params;
        const request = await requestModel.findByIdAndDelete(requestId);

        if (!request) {
            return res.status(404).json({ success: false, message: "Request not found" });
        }

        res.json({
            success: true,
            message: "Request deleted successfully"
        });
    } catch (error) {
        console.error('Delete request error:', error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// ===== ADMIN COMPLAINT MANAGEMENT ROUTES =====

// Get All Complaints
app.get("/admin/complaints", verifyAdminToken, checkPermission('handleComplaints'), async (req, res) => {
    try {
        const { page = 1, limit = 10, status = '', type = '' } = req.query;
        
        let query = {};
        if (status) query.status = status;
        if (type) query.type = type;

        const complaints = await complaintModel.find(query)
            .populate('reportedBy', 'name email')
            .populate('reportedUser', 'name email')
            .populate('handledBy', 'username')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await complaintModel.countDocuments(query);

        res.json({
            success: true,
            complaints,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error('Get complaints error:', error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Update Complaint Status
app.patch("/admin/complaints/:complaintId", verifyAdminToken, checkPermission('handleComplaints'), async (req, res) => {
    try {
        const { complaintId } = req.params;
        const { status, adminResponse } = req.body;

        const updateData = { status, handledBy: req.admin._id };
        if (adminResponse) updateData.adminResponse = adminResponse;
        if (status === 'resolved') updateData.resolvedAt = new Date();

        const complaint = await complaintModel.findByIdAndUpdate(
            complaintId,
            updateData,
            { new: true }
        ).populate('reportedBy', 'name email').populate('reportedUser', 'name email');

        if (!complaint) {
            return res.status(404).json({ success: false, message: "Complaint not found" });
        }

        res.json({
            success: true,
            message: "Complaint updated successfully",
            complaint
        });
    } catch (error) {
        console.error('Update complaint error:', error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Create Default Admin (for initial setup)
app.post("/admin/setup", async (req, res) => {
    try {
        // Check if any admin exists
        const existingAdmin = await adminModel.findOne();
        if (existingAdmin) {
            return res.status(400).json({ 
                success: false, 
                message: "Admin already exists" 
            });
        }

        const { username, email, password } = req.body;
        
        if (!username || !email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "All fields are required" 
            });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        const admin = await adminModel.create({
            username,
            email,
            password: hashedPassword,
            role: 'super-admin',
            permissions: {
                manageUsers: true,
                manageRequests: true,
                handleComplaints: true,
                viewAnalytics: true,
                systemSettings: true
            }
        });

        res.json({
            success: true,
            message: "Super admin created successfully",
            admin: {
                id: admin._id,
                username: admin.username,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (error) {
        console.error('Admin setup error:', error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
