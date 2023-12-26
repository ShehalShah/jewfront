import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useUser } from '../context/UserContext';
import { collection, addDoc, doc, getDoc, arrayUnion, arrayRemove, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { database, storage } from '../firebaseConfig';

const Profile = () => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  const [activeTab, setActiveTab] = useState('profile');
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'cart', label: 'Cart' },
    { id: 'wishlist', label: 'Wishlist' },
    { id: 'orders', label: 'Orders' },
  ];

  // const cartItems = [
  //   { id: 1, name: 'Product C', price: 30, image: 'product_c_image.jpg', date: '2023-01-15' },
  //   { id: 2, name: 'Product D', price: 45, image: 'product_d_image.jpg', date: '2023-02-20' },
  // ];

  const orderHistory = [
    { id: 12345, status: 'Shipped', date: '2023-01-10', items: [{ name: 'Product A', price: 50, image: 'product_a_image.jpg' }] },
    { id: 67890, status: 'Delivered', date: '2023-02-15', items: [{ name: 'Product B', price: 75, image: 'product_b_image.jpg' }] },
  ];

  // const wishlistItems = [
  //   { id: 101, name: 'Product X', price: 60, image: 'product_x_image.jpg' },
  //   { id: 102, name: 'Product Y', price: 80, image: 'product_y_image.jpg' },
  // ];

  useEffect(() => {
    const fetchCartAndWishlist = async () => {
      if (user) {
        try {
          // Fetch cart items
          const cartItemDocs = await Promise.all(user.cart.map(async productId => {
            const productDocRef = doc(database, 'products', productId);
            const productDocSnapshot = await getDoc(productDocRef);
            return { id: productDocSnapshot.id, ...productDocSnapshot.data() };
          }));
          setCartItems(cartItemDocs)
          const total = cartItemDocs.reduce((acc, item) => acc + parseFloat(item.price), 0);
          setTotalPrice(total);

          // Fetch wishlist items
          const wishlistItemDocs = await Promise.all(user.wishlist.map(async productId => {
            const productDocRef = doc(database, 'products', productId);
            const productDocSnapshot = await getDoc(productDocRef);
            return { id: productDocSnapshot.id, ...productDocSnapshot.data() };
          }));
          setWishlistItems(wishlistItemDocs);
        } catch (error) {
          console.error('Error fetching cart and wishlist:', error.message);
        }
      }
    };

    fetchCartAndWishlist();
  }, [user]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'cart':
        return (
          <div className="container mx-auto mt-8">
            <div className="bg-white p-4 shadow-md">
              <div className="text-2xl font-bold mb-4">My Cart</div>
              {cartItems.map(item => (
                <div key={item.id} className="mb-4 flex items-center">
                  <img src={item.images[0]} alt={item.productName} className="w-16 h-16 object-cover rounded-md mr-4" />
                  <div>
                    <div className="text-lg font-bold">{item.productName}</div>
                    <div className="text-gray-700">${item.price}</div>
                    <div className="text-gray-500">Product ID: {item.id}</div>
                  </div>
                </div>
              ))}
              <div className="text-xl font-bold mt-4">Total Price: ${totalPrice?.toFixed(2)}</div>
              <button
                className="bg-teal-500 text-white px-6 py-2 rounded mt-4"
              >
                Place Order
              </button>
            </div>
          </div>
        );

      case 'orders':
        return (
          <div>
            <div className="text-2xl font-bold mb-2">Order History</div>
            {orderHistory.map(order => (
              <div key={order.id} className="mb-4">
                <div className="flex items-center mb-2">
                  <div className="text-lg font-bold">Order #{order.id}</div>
                  <div className="text-gray-500 ml-auto">{order.status}</div>
                </div>
                <div className="text-gray-500">Placed on {order.date}</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {order.items.map(item => (
                    <div key={item.name} className="flex items-center mt-4">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md mr-4" />
                      <div>
                        <div className="text-lg font-bold">{item.name}</div>
                        <div className="text-gray-700">${item.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case 'wishlist':
        return (
          <div>
            <div className="text-2xl font-bold mb-2">My Wishlist</div>
            {wishlistItems.map(item => (
              <div key={item.id} className="mb-4 flex items-center border-b pb-4">
                <img src={item.images[0]} alt={item.productName} className="w-16 h-16 object-cover rounded-md mr-4" />
                <div className="flex-1">
                  <div className="text-lg font-bold">{item.productName}</div>
                  <div className="text-gray-700">${item.price}</div>
                  <button className="bg-teal-500 text-white px-4 py-1 rounded mt-2">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return (
          <div className="bg-white p-6 shadow-md rounded-md">
            <div className="text-3xl font-bold mb-4">User Information</div>
            {user ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <span className="font-bold block text-lg mb-2">Name:</span>
                  <p className="text-gray-800">{user?.name}</p>
                </div>
                <div className="mb-4">
                  <span className="font-bold block text-lg mb-2">Email:</span>
                  <p className="text-gray-800">{user?.email}</p>
                </div>
                <div className="mb-4">
                  <span className="font-bold block text-lg mb-2">Phone Number:</span>
                  <p className="text-gray-800">{user?.phoneNumber}</p>
                </div>
              </div>
            ) : (
              <div className="text-gray-700">Please sign in to view your profile information.</div>
            )}
          </div>


        );
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto mt-8">
        <div className="lg:flex">
          {/* Tabs Section */}
          <div className="lg:w-1/4 pr-4 lg:mb-0 mb-4">
            <div className="bg-white p-4 shadow-md mb-4">
              <div className="text-2xl font-bold mb-4">Tabs</div>
              {tabs.map(tab => (
                <div
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`cursor-pointer p-2 mb-2 rounded-md ${activeTab === tab.id ? 'bg-teal-300' : 'hover:bg-gray-100'}`}
                >
                  {tab.label}
                </div>
              ))}
            </div>
          </div>

          {/* Content Section */}
          <div className="lg:w-3/4 pl-4">
            <div className="bg-white p-4 shadow-md">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
