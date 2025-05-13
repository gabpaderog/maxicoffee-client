import React, { useState, useEffect } from 'react';
import ProductCard from '../components/productCard';
import { getProducts } from '../product.api';

const CART_KEY = 'cart';

// Toast component
const Toast = ({ message, isVisible, onClose }) => {
  if (!isVisible) return null;
  
  return (
    <div className="fixed top-4 right-4 z-50 flex items-center p-4 mb-4 w-full max-w-xs text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
      <div className="inline-flex flex-shrink-0 justify-center items-center w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
        </svg>
      </div>
      <div className="ml-3 text-sm font-normal">{message}</div>
      <button 
        type="button" 
        className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
        onClick={onClose}
      >
        <span className="sr-only">Close</span>
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
        </svg>
      </button>
    </div>
  );
};

const ProductList = () => {
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  });
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [toast, setToast] = useState({
    visible: false,
    message: ''
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data);
      setFilteredProducts(data);
      
      // Extract unique categories from the product data
      // Categories are objects with _id and name properties
      const uniqueCategoriesMap = new Map();
      data.forEach(product => {
        if (product.category && product.category._id && product.category.name) {
          uniqueCategoriesMap.set(product.category._id, product.category);
        }
      });
      
      // Convert the Map values to an array of category objects
      const uniqueCategoriesArray = Array.from(uniqueCategoriesMap.values());
      setCategories(uniqueCategoriesArray);
      
      console.log('Products loaded:', data);
    });
  }, []);

  // Filter products whenever searchTerm or selectedCategory changes
  useEffect(() => {
    let filtered = products;
    
    // Filter by category first
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.category && product.category._id === selectedCategory
      );
    }
    
    // Then filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(product =>
        product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, products]);

  const handleAddToCart = (productWithAddons) => {
    const newCartItem = {
      ...productWithAddons,
      cartItemId: Date.now() + Math.random(), // Unique ID for this cart item
    };
 
    setCart(prevCart => [...prevCart, newCartItem]);
    
    // Show toast notification
    const productName = productWithAddons.name || 'Product';
    setToast({
      visible: true,
      message: `${productName} added to cart!`
    });
    
    // Automatically hide toast after 3 seconds
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);
  };
  
  const closeToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
  };
  
  // Group products by category
  const groupedProducts = () => {
    if (selectedCategory !== 'all') {
      // If a category is selected, find its name for display
      const categoryObj = categories.find(cat => cat._id === selectedCategory);
      const categoryName = categoryObj ? categoryObj.name : 'Selected Category';
      
      // Return just one group with the selected category name
      return {
        [categoryName]: filteredProducts
      };
    }
    
    // Otherwise, group all filtered products by category name
    return filteredProducts.reduce((groups, product) => {
      if (!product.category || !product.category.name) {
        // Handle products without a category
        if (!groups['Uncategorized']) {
          groups['Uncategorized'] = [];
        }
        groups['Uncategorized'].push(product);
      } else {
        const categoryName = product.category.name;
        if (!groups[categoryName]) {
          groups[categoryName] = [];
        }
        groups[categoryName].push(product);
      }
      return groups;
    }, {});
  };

  return (
    <div className="container mx-auto py-8">
      {/* Toast notification */}
      <Toast 
        message={toast.message}
        isVisible={toast.visible}
        onClose={closeToast}
      />
      
      <h2 className="text-2xl font-bold mb-6 text-center">Our Products</h2>
      
      {/* Search Filter */}
      <div className="mb-4">
        <div className="max-w-md mx-auto">
          <div className="relative flex items-center w-full">
            <input
              type="text"
              className="block w-full p-3 pl-4 text-sm border rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search product names..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {searchTerm && (
              <button
                className="absolute right-2.5 text-gray-400 hover:text-gray-600"
                onClick={() => setSearchTerm('')}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Category Filters */}
      <div className="mb-6 flex flex-wrap justify-center gap-2">
        <button
          onClick={() => handleCategoryClick('all')}
          className={`px-4 py-2 text-sm rounded-full ${
            selectedCategory === 'all' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          All Categories
        </button>
        {categories.map(category => (
          <button
            key={category._id}
            onClick={() => handleCategoryClick(category._id)}
            className={`px-4 py-2 text-sm rounded-full ${
              selectedCategory === category._id 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      {/* Products by Category */}
      {Object.keys(groupedProducts()).length > 0 ? (
        Object.entries(groupedProducts()).map(([categoryName, products]) => (
          <div key={categoryName} className="mb-10">
            <h3 className="text-xl font-semibold mb-4 border-b pb-2">{categoryName}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-10 text-gray-500">
          No products found matching your criteria
        </div>
      )}
      
      {/* Optionally, show cart summary */}
      {/* <pre>{JSON.stringify(cart, null, 2)}</pre> */}
    </div>
  );
};

export default ProductList;