import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight02Icon, CoffeeBeansIcon } from '@hugeicons/core-free-icons'
import React, { useState } from "react"
import { Link, useNavigate } from 'react-router'
import { forgotPassword } from '../auth.api'
// import { requestPasswordReset } from '../auth.api'

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err?.message || "Failed to send password reset email");
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
            Forgot Password
          </h2>
          <p className="text-center text-[#7c5e3c]/90 text-base font-medium max-w-xl mx-auto">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>
        
        {success ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative w-full mb-4">
            <p>Check your email for password reset instructions.</p>
            <div className="mt-4">
              <Link to="/signin" className="text-[#b68973] font-semibold hover:underline">
                Return to Sign In
              </Link>
            </div>
          </div>
        ) : (
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
                value={email}
                onChange={handleChange}
                required
                placeholder="you@email.com"
                disabled={loading}
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}
            <button
              type="submit"
              className="flex items-center gap-3 bg-[#b68973] hover:bg-[#a1745e] text-white font-bold px-8 py-3 border-2 border-[#7c5e3c] uppercase tracking-wider shadow-lg transition rounded w-full justify-center"
              disabled={loading}
            >
              {loading ? "Processing..." : "Reset Password"}
              <HugeiconsIcon icon={ArrowRight02Icon} size={22} />
            </button>
          </form>
        )}
        
        <p className="mt-6 text-center text-sm text-[#7c5e3c]">
          Remembered your password?{" "}
          <Link to="/signin" className="text-[#b68973] font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;