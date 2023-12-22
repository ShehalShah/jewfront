import React, { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser, faShoppingCart, faSignOutAlt  } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { signOut } from 'firebase/auth';
import { auth, database } from '../firebaseConfig'; 

const Navbar = () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const { updateUser } = useUser();
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const nav = useNavigate()

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const quotes = [
        "Discover the beauty of our exquisite jewelry.",
        "Elegance that speaks volumes.",
        "Crafting memories, one piece at a time.",
        "Indulge in luxury, adorn yourself with elegance.",
    ];
    const settings = {
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3500,
        arrows: false,
    };

    return (
        <nav>
            <div className="bg-teal-300 p-2 text-center">
                <Slider {...settings} className="mx-auto max-w-lg">
                    {quotes.map((quote, index) => (
                        <div key={index} className="text-black">
                            <p>{quote}</p>
                        </div>
                    ))}
                </Slider>
            </div>

            <div className="bg-white p-4">
                <div className="lg:hidden">
                    <button onClick={toggleNavbar} className="text-black focus:outline-none">
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                        </svg>
                    </button>
                </div>
                <div className="flex justify-between items-center">
                    <div className="relative z-10">
                        <input
                            type="text"
                            placeholder="Search"
                            className="py-2 pl-8 pr-2 text-gray-600 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 w-64 font-medium hidden lg:block"
                        />
                        <FontAwesomeIcon
                            icon={faSearch}
                            className="w-4 absolute left-2 top-[55%] transform -translate-y-1/2 text-black lg:block"
                        />
                    </div>
                    <div className="text-black font-bold text-xl absolute inset-x-0 text-center cursor-pointer hover:underline" onClick={()=>{nav("/")}}>
                        Jewellery Store
                    </div>
                    <div className="flex gap-10">                        
                        <div
                            className="relative cursor-pointer flex items-center justify-center"
                            onMouseEnter={toggleDropdown}
                            onMouseLeave={toggleDropdown}
                            onClick={toggleDropdown}
                        >
                            <FontAwesomeIcon icon={faUser} className="text-black pb-2" />
                            {isDropdownOpen && (
                                !user?
                                <div className="absolute top-4  bg-white border border-gray-300 rounded-md z-20">
                                    <button className="block w-full hover:bg-gray-200 p-2" onClick={()=>nav("/login")}>
                                        Login
                                    </button>
                                    <button className='block w-full hover:bg-gray-200 p-2' onClick={()=>nav("/signup")}>Signup</button>
                                </div>:
                                <div className='absolute top-5  bg-white border border-gray-300 rounded-md z-20'>
                                 <div className="flex items-center p-2">
                                            <img
                                                src={user?.photoURL || 'https://cdn.iconscout.com/icon/free/png-256/free-user-1648810-1401302.png'}
                                                alt="User Avatar"
                                                className="w-8 h-8 rounded-full mr-2"
                                            />
                                            <div>
                                                <p className="font-bold">{user?.name}</p>
                                                <p className="text-gray-500">{user?.email}</p>
                                            </div>
                                        </div>
                                        <button className="block w-full hover:bg-gray-200 p-2" onClick={() => nav("/profile")}>
                                            Profile
                                        </button>
                                        <button className='block w-full hover:bg-gray-200 p-2' onClick={async() => {sessionStorage.removeItem("user"); await signOut(auth); updateUser(null);}}>
                                            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                                            Sign Out
                                        </button>
                                </div>
                            )}
                        </div>
                        <FontAwesomeIcon icon={faShoppingCart} className="text-black mr-4" />
                    </div>
                </div>
                <div className={`lg:flex mt-4 px-20 items-center justify-center gap-10 ${isOpen ? 'block' : 'hidden'}`}>
                    <a href="#" className="block mt-4 lg:inline-block lg:mt-0 text-black mr-4">
                        Rings
                    </a>
                    <a href="#" className="block mt-4 lg:inline-block lg:mt-0 text-black mr-4">
                        Earrings
                    </a>
                    <a href="#" className="block mt-4 lg:inline-block lg:mt-0 text-black mr-4">
                        Bangles
                    </a>
                    <a href="#" className="block mt-4 lg:inline-block lg:mt-0 text-black">
                        Solitaires
                    </a>
                    <a href="#" className="block mt-4 lg:inline-block lg:mt-0 text-black mr-4">
                        Mangalsutras
                    </a>
                    <a href="#" className="block mt-4 lg:inline-block lg:mt-0 text-black">
                        Necklaces
                    </a>
                    <a href="#" className="block mt-4 lg:inline-block lg:mt-0 text-black">
                        More
                    </a>
                    <a href="#" className="block mt-4 lg:inline-block lg:mt-0 text-black">
                        Gifting
                    </a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
