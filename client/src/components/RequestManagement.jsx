import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Toast } from './Toast';

const RequestManagement = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        status: '',
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
        fetchRequests();
    }, [filters]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page: filters.page,
                limit: filters.limit,
                ...(filters.search && { search: filters.search }),
                ...(filters.status && { status: filters.status })
            });

            const response = await fetch(`/admin/requests?${queryParams}`, {
                credentials: 'include'
            });

            const data = await response.json();

            if (data.success) {
                setRequests(data.requests);
                setPagination({
                    currentPage: data.currentPage,
                    totalPages: data.totalPages,
                    total: data.total
                });
            } else {
                showToast(data.message || 'Failed to fetch requests', 'error');
            }
        } catch (error) {
            console.error('Fetch requests error:', error);
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

    const handleStatusFilter = (status) => {
        setFilters(prev => ({
            ...prev,
            status: status === 'all' ? '' : status,
            page: 1
        }));
    };

    const markRequestCompleted = async (requestId) => {
        try {
            const response = await fetch(`/admin/requests/${requestId}/complete`, {
                method: 'PATCH',
                credentials: 'include'
            });

            const data = await response.json();

            if (data.success) {
                showToast('Request marked as completed', 'success');
                fetchRequests(); // Refresh the list
            } else {
                showToast(data.message || 'Failed to update request', 'error');
            }
        } catch (error) {
            console.error('Complete request error:', error);
            showToast('Network error. Please try again.', 'error');
        }
    };

    const deleteRequest = async (requestId, requestTitle) => {
        if (!window.confirm(`Are you sure you want to delete the request "${requestTitle}"? This action cannot be undone.`)) {
            return;
        }

        try {
            const response = await fetch(`/admin/requests/${requestId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            const data = await response.json();

            if (data.success) {
                showToast('Request deleted successfully', 'success');
                fetchRequests(); // Refresh the list
            } else {
                showToast(data.message || 'Failed to delete request', 'error');
            }
        } catch (error) {
            console.error('Delete request error:', error);
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

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(price);
    };

    if (loading && requests.length === 0) {
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
                    <CardTitle>Request Management</CardTitle>
                    <CardDescription>
                        Monitor and moderate user requests. All requests are automatically live when posted.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="flex-1">
                            <Input
                                placeholder="Search requests by title or description..."
                                value={filters.search}
                                onChange={handleSearch}
                                className="w-full"
                            />
                        </div>
                        <Select value={filters.status || "all"} onValueChange={handleStatusFilter}>
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                                <SelectItem value="accepted">Accepted</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Requests Grid */}
                    <div className="grid gap-4">
                        {requests.map((request) => (
                            <div key={request._id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-semibold text-lg text-gray-900">{request.title}</h3>
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                request.status === 'active' ? 'bg-green-100 text-green-800' :
                                                request.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {request.status}
                                            </span>
                                        </div>
                                        
                                        <p className="text-gray-600 mb-3 line-clamp-2">{request.description}</p>
                                        
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <span className="font-medium">Posted by:</span>
                                                {request.userId?.name} ({request.userId?.type})
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <span className="font-medium">Price:</span>
                                                <span className="font-semibold text-green-600">
                                                    {formatPrice(request.price)}
                                                </span>
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <span className="font-medium">Posted:</span>
                                                {formatDate(request.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-2 ml-4">
                                        {request.status === 'active' && (
                                            <Button
                                                onClick={() => markRequestCompleted(request._id)}
                                                variant="outline"
                                                size="sm"
                                                className="text-blue-600 border-blue-300 hover:bg-blue-50"
                                            >
                                                Mark Complete
                                            </Button>
                                        )}
                                        <Button
                                            onClick={() => deleteRequest(request._id, request.title)}
                                            variant="destructive"
                                            size="sm"
                                            className="text-white"
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {requests.length === 0 && !loading && (
                        <div className="text-center py-8">
                            <div className="text-gray-400 text-4xl mb-4">📋</div>
                            <p className="text-gray-500">No requests found</p>
                            <p className="text-sm text-gray-400 mt-1">
                                {filters.search || filters.status ? 'Try adjusting your filters' : 'Requests will appear here when users post them'}
                            </p>
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6">
                            <div className="text-sm text-gray-700">
                                Showing {((pagination.currentPage - 1) * filters.limit) + 1} to{' '}
                                {Math.min(pagination.currentPage * filters.limit, pagination.total)} of{' '}
                                {pagination.total} requests
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

export default RequestManagement;