import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/Navbar';
import rightSvg from './images/right.svg';
import { NavLink } from 'react-router-dom';
import Horizontal from '../components/Horizontal';
import Lenis from 'lenis';
import bulb from './images/bulb.svg';
import illustrate from './images/illustrate.png';
import community from './images/community.png';
import fastandreliabledelivery from './images/fast and reliable delivery.png';
import profile from './images/profile.png';
import sample from './video/sample.mp4';

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
    useGSAP(() => {
        // Card animations - simple fade and scale on scroll
        gsap.utils.toArray('.card').forEach((card) => {
            gsap.to(card, {
                scale: 0.8,
                opacity: 0,
                scrollTrigger: {
                    trigger: card,
                    start: 'top 20%',
                    end: 'bottom 20%',
                    scrub: true,
                }
            });
        });
        
        // Footer background change
        gsap.to('.footer, .navbar', {
            backgroundColor: 'black',
            color: 'white',
            scrollTrigger: {
                trigger: '.footer',
                start: 'top 10%',
                end: 'top 10%',
                scrub: 1,
            },
        });
    }, []);

    useEffect(() => {
        // Initialize Lenis smooth scrolling
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
        
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        
        const rafId = requestAnimationFrame(raf);
        
        // Particle mouse interaction
        const particles = document.querySelectorAll('.particle');
        
        const handleMouseMove = (event) => {
            const { clientX, clientY } = event;
            particles.forEach((particle) => {
                const rect = particle.getBoundingClientRect();
                const dx = (clientX - rect.left - rect.width / 2) * 0.02;
                const dy = (clientY - rect.top - rect.height / 2) * 0.02;
                gsap.to(particle, {
                    x: dx,
                    y: dy,
                    duration: 0.3,
                    ease: 'power2.out',
                });
            });
        };

        document.addEventListener('mousemove', handleMouseMove);
        
        // Refresh ScrollTrigger after everything is loaded
        const timer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 100);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(rafId);
            lenis.destroy();
            clearTimeout(timer);
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <>
            <main className="min-h-screen w-full">
                <Navbar className="navbar" />
                <header className="h-full md:p-[100px] p-5">
                    <div className="gap-y-3 flex flex-col w-full h-full py-20 relative z-[4]">
                        <div className="overflow-hidden text-center">
                            <h1 className="heading text-[50px] md:text-[140px] font-bold tracking-tighter md:leading-[120px] bg-gradient-to-r from-[#7c7c7f] to-[#2f2f33] inline-block text-transparent bg-clip-text">
                                Doorstep<span className="block">Convenience</span>
                            </h1>
                        </div>
                        <div className="overflow-hidden">
                            <h3 className="text-center text-[#5e5e63] subtext uppercase text-lg md:text-4xl">
                                With
                            </h3>
                        </div>
                        <div className="overflow-hidden text-center gap-2 flex flex-col items-center">
                            <NavLink to="/register">
                                <h3 className="heading font-semibold p-5 maintext py-2 text-black-1/2 w-max text-xl md:text-3xl lg:text-7xl cursor-pointer hover:underline transition ease-in-out delay-150 bg-red-400 rounded-lg">
                                    CampusKart
                                    <img
                                        src={rightSvg}
                                        alt="Right Arrow"
                                        className="animated-icon text-3xl ml-2 w-6 h-6 md:w-10 md:h-10 font-bold inline-block"
                                    />
                                </h3>
                            </NavLink>
                        </div>
                    </div>
                    <div className='absolute h-[60vh] w-[70vw] z-[3] top-[0px] left-[150px] m-32'>
                        <div className=' particle
                            bg-black opacity-[0.3] absolute w-[30px] h-[30px] rounded-[10px]
                            transform right-[232px] rotate-45 top-[10px]
                        '>
                        </div><div className=' particle
                            bg-black absolute opacity-[0.2] w-[20px] h-[20px] rounded-[5px]
                            transform right-[50px] top-[100px] rotate-45
                        '>
                        </div>
                        <div className='particle
                            bg-black absolute opacity-[0.1] w-[37px] h-[37px] rounded-[10px]
                            transform right-[130px] bottom-[290px] rotate-45
                        '>
                        </div>
                        <div className='particle
                            bg-black absolute opacity-[0.16] w-[40px] h-[40px] rounded-[10px]
                            transform left-[172px] rotate-[45deg]
                        '>
                        </div>
                        <div className='particle
                            bg-black absolute opacity-[0.3] w-[20px] h-[20px] rounded-[5px]
                            transform rotate-[70deg] left-[5px] top-[100px]
                        '>
                        </div>
                        <div className='particle
                            absolute bg-black opacity-[0.3] w-[45px] h-[45px] rounded-xl
                            transform left-[50px] bottom-[250px] rotate-45
                        '>
                        </div>
                    </div>
                </header>
                <section className="video h-[50vh] md:h-screen w-full p-5 md:p-[100px] flex justify-center items-center">
                    <div className="h-full w-full flex justify-center items-center rounded-[20px] md:rounded-[40px] shadow-2xl overflow-hidden">
                        <video
                            className="w-full h-full object-cover rounded-[20px] md:rounded-[40px]"
                            autoPlay
                            loop
                            muted
                            playsInline
                        >
                            <source src={sample} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </section>
                <Horizontal />
                <section className="w-full flex flex-col items-center justify-center gap-5 text-black p-5 md:p-20">
                    <div className="flex flex-col text-center gap-3 my-10">
                        <h1 className="text-red-400 text-xl md:text-2xl">Features</h1>
                        <p className="text-3xl md:text-6xl font-bold">
                            Our services streamline your <br />
                            existing delivery process
                        </p>
                    </div>
                    <article className="card h-auto md:h-[50vh] sticky top-[15vh] bg-[#f5f5f5] w-full md:w-[65vw] flex flex-col md:flex-row gap-5 rounded-[20px] p-5 md:p-10 shadow-sm">
                        <div className="w-full flex flex-col gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                                <img src={bulb} alt="" />
                            </div>
                            <h1 className="font-bold text-2xl md:text-4xl">Convenience and Efficiency</h1>
                            <h2 className="text-sm md:text-lg text-gray-500">
                                CampusKart will lead to a measurable increase in convenience and efficiency for hostellers in acquiring essential items. Hostellers are expected to experience a reduction in the time and effort spent obtaining necessities.
                            </h2>
                        </div>
                        <div className="w-full">
                            <div className="w-full h-full flex justify-center items-center">
                                <img src={illustrate} alt="" />
                            </div>
                        </div>
                    </article>
                    <article className="card h-auto md:h-[50vh] sticky top-[15vh] bg-[#f5f5f5] w-full md:w-[65vw] flex flex-col md:flex-row gap-5 rounded-[20px] p-5 md:p-10 shadow-sm">
                        <div className="w-full flex flex-col gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                                <img src={bulb} alt="" />
                            </div>
                            <h1 className="font-bold text-2xl md:text-4xl">Fast and Reliable</h1>
                            <h2 className="text-sm md:text-lg text-gray-500">
                                CampusKart prioritizes timely and efficient deliveries. Our platform uses advanced algorithms to optimize delivery routes and ensure orders are fulfilled promptly.
                            </h2>
                        </div>
                        <div className="w-full">
                            <div className="w-full h-full flex justify-center items-center">
                                <img src={fastandreliabledelivery} alt="" />
                            </div>
                        </div>
                    </article>
                    <article className="card h-auto md:h-[50vh] sticky top-[15vh] bg-[#f5f5f5] w-full md:w-[65vw] flex flex-col md:flex-row gap-5 rounded-[20px] p-5 md:p-10 shadow-sm">
                        <div className="w-full flex flex-col gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                                <img src={bulb} alt="" />
                            </div>
                            <h1 className="font-bold text-2xl md:text-4xl">Community Building</h1>
                            <h2 className="text-sm md:text-lg text-gray-500">
                                CampusKart will foster a sense of community and enhance social interaction between day scholars and hostellers. By facilitating interactions and cooperation through the delivery process, the platform is expected to promote a sense of belonging and mutual support within the university community.
                            </h2>
                        </div>
                        <div className="w-full">
                            <div className="w-full h-full flex justify-center items-center">
                                <img src={community} alt="" />
                            </div>
                        </div>
                    </article>
                </section>
                <section className="w-full min-h-screen p-5 md:p-20 flex flex-col gap-7">
                    <div className="text-center">
                        <h1 className="text-orange-500 uppercase text-lg md:text-xl">Feedbacks</h1>
                        <p className="text-3xl md:text-6xl font-bold">What our customers are saying</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 py-4 leading-10">
                        <div className="p-4 bg-[#f5f5f5] shadow-sm rounded-xl">
                            <div className="flex flex-col gap-3">
                                <div className="flex gap-4 items-center">
                                    <div className="flex h-12 w-12 items-center bg-gray-500 justify-center rounded-full">
                                        <img src={profile} alt="User 1" />
                                    </div>
                                    <h1 className="text-[20px] md:text-[25px] font-bold hover:underline cursor-pointer transition">
                                        Gurniaz
                                    </h1>
                                </div>
                                <div>
                                    <p className="text-gray-500 leading-7 text-sm md:text-base">
                                        "At first, I was a bit hesitant to use CampusKart. I wasn't sure if it would be reliable or if the delivery would take forever. But I was pleasantly surprised. The entire process was smooth, from placing the order to receiving the item. The delivery was quick, and the dayscholar was very polite. I'm now a regular user and have recommended CampusKart to all my friends."
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-[#f5f5f5] shadow-sm rounded-xl">
                            <div className="flex flex-col gap-3">
                                <div className="flex gap-4 items-center">
                                    <div className="flex h-12 w-12 items-center bg-gray-500 justify-center rounded-full">
                                        <img src={profile} alt="User 2" />
                                    </div>
                                    <h1 className="text-[20px] md:text-[25px] font-bold hover:underline cursor-pointer transition">
                                        Sarthak Sharma
                                    </h1>
                                </div>
                                <div>
                                    <p className="text-gray-500 leading-7 text-sm md:text-base">
                                        "CampusKart has been a lifesaver for me. Being able to order items directly from the app has been incredibly convenient. The dayscholars are always friendly and efficient. I'd definitely recommend CampusKart to any student living in a hostel."
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-[#f5f5f5] shadow-sm rounded-xl">
                            <div className="flex flex-col gap-3">
                                <div className="flex gap-4 items-center">
                                    <div className="flex h-12 w-12 items-center bg-gray-500 justify-center rounded-full">
                                        <img src={profile} alt="User 3" />
                                    </div>
                                    <h1 className="text-[20px] md:text-[25px] font-bold hover:underline cursor-pointer transition">
                                        Tanya Goyal
                                    </h1>
                                </div>
                                <div>
                                    <p className="text-gray-500 leading-7 text-sm md:text-base">
                                        "I love the technology behind CampusKart. The app is well-designed and user-friendly. The real-time tracking feature is especially helpful. I can see exactly where my order is and when it will arrive. The payment process is secure, and the overall experience is seamless. I'm impressed."
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-[#f5f5f5] shadow-sm rounded-xl">
                            <div className="flex flex-col gap-3">
                                <div className="flex gap-4 items-center">
                                    <div className="flex h-12 w-12 items-center bg-gray-500 justify-center rounded-full">
                                        <img src={profile} alt="User 4" />
                                    </div>
                                    <h1 className="text-[20px] md:text-[25px] font-bold hover:underline cursor-pointer transition">
                                        Shrishti Mahajan
                                    </h1>
                                </div>
                                <div>
                                    <p className="text-gray-500 leading-7 text-sm md:text-base">
                                        "With my hectic schedule, I often don't have time to go shopping for groceries or other essentials. CampusKart has been a game-changer. I can simply place an order from my phone and have everything delivered to my doorstep. It's so convenient and saves me a lot of time."
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-[#f5f5f5] shadow-sm rounded-xl">
                            <div className="flex flex-col gap-3">
                                <div className="flex gap-4 items-center">
                                    <div className="flex h-12 w-12 items-center bg-gray-500 justify-center rounded-full">
                                        <img src={profile} alt="User 5" />
                                    </div>
                                    <h1 className="text-[20px] md:text-[25px] font-bold hover:underline cursor-pointer transition">
                                        Harsh Duggal
                                    </h1>
                                </div>
                                <div>
                                    <p className="text-gray-500 leading-7 text-sm md:text-base">
                                        "I really appreciate how CampusKart helps connect hostellers and day scholars. It’s not just about deliveries—it’s also creating a sense of community. I’ve had seamless experiences so far, and the quick responses from day scholars have been impressive!"
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <footer className="footer w-full h-screen flex flex-col gap-2">
                    <div className="h-full flex flex-col text-center justify-center items-center font-bold leading-tight">
                        <p className="text-[30px] md:text-[70px]">
                            Cost-effective, reliable and used by <br /> hundreds of deliveries today
                        </p>
                        <button className="bg-red-400 text-white font-bold p-4 text-lg md:text-xl rounded-lg mt-5 hover:bg-red-400 transition ease-in-out delay-150">
                            <NavLink to="/contact">Contact us</NavLink>
                        </button>
                    </div>
                </footer>
            </main>
        </>
    );
};

export default Hero;
