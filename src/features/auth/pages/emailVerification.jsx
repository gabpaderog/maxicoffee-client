import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { axiosInstance } from "../../../config/axios";

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Verifying your email...");
  const navigate = useNavigate();
  useEffect
  (() => {
    const token = searchParams.get("token");

    if (!token) {
      setMessage("Invalid verification link. Redirecting to login...");
      setTimeout(() => navigate("/signin"), 3000)
      return;
    }

    axiosInstance
      .post(`/auth/verify?token=${token}`)
      .then(() => {
        setMessage("Email verified successfully! Redirecting to login...");
        setTimeout(() => navigate("/signin"), 3000);
      })
      .catch((err) => {
        setMessage(err.response?.data?.message || "Verification failed. Redirecting to login...");
        setTimeout(() => navigate("/signin"), 3000)
      });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-xl font-semibold">{message}</h1>
      </div>
    </div>
  );
};

export default EmailVerification;
