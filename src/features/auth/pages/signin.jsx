import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight02Icon, CoffeeBeansIcon } from '@hugeicons/core-free-icons'
import React, { useState } from "react"
import { Link, useNavigate } from 'react-router'
import { signIn } from '../auth.api'
import {jwtDecode} from "jwt-decode"

const Signin = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    setError("")
    try {
      const res = await signIn(form)
      if (res?.accessToken) {
        // Decode the token to check the role
        const decoded = jwtDecode(res.accessToken)
        console.log(decoded.role)
        if (decoded?.role === "admin") {
          setError("Admin accounts cannot sign in here.")
          setLoading(false)
          return
        }
        localStorage.setItem('accessToken', res.accessToken)
      }
      navigate('/') // Redirect to home or dashboard
    } catch (err) {
      setError(err?.message || "Sign in failed")
    } finally {
      setLoading(false)
    }
  };
  
  return (
    <div className="min-h-[100vh] flex items-center justify-center bg-gradient-to-br from-[#f5eee6] to-[#e3caa5] px-4">
      <div className="flex flex-col items-center w-full max-w-md mx-auto py-10">
        <div className="flex flex-col items-center gap-4 mb-8 w-full">
          <HugeiconsIcon icon={CoffeeBeansIcon} size={48} className="text-[#b68973]" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#7c5e3c] text-center font-serif tracking-tight uppercase">
            Sign In to Maxicoffee
          </h2>
          <p className="text-center text-[#7c5e3c]/90 text-base font-medium max-w-xl mx-auto">
            Welcome back! Please sign in to continue enjoying fresh brews and cozy vibes.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5 w-full">
          <div>
            <label className="block text-[#7c5e3c] font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              className="w-full px-4 py-2 border border-[#e3caa5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e3caa5] bg-[#f5eee6]"
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@email.com"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-[#7c5e3c] font-medium mb-1" htmlFor="password">
              Password
            </label>
            <input
              className="w-full px-4 py-2 border border-[#e3caa5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e3caa5] bg-[#f5eee6]"
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Password"
              disabled={loading}
            />
          </div>
          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}
          <div className="flex justify-end mt-2">
            <Link to="/forgotpassword" className="text-[#b68973] text-sm font-medium hover:underline">
              Forgot Password?
            </Link>
          </div>
          <button
            type="submit"
            className="flex items-center gap-3 bg-[#b68973] hover:bg-[#a1745e] text-white font-bold px-8 py-3 border-2 border-[#7c5e3c] uppercase tracking-wider shadow-lg transition rounded w-full justify-center"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
            <HugeiconsIcon icon={ArrowRight02Icon} size={22} />
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-[#7c5e3c]">
          Don't have an account?{" "}
          <Link href="/signup" className="text-[#b68973] font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signin;
