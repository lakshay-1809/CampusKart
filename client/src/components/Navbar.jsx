import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
const Navbar = ({ className }) => {
    const [isloggedin, setIsloggedin] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);
    const handleLogout = async () => {
        try {
            // Clear token from localStorage
            localStorage.removeItem('authToken');
            
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/logout`, {
                method: "GET",
                credentials: "include",
            });
            
            setIsloggedin(false);
            alert("Logged out successfully!");
            window.location.href = "/";
        } catch (error) {
            console.error(error);
            // Still clear token and logout locally even if server request fails
            setIsloggedin(false);
            window.location.href = "/";
        }
    };
    useEffect(() => {
        const checkLogin = async () => {
            try {
                // Check if user has token in localStorage
                const token = localStorage.getItem('authToken');
                if (token) {
                    const headers = {
                        'Content-Type': 'application/json'
                    };
                    headers.Authorization = `Bearer ${token}`;
                    
                    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/user`, {
                        method: "GET",
                        credentials: "include",
                        headers: headers
                    });
                    
                    if (response.ok) {
                        setIsloggedin(true);
                    } else {
                        // Token is invalid, remove it
                        localStorage.removeItem('authToken');
                        setIsloggedin(false);
                    }
                } else {
                    setIsloggedin(false);
                }
                setAuthLoading(false);
            } catch (error) {
                console.error(error);
                setIsloggedin(false);
                setAuthLoading(false);
            }
        };
        checkLogin();
    }, [])

    return (
        <nav className={`fixed w-full m-auto p-5 flex justify-between items-center bg-white z-50 ${className}`}>
            <NavLink to='/'><div className='overflow-hidden'><h1 className='nav1 text-3xl font-bold leading-7 tracking-tighter shadow-2xl'>Campus <br /> Kart</h1></div></NavLink>
            <div className='flex font-bold gap-10 text-[17px] tracking-wider ml-[70px]'>
                <NavLink to='/dashboard' className='hover-underline-animation center'>Dashboard</NavLink> /
                <NavLink to='/About'className='hover-underline-animation center'>About</NavLink> /
                <NavLink to="/contact" className='hover-underline-animation center'>Contact</NavLink>
            </div>
            <div className='nav2 flex gap-2'>
                {authLoading ? (
                    <div className='px-7 py-3'>
                        {/* Empty space while loading to prevent layout shift */}
                    </div>
                ) : isloggedin ? (
                    <>
                        <img src="" alt="" />
                        <button
                            onClick={() => {
                                handleLogout();
                                notify();
                            }}
                            className='bg-[#f87171] rounded-[10px] border-black text-white px-7 py-3 font-bold transition ease-in-out delay-150 shadow-2xl hover:bg-[#e63946] focus:outline-none focus:ring-2 focus:ring-[#e63946]'>
                            Logout
                        </button>
                    </>
                ) : (<>
                    <NavLink to="/login">
                        <button
                            className='bg-white shadow-2xl border-[1px] rounded-[10px] border-black px-7 py-3 font-bold transition ease-in-out delay-150 hover:bg-[#f0f0f0] focus:outline-none focus:ring-2 focus:ring-[#304C6B]'>
                            Login
                        </button>
                    </NavLink>
                    <NavLink to="/register">
                        <button
                            className='bg-black shadow-2xl rounded-[10px] border-black text-white px-7 py-3 font-bold transition ease-in-out delay-150 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1d3557]'>
                            Register
                        </button>
                    </NavLink>
                </>)}
            </div>
        </nav >
    );
};

export default Navbar;
