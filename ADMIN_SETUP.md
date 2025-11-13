# CampusKart Admin Panel

A comprehensive admin panel for managing the CampusKart application. The admin panel provides secure access to manage users, requests, complaints, and monitor system activity.

## 🚀 Features

### Authentication & Security
- **Secure Admin Login**: Separate login route `/admin/login` that's not accessible to regular users
- **Role-based Access Control**: Super admin and regular admin roles with customizable permissions
- **JWT Authentication**: Secure token-based authentication with HTTP-only cookies
- **Session Management**: Automatic logout and session verification

### User Management
- **View All Users**: Paginated list of all registered users (Hostellers and Day Scholars)
- **Search & Filter**: Search users by name/email and filter by user type
- **Block/Unblock Users**: Disable or enable user accounts
- **Delete Users**: Permanently remove users and their associated data
- **User Activity Monitoring**: Track user registration and activity

### Request Management
- **View All Requests**: Monitor all user requests with filtering options
- **Mark as Completed**: Mark requests as completed when fulfilled
- **Delete Requests**: Remove inappropriate or spam requests
- **Auto-Live Requests**: All requests are automatically live when posted (no approval needed)
- **Request Analytics**: Track request patterns and statistics

### Complaint Management
- **Complaint System**: Handle user reports and complaints
- **Status Tracking**: Manage complaint status (pending, investigating, resolved)
- **Priority Levels**: Categorize complaints by priority
- **Admin Response**: Add admin responses to complaints

### System Monitoring
- **Dashboard Analytics**: Real-time statistics and metrics
- **User Statistics**: Total users, active users, registrations
- **Request Statistics**: Total requests, pending approvals
- **Recent Activity**: Latest users and requests

## 🛠️ Setup Instructions

### 1. Backend Setup

1. **Install Dependencies** (if not already done):
   ```bash
   cd server
   npm install
   ```

2. **Environment Configuration**:
   The `.env` file has been updated with admin-specific configurations:
   ```env
   DB_URL="your-mongodb-connection-string"
   JWT_KEY="your-jwt-secret"
   ADMIN_JWT_KEY="admin_secure_key_750db49813e0da2537d0387f7f9401_admin"
   NODE_ENV="development"
   ```

3. **Create First Admin Account**:
   Run the setup script to create the initial super admin:
   ```bash
   cd server
   node setup-admin.js
   ```
   
   This will create an admin with:
   - **Username**: `admin`
   - **Email**: `admin@campuskart.com`
   - **Password**: `admin123`
   - **Role**: `super-admin`

   ⚠️ **IMPORTANT**: Change the default password immediately after first login!

### 2. Frontend Setup

1. **Install Dependencies** (if not already done):
   ```bash
   cd client
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

### 3. Access Admin Panel

1. **Start the Backend Server**:
   ```bash
   cd server
   node index.js
   ```

2. **Access Admin Login**:
   Navigate to: `http://localhost:5173/admin/login`

3. **Login with Default Credentials**:
   - Username: `admin`
   - Password: `admin123`

## 📁 File Structure

### Backend Files Added/Modified:
```
server/
├── models/
│   ├── admin-model.js          # Admin user model
│   ├── complaint-model.js      # Complaint system model
│   ├── user-model.js          # Updated with isActive field
│   └── request-model.js       # Updated with admin fields
├── middleware/
│   └── admin-auth.js          # Admin authentication middleware
├── setup-admin.js             # Admin setup script
├── index.js                   # Updated with admin routes
└── .env                       # Updated with admin JWT key
```

### Frontend Files Added/Modified:
```
client/src/
├── pages/
│   ├── AdminLogin.jsx         # Admin login page
│   └── AdminDashboard.jsx     # Main admin dashboard
├── components/
│   └── UserManagement.jsx     # User management interface
└── App.jsx                    # Updated with admin routes
```

## 🔒 Security Features

1. **Hidden Routes**: Admin routes are not visible in normal navigation
2. **Secure Authentication**: JWT tokens with HTTP-only cookies
3. **Permission System**: Role-based access control
4. **Session Management**: Automatic logout and verification
5. **Input Validation**: Server-side validation for all admin actions

## 📊 API Endpoints

### Authentication
- `POST /admin/auth/login` - Admin login
- `POST /admin/auth/logout` - Admin logout
- `GET /admin/auth/verify` - Verify admin session

### User Management
- `GET /admin/users` - Get all users (with pagination)
- `PATCH /admin/users/:id/toggle-status` - Block/unblock user
- `DELETE /admin/users/:id` - Delete user

### Request Management
- `GET /admin/requests` - Get all requests
- `PATCH /admin/requests/:id/complete` - Mark request as completed
- `DELETE /admin/requests/:id` - Delete request

### Complaint Management
- `GET /admin/complaints` - Get all complaints
- `PATCH /admin/complaints/:id` - Update complaint

### Analytics
- `GET /admin/dashboard/stats` - Get dashboard statistics

## 🎨 UI Features

- **Modern Design**: Clean, professional interface with Tailwind CSS
- **Responsive Layout**: Works on desktop and mobile devices
- **Dark Theme Elements**: Professional admin aesthetics
- **Loading States**: Smooth loading indicators
- **Toast Notifications**: User feedback for all actions
- **Data Tables**: Sortable, searchable data tables
- **Pagination**: Efficient data pagination

## 🔧 Customization

### Adding New Admin Features:
1. Create new routes in `server/index.js`
2. Add middleware protection with `verifyAdminToken`
3. Use permission checks with `checkPermission('permissionName')`
4. Create frontend components and integrate with dashboard

### Managing Permissions:
Edit the admin model's permissions object to add new permission types:
```javascript
permissions: {
    manageUsers: Boolean,
    manageRequests: Boolean,
    handleComplaints: Boolean,
    viewAnalytics: Boolean,
    systemSettings: Boolean,
    // Add new permissions here
}
```

## 🚨 Production Considerations

1. **Change Default Credentials**: Immediately change admin password
2. **Secure Environment Variables**: Use strong, unique JWT secrets
3. **HTTPS**: Use HTTPS in production for secure cookie transmission
4. **Rate Limiting**: Implement rate limiting for admin routes
5. **Logging**: Add comprehensive logging for admin actions
6. **Backup**: Regular database backups
7. **Monitoring**: Set up monitoring for admin activities

## 🆘 Troubleshooting

### Common Issues:

1. **Cannot Access Admin Panel**:
   - Ensure backend server is running
   - Check if admin account is created (`node setup-admin.js`)
   - Verify correct URL: `/admin/login`

2. **Login Failed**:
   - Check database connection
   - Verify admin credentials
   - Check browser console for errors

3. **Permission Denied**:
   - Verify admin role and permissions
   - Check middleware configuration
   - Ensure JWT tokens are valid

## 📞 Support

For any issues or questions regarding the admin panel, please check:
1. Console errors in browser developer tools
2. Server logs for backend errors
3. Database connection status
4. Environment variable configuration

---

**Note**: This admin panel is designed for authorized personnel only. Unauthorized access attempts are logged and monitored.