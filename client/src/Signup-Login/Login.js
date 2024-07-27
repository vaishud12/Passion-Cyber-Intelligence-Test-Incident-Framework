import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        
      });
  

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");

      }
      
      const data = await response.json();
      console.log("Response data:", data);

      if (data.token) {
        // Save token in local storage or context
        localStorage.setItem("token", data.token);
        navigate("/chatbot");
      } else {
        alert("Login failed: Token not provided");
      }
    } catch (err) {
      console.error("Error:", err);
      alert(`Login failed: ${err.message}`);
    }
  };

  return (
    <div className="login-container bg-gray-100 h-screen flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-sm">
          Don't have an account? <Link to="/" className="text-blue-500">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
