import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { getDiscount } from '../cart.api';
import { postOrder } from '../cart.api';

const getCartFromStorage = () => {
  try {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  } catch {
    return [];
  }
};

const getUserFromToken = () => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;
    const decoded = jwtDecode(token);
    return decoded && decoded.userId
      ? { userId: decoded.userId, name: decoded.name || '' }
      : null;
  } catch {
    return null;
  }
};

const getUserIdFromToken = () => {
  const user = getUserFromToken();
  return user ? user.userId : null;
};

const CartList = () => {
  const [cart, setCart] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [selectedDiscountId, setSelectedDiscountId] = useState('');
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  useEffect(() => {
    setCart(getCartFromStorage());
    getDiscount().then((data) => {
      setDiscounts(data || []);
    });
  }, []);

  useEffect(() => {
    const found = discounts.find(d => d._id === selectedDiscountId);
    setSelectedDiscount(found || null);
  }, [selectedDiscountId, discounts]);

  const handleDelete = (cartItemId) => {
    const updated = cart.filter(item => item.cartItemId !== cartItemId);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const handleReset = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const handleCheckout = () => {      
    setShowConfirm(true);
  };

  const handleConfirmOrder = async () => {
    setIsCheckingOut(true);
    try {
      const user = getUserFromToken();
      if (!user) {
        alert('User not authenticated!');
        setIsCheckingOut(false);
        setShowConfirm(false);
        return;
      }
      const orderData = {
        userId: user.userId,
        items: cart.map(item => ({
          productName: item.name,
          price: item.basePrice,
          addons: (item.addons || []).map(addon => ({
            addonName: addon.name,
            price: addon.price
          }))
        })),
        discountId: selectedDiscountId || undefined
      };

      const res = await postOrder(orderData);
      if (res) {
        setReceiptData({
          orderId: res._id || Math.floor(Math.random() * 1000000),
          items: cart,
          discount: selectedDiscount,
          total: total,
          discountedTotal: discountedTotal,
          createdAt: new Date().toLocaleString(),
          name: user.name || '',
        });
        handleReset();
      } else {
        alert('Checkout failed!');
      }
    } catch {
      alert('Checkout error!');
    } finally {
      setShowConfirm(false);
      setIsCheckingOut(false);
    }
  };

  // Calculate totals and breakdowns
  const cartBreakdown = cart.map(item => {
    const addonsTotal = (item.addons || []).reduce((sum, addon) => sum + (addon.price || 0), 0);
    return {
      ...item,
      addonsTotal,
      itemTotal: item.basePrice + addonsTotal,
    };
  });

  const total = cartBreakdown.reduce((sum, item) => sum + item.itemTotal, 0);
  const discountedTotal = selectedDiscount
    ? total * (1 - selectedDiscount.percentage)
    : total;
  const discountAmount = selectedDiscount ? total * selectedDiscount.percentage : 0;

  // Receipt Screen
  if (receiptData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Order Receipt</h2>
          <div className="mb-2 text-sm text-gray-600">Order ID: <span className="font-mono">{receiptData.orderId}</span></div>
          <div className="mb-2 text-sm text-gray-600">Date: {receiptData.createdAt}</div>
          {receiptData.name && (
            <div className="mb-2 text-sm text-gray-600">Name: <span className="font-semibold">{receiptData.name}</span></div>
          )}
          <hr className="my-4" />
          <div className="mb-4">
            {receiptData.items.map((item, idx) => {
              const addonsTotal = (item.addons || []).reduce((sum, addon) => sum + (addon.price || 0), 0);
              const itemTotal = item.basePrice + addonsTotal;
              return (
                <div key={idx} className="mb-2 text-left">
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                  <div className="text-xs">
                    Base Price: P{item.basePrice.toFixed(2)}
                  </div>
                  {item.addons && item.addons.length > 0 && (
                    <div className="text-xs text-gray-500">
                      Addons:
                      <ul className="ml-4 list-disc">
                        {item.addons.map((a, i) => (
                          <li key={i}>
                            {a.name} <span className="text-gray-400">(P{a.price.toFixed(2)})</span>
                          </li>
                        ))}
                      </ul>
                      <div className="text-xs">
                        Addons Total: P{addonsTotal.toFixed(2)}
                      </div>
                    </div>
                  )}
                  <div className="text-xs font-semibold">
                    Item Total: P{itemTotal.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
          <hr className="my-4" />
          <div className="mb-2 font-bold">Subtotal: P{receiptData.total.toFixed(2)}</div>
          {receiptData.discount && (
            <div className="text-xs text-green-600 mb-2">
              Discount: {receiptData.discount.name} ({(receiptData.discount.percentage * 100).toFixed(0)}%)<br />
              -P{(receiptData.total * receiptData.discount.percentage).toFixed(2)}
            </div>
          )}
          <div className="mb-2 font-bold">Total: P{receiptData.discountedTotal.toFixed(2)}</div>
          <div className="mt-4 text-lg font-semibold text-[#6f4e37]">Show this receipt at the counter</div>
          <button
            className="mt-6 px-4 py-2 bg-[#6f4e37] text-white rounded"
            onClick={() => setReceiptData(null)}
          >
            Back to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Your Cart</h2>
      {cart.length === 0 ? (
        <div className="flex flex-col items-center">
          <div className="text-center text-gray-500 mb-4">Cart is empty.</div>
          <a
            href="/products"
            className="px-4 py-2 bg-[#6f4e37] text-white rounded"
          >
            Go to Products
          </a>
        </div>
      ) : (
        <div className="flex flex-col gap-4 max-w-2xl mx-auto">
          {cart.map((item) => (
            <div
              key={item.cartItemId}
              className="flex items-center border rounded-lg p-4 shadow-sm bg-white"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded mr-4"
              />
              <div className="flex-1">
                <div className="font-semibold">{item.name}</div>
                <div className="text-sm text-gray-600">{item.description}</div>
                <div className="text-sm text-gray-700">
                  Price: P{item.basePrice.toFixed(2)}
                </div>
                {item.addons && item.addons.length > 0 && (
                  <div className="text-xs text-gray-500">
                    Addons: {item.addons.map((a) => a.name).join(', ')}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2 ml-4">
                <button
                  className="px-2 py-1 bg-red-500 text-white rounded text-xs"
                  onClick={() => handleDelete(item.cartItemId)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="flex items-center gap-4 mt-2">
            <label htmlFor="discount" className="text-sm">
              Discount:
            </label>
            <select
              id="discount"
              value={selectedDiscountId}
              onChange={e => setSelectedDiscountId(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="">No discount</option>
              {discounts.map(d => (
                <option key={d._id} value={d._id}>
                  {d.name} ({(d.percentage * 100).toFixed(0)}%)
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-between items-center mt-4">
            <button
              className="px-4 py-2 bg-gray-300 rounded"
              onClick={handleReset}
            >
              Reset Cart
            </button>
            <div className="font-bold">
              Total: P{discountedTotal.toFixed(2)}
              {selectedDiscount && (
                <span className="ml-2 text-xs text-green-600">
                  ({selectedDiscount.name} discount applied)
                </span>
              )}
            </div>
            <button
              className="px-4 py-2 bg-[#6f4e37] text-white rounded"
              onClick={handleCheckout}
            >
              Checkout
            </button>
          </div>
        </div>
      )}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4">Confirm Order</h3>
            <p className="mb-4">
              Are you sure you want to place this order for <span className="font-semibold">P{discountedTotal.toFixed(2)}</span>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setShowConfirm(false)}
                disabled={isCheckingOut}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-[#6f4e37] text-white rounded"
                onClick={handleConfirmOrder}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartList;
