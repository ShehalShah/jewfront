import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { database, storage } from '../firebaseConfig';
import { doc, setDoc, getDoc, onSnapshot, collection, addDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import AddProduct from '../components/AddProduct';
import Papa from 'papaparse';
import { ref, uploadBytes, getDownloadURL, list } from 'firebase/storage';

const Admin = () => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  const [activeTab, setActiveTab] = useState('profile');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [goldRate, setGoldRate] = useState(0);
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
  const [fileData, setFileData] = useState(null);
  const [mediaFiles, setMediaFiles] = useState(null);
  const nav = useNavigate();

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'addProduct', label: 'Add Product' },
    { id: 'editPrices', label: 'Edit Prices' },
    { id: 'editGoldRate', label: 'Edit Gold Rate' },
    { id: 'manageOrders', label: 'Manage Orders' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'uploadFile', label: 'Upload File' },
  ];

  useEffect(() => {
    if (!user || !user.isAdmin) {
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
    const unsubscribe = fetchGoldRate();

    return () => unsubscribe();
  }, []);

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
  
  const updateRates = async () => {
    try {
      const ratesDocRef = doc(database, 'gold', 'diamondAndStoneRates');
      await setDoc(ratesDocRef, {
        diamondRates,
        stoneRate,
        solitaireRates,
        goldRates, 
      });
      console.log('Rates updated successfully!');
    } catch (error) {
      console.error('Error updating rates:', error.message);
    }
  };
  
  useEffect(() => {
    const unsubscribe = fetchRates();

    return () => unsubscribe();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileData(file);
  };

  const processDataForFirebase = (data) => {
    return data.map((item) => {
      const {
        "Product ID": ProductID,
        Name,
        Category,
        "Sub Category": SubCategory,
        Description,
        "Standard Make": StandardMake,
        "possible makes": possibleMakes,
        "Standard Color of Metal": StandardColor,
        "Possible makes": possibleColors,
        "disocunt narration": discountNarration,
        discount,
        "Gross Weight": GrossWeight,
        "Diamond Weight": DiamondWeight,
        "Solitaire Weight": SolitaireWeight,
        "Stone Weight": StoneWeight,
        "Making Charges Per Gm": MakingChargesPerGm,
      } = item;

      const netWeight =
        parseFloat(GrossWeight) - 0.2 * (parseFloat(DiamondWeight) + parseFloat(SolitaireWeight) + parseFloat(StoneWeight));

      return {
        productID: ProductID,
        name: Name,
        category: Category,
        subcategory: SubCategory.split(',').map((subcategory) => subcategory.trim().toLowerCase()),
        description: Description,
        standardmake: StandardMake.substring(0, 2),
        possiblemakes: possibleMakes.split(',').map((make) => make.trim()),
        standardcolor: StandardColor,
        possiblecolors: possibleColors.split(',').map((color) => color.trim()),
        discountnarration: discountNarration,
        discount: parseFloat(discount.replace(/,/g, '')) || 0,
        weight: {
          GrossWeight: parseFloat(GrossWeight),
          DiamondWeight: parseFloat(DiamondWeight),
          SolitaireWeight: parseFloat(SolitaireWeight),
          StoneWeight: parseFloat(StoneWeight),
          netWeight: parseFloat(netWeight.toFixed(2)),
        },
        makingcharges: parseFloat(MakingChargesPerGm),
      };
    });
  };

  const handleLogData = async () => {
    if (fileData) {
      Papa.parse(fileData, {
        header: true,
        complete: async (result) => {
          result.data.pop();
          console.log('Parsed Data:', result.data);

          const firebaseData = processDataForFirebase(result.data);
          console.log(firebaseData);

          const productsCollection = collection(database, 'products');

          for (const product of firebaseData) {
            try {
              await setDoc(doc(database, "products", product.productID), product);
              console.log(`Product ${product.productID} added to Firestore.`);
            } catch (error) {
              console.error(`Error adding product ${product.productID} to Firestore:`, error.message);
            }
          }
        },
        error: (error) => {
          console.error('Error parsing file:', error.message);
        },
      });
    } else {
      console.error('No file selected.');
    }
  };

  const uploadAllFiles = async (files) => {
    const storageRef = ref(storage, 'products');
    const fileURLs = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const [productID, index] = file.name.split('_');
      const fileType = file.type.split('/')[0];
      const filename = `${productID}_${index}.${fileType}`;
      const fileRef = ref(storageRef, filename);

      try {
        await uploadBytes(fileRef, file);
        const downloadURL = await getDownloadURL(fileRef);
        fileURLs.push({ productID, downloadURL });
      } catch (error) {
        console.error(`Error uploading ${fileType} for Product ID ${productID}:`, error.message);
      }
    }

    return fileURLs;
  };

  const getAllImageDownloadURLs = async (productID) => {
    try {
      const storageRef = ref(storage, 'products', String(100));
      const listResult = await list(storageRef);

      const downloadURLs = await Promise.all(
        listResult.items
          .filter((item) => item.name.startsWith(`100_`))
          .map(async (item) => {
            const downloadURL = await getDownloadURL(item);
            return { fileName: item.name, downloadURL };
          })
      );

      console.log('Download URLs for Product ID', productID, ':', downloadURLs);
      return downloadURLs;
    } catch (error) {
      console.error(`Error getting download URLs for Product ID ${productID}:`, error.message);
      return [];
    }
  };

  const handleMediaChange = (e) => {
    const files = e.target.files;
    setMediaFiles(files);
  };


  const handleMediaUpload = async () => {
    if (mediaFiles) {
      try {
        const fileURLs = await uploadAllFiles(mediaFiles);

        // Update Firestore documents with the fileURLs
        fileURLs.forEach(async ({ productID, downloadURL }) => {
          const productDocRef = doc(database, 'products', productID);

          try {
            await updateDoc(productDocRef, {
              media: arrayUnion(downloadURL), // Assuming 'media' is the array field in the document
            });

            console.log(`Media URLs added to the document with Product ID ${productID}`);
          } catch (error) {
            console.error(`Error updating document with Product ID ${productID}:`, error.message);
          }
        });

        console.log('Media files uploaded successfully:', fileURLs);
      } catch (error) {
        console.error('Error uploading media files:', error.message);
      }
    } else {
      console.error('No media files selected.');
    }
  };

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
          <div className="flex flex-col space-y-8">
            <div className="bg-white p-6 rounded-md shadow-md">
              <h2 className="text-2xl font-bold mb-4">Edit Gold Rate</h2>
              <p className="mb-2">Current Gold Rate: ${goldRate}</p>
              <div className="flex items-center">
                <input
                  type="number"
                  placeholder="Enter new gold rate"
                  value={goldRate}
                  onChange={(e) => setGoldRate(e.target.value)}
                  className="mr-2 p-2 border border-gray-300 rounded w-36"
                />
                <button
                  onClick={() => updateGoldRate(goldRate)}
                  className="bg-teal-500 text-white p-2 rounded hover:bg-teal-600 cursor-pointer"
                >
                  Update Gold Rate
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-md shadow-md">
              <h2 className="text-2xl font-bold mb-4">Edit Gold Rate</h2>
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between">
                  <span>24 karat Gold Rate:</span>
                  <span>
                    <input
                      type="number"
                      value={goldRates['24karat']}
                      onChange={(e) => setGoldRates({ ...goldRates, '24karat': e.target.value })}
                      className="p-2 border border-gray-300 rounded w-36"
                    />
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>22 karat Gold Rate:</span>
                  <span>
                    <input
                      type="number"
                      value={goldRates['22karat']}
                      onChange={(e) => setGoldRates({ ...goldRates, '22karat': e.target.value })}
                      className="p-2 border border-gray-300 rounded w-36"
                    />
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>18 karat Gold Rate:</span>
                  <span>
                    <input
                      type="number"
                      value={goldRates['18karat']}
                      onChange={(e) => setGoldRates({ ...goldRates, '18karat': e.target.value })}
                      className="p-2 border border-gray-300 rounded w-36"
                    />
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>14 karat Gold Rate:</span>
                  <span>
                    <input
                      type="number"
                      value={goldRates['14karat']}
                      onChange={(e) => setGoldRates({ ...goldRates, '14karat': e.target.value })}
                      className="p-2 border border-gray-300 rounded w-36"
                    />
                  </span>
                </div>
              </div>
            </div>


            <div className="bg-white p-6 rounded-md shadow-md">
              <h2 className="text-2xl font-bold mb-4">Edit Diamond Rates</h2>
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between">
                  <span>IJSI Diamond Rate:</span>
                  <span>
                    <input
                      type="number"
                      value={diamondRates.ijsi}
                      onChange={(e) => setDiamondRates({ ...diamondRates, ijsi: e.target.value })}
                      className="p-2 border border-gray-300 rounded w-36"
                    />
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>GH-VSSI Diamond Rate:</span>
                  <span>
                    <input
                      type="number"
                      value={diamondRates.ghvssi}
                      onChange={(e) => setDiamondRates({ ...diamondRates, ghvssi: e.target.value })}
                      className="p-2 border border-gray-300 rounded w-36"
                    />
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-md shadow-md">
              <h2 className="text-2xl font-bold mb-4">Edit Stone Rate</h2>
              <div className="flex justify-between">
                <span>Stone Rate:</span>
                <span>
                  <input
                    type="number"
                    value={stoneRate}
                    onChange={(e) => setStoneRate(e.target.value)}
                    className="p-2 border border-gray-300 rounded w-36"
                  />
                </span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-md shadow-md">
              <h2 className="text-2xl font-bold mb-4">Edit Solitaire Rates</h2>
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between">
                  <span>Up to 0.70 ct Solitaire Rate:</span>
                  <span>
                    <input
                      type="number"
                      value={solitaireRates.upTo05ct}
                      onChange={(e) => setSolitaireRates({ ...solitaireRates, upTo05ct: e.target.value })}
                      className="p-2 border border-gray-300 rounded w-36"
                    />
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>0.70 ct to 1 ct Solitaire Rate:</span>
                  <span>
                    <input
                      type="number"
                      value={solitaireRates.gt05ctLt1ct}
                      onChange={(e) => setSolitaireRates({ ...solitaireRates, gt05ctLt1ct: e.target.value })}
                      className="p-2 border border-gray-300 rounded w-36"
                    />
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>More than 1 ct Solitaire Rate:</span>
                  <span>
                    <input
                      type="number"
                      value={solitaireRates.gt1ct}
                      onChange={(e) => setSolitaireRates({ ...solitaireRates, gt1ct: e.target.value })}
                      className="p-2 border border-gray-300 rounded w-36"
                    />
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={updateRates}
              className="bg-teal-500 text-white p-4 rounded hover:bg-teal-600 cursor-pointer"
            >
              Update Rates
            </button>
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
      case 'addProduct':
        return <AddProduct />;
      case 'uploadFile':
        return (
          <div className='flex flex-col gap-5'>
            <div>
              <h2 className="text-2xl font-bold mb-2">Upload File</h2>
              <input type="file" onChange={handleFileChange} className="mb-2" />
              <button onClick={handleLogData} className="bg-teal-500 text-white p-2 rounded hover:bg-teal-600 cursor-pointer">
                Log Data
              </button>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Upload Images and Videos</h2>
              <input type="file" onChange={handleMediaChange} className="mb-2" multiple />
              <button onClick={handleMediaUpload} className="bg-teal-500 text-white p-2 rounded hover:bg-teal-600 cursor-pointer">
                Upload Media Files
              </button>
            </div>
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
                {tabs.map((tab) => (
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
              {tabs.map((tab) => (
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
            <div className="bg-white p-4 shadow-md">{renderTabContent()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
