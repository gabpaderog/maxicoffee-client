import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router'
import { jwtDecode } from 'jwt-decode'

// Helper to get user name from JWT
const getUserNameFromToken = () => {
  const token = localStorage.getItem('accessToken')
  if (!token) return null
  try {
    const decoded = jwtDecode(token)
    return decoded.name
  } catch {
    return 'User'
  }
}

const Header = () => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'))
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const isAuthenticated = !!accessToken
  const userName = isAuthenticated ? getUserNameFromToken() : null
  const [cartOpen, setCartOpen] = useState(false)
  const cartBtnRef = useRef(null)
  const cartMenuRef = useRef(null)

  const navigate = useNavigate()

  // Refs for profile button and menu
  const profileBtnRef = useRef(null)
  const profileMenuRef = useRef(null)

  useEffect(() => {
    const handleStorage = () => {
      setAccessToken(localStorage.getItem('accessToken'))
    }
    window.addEventListener('storage', handleStorage)
    const interval = setInterval(() => {
      setAccessToken(localStorage.getItem('accessToken'))
    }, 1000)
    return () => {
      window.removeEventListener('storage', handleStorage)
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    if (!cartOpen) return
    const handleClickOutside = (e) => {
      if (
        cartBtnRef.current &&
        !cartBtnRef.current.contains(e.target) &&
        cartMenuRef.current &&
        !cartMenuRef.current.contains(e.target)
      ) {
        setCartOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [cartOpen])

  // Close menu on navigation
  const handleNavClick = () => setMenuOpen(false)

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('cart') // Remove cart items on logout
    setAccessToken(null)
    setProfileMenuOpen(false)
    setMenuOpen(false)
    if (navigate) navigate('/')
    else window.location.href = '/'
  }

  // Close profile menu when clicking outside
  useEffect(() => {
    if (!profileMenuOpen) return
    const handleClick = (e) => {
      if (
        profileBtnRef.current &&
        !profileBtnRef.current.contains(e.target) &&
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target)
      ) {
        setProfileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [profileMenuOpen])

  const CartItems = () => {
    const [items, setItems] = useState([])
  
    useEffect(() => {
      const storedCart = JSON.parse(localStorage.getItem('cart')) || []
      setItems(storedCart)
    }, [])
  
    const removeItem = (indexToRemove) => {
      const updatedCart = items.filter((_, i) => i !== indexToRemove)
      setItems(updatedCart)
      localStorage.setItem('cart', JSON.stringify(updatedCart))
    }
  
    if (items.length === 0) return <p className="text-sm text-gray-500">Cart is empty.</p>
  
    return (
      <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto space-y-2">
        {items.map((item, index) => (
          <li key={index} className="py-2 text-sm text-[#4B2E19]">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-xs text-gray-600">₱{item.basePrice}</p>
                {item.addons && item.addons.length > 0 && (
                  <ul className="mt-1 text-xs text-gray-500">
                    {item.addons.map((addon, i) => (
                      <li key={i}>{addon.name} (+₱{addon.price})</li>
                    ))}
                  </ul>
                )}
              </div>
              <button
                onClick={() => removeItem(index)}
                className="text-red-500 text-xs hover:underline"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    )
  }
  
  

  return (
    <header className="w-full bg-[#6F4E37] py-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-extrabold text-[#D7CCC0] tracking-wide">MaxiCoffee</span>
        </Link>

        {/* Hamburger for mobile */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className={`block h-0.5 w-6 bg-[#D7CCC0] mb-1 transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block h-0.5 w-6 bg-[#D7CCC0] mb-1 transition-all ${menuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block h-0.5 w-6 bg-[#D7CCC0] transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>

        {/* Navigation */}
        <nav
          className={`
            flex-col md:flex-row md:flex md:static absolute top-full left-0 w-full md:w-auto bg-[#6F4E37] md:bg-transparent
            transition-all duration-200 z-40
            ${menuOpen ? 'flex' : 'hidden'}
          `}
        >
          <ul className="flex flex-col md:flex-row gap-6 md:gap-8 text-[#D7CCC0] font-medium px-6 md:px-0 py-4 md:py-0">
            <li>
              <Link to="/" className="hover:text-[#A67B5B] transition" onClick={handleNavClick}>Home</Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-[#A67B5B] transition" onClick={handleNavClick}>Products</Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-[#A67B5B] transition" onClick={handleNavClick}>Cart</Link>
            </li>
          </ul>
        </nav>

        {/* Auth Buttons / Profile */}
        <div className="hidden md:flex items-center gap-3 relative">
          {!isAuthenticated ? (
            <>
              <Link
                to={'/signin'}
                className="px-4 py-2 rounded bg-[#C7A17A] text-[#4B2E19] font-semibold hover:bg-[#E6D3B3] transition-colors shadow"
              >
                <span>Login</span>
              </Link>
              <Link
                to={'/signup'}
                className="px-4 py-2 rounded border-2 border-[#C7A17A] text-[#C7A17A] font-semibold hover:bg-[#C7A17A] hover:text-[#4B2E19] transition-colors shadow"
              >
                <span>Sign up</span>
              </Link>
            </>
          ) : (
            <div className="relative flex gap-2 items-center">
              <button
                ref={cartBtnRef}
                className="relative"
                onClick={() => setCartOpen((prev) => !prev)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-[#D7CCC0] hover:text-[#A67B5B] transition"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.6 8m1.6-8L5.4 5M7 13h10l-1.6 8m-6.8 0a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z" />
                </svg>
              </button>

              {cartOpen && (
                <div
                  ref={cartMenuRef}
                  className="absolute top-8 right-0 mt-2 w-72 bg-white rounded shadow-lg z-50 p-4"
                >
                  <h3 className="text-[#4B2E19] font-semibold mb-2">Your Cart</h3>
                  <CartItems />
                  <Link to="/cart" onClick={() => setCartOpen(!setCartOpen)} className='flex justify-center text-sm text-white rounded py-2 bg-[#4B2E19]'>Checkout</Link>
                </div>
              )}
              <button
                ref={profileBtnRef}
                className="flex items-center gap-2 focus:outline-none"
                onClick={() => setProfileMenuOpen((open) => !open)}
              >
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=C7A17A&color=4B2E19&rounded=true`}
                  alt={userName}
                  className="h-8 w-8 rounded-full border-2 border-[#C7A17A]"
                />
                <span className="text-[#C7A17A] font-semibold">{userName}</span>
                <svg className="w-4 h-4 ml-1 text-[#C7A17A]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {profileMenuOpen && (
                <div
                  ref={profileMenuRef}
                  className="absolute top-8 right-0 mt-2 w-40 bg-white rounded shadow-lg z-50"
                >
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-[#4B2E19] hover:bg-[#F5F5F5] transition"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    className="w-full text-left px-4 py-2 text-[#4B2E19] hover:bg-[#F5F5F5] transition"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Auth/Profile */}
        {menuOpen && (
          <div className="flex flex-col md:hidden gap-3 px-6 pb-4">
            {!isAuthenticated ? (
              <>
                <Link
                  to={'/signin'}
                  className="px-4 py-2 rounded bg-[#C7A17A] text-[#4B2E19] font-semibold hover:bg-[#E6D3B3] transition-colors shadow"
                  onClick={handleNavClick}
                >
                  <span>Login</span>
                </Link>
                <Link
                  to={'/signup'}
                  className="px-4 py-2 rounded border-2 border-[#C7A17A] text-[#C7A17A] font-semibold hover:bg-[#C7A17A] hover:text-[#4B2E19] transition-colors shadow"
                  onClick={handleNavClick}
                >
                  <span>Sign up</span>
                </Link>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-2"
                  onClick={handleNavClick}
                >
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=C7A17A&color=4B2E19&rounded=true`}
                    alt={userName}
                    className="h-8 w-8 rounded-full border-2 border-[#C7A17A]"
                  />
                  <span className="text-[#C7A17A] font-semibold">{userName}</span>
                </Link>
                <button
                  className="px-4 py-2 rounded text-[#C7A17A] font-semibold border-2 border-[#C7A17A] hover:bg-[#C7A17A] hover:text-[#4B2E19] transition-colors shadow"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
