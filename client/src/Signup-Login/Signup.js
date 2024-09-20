import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "./logo.jpeg"
import { SocialIcon } from 'react-social-icons'
import * as API from "../Endpoint/Endpoint";
import loginimg from "./loginimg.png";
function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate(); 

  // Update the fetch URL to point to your backend server
const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    console.log(API.SIGNUP);
    try {
      const response = await fetch(API.SIGNUP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name}),
      });
      if (response.ok) {
        // Redirect to login page or handle success
        navigate("/login");
      } else {
        const data = await response.json();
        alert("Signup failed: " + data);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Signup failed. Please try again later.");
    }
  };
  
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

        {/* Sign Up Section */}
        <div className="relative flex-1 bg-gray-100 flex items-center justify-center">
          <div className="absolute inset-0">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${loginimg})`,
                filter: "blur(8px)",
                zIndex: -1,
                opacity: 0.5,
              }}
            />
          </div>
          <div className="max-w-md w-full mx-auto p-8 bg-white rounded-lg shadow-md relative z-10">
            <div className="flex justify-center mb-4">
              <img src={logo} alt="Logo" className="h-12" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
              Sign Up
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Name:
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Email:
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Password:
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Confirm Password:
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Sign Up
              </button>
            </form>
            <p className="mt-4 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500">
                Log in
              </Link>
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

export default Signup;