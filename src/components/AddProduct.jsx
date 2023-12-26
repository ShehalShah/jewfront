import React, { useState } from 'react';
import { database, storage } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { uploadBytes, getDownloadURL, ref } from 'firebase/storage';

const AddProduct = () => {
  const [productName, setProductName] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [price, setPrice] = useState(0);
  const [diamondRate, setDiamondRate] = useState(0);
  const [makingCharges, setMakingCharges] = useState(0);
  const [diamondWeight, setDiamondWeight] = useState(0);
  const [goldWeight, setGoldWeight] = useState(0);
  const [surplusCharges, setSurplusCharges] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const categoryOptions = [
    'Rings',
    'Earrings',
    'Bangles',
    'Solitaires',
    'Mangalsutras',
    'Necklaces',
    'More',
    'Gifting',
  ];

  const handleImageUpload = async (e) => {
    try {
      const file = e.target.files[0];
      const storageRef = ref(storage, `product-images/${file.name}`);

      // Upload the file using put
      const snapshot = await uploadBytes(storageRef, file);

      // Get the download URL
      const imageUrl = await getDownloadURL(snapshot.ref);

      // Update the state with the new image URL
      setImages([...images, imageUrl]);
    } catch (error) {
      console.error('Error uploading image:', error.message);
    }
  };

  const handleCategoryToggle = (category) => {
    setSelectedCategories((prevCategories) => {
      if (prevCategories.includes(category)) {
        return prevCategories.filter((prevCategory) => prevCategory !== category);
      } else {
        return [...prevCategories, category];
      }
    });
  };

  const handleAddProduct = async () => {
    try {
      const productRef = collection(database, 'products');
      await addDoc(productRef, {
        productName,
        category: selectedCategories,
        images,
        description,
        additionalDetails: additionalDetails.split(',').map((detail) => detail.trim()),
        price,
        priceBreakdown: {
          diamondRate,
          makingCharges,
          diamondWeight,
          goldWeight,
          surplusCharges,
          discount,
        },
      });

      setProductName('');
      setSelectedCategories([]);
      setImages([]);
      setDescription('');
      setAdditionalDetails('');
      setPrice(0);
      setDiamondRate(0);
      setMakingCharges(0);
      setDiamondWeight(0);
      setGoldWeight(0);
      setSurplusCharges(0);
      setDiscount(0);

      console.log('Product added successfully');
    } catch (error) {
      console.error('Error adding product:', error.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-8">Add Product</h2>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Name:</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Category:</label>
          <div className="relative mt-1">
            <div
              className="p-2 border border-gray-300 rounded-md w-full cursor-pointer overflow-scroll"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              {selectedCategories.length > 0
                ? selectedCategories.map((category) => (
                    <span key={category} className="mr-1">
                      {category},
                    </span>
                  ))
                : 'Select Categories'}
            </div>
            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-md shadow-md">
                {categoryOptions.map((option) => (
                  <div
                    key={option}
                    className="p-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleCategoryToggle(option)}
                  >
                    <span className="mr-2">{option}</span>
                    {selectedCategories.includes(option) && (
                      <span className="text-green-500">✔</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Images:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mt-1 p-2 border border-gray-300 rounded-md"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Product ${index + 1}`}
                className="w-16 h-16 object-cover rounded-md"
              />
            ))}
          </div>
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Additional Details:</label>
          <input
            type="text"
            value={additionalDetails}
            onChange={(e) => setAdditionalDetails(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Diamond Weight:</label>
          <input
            type="number"
            value={diamondWeight}
            onChange={(e) => setDiamondWeight(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
       
        <div>
          <label className="block text-sm font-medium text-gray-700">Diamond Rate:</label>
          <input
            type="number"
            value={diamondRate}
            onChange={(e) => setDiamondRate(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Gold Weight:</label>
          <input
            type="number"
            value={goldWeight}
            onChange={(e) => setGoldWeight(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Making Charges:</label>
          <input
            type="number"
            value={makingCharges}
            onChange={(e) => setMakingCharges(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Surplus Charges:</label>
          <input
            type="number"
            value={surplusCharges}
            onChange={(e) => setSurplusCharges(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Discount:</label>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
      </div>
      <button
        onClick={handleAddProduct}
        className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 cursor-pointer"
      >
        Add Product
      </button>
    </div>
  );
};

export default AddProduct;
