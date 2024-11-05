import React, { useState, useEffect } from 'react';
import dummyData from '../data/dummyData.json';

const ChatModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Load dummy data and initialize the messages state
    setMessages(dummyData.messages);
  }, []);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const sendMessage = () => {
    if (message.trim() !== '') {
      // Add a new message with initial likes and dislikes
      setMessages([...messages, { user: 'You', message: message.trim(), likes: 0, dislikes: 0 }]);
      setMessage('');
    }
  };

  const upvoteMessage = (index) => {
    setMessages(messages.map((msg, i) => (
      i === index ? { ...msg, likes: msg.likes + 1 } : msg
    )));
  };

  const downvoteMessage = (index) => {
    setMessages(messages.map((msg, i) => (
      i === index ? { ...msg, dislikes: msg.dislikes + 1 } : msg
    )));
  };

  return (
    <>
      <button onClick={openModal} className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg">
        Chat
      </button>
      {isOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto bg-gray-900 bg-opacity-50">
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white rounded-lg shadow-xl transform transition-all sm:max-w-lg w-full">
              <div className="bg-blue-600 px-4 py-3 border-b rounded-t-lg">
                <h3 className="text-lg font-medium text-white">Chat</h3>
              </div>
              <div className="px-4 py-5 h-64 overflow-y-auto space-y-3 bg-gray-100">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded-lg ${index % 2 === 0 ? 'bg-blue-500 text-white ml-auto' : 'bg-gray-300 text-gray-900 mr-auto'}`}
                    style={{ maxWidth: '70%' }}
                  >
                    <p><strong>{msg.user}:</strong> {msg.message}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <button onClick={() => upvoteMessage(index)} className="text-xs text-gray-600 hover:text-blue-500">
                        👍 {msg.likes}
                      </button>
                      <button onClick={() => downvoteMessage(index)} className="text-xs text-gray-600 hover:text-red-500">
                        👎 {msg.dislikes}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-gray-50 px-4 py-3 flex items-center space-x-3 rounded-b-lg">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-grow border rounded-full p-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type a message..."
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-600 text-white rounded-full px-4 py-2 shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
