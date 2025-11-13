import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Toast } from '../components/Toast';
import UserManagement from '../components/UserManagement';
import RequestManagement from '../components/RequestManagement';

const AdminDashboard = () => {
    const [admin, setAdmin] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [activeTab, setActiveTab] = useState('dashboard');
    const navigate = useNavigate();

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    useEffect(() => {
        verifyAdmin();
        fetchDashboardStats();
    }, []);

    const verifyAdmin = async () => {
        try {
            const response = await fetch('/admin/auth/verify', {
                credentials: 'include'
            });
            
            const data = await response.json();
            
            if (data.success) {
                setAdmin(data.admin);
            } else {
                navigate('/admin/login');
            }
        } catch (error) {
            console.error('Verification error:', error);
            navigate('/admin/login');
        } finally {
            setLoading(false);
        }
    };

    const fetchDashboardStats = async () => {
        try {
            const response = await fetch('/admin/dashboard/stats', {
                credentials: 'include'
            });
            
            const data = await response.json();
            
            if (data.success) {
                setStats(data.stats);
            }
        } catch (error) {
            console.error('Stats fetch error:', error);
        }
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('/admin/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });
            
            if (response.ok) {
                showToast('Logged out successfully', 'success');
                setTimeout(() => navigate('/admin/login'), 1000);
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊', permission: 'viewAnalytics' },
        { id: 'users', label: 'User Management', icon: '👥', permission: 'manageUsers' },
        { id: 'requests', label: 'Request Management', icon: '📋', permission: 'manageRequests' },
        { id: 'complaints', label: 'Complaints', icon: '⚠️', permission: 'handleComplaints' }
    ];

    const StatCard = ({ title, value, description, icon, color = 'blue' }) => (
        <Card className={`border-l-4 border-l-${color}-500`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                    {title}
                </CardTitle>
                <div className="text-2xl">{icon}</div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-gray-900">{value}</div>
                <p className="text-xs text-gray-500 mt-1">{description}</p>
            </CardContent>
        </Card>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-semibold text-gray-900">
                                CampusKart Admin Panel
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">
                                Welcome, {admin?.username}
                            </span>
                            <Button
                                onClick={handleLogout}
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-300 hover:bg-red-50"
                            >
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex gap-8">
                    {/* Sidebar */}
                    <div className="w-64 bg-white rounded-lg shadow-sm p-6">
                        <nav className="space-y-2">
                            {menuItems.map((item) => {
                                if (admin?.permissions[item.permission] || admin?.role === 'super-admin') {
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => setActiveTab(item.id)}
                                            className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                                activeTab === item.id
                                                    ? 'bg-purple-100 text-purple-700'
                                                    : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                        >
                                            <span className="mr-3">{item.icon}</span>
                                            {item.label}
                                        </button>
                                    );
                                }
                                return null;
                            })}
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {activeTab === 'dashboard' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
                                    
                                    {stats && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                            <StatCard
                                                title="Total Users"
                                                value={stats.totalUsers}
                                                description="Registered users"
                                                icon="👥"
                                                color="blue"
                                            />
                                            <StatCard
                                                title="Active Users"
                                                value={stats.activeUsers}
                                                description="Currently active"
                                                icon="✅"
                                                color="green"
                                            />
                                            <StatCard
                                                title="Total Requests"
                                                value={stats.totalRequests}
                                                description="All time requests"
                                                icon="📋"
                                                color="yellow"
                                            />
                                            <StatCard
                                                title="Active Requests"
                                                value={stats.activeRequests}
                                                description="Currently active"
                                                icon="🔥"
                                                color="orange"
                                            />
                                        </div>
                                    )}

                                    {/* Recent Activity */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Recent Users</CardTitle>
                                                <CardDescription>Latest registered users</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-3">
                                                    {stats?.recentUsers?.map((user) => (
                                                        <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                                                            <div>
                                                                <p className="font-medium text-sm">{user.name}</p>
                                                                <p className="text-xs text-gray-500">{user.email}</p>
                                                            </div>
                                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                                {user.type}
                                                            </span>
                                                        </div>
                                                    )) || <p className="text-gray-500">No recent users</p>}
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Recent Requests</CardTitle>
                                                <CardDescription>Latest user requests</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-3">
                                                    {stats?.recentRequests?.map((request) => (
                                                        <div key={request._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                                                            <div>
                                                                <p className="font-medium text-sm">{request.title || 'Untitled Request'}</p>
                                                                <p className="text-xs text-gray-500">by {request.userId?.name}</p>
                                                            </div>
                                                            <span className={`text-xs px-2 py-1 rounded ${
                                                                request.status === 'active' ? 'bg-green-100 text-green-800' :
                                                                request.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                                                'bg-gray-100 text-gray-800'
                                                            }`}>
                                                                {request.status}
                                                            </span>
                                                        </div>
                                                    )) || <p className="text-gray-500">No recent requests</p>}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'users' && (
                            <UserManagement />
                        )}

                        {activeTab === 'requests' && (
                            <RequestManagement />
                        )}

                        {activeTab === 'complaints' && (
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Complaint Management</h2>
                                <p className="text-gray-600">Complaint management interface will be implemented here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ show: false, message: '', type: 'success' })}
                />
            )}
        </div>
    );
};

export default AdminDashboard;