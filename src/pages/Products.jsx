import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faCartPlus, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, Link, useLocation, useParams } from 'react-router-dom';
import { collection, addDoc, doc, getDoc,arrayUnion,arrayRemove,updateDoc } from 'firebase/firestore';
import { database, storage } from '../firebaseConfig';

const Product = () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    console.log(user);
    const { id } = useParams();
    const [quantity, setQuantity] = useState(1);
    const [isWishlistSelected, setWishlistSelected] = useState(false);
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const productDocRef = doc(database, 'products', id);

        const fetchProduct = async () => {
            try {
                const productDocSnapshot = await getDoc(productDocRef);

                if (productDocSnapshot.exists()) {
                    setProduct({
                        id: productDocSnapshot.id,
                        ...productDocSnapshot.data(),
                    });
                } else {
                    console.error('Product not found');
                }
            } catch (error) {
                console.error('Error fetching product:', error.message);
            }
        };
        fetchProduct();
    }, [id]);

    const handleWishlistToggle = async () => {
        setWishlistSelected(!isWishlistSelected);
        if (!user) {
          navigate('/login');
          return;
        }
    
        try {
          const userDocRef = doc(database, 'users', user.id);
    
          if (isWishlistSelected) {
            await updateDoc(userDocRef, {
              wishlist: arrayRemove(id),
            });
          } else {
            await updateDoc(userDocRef, {
              wishlist: arrayUnion(id),
            });
          }
    
          setWishlistSelected(!isWishlistSelected);
        } catch (error) {
          console.error('Error updating wishlist:', error.message);
        }
      };
    
      const handleAddToCart = async () => {
        if (!user) {
          navigate('/login');
          return;
        }
    
        try {
          const userDocRef = doc(database, 'users', user.id);
    
          await updateDoc(userDocRef, {
            cart: arrayUnion(id),
          });
        } catch (error) {
          console.error('Error adding to cart:', error.message);
        }
      };

    const handleQuantityChange = (value) => {
        setQuantity(quantity + value);
    };

    const productImages = product?.images || [];

    const carouselSettings = {
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true,
    };

    return (
        <div>
            <Navbar />
            <div className="bg-gray-100 container mx-auto mt-8 flex flex-col lg:flex-row items-center justify-center ">
                <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
                    <Slider {...carouselSettings} className="mx-auto w-full h-full">
                        {productImages.map((image, index) => (
                            <div key={index}>
                                <img
                                    src={image}
                                    alt={`Product ${index + 1}`}
                                    className="w-full h-auto max-h-[30rem] object-cover"
                                />
                            </div>
                        ))}
                    </Slider>
                </div>

                <div className="w-full lg:w-1/2 p-8 rounded-lg">
                    <h1 className="text-3xl font-bold mb-4">{product?.productName}</h1>
                    <p className="text-lg text-gray-700 mb-4">
                        {product?.description}
                    </p>

                    <div className="container mx-auto mt-8">
                        <h2 className="text-2xl font-bold mb-4">Additional Details</h2>
                        <ul className="list-disc pl-6">
                            {product?.additionalDetails?.map((message, index) => (
                                <li key={index} className="text-lg text-gray-700">
                                    {message}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mb-4 w-full px-4 flex items-center justify-between border border-black py-2">
                        <span className="text-xl font-bold text-black">₹ {product?.price}</span>
                        <div className="flex items-center">
                            <label htmlFor="quantity" className="mr-2">
                                Quantity:
                            </label>
                            <button
                                className="bg-teal-500 text-white px-1 h-8 rounded-l"
                                onClick={() => handleQuantityChange(-1)}
                            >
                                <FontAwesomeIcon icon={faMinus} />
                            </button>
                            <input
                                type="text"
                                id="quantity"
                                className="w-8 h-8 text-center border border-teal-500"
                                value={quantity}
                                readOnly
                            />
                            <button
                                className="bg-teal-500 text-white px-1 h-8 rounded-r"
                                onClick={() => handleQuantityChange(1)}
                            >
                                <FontAwesomeIcon icon={faPlus} />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 w-full">
                        <button
                            className={`w-1/2 bg-teal-500 text-white px-6 py-2 rounded ${isWishlistSelected ? 'bg-red-500' : ''
                                }`}
                            onClick={handleWishlistToggle}
                        >
                            <FontAwesomeIcon icon={faHeart} className="mr-2" />
                            {isWishlistSelected ? 'Remove from Wishlist' : 'Add to Wishlist'}
                        </button>
                        <button className="w-1/2 bg-black text-white px-6 py-2 rounded">
                            <FontAwesomeIcon icon={faCartPlus} className="mr-2" onClick={handleAddToCart}/>
                            Add to Cart
                        </button>
                    </div>

                    <div className="mt-8">
                        <h2 className="text-2xl font-bold mb-4">Category</h2>
                        <div className="flex space-x-4">
                            {product?.category?.map((category, index) => (
                                <span key={index} className="bg-gray-200 px-4 py-2 rounded">
                                    {category}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8">
                        <h2 className="text-2xl font-bold mb-4">Price Breakdown</h2>
                        <div className="flex flex-col space-y-4">
                            <div className="flex justify-between">
                                <span>Gold Weight:</span>
                                <span>{product?.priceBreakdown?.goldWeight}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Making Charges:</span>
                                <span>{product?.priceBreakdown?.makingCharges}</span>
                            </div>
                            {/* <div className="flex justify-between">
                                <span>Surplus Charges:</span>
                                <span>{product?.priceBreakdown?.surplusCharges}</span>
                            </div> */}
                            <div className="flex justify-between">
                                <span>Diamond Rate:</span>
                                <span>{product?.priceBreakdown?.diamondRate}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Discount:</span>
                                <span>{product?.priceBreakdown?.discount}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Product;
