import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faCartPlus, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, Link, useLocation, useParams } from 'react-router-dom';
import { collection, addDoc, doc, getDoc, arrayUnion, arrayRemove, updateDoc,onSnapshot } from 'firebase/firestore';
import { database, storage } from '../firebaseConfig';
import ReactImageMagnify from 'react-image-magnify';

const Product = () => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  console.log(user);
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [isWishlistSelected, setWishlistSelected] = useState(false);
  const [product, setProduct] = useState(null);
  const [selectedMake, setSelectedMake] = useState(product?.standardmake);
  const [selectedColor, setSelectedColor] = useState(product?.standardcolor);
  const [price, setprice] = useState(0);

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

          console.log({
            id: productDocSnapshot.id,
            ...productDocSnapshot.data(),
          });
          setSelectedMake(productDocSnapshot?.data()?.standardmake)
          setSelectedColor(productDocSnapshot?.data()?.standardcolor)
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

    console.log("heyfwebfbwjf");

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

  const productImages = product?.media || [];

  const carouselSettings = {
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  const renderWeightBreakdown = () => {
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Weight Breakdown</h2>
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between">
            <span>Diamond Weight:</span>
            <span>{product?.weight?.DiamondWeight} carats</span>
          </div>
          <div className="flex justify-between">
            <span>Gross Weight:</span>
            <span>{product?.weight?.GrossWeight} grams</span>
          </div>
          <div className="flex justify-between">
            <span>Solitaire Weight:</span>
            <span>{product?.weight?.SolitaireWeight} carats</span>
          </div>
          <div className="flex justify-between">
            <span>Stone Weight:</span>
            <span>{product?.weight?.StoneWeight} carats</span>
          </div>
          <div className="flex justify-between">
            <span>Net Weight:</span>
            <span>{product?.weight?.netWeight} grams</span>
          </div>
        </div>
      </div>

    );
  };

  const renderPriceBreakdown = () => {
    const [goldRates, setGoldRates] = useState({
      '24karat': 0,
      '22karat': 0,
      '18karat': 0,
      '14karat': 0,
    });
    const [diamondRates, setDiamondRates] = useState({
      ijsi: 60000,
      ghvssi: 90000,
    });
  
    const [stoneRate, setStoneRate] = useState(15000);
  
    const [solitaireRates, setSolitaireRates] = useState({
      upTo05ct: 100000,
      gt05ctLt1ct: 140000,
      gt1ct: 200000,
    });
    const makingCharges = product?.weight?.GrossWeight * product?.makingcharges;
    const diamondAmount = diamondRates.ijsi * product?.weight?.DiamondWeight;
    let solAmount = 0;
    if (product?.weight?.SolitaireWeight <= 0.7) {
      solAmount = product?.weight?.SolitaireWeight * solitaireRates.upTo05ct;
    } else if (product?.weight?.SolitaireWeight > 0.7 && product?.weight?.SolitaireWeight < 1) {
      solAmount = product?.weight?.SolitaireWeight * solitaireRates.gt05ctLt1ct;
    } else {
      solAmount = product?.weight?.SolitaireWeight * solitaireRates.gt1ct;
    }
    const goldPrice =
    product?.weight?.netWeight *
    (selectedMake === '14' ? goldRates['14karat']/10 : selectedMake === '18' ? goldRates['18karat']/10 : goldRates['22karat']/10);
    const stonePrice = product?.weight?.StoneWeight * stoneRate;

    const mrp = makingCharges + diamondAmount + solAmount + goldPrice + stonePrice;
    const discount = product?.discount ? parseFloat(product?.discount) : 0;
    const netMrp = mrp - discount;
    const gst = 0.03 * netMrp;
    const finalAmount = netMrp + gst;
    useEffect(() => {

      console.log(finalAmount);
      setprice(finalAmount)
    }, [product])

    const fetchRates = () => {
      try {
        const ratesDocRef = doc(database, 'gold', 'diamondAndStoneRates');
        const unsubscribe = onSnapshot(ratesDocRef, (ratesSnapshot) => {
          if (ratesSnapshot.exists()) {
            const ratesData = ratesSnapshot.data();
            setDiamondRates(ratesData.diamondRates);
            setStoneRate(ratesData.stoneRate);
            setSolitaireRates(ratesData.solitaireRates);
            setGoldRates(ratesData.goldRates || {
              '24karat': 0,
              '22karat': 0,
              '18karat': 0,
              '14karat': 0,
            });
          }
        });
        return unsubscribe;
      } catch (error) {
        console.error('Error fetching rates:', error.message);
      }
    };  
    
    useEffect(() => {
      const unsubscribe = fetchRates();
  
      return () => unsubscribe();
    }, []);

    return (
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Price Breakdown</h2>
        <div className="flex flex-col space-y-4">
          {makingCharges > 0 && (
            <div className="flex justify-between">
              <span>Total Making Charges:</span>
              <span>₹ {makingCharges}</span>
            </div>
          )}
          {diamondAmount > 0 && (
            <div className="flex justify-between">
              <span>Diamond Amount (IJSI):</span>
              <span>₹ {diamondAmount}</span>
            </div>
          )}
          {solAmount > 0 && (
            <div className="flex justify-between">
              <span>Solitaire Amount:</span>
              <span>₹ {solAmount}</span>
            </div>
          )}
          {mrp > 0 && (
            <div className="flex justify-between">
              <span>MRP:</span>
              <span>₹ {mrp}</span>
            </div>
          )}
          {discount > 0 && (
            <div className="flex justify-between">
              <span>Discount:</span>
              <span>₹ {discount}</span>
            </div>
          )}
          {netMrp > 0 && (
            <div className="flex justify-between">
              <span>Net MRP:</span>
              <span>₹ {netMrp}</span>
            </div>
          )}
          {gst > 0 && (
            <div className="flex justify-between">
              <span>GST (3%):</span>
              <span>₹ {gst?.toFixed(2)}</span>
            </div>
          )}
          {finalAmount > 0 && (
            <div className="flex justify-between">
              <span>Final Amount:</span>
              <span>₹ {finalAmount}</span>
            </div>
          )}
        </div>
      </div>

    );
  };

  const ProductDropdowns = () => {
    const [isMakeDropdownOpen, setIsMakeDropdownOpen] = useState(false);
    const [isColorDropdownOpen, setIsColorDropdownOpen] = useState(false);

    const toggleMakeDropdown = () => {
      setIsMakeDropdownOpen(!isMakeDropdownOpen);
      setIsColorDropdownOpen(false);
    };

    const toggleColorDropdown = () => {
      setIsColorDropdownOpen(!isColorDropdownOpen);
      setIsMakeDropdownOpen(false);
    };

    const handleMakeSelect = (make) => {
      setSelectedMake(make);
      setIsMakeDropdownOpen(false);
    };

    const handleColorSelect = (color) => {
      setSelectedColor(color);
      setIsColorDropdownOpen(false);
    };

    return (
      <div className="flex w-full relative">
        <div className="relative w-1/2">
          <label htmlFor="make">Select Make:</label>
          <div className="dropdown-container relative cursor-pointer">
            <button
              className={`border border-gray-200 w-40 p-2 rounded-lg hover:bg-teal-500 hover:text-white dropdown-header ${isMakeDropdownOpen ? 'active' : ''}`}
              onClick={toggleMakeDropdown}
            >
              {selectedMake === '14' && '14 Karat'}
              {selectedMake === '18' && '18 Karat'}
              {selectedMake === '22' && '22 Karat'}
            </button>
            {isMakeDropdownOpen && (
              <div className="dropdown-list absolute top-full left-0 bg-white shadow-md rounded-md mt-2 w-40">
                {product?.possiblemakes.map((make) => (
                  <div
                    key={make}
                    className={`dropdown-item py-2 px-4 ${selectedMake === make ? 'bg-gray-200' : ''}`}
                    onClick={() => handleMakeSelect(make)}
                  >
                    {make} Karat
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="relative w-1/2">
          <label htmlFor="color">Select Color:</label>
          <div className="dropdown-container relative cursor-pointer">
            <button
              className={`border border-gray-200 w-40 p-2 rounded-lg hover:bg-teal-500 hover:text-white  ${isColorDropdownOpen ? 'active' : ''}`}
              onClick={toggleColorDropdown}
            >
              {selectedColor === 'yellow' && 'Yellow'}
              {selectedColor === 'white' && 'White'}
              {selectedColor === 'rose' && 'Rose'}
            </button>
            {isColorDropdownOpen && (
              <div className="dropdown-list absolute top-full left-0 bg-white shadow-md rounded-md mt-2 w-40">
                {product?.possiblecolors.map((color) => (
                  <div
                    key={color}
                    className={`dropdown-item py-2 px-4 ${selectedColor === color ? 'bg-gray-200' : ''}`}
                    onClick={() => handleColorSelect(color)}
                  >
                    {color}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  return (
    <div>
      <Navbar />
      <div className="bg-gray-100 container mx-auto mt-8 flex flex-col lg:flex-row items-center justify-center ">
        <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
          <Slider {...carouselSettings} className="mx-auto w-full h-full">
            {productImages.map((image, index) => (
              <div key={index}>
                <ReactImageMagnify {...{
                  smallImage: {
                    alt: 'Wristwatch by Ted Baker London',
                    isFluidWidth: true,
                    src: image
                  },
                  largeImage: {
                    src: image,
                    width: 1200,
                    height: 1800
                  }
                }} />
              </div>
            ))}
          </Slider>
        </div>

        <div className="w-full lg:w-1/2 p-8 rounded-lg">
          <h1 className="text-3xl font-bold mb-4">{product?.name}</h1>
          <p className="text-lg text-gray-700 mb-4">
            {product?.description}
          </p>



          {ProductDropdowns()}

          <div className="m-4 w-full px-4 flex items-center justify-between border border-black py-2">
            <span className="text-xl font-bold text-black">₹ {price}</span>
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

          {renderWeightBreakdown()}

          {renderPriceBreakdown()}



          <div className="flex items-center space-x-4 w-full">
            <button
              className={`w-1/2 bg-teal-500 text-white px-6 py-2 rounded ${isWishlistSelected ? 'bg-red-500' : ''
                }`}
              onClick={handleWishlistToggle}
            >
              <FontAwesomeIcon icon={faHeart} className="mr-2" />
              {isWishlistSelected ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>
            <button className="w-1/2 bg-black text-white px-6 py-2 rounded" onClick={handleAddToCart} >
              <FontAwesomeIcon icon={faCartPlus} className="mr-2" />
              Add to Cart
            </button>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Category</h2>
            <div className="flex space-x-4">
              {product?.subcategory?.map((category, index) => (
                <span key={index} className="bg-gray-200 px-4 py-2 rounded">
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
