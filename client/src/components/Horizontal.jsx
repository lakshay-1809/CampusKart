import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import image from './images/image.png';
import login from './images/login.jpg';
import deliver from './images/deliver.jpg';
import order from './images/order.jpg';
const Horizontal = () => {
    const sectionRef = useRef(null);
    const triggerRef = useRef(null);

    gsap.registerPlugin(ScrollTrigger);
    useEffect(() => {
        const pin = gsap.fromTo(sectionRef.current, {
            translateX: 0
        }, {
            translateX: "-100vw",
            ease: "none",
            duration: 1,
            scrollTrigger: {
                trigger: triggerRef.current,
                start: "top top",
                end: "2000 top",
                scrub: 0.6,
                pin: true,
            }
        })

        return () => {
            pin.kill();
        }
    })

    return (
        <section className='scroll-section-outer'>
            <div ref={triggerRef}>
                <div ref={sectionRef} className='scroll-section-inner'>
                    <div className="scroll-section flex p-40">
                        <div className='w-full py-32 px-10 flex items-center justify-center'>
                            <img src={image} alt="pic here" className='
                            w-[800px] h-[600px] object-contain rounded-[20px]
                            '/>
                        </div>
                        <div className='w-full py-36 px-10'>
                            <p className='text-2xl text-red-400 uppercase'>About</p>
                            <p className='text-[50px] font-bold leading-[59px]'>CampusKart</p>
                            <p className='text-[25px] text-gray-500'>
                                CampusKart is a community based delivery platform that connects you with local delivery agents who can deliver your orders right to your doorstep. Our platform is designed to provide you with a convenient and hassle-free shopping experience.
                            </p>
                        </div>
                    </div>
                    <div className="scroll-section flex gap-6 p-44">
                        <div className='bg-[#f5f5f5] w-full rounded-3xl flex p-8'>
                            <div class="flex flex-col gap-6">
                                <div class="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                                    <span>1</span>
                                </div>
                                <div>
                                    <img class="object-contain" className='
                                    w-full h-[300px] object-cover object-center rounded-[20px]
                                    ' src={login} alt='img' />
                                </div>
                                <div>
                                    <p className='text-[20px] text-gray-500'>Create an account on our platform by providing your basic information. It's quick and easy!</p>
                                </div>
                            </div>
                        </div>
                        <div className='bg-[#f5f5f5] w-full rounded-3xl flex p-8'>
                            <div class="flex flex-col gap-6">
                                <div class="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                                    <span>2</span>
                                </div>
                                <div>
                                    <img class="object-contain" className='
                                    w-full h-[300px] object-cover object-center rounded-[20px]
                                    ' src={order} alt='img' />
                                </div>
                                <div>
                                    <p className='text-[20px] text-gray-500'>Browse through our wide range of products and select the items you need. Add them to your cart and proceed to checkout.</p>
                                </div>
                            </div>

                        </div>
                        <div className='bg-[#f5f5f5] w-full rounded-3xl flex p-8'>
                            <div class="flex flex-col gap-6">
                                <div class="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                                    <span>3</span>
                                </div>
                                <div>
                                    <img class="object-contain" className='
                                    w-full h-[300px] object-cover object-center rounded-[20px]
                                    '  src={deliver} alt='img' />
                                </div>
                                <div>
                                    <p className='text-[20px] text-gray-500'>Sit back and relax while our community-based delivery team brings your order right to your doorstep.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Horizontal
