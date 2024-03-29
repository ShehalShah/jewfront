import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser, faShoppingCart, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { signOut } from 'firebase/auth';
import { auth, database } from '../firebaseConfig';
import { doc, setDoc, getDoc, collection, updateDoc, onSnapshot } from "firebase/firestore";

const Navbar = () => {
    const { cat } = useParams();
    const user = JSON.parse(sessionStorage.getItem('user'));
    const { updateUser } = useUser();
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const nav = useNavigate()
    const [goldRate, setGoldRate] = useState(0);

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const fetchGoldRate = () => {
        try {
            const goldRateDocRef = doc(database, 'gold', 'rate');

            const unsubscribe = onSnapshot(goldRateDocRef, (goldRateDocSnapshot) => {
                if (goldRateDocSnapshot.exists()) {
                    setGoldRate(goldRateDocSnapshot.data().value);
                }
            });

            return () => unsubscribe();
        } catch (error) {
            console.error('Error fetching gold rate:', error.message);
        }
    };

    useEffect(() => {
        const unsubscribe = fetchGoldRate();

        return () => unsubscribe();
    }, []);

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

    const handleCartClick = () => {
        console.log("feh");
    }

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
                    <div className="text-black font-bold text-xl absolute inset-x-0 text-center cursor-pointer hover:underline" onClick={() => { nav("/") }}>
                        Jewellery Store
                    </div>
                    <div className="flex gap-10 z-10">
                        <div className='text-sm items-center justify-center lg:flex flex-col hidden'>
                            <span>Current Gold Rate:</span>
                            <span>{goldRate}</span>
                        </div>

                        <div
                            className="relative cursor-pointer flex items-center justify-center"
                            onMouseEnter={toggleDropdown}
                            onMouseLeave={toggleDropdown}
                            onClick={toggleDropdown}
                        >
                            <FontAwesomeIcon icon={faUser} className="text-black pb-2" />
                            {isDropdownOpen && (
                                !user ?
                                    <div className="absolute top-4  bg-white border border-gray-300 rounded-md z-20">
                                        <button className="block w-full hover:bg-gray-200 p-2" onClick={() => nav("/login")}>
                                            Login
                                        </button>
                                        <button className='block w-full hover:bg-gray-200 p-2' onClick={() => nav("/signup")}>Signup</button>
                                    </div> :
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
                                        {user.isAdmin && <button className="block w-full hover:bg-gray-200 p-2" onClick={() => nav("/admin")}>
                                            Admin
                                        </button>}
                                        <button className='block w-full hover:bg-gray-200 p-2' onClick={async () => { sessionStorage.removeItem("user"); await signOut(auth); updateUser(null); nav("/") }}>
                                            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                                            Sign Out
                                        </button>
                                    </div>
                            )}
                        </div>
                        <FontAwesomeIcon icon={faShoppingCart} className="text-black mr-4 lg:py-2" onClick={handleCartClick} />
                    </div>
                </div>
                <div className={`lg:flex mt-4 px-20 items-center justify-center gap-10 ${isOpen ? 'block' : 'hidden'}`}>
                    <Link to="/category/rings" className={`block mt-4 lg:inline-block lg:mt-0 ${cat === 'rings' ? 'text-teal-500 underline' : 'text-black'} mr-4`}>
                        Rings
                    </Link>
                    <Link to="/category/earrings" className={`block mt-4 lg:inline-block lg:mt-0 ${cat === 'earrings' ? 'text-teal-500 underline' : 'text-black'} mr-4`}>
                        Earrings
                    </Link>
                    <Link to="/category/bangles" className={`block mt-4 lg:inline-block lg:mt-0 ${cat === 'bangles' ? 'text-teal-500 underline' : 'text-black'} mr-4`}>
                        Bangles
                    </Link>
                    <Link to="/category/solitaires" className={`block mt-4 lg:inline-block lg:mt-0 ${cat === 'solitaires' ? 'text-teal-500 underline' : 'text-black'}`}>
                        Solitaires
                    </Link>
                    <Link to="/category/mangalsutras" className={`block mt-4 lg:inline-block lg:mt-0 ${cat === 'mangalsutras' ? 'text-teal-500 underline' : 'text-black'} mr-4`}>
                        Mangalsutras
                    </Link>
                    <Link to="/category/necklaces" className={`block mt-4 lg:inline-block lg:mt-0 ${cat === 'necklaces' ? 'text-teal-500 underline' : 'text-black'}`}>
                        Necklaces
                    </Link>
                    <Link to="/category/more" className={`block mt-4 lg:inline-block lg:mt-0 ${cat === 'more' ? 'text-teal-500 underline' : 'text-black'}`}>
                        More
                    </Link>
                    <Link to="/category/gifting" className={`block mt-4 lg:inline-block lg:mt-0 ${cat === 'gifting' ? 'text-teal-500 underline' : 'text-black'}`}>
                        Gifting
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
