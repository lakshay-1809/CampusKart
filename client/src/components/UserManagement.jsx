import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Toast } from './Toast';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        type: '',
        page: 1,
        limit: 10
    });
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        total: 0
    });
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    useEffect(() => {
        fetchUsers();
    }, [filters]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page: filters.page,
                limit: filters.limit,
                ...(filters.search && { search: filters.search }),
                ...(filters.type && { type: filters.type })
            });

            const apiUrl = window.location.hostname === 'localhost' 
                ? `http://localhost:5000/admin/users?${queryParams}` 
                : `https://campuskart-1-vv50.onrender.com/admin/users?${queryParams}`;

            // Get token from localStorage for production
            const token = localStorage.getItem('adminToken');
            const headers = {
                'Content-Type': 'application/json'
            };

            if (token && window.location.hostname !== 'localhost') {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(apiUrl, {
                headers,
                credentials: 'include'
            });

            const data = await response.json();

            if (data.success) {
                setUsers(data.users);
                setPagination({
                    currentPage: data.currentPage,
                    totalPages: data.totalPages,
                    total: data.total
                });
            } else {
                showToast(data.message || 'Failed to fetch users', 'error');
            }
        } catch (error) {
            console.error('Fetch users error:', error);
            showToast('Network error. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setFilters(prev => ({
            ...prev,
            search: e.target.value,
            page: 1
        }));
    };

    const handleTypeFilter = (type) => {
        setFilters(prev => ({
            ...prev,
            type: type === 'all' ? '' : type,
            page: 1
        }));
    };

    const toggleUserStatus = async (userId, currentStatus) => {
        try {
            const apiUrl = window.location.hostname === 'localhost' 
                ? `http://localhost:5000/admin/users/${userId}/toggle-status` 
                : `https://campuskart-1-vv50.onrender.com/admin/users/${userId}/toggle-status`;

            // Get token from localStorage for production
            const token = localStorage.getItem('adminToken');
            const headers = {
                'Content-Type': 'application/json'
            };

            if (token && window.location.hostname !== 'localhost') {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(apiUrl, {
                method: 'PATCH',
                headers,
                credentials: 'include'
            });

            const data = await response.json();

            if (data.success) {
                showToast(data.message, 'success');
                fetchUsers(); // Refresh the list
            } else {
                showToast(data.message || 'Failed to update user status', 'error');
            }
        } catch (error) {
            console.error('Toggle user status error:', error);
            showToast('Network error. Please try again.', 'error');
        }
    };

    const deleteUser = async (userId, userName) => {
        if (!window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
            return;
        }

        try {
            const apiUrl = window.location.hostname === 'localhost' 
                ? `http://localhost:5000/admin/users/${userId}` 
                : `https://campuskart-1-vv50.onrender.com/admin/users/${userId}`;

            // Get token from localStorage for production
            const token = localStorage.getItem('adminToken');
            const headers = {
                'Content-Type': 'application/json'
            };

            if (token && window.location.hostname !== 'localhost') {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(apiUrl, {
                method: 'DELETE',
                headers,
                credentials: 'include'
            });

            const data = await response.json();

            if (data.success) {
                showToast(data.message, 'success');
                fetchUsers(); // Refresh the list
            } else {
                showToast(data.message || 'Failed to delete user', 'error');
            }
        } catch (error) {
            console.error('Delete user error:', error);
            showToast('Network error. Please try again.', 'error');
        }
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({
            ...prev,
            page: newPage
        }));
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading && users.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-4 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>
                        Manage all registered users, block/unblock accounts, and monitor user activity
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="flex-1">
                            <Input
                                placeholder="Search users by name or email..."
                                value={filters.search}
                                onChange={handleSearch}
                                className="w-full"
                            />
                        </div>
                        <Select value={filters.type || "all"} onValueChange={handleTypeFilter}>
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="Filter by type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="Hosteller">Hosteller</SelectItem>
                                <SelectItem value="Day Scholar">Day Scholar</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Users Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-3 font-medium text-gray-900">User</th>
                                    <th className="text-left p-3 font-medium text-gray-900">Type</th>
                                    <th className="text-left p-3 font-medium text-gray-900">Status</th>
                                    <th className="text-left p-3 font-medium text-gray-900">Joined</th>
                                    <th className="text-left p-3 font-medium text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user._id} className="border-b hover:bg-gray-50">
                                        <td className="p-3">
                                            <div>
                                                <div className="font-medium text-gray-900">{user.name}</div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                user.type === 'Hosteller' 
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-green-100 text-green-800'
                                            }`}>
                                                {user.type}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                user.isActive 
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {user.isActive ? 'Active' : 'Blocked'}
                                            </span>
                                        </td>
                                        <td className="p-3 text-sm text-gray-600">
                                            {formatDate(user.createdAt)}
                                        </td>
                                        <td className="p-3">
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={() => toggleUserStatus(user._id, user.isActive)}
                                                    variant={user.isActive ? "destructive" : "default"}
                                                    size="sm"
                                                    className="text-xs"
                                                >
                                                    {user.isActive ? 'Block' : 'Unblock'}
                                                </Button>
                                                <Button
                                                    onClick={() => deleteUser(user._id, user.name)}
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-xs text-red-600 border-red-300 hover:bg-red-50"
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {users.length === 0 && !loading && (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No users found</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6">
                            <div className="text-sm text-gray-700">
                                Showing {((pagination.currentPage - 1) * filters.limit) + 1} to{' '}
                                {Math.min(pagination.currentPage * filters.limit, pagination.total)} of{' '}
                                {pagination.total} users
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                                    disabled={pagination.currentPage === 1}
                                    variant="outline"
                                    size="sm"
                                >
                                    Previous
                                </Button>
                                <span className="flex items-center px-3 py-1 text-sm">
                                    Page {pagination.currentPage} of {pagination.totalPages}
                                </span>
                                <Button
                                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                                    disabled={pagination.currentPage === pagination.totalPages}
                                    variant="outline"
                                    size="sm"
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

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

export default UserManagement;