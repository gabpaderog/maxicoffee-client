import React, { useState, useEffect } from 'react';
import { getAddonByCategory, getGlobalAddons } from '../product.api'; // Adjust the import path as needed

const ProductCard = ({ product, onAddToCart }) => {
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [categoryAddons, setCategoryAddons] = useState([]);
  const [globalAddons, setGlobalAddons] = useState([]);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (product?.category?._id) {
      getAddonByCategory(product.category._id)
        .then((data) => setCategoryAddons(data))
        .catch(() => setCategoryAddons([]));
    }
    getGlobalAddons()
      .then((data) => setGlobalAddons(data))
      .catch(() => setGlobalAddons([]));
  }, [product?.category?._id]);

  const handleAddonChange = (addon) => {
    setSelectedAddons((prev) =>
      prev.includes(addon)
        ? prev.filter((a) => a !== addon)
        : [...prev, addon]
    );
  };

  const handleAddToCart = () => {
    onAddToCart({
      ...product,
      addons: selectedAddons,
    });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const renderAddons = (addons, label) =>
    addons.length > 0 && (
      <div className="mb-4">
        <p className="font-medium text-gray-700 mb-2">{label}</p>
        <div className="flex flex-wrap gap-2">
          {addons.map((addon) => (
            <label
              key={addon.id}
              className="flex items-center bg-gray-100 rounded px-2 py-1 text-sm cursor-pointer transition-colors hover:bg-gray-200"
            >
              <input
                type="checkbox"
                checked={selectedAddons.includes(addon)}
                onChange={() => handleAddonChange(addon)}
                className="mr-2 accent-[#6f4e37]"
              />
              {addon.name}
              <span className="ml-1 text-xs text-gray-500">
                (+{addon.price.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })})
              </span>
            </label>
          ))}
        </div>
      </div>
    );

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 max-w-xs m-4 transition-transform hover:-translate-y-1 hover:shadow-2xl product-card relative">
      {showToast && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow z-20 animate-fade-in">
          Added to cart!
        </div>
      )}
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover rounded-t-xl"
        />
        <span className="absolute top-3 right-3 bg-[#6f4e37] text-white text-xs px-3 py-1 rounded-full font-semibold shadow">
          {product.category?.name}
        </span>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-1 truncate">{product.name}</h3>
        <p className="text-gray-500 text-sm mb-2">{product.description}</p>
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-semibold text-[#6f4e37]">
            {product.basePrice.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}
          </span>
          <span className="text-xs text-gray-400">per item</span>
        </div>
        {renderAddons(categoryAddons, 'Optional Addons')}
        {renderAddons(globalAddons, 'Global Addons')}
        <button
          onClick={handleAddToCart}
          className="w-full bg-[#6f4e37] text-white py-2 rounded-lg font-bold shadow hover:bg-[#563b29] transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
