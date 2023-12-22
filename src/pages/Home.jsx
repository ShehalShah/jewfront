import React from 'react';
import Navbar from '../components/Navbar';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useUser } from '../context/UserContext';
import { useNavigate, Link } from 'react-router-dom';

const Home = () => {
  const {user}=useUser()
  const navigate=useNavigate()
  const carouselImages = [
    'https://www.noreenlondon.com/cdn/shop/files/homepage_connection_3000x.jpg?v=1622040386',
    'https://www.astleyclarke.com/media/hero_banner/default/Desktop_Wrap_it_Up.jpg',
    'https://media.tiffany.com/is/image/tiffanydm/2023_GW-HP-FWMH-Desktop?$tile$&wid=2992&fmt=webp',
  ];

  const settings = {
    infinite: true,
    speed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
  };

  const categories = [
    {
      name: 'Rings',
      image: 'https://media.tiffany.com/is/image/tiffanydm/HOLIDAY-BG-2x2MktTile-Product-19?$tile$&wid=988&hei=988&fmt=webp',
    },
    {
      name: 'Earrings',
      image: 'https://kinclimg2.bluestone.com/f_webp,c_scale,w_1024,b_rgb:f0f0f0/giproduct/BIAR0130S17_YAA18DIG6XXXXXXXX_ABCD00-PICS-00004-1024-7088.png',
    },
    {
      name: 'Necklaces',
      image: 'https://kinclimg5.bluestone.com/f_webp,c_scale,w_1024,b_rgb:f0f0f0/giproduct/BIPM0042N05_YAA22XXXXXXXXXXXX_ABCD00-PICS-00003-1024-26095.png',
    },
  ];

  const products = [
    {
      id: '1',
      name: 'Product 1',
      photo: 'https://www.astleyclarke.com/media/catalog/product/4/2/42044ynon_2_4.jpg?optimize=low&fit=bounds&height=340&width=340&dpr=2',
      description: 'Description of Product 1.',
    },
    {
      id: '2',
      name: 'Product 2',
      photo: 'https://www.astleyclarke.com/media/catalog/product/5/7/57048ynoe_1.jpg?width=768&height=768&optimize=low&fit=bounds',
      description: 'Description of Product 2.',
    },
    {
      id: '3',
      name: 'Product 3',
      photo: 'https://www.astleyclarke.com/media/catalog/product/c/o/cosmos-mother-of-pearl-ring.jpg?width=768&height=768&optimize=low&fit=bounds',
      description: 'Description of Product 3.',
    },
    {
      id: '4',
      name: 'Product 4',
      photo: 'https://www.astleyclarke.com/media/catalog/product/5/4/54005ynocjr_1.jpg?width=768&height=768&optimize=low&fit=bounds',
      description: 'Description of Product 4.',
    },
  ];

  return (
    <div>
      <Navbar />
      <div className='w-screen px-10'>
        {/* Carousel Section */}
        <Slider {...settings} className="mx-auto w-full">
          {carouselImages.map((image, index) => (
            <div key={index}>
              <img src={image} alt={`Carousel ${index + 1}`} className="w-full h-auto object-cover max-h-[30rem]" />
            </div>
          ))}
        </Slider>
      </div>

      {/* Content Section */}
      <div className="container mx-auto mt-8">
        <div className="text-3xl font-bold mb-4">Welcome to Jewellery Store</div>
        <p className="text-lg">
          Explore our exquisite collection of handcrafted Jewellery , crafted with precision and passion.
        </p>
        {/* Categories Section */}
        <div className="mt-8">
          <div className="text-2xl font-bold mb-4">Shop by Category</div>
          <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <div key={index} className="bg-white p-4 shadow-md">
                <img src={category.image} alt={category.name} className="w-full h-auto mb-4" />
                <div className="text-lg font-bold">{category.name}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <div className="text-2xl font-bold mb-4">Featured Products</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
              <div key={product.id} className="bg-white p-4 cursor-pointer shadow-md hover:shadow-2xl" onClick={()=>{navigate(`/product`, {state:{ product: product }});}}>
                <img src={product.photo} alt={product.name} className="w-full h-auto mb-4" />
                <div className="text-lg font-bold">{product.name}</div>
                <p className="text-gray-700">{product.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <div className="text-2xl font-bold mb-4">Special Offers</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
              <div key={product.id} className="bg-white p-4 cursor-pointer shadow-md hover:shadow-2xl">
                <img src={product.photo} alt={product.name} className="w-full h-auto mb-4" />
                <div className="text-lg font-bold">{product.name}</div>
                <p className="text-gray-700">{product.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
