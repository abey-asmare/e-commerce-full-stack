import { useState } from 'react';
import PropTypes from 'prop-types';
import { Send } from 'lucide-react';

const MessageSection = ({ clientName, productOwnerName, initialMessages, className }) => {
  const [messages, setMessages] = useState(initialMessages || []);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (sender) => {
    if (newMessage.trim() === '') return;

    const message = {
      id: Date.now(),
      sender,
      content: newMessage,
      timestamp: new Date().toLocaleString(),
    };

    setMessages((prevMessages) => [...prevMessages, message]);
    setNewMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage('client');
    } else if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      handleSendMessage('productOwner');
    }
  };

  return (
    <div className={`flex flex-col h-[400px] border-t mt-1 rounded-lg bg-white ${className}`}>
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages && messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === 'client' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.sender === 'client'
                    ? 'bg-black text-white'
                    : 'bg-[#E6D5B8] text-gray-800'
                }`}
              >
                <p className="font-bold">
                  {message.sender === 'client' ? clientName : productOwnerName}
                </p>
                <p className="mt-1">{message.content}</p>
                <p className="text-xs mt-1 opacity-75">{message.timestamp}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">
            <p>No messages yet.</p>
            <p className="text-sm">Start a conversation about your order!</p>
          </div>
        )}
      </div>
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-grow px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button
            onClick={() => handleSendMessage('client')}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-2 text-sm text-gray-500 flex items-center justify-between">
          {/* <span>Press Enter to send as {clientName}</span>
          <button
            onClick={() => handleSendMessage('productOwner')}
            className="px-4 py-1 rounded-lg bg-[#E6D5B8] text-gray-800 hover:bg-[#d8c7aa] transition-colors"
          >
            Send as {productOwnerName}
          </button> */}
        </div>
      </div>
    </div>
  );
};

MessageSection.propTypes = {
  className: PropTypes.string,
  clientName: PropTypes.string.isRequired,
  productOwnerName: PropTypes.string.isRequired,
  initialMessages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      sender: PropTypes.oneOf(['client', 'productOwner']).isRequired,
      content: PropTypes.string.isRequired,
      timestamp: PropTypes.string.isRequired,
    })
  ),
};

MessageSection.defaultProps = {
  initialMessages: [],
};

export default MessageSection;

