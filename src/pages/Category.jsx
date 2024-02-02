import React, { useState, useEffect } from 'react';
import { useParams, Link,useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { database } from '../firebaseConfig';

const Category = () => {
    const nav=useNavigate()
    const { cat } = useParams();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const productsCollection = collection(database, 'products');
        const categoryQuery = query(productsCollection, where('category', '==', cat?.charAt(0)?.toUpperCase() + cat?.slice(1)));

        const unsubscribe = onSnapshot(categoryQuery, (snapshot) => {
            const updatedProducts = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setProducts(updatedProducts);
        });

        return () => {
            unsubscribe();
        };
    }, [cat]);

    return (
        <div>
            <Navbar />
            <div className="container mx-auto my-8">
                <h1 className="text-3xl font-bold mb-4">{cat?.charAt(0)?.toUpperCase() + cat?.slice(1)}</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {products?.map((product) => (
                        <div key={product.id} className="bg-white p-4 cursor-pointer shadow-md hover:shadow-2xl" onClick={() => { nav(`/product/${product.id}`); }}>
                            {product?.media ? <img src={product?.media[0]} alt={product.name} className="w-full h-auto mb-4 rounded-lg" /> : <img src="https://via.placeholder.com/400" alt="Placeholder" className="w-full h-auto mb-4 rounded-lg" />}
                            <div className="text-lg font-bold mb-2">{product.name}</div>
                            <p className="text-gray-700">{product.description.split(' ').slice(0, 15).join(' ')}{(product.description.split(' ').length > 10 ? ' ...' : '')}</p>
                            <div className="mt-4 flex justify-between items-center">
                                <div className="text-teal-500 font-bold">
                                    ₹ {product.price} {/* Assuming there is a 'price' field in your product */}
                                </div>
                                <Link to={`/product/${product.id}`} className="text-teal-500 hover:underline">
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Category;
