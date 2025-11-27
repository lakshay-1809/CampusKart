import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from '@/components/ui/textarea';
function DialogDemo() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: ''
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    const postRequest = async (e) => {
        e.preventDefault();
        
        const token = localStorage.getItem('authToken');
        const headers = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }
        
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/requests`, {
            method: 'POST',
            headers: headers,
            credentials: 'include',
            body: JSON.stringify(formData),
        });
        
        if (response.ok) {
            alert('Request submitted successfully');
            location.reload();
        } else {
            alert('Failed to submit request');
        }
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-black rounded-full px-6 py-8 text-4xl">+</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Make your request</DialogTitle>
                </DialogHeader>
                <form onSubmit={postRequest}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">
                                Title
                            </Label>
                            <Input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="price" className="text-right">
                                Price
                            </Label>
                            <Input
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className="col-span-3"
                                type="number"
                            />
                        </div>
                    </div>
                    <Button type="submit" >Submit</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
const Dashboard = () => {
    const [userData, setUserData] = useState(null);
    const [requests, setRequests] = useState([]);
    const [allrequests, setAllRequests] = useState([]);
    const [acceptedBy, setAcceptedBy] = useState("");
    const [loading, setLoading] = useState(true);
    async function orderAccept(id) {
        try {
            const token = localStorage.getItem('authToken');
            const headers = {
                'Content-Type': 'application/json'
            };
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/requests/${id}/accept`, {
                method: 'POST',
                credentials: 'include',
                headers: headers
            });

            const data = await response.json();

            if (data.success) {
                // Update local state to immediately reflect the change
                setAllRequests(prevRequests => 
                    prevRequests.map(request => 
                        request._id === id 
                            ? { ...request, status: 'accepted', acceptedBy: userData }
                            : request
                    )
                );
                alert('Request accepted successfully!');
            } else {
                alert(data.error || 'Failed to accept request');
            }
        } catch (error) {
            console.error('Error accepting request:', error);
            alert('Error accepting request');
        }
    }
    useEffect(() => {
        async function fetchUserData() {
            try {
                console.log("Fetching user data...");
                
                // Get token from localStorage for cross-domain requests
                const token = localStorage.getItem('authToken');
                const headers = {
                    'Content-Type': 'application/json'
                };
                if (token) {
                    headers.Authorization = `Bearer ${token}`;
                }
                
                const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/user`, {
                    method: "GET",
                    credentials: "include",
                    headers: headers
                });
                
                console.log("User data response status:", response.status);
                
                if (response.status === 403) {
                    const errorData = await response.json();
                    console.log("Account blocked:", errorData);
                    alert(errorData.error || "Your account has been blocked.");
                    window.location.href = "/login";
                    return;
                }
                
                if (!response.ok) {
                    console.error(`User data fetch failed with status: ${response.status}`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log("User data received:", data);
                setUserData(data);
                setLoading(false);
            } catch (error) {
                console.error("There was an error fetching the user data:", error);
                setLoading(false);
                alert("Failed to load dashboard. Redirecting to login.");
                window.location.href = "/login";
            }
        }
        async function getRequest() {
            try {
                const token = localStorage.getItem('authToken');
                const headers = {
                    'Content-Type': 'application/json'
                };
                if (token) {
                    headers.Authorization = `Bearer ${token}`;
                }
                
                const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/requests`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: headers
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setRequests(Array.isArray(data) ? data : []);
                } else {
                    console.error('Failed to fetch requests:', response.status);
                    setRequests([]);
                }
            } catch (error) {
                console.error('Error fetching requests:', error);
                setRequests([]);
            }
        }
        async function allRequests() {
            try {
                const token = localStorage.getItem('authToken');
                const headers = {
                    'Content-Type': 'application/json'
                };
                if (token) {
                    headers.Authorization = `Bearer ${token}`;
                }
                
                const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/allrequests`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: headers
                });
                
                if (response.ok) {
                    const data = await response.json();
                    console.log('All requests data:', data);
                    setAllRequests(Array.isArray(data) ? data : []);
                } else {
                    console.error('Failed to fetch all requests:', response.status);
                    setAllRequests([]);
                }
            } catch (error) {
                console.error('Error fetching all requests:', error);
                setAllRequests([]);
            }
        }

        fetchUserData();
        getRequest();
        allRequests();
    }, []);

    if (loading) {
        return <div className='flex justify-center items-center min-h-screen'>
            <div className='text-xl'>Loading...</div>
        </div>;
    }

    if (!userData) {
        window.location.href = "/login";
        return null;
    }

    return (
        <div className='min-h-screen w-full'>
            <Navbar />
            <div className='min-h-[300px] p-[100px]  bg-[#f6f6f6] border shadow'>
                <h1 className='text-[30px] md:text-[60px] tracking-tight font-bold mt-10'>Welcome {userData.name}</h1>
                {userData.type === "dayScholar" ? (
                    <h2 className='text-[20px] md:text-[30px] text-gray-400 font-bold tracking-tight'>Day Scholar</h2>
                ) : (
                    <h2 className='text-[20px] md:text-[30px] text-gray-400 font-bold tracking-tight'>Hosteller</h2>
                )}
                <button className='bg-black my-5 shadow-2xl rounded-[10px] border-black text-white px-7 py-3 font-bold transition ease-in-out delay-150 hover:bg-[#1d3557] focus:outline-none focus:ring-2 focus:ring-[#1d3557]'>See Profile</button>
            </div>
            {/* <hr class="my-12 w-3/4 m-auto h-0.5 border-t-0 bg-neutral-200 dark:bg-white/10" /> */}
            <div className='min-h-full m-5 md:m-20 p-6'>
                <h1 className='font-bold text-3xl md:text-5xl my-5'>{userData.type === "dayScholar" ? "Active" : "Your"} Orders</h1>
                {userData.type === "dayScholar" ? (
                    <div className="flex flex-wrap gap-5">
                        {allrequests.length === 0 ? (
                            <div className="w-full text-center py-10">
                                <p className="text-gray-500 text-lg">No active requests available at the moment.</p>
                            </div>
                        ) : (
                            (allrequests || [])
                                .filter(request => request.status !== "accepted") // Filter out accepted requests
                                .slice().reverse().map((request) => (
                                    <div key={request._id} className="flex flex-wrap gap-5">
                                        <div className="min-w-[200px] md:min-w-[300px] min-h-[200px] p-6 bg-[#eceff1] border border-black-100 rounded-xl shadow hover:shadow-2xl transition duration-300 ease-in-out transform  hover:scale-[1.06] hover:bg-white
                                        ">
                                            <h5 className="mb-2 text-xl md:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{request.title}</h5>
                                            <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">Requested by: {request.userId?.name || 'Unknown'}</p>
                                            <p className="mb-3 font-normal text-gray-600 dark:text-gray-400">{request.description}</p>
                                            <h1 className='my-5 font-bold text-xl md:text-2xl'>₹ {request.price} </h1>
                                            <button href="#" className="bg-green-500 rounded-[10px] border-black text-white px-7 py-3 font-bold transition ease-in-out delay-150 shadow-2xl hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                                                onClick={() => orderAccept(request._id)}>
                                                Accept
                                            </button>
                                        </div>
                                    </div>
                                ))
                        )}
                    </div>
                ) : (
                    <>
                        <div className='text-3xl fixed flex text-white w-16 bottom-0 m-10 right-0 h-16 justify-center items-center rounded-full'>
                            <DialogDemo />
                        </div>
                        <div className="flex flex-wrap gap-5">
                            {
                                (requests || []).slice().reverse().map((request) => {
                                    return (
                                        <div key={request._id} className="flex flex-wrap gap-5">
                                            <div className="min-w-[200px] md:min-w-[300px] min-h-[200px] p-6 bg-white border border-black-100 rounded-xl shadow hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-1 hover:bg-[#f2faff] hover:border-[#1d3557]">
                                                <h5 className="mb-2 text-xl md:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{request.title}</h5>
                                                <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">Accepted by: {request.acceptedBy?.name || 'Not accepted yet'}</p>
                                                <p className="mb-3 font-normal text-gray-600 dark:text-gray-400">{request.description}</p>
                                                <h1 className='my-5 font-bold text-xl md:text-2xl'>₹ {request.price} </h1>
                                                <button href="#" className={`${request.status === "accepted" ? "bg-green-600" : "bg-gray-500"} rounded-[10px] border-black text-white px-7 py-3 font-bold transition ease-in-out delay-150 shadow-2xl`}>
                                                    {request.status}
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </>

                )}
            </div>
        </div>
    );
};
export default Dashboard;
