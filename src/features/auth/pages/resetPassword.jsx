import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight02Icon, CoffeeBeansIcon } from '@hugeicons/core-free-icons'
import React, { useState, useEffect } from "react"
import { Link, useNavigate } from 'react-router'
import { verifyResetPasswordToken, resetPassword } from '../auth.api'

const ResetPassword = () => {
  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [token, setToken] = useState(null)
  const navigate = useNavigate()
  
  useEffect(() => {
    // Extract token from URL query parameters
    const queryParams = new URLSearchParams(window.location.search)
    const urlToken = queryParams.get('token')
    
    if (!urlToken) {
      setError("Reset token is missing")
      setTimeout(() => navigate('/signin'), 1500)
      return
    }
    
    // Verify token validity
    const verifyToken = async () => {
      try {
        setLoading(true)
        // Use the imported verifyResetPasswordToken API function
        const response = await verifyResetPasswordToken(urlToken)
        
        // If verification is successful, set the token
        setToken(urlToken)
      } catch (err) {
        setError(err.message || "Invalid or expired reset token")
        setTimeout(() => navigate('/signin'), 1500)
      } finally {
        setLoading(false)
      }
    }
    
    verifyToken()
  }, [navigate])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate that passwords match
    if (form.newPassword !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setLoading(true);
    setError("");
    try {
      // Call reset password API with correct parameter order
      await resetPassword(form.newPassword, token);
      
      // Show success message
      setError("");
      // Add a success state or use the error state with positive message
      setForm({ newPassword: "", confirmPassword: "" });
      alert("Password reset successful! Redirecting to login...");
      
      // Redirect to signin page
      setTimeout(() => {
      navigate('/signin');
      }, 1500);
    } catch (err) {
      setError(err?.message || "Password reset failed");
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
            Reset Password
          </h2>
          <p className="text-center text-[#7c5e3c]/90 text-base font-medium max-w-xl mx-auto">
            Please enter your new password below to secure your account.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5 w-full">
          <div>
            <label className="block text-[#7c5e3c] font-medium mb-1" htmlFor="newPassword">
              New Password
            </label>
            <input
              className="w-full px-4 py-2 border border-[#e3caa5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e3caa5] bg-[#f5eee6]"
              type="password"
              id="newPassword"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              required
              placeholder="Enter new password"
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
              placeholder="Confirm your password"
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
            {loading ? "Resetting Password..." : "Reset Password"}
            <HugeiconsIcon icon={ArrowRight02Icon} size={22} />
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-[#7c5e3c]">
          Remember your password?{" "}
          <Link to="/signin" className="text-[#b68973] font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
