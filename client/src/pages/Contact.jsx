import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from '@/components/Navbar';
import { Instagram } from "lucide-react";
import { Twitter } from "lucide-react";
import { Mail } from "lucide-react";

const App = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        emailjs.send(
            'service_mv3lt99',
            'template_3khmhzm',
            {
                from_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                message: formData.message,
            },
            'UHtIW7wbgKtaNBAHp'
        ).then((result) => {
            alert('Message sent successfully!');
        }).catch((error) => {
            console.error('Failed to send message:', error);
            alert('Failed to send the message, please try again.');
        });
    };

    return (
        <main className='w-full h-screen '>
            <Navbar className='top-0' />
            <div className='bg-[#f6f6f6] w-full h-full animate-fadeIn'>
                <div className='text-center mt-[95px] p-6'>
                    <p className='text-[40px] font-bold mt-8 hover:scale-105 transition-transform duration-300'>
                        Contact our team
                    </p>
                    <div className='w-2/4 mx-auto'>
                        <p>Got any questions about the product or scaling our platform? We're here to help. Chat to our friendly team 24/7 and get onboard in less than 5 minutes.</p>
                    </div>
                </div>
                <div className='flex justify-center items-center gap-10'>
                    <div className='bg-white p-10 rounded-xl border shadow'>
                        <form onSubmit={handleSubmit}>
                            <div className='flex gap-14'>
                                <div>
                                    <label htmlFor='first-name' className='font-semibold text-[0.9rem]'>First name <br /></label>
                                    <Input
                                        required
                                        type='text'
                                        id='first-name'
                                        name='firstName'
                                        placeholder='First name'
                                        className='border p-2 rounded-md h-[2rem] text-[0.8rem] focus:border-blue-500 transition-colors duration-300'
                                        value={formData.firstName}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor='last-name' className='font-semibold text-[0.9rem]'>Last name <br /></label>
                                    <Input
                                        required
                                        type='text'
                                        id='last-name'
                                        name='lastName'
                                        placeholder='Last name '
                                        className='border p-2 rounded-md h-[2rem] text-[0.8rem] focus:border-blue-500 transition-colors duration-300'
                                        value={formData.lastName}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <br />
                            <div className='flex flex-col gap-4'>
                                <div>
                                    <label htmlFor='email' className='text-[0.9rem] font-semibold relative bottom-2'>Email </label>
                                    <Input
                                        required
                                        type='email'
                                        id='email'
                                        name='email'
                                        placeholder='Enter your email '
                                        className='border p-2 rounded-md h-[2rem] text-[0.8rem] focus:border-blue-500 transition-colors duration-300'
                                        pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor='phone' className='relative bottom-2 text-[0.9rem] font-semibold'>Phone number</label>
                                    <Input
                                        required
                                        type='number'
                                        id='phone'
                                        name='phone'
                                        placeholder='Enter your phone number'
                                        className='border p-2 rounded-md h-[2rem] text-[0.8rem] focus:border-blue-500 transition-colors duration-300'
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor='message' className='relative bottom-3 text-[0.9rem] font-semibold'>Message</label>
                                    <Textarea
                                        required
                                        id='message'
                                        name='message'
                                        placeholder='Enter your message'
                                        className='border w-full h-[7rem] focus:border-blue-500 transition-colors duration-300'
                                        value={formData.message}
                                        onChange={handleChange}
                                    ></Textarea>
                                </div>
                                <Button
                                    type='submit'
                                    className='bg-black text-white text-[0.8rem] px-4 py-1 relative top-4 rounded hover:bg-gray-800 hover:scale-105 transition-all duration-300'
                                >
                                    Send Message
                                </Button>
                            </div>
                        </form>
                    </div>
                    <div>
                        <h1 className='text-3xl font-bold hover:scale-105 transition-transform duration-300'>Chat with us</h1>
                        <p className='text-gray-500 text-[0.9rem] my-4'>Speak to our friendly team via live chat</p>
                        <div className='text-[1rem] underline font-semibold my-[2rem]'>
                            <div className='flex gap-2'>
                                <Instagram />
                                <div className='cursor-pointer hover:scale-105 transition-transform duration-300'>Instagram</div>
                            </div>
                            <div className='flex gap-2'>
                                <Twitter />
                                <div className='cursor-pointer hover:scale-105 transition-transform duration-300'>Discord</div>
                            </div>
                            <div className='flex gap-2'>
                                <Mail />
                                <a href='mailto:delivereasee@gmail.com' className='cursor-pointer hover:scale-105 transition-transform duration-300'>CampusKart@gmail.com</a>
                            </div>


                        </div>
                        <div className='text-[1rem]  font-semibold my-[2rem] '>
                            <div className=''>Call Us</div>
                            <div className='text-gray-500'>Call our team</div>
                            <div className='underline'>
                                +90 123 456 789
                            </div>
                        </div>
                        <div className='text-[1rem]  font-semibold my-[2rem] '>
                            <div className=''>Visit Us</div>
                            <div className='underline'>
                                100 Rajpura Punjab near eagle chowk
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default App;
