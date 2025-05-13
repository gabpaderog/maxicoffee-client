import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight02Icon, CoffeeBeansIcon } from '@hugeicons/core-free-icons'
import React, { useState } from "react"
import { signUp } from "../auth.api" // Adjust the import path if needed
import { Link } from 'react-router';

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await signUp({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      setVerificationSent(true);
    } catch (err) {
      setError(err?.message || "Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100vh] flex items-center justify-center bg-gradient-to-br from-[#f5eee6] to-[#e3caa5] px-4">
      <div className="flex flex-col items-center w-full max-w-md mx-auto py-10">
        <div className="flex flex-col items-center gap-4 mb-8 w-full">
          <HugeiconsIcon icon={CoffeeBeansIcon} size={48} className="text-[#b68973]" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#7c5e3c] text-center font-serif tracking-tight uppercase">
            Sign Up for Maxicoffee
          </h2>
          <p className="text-center text-[#7c5e3c]/90 text-base font-medium max-w-xl mx-auto">
            Join the Maxicoffee family and start your coffee journey!
          </p>
        </div>
        {verificationSent ? (
          <div className="bg-[#f5eee6] border border-[#e3caa5] rounded-lg p-6 text-center shadow space-y-3 w-full">
            <div className="flex justify-center">
              <HugeiconsIcon icon={CoffeeBeansIcon} size={36} className="text-[#b68973]" />
            </div>
            <h3 className="text-xl font-bold text-[#7c5e3c]">Verify your email</h3>
            <p className="text-[#7c5e3c]/90">
              A verification link has been sent to <span className="font-semibold">{form.email}</span>.<br />
              Please check your inbox and follow the instructions to activate your account.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 w-full">
            <div>
              <label className="block text-[#7c5e3c] font-medium mb-1" htmlFor="name">
                Name
              </label>
              <input
                className="w-full px-4 py-2 border border-[#e3caa5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e3caa5] bg-[#f5eee6]"
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Your Name"
                disabled={loading}
              />
            </div>
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
            <div>
              <label className="block text-[#7c5e3c] font-medium mb-1" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                className="w-full px-4 py-2 border border-[#e3caa5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e3caa5] bg-[#f5eee6]"
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm Password"
                disabled={loading}
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm font-medium">{error}</div>
            )}
            <button
              type="submit"
              className="flex items-center gap-3 bg-[#b68973] hover:bg-[#a1745e] text-white font-bold px-8 py-3 border-2 border-[#7c5e3c] uppercase tracking-wider shadow-lg transition rounded w-full justify-center disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
              {!loading && <HugeiconsIcon icon={ArrowRight02Icon} size={22} />}
            </button>
          </form>
        )}
        {!verificationSent && (
          <p className="mt-6 text-center text-sm text-[#7c5e3c]">
            Already have an account?{" "}
            <Link href="/signin" className="text-[#b68973] font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Signup;