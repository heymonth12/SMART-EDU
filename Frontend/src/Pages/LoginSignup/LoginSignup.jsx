import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const LoginSignup = () => {
  const navigate = useNavigate(); // Correctly initializing useNavigate

  const [isSignup, setIsSignup] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset Password
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });

  const [forgotData, setForgotData] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleForgotChange = (e) => {
    const { name, value } = e.target;
    setForgotData({ ...forgotData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password || (isSignup && !formData.username)) {
      toast.error("All fields are required!");
      return;
    }

    try {
      setIsLoading(true);
      const endpoint = isSignup
        ? "http://localhost:5000/user/register"
        : "http://localhost:5000/user/login";

      const requestData = isSignup
        ? { ...formData }
        : { email: formData.email, password: formData.password };

      const response = await axios.post(endpoint, requestData);
      toast.success(isSignup ? "Signup successful! Please log in." : "Login successful!");

      if (!isSignup) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.data.role);
        const role = response.data.data.role;

        // Corrected navigation logic
        if (role === "admin") navigate("/admin");
        else if (role === "student") navigate("/student");
        else if (role === "faculty") navigate("/faculty");
      }

      console.log(`${isSignup ? "Signup" : "Login"} Response:`, response.data);
    } catch (error) {
      console.error("Error:", error.message);
      toast.error(`Failed to ${isSignup ? "sign up" : "log in"}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    try {
      setIsLoading(true);

      if (step === 1) {
        await axios.post("http://localhost:5000/user/fp", { email: forgotData.email });
        toast.success("OTP sent to your email!");
        setStep(2);
      } else if (step === 2) {
        await axios.post("http://localhost:5000/user/fp/verify", forgotData);
        toast.success("Password reset successful!");
        setShowForgotPassword(false);
        setStep(1);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-gray-900 via-gray-400 to-gray-900">
      <div className="bg-gray-200 p-8 rounded-3xl shadow-2xl w-full sm:w-96">
        <ToastContainer />
        {!showForgotPassword ? (
          <>
            <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">
              {isSignup ? "Create an Account" : "Log In"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="text-sm font-semibold text-gray-600">Email</label>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="w-full p-3 mt-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              {isSignup && (
                <div className="mb-4">
                  <label className="text-sm font-semibold text-gray-600">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter your username"
                    className="w-full p-3 mt-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              )}
              <div className="mb-4">
                <label className="text-sm font-semibold text-gray-600">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="w-full p-3 mt-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button
                type="submit"
                className={`w-full p-3 font-semibold rounded-lg ${
                  isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-gray-700 text-white hover:bg-black"
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : isSignup ? "Sign Up" : "Log In"}
              </button>
            </form>
            <p onClick={() => setIsSignup(!isSignup)} className="mt-4 text-center text-sm cursor-pointer hover:underline">
              {isSignup ? "Already have an account? Log In" : "Don’t have an account? Sign Up"}
            </p>
            {!isSignup && (
              <p onClick={() => setShowForgotPassword(true)} className="mt-2 text-center text-sm cursor-pointer hover:underline">
                Forgot Password?
              </p>
            )}
          </>
        ) : (
          <div>
            <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">Forgot Password</h2>
            <div className="mb-4">
              {step === 1 ? (
                <>
                  <label className="text-sm font-semibold text-gray-600">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={forgotData.email}
                    onChange={handleForgotChange}
                    placeholder="Enter your email"
                    className="w-full p-3 mt-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button onClick={handleForgotPassword} className="mt-4 w-full p-3 bg-gray-700 text-white rounded-lg">
                    Send OTP
                  </button>
                </>
              ) : (
                <>
                  <input type="text" name="otp" value={forgotData.otp} onChange={handleForgotChange} placeholder="Enter OTP" className="w-full p-3 mt-2 border-2 rounded-lg" />
                  <input type="password" name="newPassword" value={forgotData.newPassword} onChange={handleForgotChange} placeholder="New password" className="w-full p-3 mt-2 border-2 rounded-lg" />
                  <button onClick={handleForgotPassword} className="mt-4 w-full p-3 bg-gray-700 text-white rounded-lg">Reset Password</button>
                </>
              )}
            </div>
            <p onClick={() => setShowForgotPassword(false)} className="mt-4 text-center text-sm cursor-pointer hover:underline">Back to Login</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginSignup;
