import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { GoScreenNormal, GoScreenFull, GoX, GoSync } from 'react-icons/go';
import { SiGooglemessages } from 'react-icons/si';
import BotAinput from './BotAinput'; // Import the BotAinput component
import Main from './Main';

const Chatbot = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [minimized, setMinimized] = useState(false);
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    const [userId, setUserId] = useState('');
    const messagesEndRef = useRef(null);
    
    useEffect(() => {
        const decodeToken = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const decoded = jwtDecode(token);
                    const userId = parseInt(decoded.userId, 10);
                    setUserId(userId);
                    localStorage.setItem('user_id', userId);

                    console.log('Decoded token:', decoded); // Debug decoded token
                    console.log('User ID:', userId); // Debug user ID

                    // Fetch user data to check if the user is an admin
                    // try {
                    //     const response = await axios.get(`http://localhost:5000/api/users/${userId}`);
                    //     console.log('User data:', response.data); // Debug user data
                       
                    // } catch (error) {
                    //     console.error('Error fetching user data:', error);
                    // }
                }
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        };

        if (isLoggedIn) {
            decodeToken();
        }
    }, [isLoggedIn]);

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    const handleMinimize = () => {
        setMinimized(true);
    };

    const handleMaximize = () => {
        setMinimized(false);
    };

    const handleClose = () => {
        // Handle close button action
    };

    const handleRefresh = () => {
        // Handle refresh button action
    };

    const handleInputChange = (event) => {
        setInputText(event.target.value);
    };

    const handleSendMessage = async (event) => {
        event.preventDefault();
        const newMessage = { text: inputText, sender: 'user' };
        setMessages([...messages, newMessage]);
        setInputText('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:8000/analyze', {
                description: inputText,
                url: '' // Add URL if needed
            });
            const analysisResult = response.data; // Assuming the response contains analysis results
            const botMessage = { text: JSON.stringify(analysisResult), sender: 'bot' };
            setMessages([...messages, botMessage]);
        } catch (error) {
            console.error('Error analyzing:', error);
            const errorMessage = { text: 'Error analyzing. Please try again.', sender: 'bot' };
            setMessages([...messages, errorMessage]);
        }

        setLoading(false);
    };

    useEffect(() => {
        // Scroll to the bottom of the messages container when messages change
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <div>
            <div>
                <div></div>
                {!showPopup && (
                    <button onClick={togglePopup} className="px-4 py-2 text-white rounded bg-blue hover:bg-blue hover:text-black font-30px">
                        <SiGooglemessages />
                    </button>
                )}
                {showPopup && (
                    <div></div>
                )}
                <div className={`fixed top-4 right-4 ${minimized ? 'hidden' : ''}`}>
                    <div className="bg-white p-6 rounded-lg border border-[#e5e7eb] w-[550px] h-[634px] overflow-y-auto">
                        <div className="flex flex-col space-y-1.5 pb-6 pt-[30px]">
                            <h2 className="p-2 text-lg font-bold tracking-tight text-white bg-blue-800 rounded">Virtual Assistant(ChatBot)</h2>
                            <p className="text-sm text-[#6b7280] leading-3 bg-gray-200 p-2 rounded">WELCOME TO AI GOVERNANCE BOT</p>
                        </div>

                        <div className="absolute flex flex-row items-center justify-center gap-3 p-1 top-2 right-2">
                            <div className="text-white hover:text-red text-[15px] pr-2 rounded-md disabled:pointer-events-none disabled:opacity-30 bg-blue-800 hover:bg-blue-200 h-7 px-2 py-2 " onClick={handleMinimize}>
                                <GoScreenNormal />
                            </div>
                            <div className="text-white hover:text-red text-[15px] pr-2">
                                <GoScreenFull onClick={handleMaximize} />
                            </div>
                            <div className="text-white hover:text-red text-[15px] pr-2 rounded-md disabled:pointer-events-none disabled:opacity-30 bg-blue-800 hover:bg-blue-200 h-7 px-2 py-2 " onClick={handleClose}  >
                                <GoX />
                            </div>
                            <div className="text-white hover:text-red text-[15px] pr-2 rounded-md disabled:pointer-events-none disabled:opacity-30 bg-blue-800 hover:bg-blue-200 h-7 px-2 py-2 " onClick={handleRefresh} >
                                <GoSync />
                            </div>
                        </div>

                        <div className="pr-4">
                            {/* Display messages */}
                            {messages.map((message, index) => (
                                <div key={index} className={`flex gap-3 my-4 text-gray-600 text-sm ${message.sender === "user" ? "justify-end" : ""}`}>
                                    <div className={`py-2 px-4 rounded-lg ${message.sender === "user" ? "bg-blue-800 text-white" : "bg-gray-100 text-gray-700"}`}>
                                        {message.text}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={handleSendMessage} className="absolute bottom-0 left-0 flex items-center justify-center w-full space-x-2">
                            <input
                                className="flex h-10 w-full rounded-md border border-[#e5e7eb] px-3 py-2 text-sm placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#9ca3af] disabled:cursor-not-allowed disabled:opacity-50 text-[#030712] focus-visible:ring-offset-2"
                                placeholder="Type your message"
                                value={inputText}
                                onChange={handleInputChange}
                            />
                            <button
                                type="submit"
                                className={`inline-flex items-center justify-center rounded-md text-sm font-medium text-[#f9fafb] ${loading ? 'disabled:pointer-events-none disabled:opacity-50' : ''} bg-blue-800 hover:bg-blue-900 h-10 px-4 py-2`}
                                disabled={loading}
                            >
                                {loading ? 'Sending...' : 'Send'}
                            </button>
                        </form>

                        {/* Include BotAinput component */}
                        {/* <BotAinput /> */}
                        <Main/>
            
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
