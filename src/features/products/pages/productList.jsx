import React, { useState, useEffect } from 'react';
import ProductCard from '../components/productCard';
import { getProducts } from '../product.api';


const CART_KEY = 'cart';

const ProductList = () => {
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  });
  const [products, setProducts] = useState([]);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data);
      console.log(data)
    });
  }, []);

  const handleAddToCart = (productWithAddons) => {
    const newCartItem = {
      ...productWithAddons,
      cartItemId: Date.now() + Math.random(), // Unique ID for this cart item
    };
  
    setCart(prevCart => [...prevCart, newCartItem]);
  };

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Our Products</h2>
      <div className="flex flex-wrap justify-center">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
      {/* Optionally, show cart summary */}
      {/* <pre>{JSON.stringify(cart, null, 2)}</pre> */}
    </div>
  );
};

export default ProductList;