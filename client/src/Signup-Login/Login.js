import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(null); // Initial state is null
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate(); // Define navigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Response Data:', data);

      if (response.ok) {
        localStorage.setItem("token", data.token);
        setIsAdmin(data.isAdmin); // Set isAdmin based on response
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
      console.error("Error:", err);
    } finally {
      setLoading(false); // End loading
    }
  };

  // Use useEffect to navigate based on admin status
  useEffect(() => {
    if (isAdmin !== null) {
      if (isAdmin) {
        navigate("/adminmain"); // Navigate to admin route
      } else {
        navigate("/chatbot"); // Navigate to user route
      }
    }
  }, [isAdmin, navigate]);

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
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            disabled={loading} // Disable button while loading
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {loading ? 'Loading...' : 'Login'} {/* Show loading text */}
          </button>
        </form>
        <p className="mt-4 text-sm">
          Don't have an account? <Link to="/" className="text-blue-500">Sign up</Link>
        </p>
        <p className="mt-4 text-sm">
          <Link to="/forgetPassword" className="text-blue-500">Forget Password</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
