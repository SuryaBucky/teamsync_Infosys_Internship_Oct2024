import React, { useState, useEffect, useRef } from 'react';
import dummyData from '../data/dummyData.json';
import { BiChat } from 'react-icons/bi';

const ChatModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [media, setMedia] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userReactions, setUserReactions] = useState({});
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMessages(dummyData.messages);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setMedia(null);
  };

  const sendMessage = async () => {
    if (message.trim() !== '' || media) {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const newMessage = {
        user: 'You',
        message: message.trim(),
        likes: 0,
        dislikes: 0,
        media: media ? URL.createObjectURL(media) : null,
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage('');
      setMedia(null);
    }
  };

  const reactToMessage = (index, reactionType) => {
    if (!userReactions[index]) {
      setUserReactions((prev) => ({
        ...prev,
        [index]: reactionType,
      }));

      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        if (reactionType === 'like') {
          updatedMessages[index].likes += 1;
        } else if (reactionType === 'dislike') {
          updatedMessages[index].dislikes += 1;
        }
        return updatedMessages;
      });
    }
  };

  return (
    <>
      <button 
        onClick={openModal} 
        className="bg-blue-950 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition duration-300 ease-in-out mr-2"
        aria-label="Open Chat"
        title="Open Chat"
      >
        <BiChat className="w-5 h-5 inline" />
      </button>

      {isOpen && (
        <div className="fixed z-10 top-40 right-5 bg-transparent">
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="bg-white rounded-2xl shadow-xl transform transition-all sm:max-w-md w-full overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-3 border-b rounded-t-2xl">
                <h3 className="text-lg font-bold text-white">Chat Room</h3>
              </div>
              <div className="px-4 py-5 h-80 overflow-y-auto space-y-3 bg-gray-100 rounded-b-2xl">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded-2xl ${index % 2 === 0 ? 'bg-green-100 text-gray-800 ml-auto' : 'bg-gray-300 text-gray-900 mr-auto'}`}
                    style={{ maxWidth: '70%' }}
                  >
                    <p className="font-semibold">{msg.user}:</p>
                    <p>{msg.message}</p>
                    {msg.media && (
                      <img src={msg.media} alt="uploaded" className="mt-2 max-w-full h-auto rounded-2xl" />
                    )}
                    <div className="flex items-center space-x-2 mt-1">
                      <button 
                        onClick={() => reactToMessage(index, 'like')} 
                        className={`text-xs ${userReactions[index] === 'like' ? 'text-green-600' : 'text-gray-600'} hover:text-green-600`}
                        disabled={userReactions[index] === 'like'}
                      >
                        👍 {msg.likes}
                      </button>
                      <button 
                        onClick={() => reactToMessage(index, 'dislike')} 
                        className={`text-xs ${userReactions[index] === 'dislike' ? 'text-red-600' : 'text-gray-600'} hover:text-red-600`}
                        disabled={userReactions[index] === 'dislike'}
                      >
                        👎 {msg.dislikes}
                      </button>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="bg-gray-50 px-4 py-3 flex items-center space-x-3 rounded-b-2xl">
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
                    onChange={(e) => setMedia(e.target.files[0])}
                    className="hidden"
                    accept="image/*,video/*"
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
