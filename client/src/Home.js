import React, { useState } from 'react';
import Navbar from './Navbar';
import Chatbot from './BotAnalysis/Chatbot'; // Assuming you have a Chatbot component


const Home = () => {
  const [chatbotOpen, setChatbotOpen] = useState(false);

  const toggleChatbot = () => {
    setChatbotOpen(!chatbotOpen);
  };

  return (
    <>
    
    <div className="relative min-h-screen">
      <Navbar />
      <div className="p-8">
        {/* Other content for your Home screen */}
      </div>

      {/* Chatbot button */}
      <button 
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none"
        onClick={toggleChatbot}
      >
        💬 {/* You can use an icon instead of an emoji */}
      </button>

      {/* Chatbot modal */}
      {chatbotOpen && (
        <div className="">
          <Chatbot />
        </div>
      )}
    </div>
    </>
  );
};

export default Home;
