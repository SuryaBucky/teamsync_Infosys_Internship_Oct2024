import React, { useState, useEffect, useRef } from 'react';
import dummyData from '../data/dummyData.json';

const ChatModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [media, setMedia] = useState(null); // State to hold the uploaded media
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null); // Reference for auto-scrolling

  useEffect(() => {
    // Load dummy data and initialize the messages state
    setMessages(dummyData.messages);
  }, []);

  useEffect(() => {
    // Scroll to the bottom of the messages when a new message is added
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setMedia(null); // Reset media when closing the modal
  };

  const sendMessage = async () => {
    if (message.trim() !== '' || media) {
      // Simulate a delay to mimic a network request
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Create a message object
      const newMessage = {
        user: 'You',
        message: message.trim(),
        likes: 0,
        dislikes: 0,
        media: media ? URL.createObjectURL(media) : null, // Set media URL if available
      };

      // Add the new message
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage('');
      setMedia(null); // Reset media after sending
    }
  };

  const upvoteMessage = (index) => {
    setMessages((prevMessages) => prevMessages.map((msg, i) =>
      i === index ? { ...msg, likes: msg.likes + 1 } : msg
    ));
  };

  const downvoteMessage = (index) => {
    setMessages((prevMessages) => prevMessages.map((msg, i) =>
      i === index ? { ...msg, dislikes: msg.dislikes + 1 } : msg
    ));
  };

  return (
    <>
      <button onClick={openModal} className="ml-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition duration-300 ease-in-out">
        Open Chat
      </button>
      {isOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto bg-black bg-opacity-50">
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white rounded-lg shadow-xl transform transition-all sm:max-w-lg w-full">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-3 border-b rounded-t-lg">
                <h3 className="text-lg font-bold text-white">Chat Room</h3>
              </div>
              <div className="px-4 py-5 h-64 overflow-y-auto space-y-3 bg-gray-100">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded-lg ${index % 2 === 0 ? 'bg-green-100 text-gray-800 ml-auto' : 'bg-gray-300 text-gray-900 mr-auto'}`}
                    style={{ maxWidth: '70%' }}
                  >
                    <p className="font-semibold">{msg.user}:</p>
                    <p>{msg.message}</p>
                    {msg.media && (
                      <img src={msg.media} alt="uploaded" className="mt-2 max-w-full h-auto rounded" />
                    )}
                    <div className="flex items-center space-x-2 mt-1">
                      <button onClick={() => upvoteMessage(index)} className="text-xs text-gray-600 hover:text-green-600">
                        👍 {msg.likes}
                      </button>
                      <button onClick={() => downvoteMessage(index)} className="text-xs text-gray-600 hover:text-red-600">
                        👎 {msg.dislikes}
                      </button>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} /> {/* Scroll to this div */}
              </div>
              <div className="bg-gray-50 px-4 py-3 flex items-center space-x-3 rounded-b-lg">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-grow border border-gray-300 rounded-full p-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type a message..."
                />
                <label className="flex items-center cursor-pointer">
                  <input
                    type="file"
                    onChange={(e) => setMedia(e.target.files[0])} // Update media state on file selection
                    className="hidden" // Hide the default file input
                    accept="image/*,video/*" // Accept image and video files
                  />
                  <span className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-700">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 12v.01M12 16v.01M12 8v.01M4.5 12A7.5 7.5 0 0112 4.5 7.5 7.5 0 0119.5 12 7.5 7.5 0 0112 19.5 7.5 7.5 0 014.5 12z" />
                    </svg>
                  </span>
                </label>
                <button
                  onClick={sendMessage}
                  className="bg-blue-600 text-white rounded-full px-4 py-2 shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
                >
                  Send
                </button>
                <button
                  onClick={closeModal}
                  className="text-gray-600 hover:text-gray-800 focus:outline-none"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatModal;
