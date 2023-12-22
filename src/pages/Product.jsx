import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faCartPlus, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, Link,useLocation  } from 'react-router-dom';


const ProductPage = () => {
  const location=useLocation()
  const product=location.state?.product
  console.log(product);
  const [quantity, setQuantity] = useState(1);
  const [isWishlistSelected, setWishlistSelected] = useState(false);

  const handleQuantityChange = (value) => {
    // You can add validation if needed
    setQuantity(quantity + value);
  };

  const handleWishlistToggle = () => {
    setWishlistSelected(!isWishlistSelected);
  };

  const productImages = [
    'https://d2x02matzb08hy.cloudfront.net/img/accessory/hero_image/781216461/ACN030__4_.jpg',
    'https://d2x02matzb08hy.cloudfront.net/img/project_photo/image/10216461/33005/large_ACN035__3_.jpg',
    'https://d2x02matzb08hy.cloudfront.net/img/project_photo/image/10216461/49498/large_Untitled_design__56_.jpg',
  ];

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
          <h1 className="text-3xl font-bold mb-4">Exquisite Diamond Necklace</h1>
          <p className="text-lg text-gray-700 mb-4">
            Stunning diamond necklace crafted with precision and elegance. Perfect for any special occasion.
          </p>

          <div className="container mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-4">Additional Details</h2>
            <ul className="list-disc pl-6">
              <li className="text-lg text-gray-700">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </li>
              <li className="text-lg text-gray-700">
                Sed euismod justo eu felis bibendum, in lacinia dolor euismod.
              </li>
            </ul>
          </div>
          
          <div className="mb-4 w-full px-4 flex items-center justify-between border border-black py-2">
            <span className="text-xl font-bold text-black">$1,500.00</span>
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
              <FontAwesomeIcon icon={faCartPlus} className="mr-2" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
