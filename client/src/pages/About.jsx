import React, { useEffect, useState } from 'react';
import Navbar from "@/components/Navbar"
import top2 from './images/about us page.png';
// import top from './images/aboutustop.jpg';
import Lakshay from './images/lakshay.jpg';
import Moksh from './images/Moksh.png';
import Nimish from './images/Nimish.jpg';
import Nimarpreet from './images/Nimarpreet.jpg';

const AboutUs = () => {

    return (
        <>
            <Navbar />
            <div className='w-full min-h-screen '>

                <div className="flex justify-between gap-10 items-center bg-[#f5f5f5] px-[150px] py-[70px]">
                    <div className='flex flex-col w-full gap-10'>
                        <div>
                            <h1 className={'text-6xl font-bold'}>
                                About CampusKart
                            </h1>
                        </div>
                        <div>
                            <h1 className='text-2xl text-justify mt text-gray-500'>
                                <span>We are CampusKart, a platform designed for the students, by the students.</span>
                                Our team is dedicated to connecting students on campus and empowering them with a seamless delivery experience. By linking hostellers who need essential items with day scholars who can deliver them, we make campus life a little easier and more connected.
                            </h1>
                        </div>
                    </div>
                    <div className='w-full ml-10'>
                        <img
                            src={top2}
                            className="w-[600px]"
                        />
                    </div>
                </div>
                <br />
                <div className="mb-32 px-[150px] py-[70px]">
                    <h2
                        className={'text-6xl font-bold text- m-3 mb-10'}
                    >
                        Meet the Team
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-16">

                        {/* Lakshay */}
                        <div className="bg-gray-50 p-8 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transform transition-all duration-300 hover:rotate-2 h-96">
                            <img
                                src={Lakshay}
                                alt="Lakshay Aggarwal "
                                className="w-56 h-56 rounded-full mx-auto mb-6"
                            />
                            <h3 className="text-2xl font-semibold text-gray-800">Lakshay Aggarwal </h3>
                            <p className="text-gray-500">Developer</p>
                        </div>

                        {/* Nimish */}
                        <div className="bg-gray-50 p-8 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transform transition-all duration-300 hover:rotate-2 h-96">
                            <img
                                src={Nimish}
                                alt="Nimish Kochher"
                                className="w-56 h-56 rounded-full mx-auto mb-6"
                            />
                            <h3 className="text-2xl font-semibold text-gray-800">Nimish Kochhar</h3>
                            <p className="text-gray-500">Developer</p>
                        </div>

                        {/* Moksh */}
                        <div className="bg-gray-50 p-8 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transform transition-all duration-300 hover:rotate-2 h-96">
                            <img
                                src={Moksh}
                                alt="Moksh Thukral"
                                className="w-56 h-56 rounded-full mx-auto mb-6"
                            />
                            <h3 className="text-2xl font-semibold text-gray-800">Moksh Thukral</h3>
                            <p className="text-gray-500">Developer</p>
                        </div>

                        {/* Nimarpreet */}
                        <div className="bg-gray-50 p-8 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transform transition-all duration-300 hover:rotate-2 h-96" >
                            <img
                                src={Nimarpreet}
                                alt="Nimarpreet"
                                className="w-56 h-56 rounded-full mx-auto mb-6"
                            />
                            <h3 className="text-2xl font-semibold text-gray-800">Nimarpreet</h3>
                            <p className="text-gray-500">Developer</p>
                        </div>
                    </div>
                </div>
                <div className='bg-[#f5f5f5] border-x-2 rounded-xl mx-[150px]'>
                    <div className="p-6">
                        <div className='m-4 text-center '>
                            <h2
                                className={'font-bold text-black mb-8 text-4xl'}
                            >
                                What is CampusKart?
                            </h2>
                            <p
                                className={'text-gray-500 ml-2 text-2xl leading-10'}
                            >
                                CampusKart is a web platform designed to bridge the gap between hostellers and day scholars at university campuses. It allows hostellers to request products that are unavailable on campus, and day scholars can accept these requests to deliver the items. This not only helps hostellers get the products they need but also provides day scholars with an opportunity to earn extra money. We are dedicated to providing an efficient and reliable service.
                            </p>
                        </div>
                    </div>
                    <hr className='border-2 border-gray-200 w-2/3 m-auto' />
                    <div className="mt-10 px-40 py-10">
                        <h2
                            className={'text-black text-3xl text-center font-bold'}
                        >
                            Why Choose CampusKart?
                        </h2>

                        <div className="flex text-xl justify-between gap-10 m-7 text-gray-500">
                            <p className='w-1/4 h-24 mt-auto'>✔ Quick and easy access to products unavailable on campus.</p>
                            <p className='w-1/4 h-24 '>✔ Efficient deliveries within campus, saving a lot of time.</p>
                            <p className='w-1/4 h-24 '> ✔ Opportunity for day scholars to earn extra money </p>
                            <p className='w-1/4 h-24 '>✔ Simple user interface for both hostellers and day scholars.</p>
                        </div>
                    </div>
                </div>
                {/* Values Section */}
                <div className='w-full h-[50vh] my-20 '>
                    <div className="values text-center w-full h-40 mb-12 mt-10 ">
                        <blockquote className="text-3xl italic text-gray-500 w-2/3 mx-auto">
                            "CampusKart truly values a supportive campus community. We work hard to make a difference in students' lives, and at the end of the day, everyone can focus on their studies and social life."
                        </blockquote>
                    </div>
                    <div className='m-5 flex justify-center flex-col gap-5'>
                        <h1 className='text-5xl text-gray-700 mx-auto'>
                            Let's get started on something great together!
                        </h1>
                        <button className='bg-black text-white rounded-lg hover:bg-black text-xl p-5 mx-auto hover:scale-95'>
                            Contact us now
                        </button>
                    </div>
                </div>

            </div >
        </>
    );
};

export default AboutUs;
