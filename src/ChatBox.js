import React, { useState, useEffect, useRef } from 'react';
import { createChat, postMessage, getChatState } from './ChatService';
import './ChatBox.css';

const ChatBox = () => {
  const [chatId, setChatId] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date().toISOString());

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const initChat = async () => {
      const chatSessionId = `chat_${new Date().getTime()}`;
      const instructions = "You are TailoredTales, a guide in the quest for the perfect read. Respond with brief, engaging hints, leading seekers to books that fit as if destined, blending curiosity with the promise of a great discovery.";
      setChatId(chatSessionId);
      await createChat(chatSessionId, instructions);
    };

    initChat();
  }, []);

  const pollForMessages = async () => {
    const maxPollingDuration = 10000;
    const pollingInterval = 200;
    let totalPollingTime = 0;
  
    const poll = setInterval(() => {
      getChatState(chatId, lastUpdate).then(data => {
        if (data.exists) {
          const assistantMessages = data.recentMessages.filter(msg => msg.role === 'assistant');
          if (assistantMessages.length > 0) {
            setMessages(prevMessages => [...prevMessages, ...assistantMessages]);
            setLastUpdate(new Date().toISOString());
            clearInterval(poll);
          }
        }
      });
  
      totalPollingTime += pollingInterval;
      if (totalPollingTime >= maxPollingDuration) {
        clearInterval(poll);
      }
    }, pollingInterval);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message) {
      const tempMessage = {
        content: message,
        role: 'user',
        id: new Date().getTime(),
      };
      setMessages(prevMessages => [...prevMessages, tempMessage]);
      await postMessage(chatId, message);
      setMessage('');
      pollForMessages();
    }
  };

  useEffect(() => {
    const messagesContainer = messagesEndRef.current;
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [messages]);
  
  return (
    <div className="chatbox-container">
      <div className="chatbox-header">
        Tailored Tales
      </div>
      <div className="chatbox-messages" ref={messagesEndRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            {msg.role === 'assistant' && <div className="message-role">Assistant</div>}
            <span>{msg.content}</span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="chatbox-form">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask me about books..."
          className="chatbox-input"
        />
      </form>
    </div>
  );
};

export default ChatBox;
