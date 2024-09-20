import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as API from "../Endpoint/Endpoint";
import logo from "./logo.jpeg"
import loginimg from "./loginimg.png";
import { SocialIcon } from 'react-social-icons';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(null); // Initial state is null
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // Define navigate
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const response = await fetch(API.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Response Data:', data);

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem('userEmail', data.email);
        localStorage.setItem('isAdmin',data.isAdmin.toString())
        console.log('Stored Email:', localStorage.getItem('userEmail'));
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
        navigate("/Adminmain"); // Navigate to admin route
      } else {
        navigate("/Home"); // Navigate to user route
      }
    }
  }, [isAdmin, navigate]);

  return (
<>
<div className="flex flex-col lg:flex-row h-full lg:h-screen">
        {/* Text and Image Section */}
        <div className="flex-1 bg-gray-200 p-6">
          <div className="flex flex-col lg:flex-row items-center lg:items-start lg:space-x-10">
            {/* Text Content */}
            <div className="flex-1">
              <h1 className="text-center text-2xl lg:text-2xl font-bold text-blue-800 mb-6">
                WELCOME TO THE PASSION INCIDENT FRAMEWORK
              </h1>
              <div className="lg:flex lg:space-x-5">
                <div className="flex-1 mb-8 lg:mb-0">
                  <p className="mb-4">
                    At PASSIONIT PCOMBINATOR, we believe in streamlining
                    business operations to help organizations thrive. Our
                    incident management tool is designed to provide a
                    comprehensive solution for managing product defects,
                    customer support issues, product repairs, and ongoing
                    maintenance.
                  </p>
                  <p className="mb-4">
                    Seamlessly integrating into any website as a bot, our tool
                    is tailored for SMEs, MSMEs, cooperative banks, startups,
                    and angel groups. We aim to move beyond the traditional
                    "Contact Us" approach by offering a proactive, dynamic
                    solution to help minimize risks and resolve business issues
                    before they escalate.
                  </p>
                  

                  
                </div>

                {/* Image */}
                <div className="flex-1 mt-4 lg:mt-0 lg:w-1/2">
                  <img
                    src={loginimg}
                    alt="Welcome"
                    className="w-full max-w-xs lg:max-w-md h-auto rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 w-full">
                    <p className="mb-4">
                      Leveraging our innovative PASSION Framework, we focus on
                      ensuring smooth operations across various business units,
                      reducing downtime, and improving customer satisfaction.
                      Whether you're a growing startup or an established bank,
                      PASSIONIT PCOMBINATOR empowers your organization with
                      intelligent, reliable, and automated incident management.
                    </p>
                  </div>
          {/* Vision Section */}
          <div className="mt-8 w-full">
            <h2 className="text-xl font-semibold mb-4">Vision</h2>
            <p className="mb-4">
              To empower organizations of all sizes with intelligent tools that
              enhance operational efficiency, streamline incident management,
              and create a seamless experience for both customers and internal
              teams, leading to minimized risks and maximized productivity.
            </p>
          </div>
        </div>

    <div className="flex-1 bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-8 bg-white rounded-lg shadow-md">
      <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="h-12" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">Login</h2>
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
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        required
      />
      <div className="mt-2">
        <label className="text-gray-700 text-sm">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
            className="mr-2"
          />
          Show Password
        </label>
      </div>
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
    </div>

{/* Full-length Section */}
<div className="w-full bg-gray-100 p-9">
        <h2 className="text-xl font-semibold mb-4">Mission</h2>
        <p className="mb-4">
          To revolutionize the way businesses handle incidents by providing an
          easy-to-integrate, AI-driven solution that proactively identifies,
          manages, and resolves product and service issues. We are committed to
          using the PASSION Framework to guide businesses toward efficient
          operations, risk reduction, and sustainable growth, enabling them to
          focus on innovation and customer satisfaction.
        </p>

        <div className="flex justify-center mt-4">
          <SocialIcon network="linkedin" url="https://www.linkedin.com/in/dr-prakash-sharma-330743a3/" />
        </div>
      </div>
</>
  );
}

export default Login;
