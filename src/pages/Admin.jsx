import React, { useState,useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useUser } from '../context/UserContext';
import { useNavigate, Link } from 'react-router-dom';
import { database } from '../firebaseConfig';
import { doc, setDoc, getDoc, collection,updateDoc,onSnapshot } from "firebase/firestore";

const Admin = () => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  const [activeTab, setActiveTab] = useState('profile'); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [goldRate, setGoldRate] = useState(0);
  const nav = useNavigate()

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'editPrices', label: 'Edit Prices' },
    { id: 'editGoldRate', label: 'Edit Gold Rate' },
    { id: 'manageOrders', label: 'Manage Orders' },
    { id: 'analytics', label: 'Analytics' },
  ];

  useEffect(() => {
    if (user && !user.isAdmin) {
      nav('/');
    }
  }, [user]);

  const fetchGoldRate = () => {
    try {
      const goldRateDocRef = doc(database, 'gold', 'rate');
  
      const unsubscribe = onSnapshot(goldRateDocRef, (goldRateDocSnapshot) => {
        if (goldRateDocSnapshot.exists()) {
          setGoldRate(goldRateDocSnapshot.data().value);
        }
      });
  
      // Return the unsubscribe function to stop listening when component unmounts
      return () => unsubscribe();
    } catch (error) {
      console.error('Error fetching gold rate:', error.message);
    }
  };

  const updateGoldRate = async (newRate) => {
    try {
      const goldRateDocRef = doc(database, 'gold', 'rate');
      await setDoc(goldRateDocRef, { value: newRate });
      setGoldRate(newRate);
    } catch (error) {
      console.error('Error updating gold rate:', error.message);
    }
  };

  useEffect(() => {
    // Fetch gold rate and subscribe to real-time updates on component mount
    const unsubscribe = fetchGoldRate();
  
    // Unsubscribe when component unmounts
    return () => unsubscribe();
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'editPrices':
        return (
          <div>
            <p>Edit product prices here</p>
          </div>
        );
      case 'editGoldRate':
        return (
            <div>
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2">Edit Gold Rate</h2>
              <p className="mb-2">Current Gold Rate: ${goldRate}</p>
              <div className="flex items-center">
                <input
                  type="number"
                  placeholder="Enter new gold rate"
                  value={goldRate}
                  onChange={(e) => setGoldRate(e.target.value)}
                  className="mr-2 p-2 border border-gray-300 rounded"
                />
                <button
                  onClick={() => updateGoldRate(goldRate)}
                  className="bg-teal-500 text-white p-2 rounded hover:bg-teal-600 cursor-pointer"
                >
                  Update Gold Rate
                </button>
              </div>
            </div>
          </div>
        );
      case 'manageOrders':
        return (
          <div>
            <p>Manage order status here</p>
          </div>
        );
      case 'analytics':
        return (
          <div>
            <p>View business analytics here</p>
          </div>
        );
      default:
        return (
          <div>
            {user ? (
              <>
                <div>
                  <span className="font-bold">Name:</span> {user?.name}
                </div>
                <div>
                  <span className="font-bold">Email:</span> {user?.email}
                </div>
              </>
            ) : (
              <div>Please sign in to view your profile information.</div>
            )}
          </div>
        );
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto mt-8">
        <div className="lg:hidden mb-4">
          <div className="bg-white p-4 shadow-md">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">Admin Panel</div>
              <div
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="cursor-pointer p-2 rounded-md bg-teal-300 hover:bg-gray-100"
              >
                Menu
              </div>
            </div>
            {isDropdownOpen && (
              <div className="mt-2">
                {tabs.map(tab => (
                  <div
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsDropdownOpen(false);
                    }}
                    className="cursor-pointer p-2 mb-2 rounded-md hover:bg-gray-100"
                  >
                    {tab.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/4 pr-4 hidden lg:block">
            <div className="bg-white p-4 shadow-md mb-4 lg:mb-0">
              <div className="text-2xl font-bold mb-4">Admin Panel</div>
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

          <div className="w-full lg:w-3/4 pl-4">
            <div className="bg-white p-4 shadow-md">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;