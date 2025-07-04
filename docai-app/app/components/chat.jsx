'use client';

import { useState, useEffect, useRef } from 'react';
import { useChat } from 'ai/react';
import Image from 'next/image';

const Chat = () => {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/diagnose',
  });

  const chatContainerRef = useRef(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const renderResponse = () => (
    <div className='response'>
      {messages.map((m, index) => (
        <div
          key={m.id || index}
          className={`chat-line ${m.role === 'user' ? 'user-chat' : 'ai-chat'}`}
        >
          <Image
            className='avatar'
            src={m.role === 'user' ? '/images/avatar.jpg' : '/ai-avatar.png'}
            alt='Avatar'
            width={40}
            height={40}
          />
          <div style={{ width: '100%', marginLeft: '16px' }}>
            <p className='message'>{m.content}</p>
            {index < messages.length - 1 && <div className='horizontal-line' />}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div ref={chatContainerRef} className='chat'>
      {renderResponse()}
      <form onSubmit={handleSubmit} className='chat-form'>
        <input
          type='text'
          name='input'
          placeholder='What is wrong with health?'
          onChange={handleInputChange}
          value={input}
          disabled={isLoading}
        />
        <button type='submit' className='main-button'>
          {isLoading ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default Chat;
