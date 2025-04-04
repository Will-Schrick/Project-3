import React, { useEffect, useState } from 'react';
import { db } from '../firebase/firebaseConfig'; // Adjust the path if necessary
import { collection, getDocs } from 'firebase/firestore';
import Navbar from '../components/Navbar'; // Assuming you have a Navbar component

export default function Menu() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // Fetch Categories and Products from Firestore
  useEffect(() => {
    const fetchData = async () => {
      // Fetch categories
      const categorySnapshot = await getDocs(collection(db, 'Categories'));
      const categoriesData = categorySnapshot.docs.map((doc) => ({
        id: doc.id, // Category ID
        ...doc.data(),
      }));

      // Fetch products
      const productSnapshot = await getDocs(collection(db, 'Products'));
      const productsData = productSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort categories by their ID to match the order
      categoriesData.sort((a, b) => a.ID - b.ID);

      // Debugging logs
      console.log('Fetched Categories:', categoriesData);
      console.log('Fetched Products:', productsData);

      setCategories(categoriesData);
      setProducts(productsData);
    };

    fetchData();
  }, []);

  // Debugging log for categories and products mapping
  console.log('Categories:', categories);
  console.log('Products:', products);

  return (
    <div>
      {/* Navbar Component */}
      <Navbar />

      <div className="max-w-4xl mx-auto p-5">
        <h1 className="text-4xl font-bold text-center mb-5">
          Delicious Bites & Coffee Menu
        </h1>
        <h1 className="text-center text-gray-600 mb-20 mt-20 text-4xl">
          Choose our Amazing Items below!
        </h1>

        {/* Render Categories */}
        {categories.map((category) => (
          <div key={category.id} className="mb-10">
            {/* Display the category name */}
            <h2 className="text-2xl font-semibold mb-4">{category.Name}</h2>

            {/* Debugging log to ensure correct filtering */}
            {console.log(
              `Products in category ${category.Name} (${category.id}):`,
              products.filter((product) => product.Category === category.ID) // Ensure that product.Category is compared with category.ID
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {/* Render Products under each Category */}
              {products
                .filter((product) => product.Category === category.ID) // Filter products by category ID
                .map((product) => (
                  <div
                    key={product.id}
                    className="bg-white p-5 rounded-lg shadow-lg"
                  >
                    <h3 className="text-lg font-semibold">{product.Name}</h3>
                    <p className="text-sm text-gray-500 mb-3">
                      {product.Description}
                    </p>
                    <p className="text-xl font-bold mt-3">{product.Price} €</p>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
