"use client";

// import { useState, useEffect, useRef } from "react";
// import Image from "next/image";

// const Chat = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const chatContainerRef = useRef(null);

//   // Auto-scroll
//   useEffect(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop =
//         chatContainerRef.current.scrollHeight;
//     }
//   }, [messages]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!input.trim()) return;

//     const newMessages = [...messages, { role: "user", content: input }];
//     setMessages(newMessages);
//     setIsLoading(true);
//     setInput("");

//     try {
//       const res = await fetch("http://localhost:3000/api/diagnose", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ messages: newMessages }),
//       });

//       const data = await res.json();
//       if (data?.content) {
//         setMessages([
//           ...newMessages,
//           { role: "assistant", content: data.content },
//         ]);
//       }
//     } catch (err) {
//       setMessages([
//         ...newMessages,
//         { role: "assistant", content: "❌ Failed to get response." },
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div ref={chatContainerRef} className="chat">
//       <h1>
//         Hi I am Elohdoc your health assistant, kindly telll me about your health
//         problems
//       </h1>
//       <div className="response">
//         {messages.map((m, index) => (
//           <div
//             key={index}
//             className={`chat-line ${
//               m.role === "user" ? "user-chat" : "ai-chat"
//             }`}
//           >
//             <Image
//               className="avatar"
//               src={m.role === "user" ? "/images/avatar.jpg" : "/ai-avatar.png"}
//               alt="Avatar"
//               width={40}
//               height={40}
//             />
//             <div style={{ width: "100%", marginLeft: "16px" }}>
//               <p className="message">{m.content}</p>
//               {index < messages.length - 1 && (
//                 <div className="horizontal-line" />
//               )}
//             </div>
//           </div>
//         ))}
//       </div>

//       <form onSubmit={handleSubmit} className="chat-form mt-10">
//         <input
//           type="text"
//           name="input"
//           onChange={(e) => setInput(e.target.value)}
//           value={input}
//           disabled={isLoading}
//           className="bg-gray-200 text-black px-4 py-2 rounded-l-md w-[2/3] shadow-sm outline-none"
//         />
//         <button
//           type="submit"
//           className="ml-5 px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 disabled:opacity-50"
//           disabled={isLoading}
//         >
//           {isLoading ? "..." : "Send"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Chat;



import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { saveDiagnosis } from '../lib/firebase'; // ✅ make sure this path is correct

const Chat = ({ currentUserId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setIsLoading(true);
    setInput('');

    try {
      const res = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, userId: currentUserId }),
      });

      const data = await res.json();
      const aiResponse = data?.content;

      if (aiResponse) {
        const updatedMessages = [...newMessages, { role: 'assistant', content: aiResponse }];
        setMessages(updatedMessages);

        // ✅ Save diagnosis if the response recommends consultation
        if (aiResponse.includes('Consult Now') && currentUserId) {
          await saveDiagnosis({
            userId: currentUserId,
            symptoms: newMessages
              .filter((m) => m.role === 'user')
              .map((m) => m.content)
              .join('; '),
            diagnosis: aiResponse,
          });
        }
      }
    } catch (err) {
      console.error('❌ Failed to get response:', err);
      setMessages([
        ...messages,
        { role: 'assistant', content: '❌ Failed to get response.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={chatContainerRef} className="chat">
      <h1 className="text-xl font-semibold mb-4">
        Hi I am Elohdoc, your health assistant. Kindly tell me about your health problems.
      </h1>

      <div className="response">
        {messages.map((m, index) => (
          <div
            key={index}
            className={`chat-line ${m.role === 'user' ? 'user-chat' : 'ai-chat'}`}
          >
            <Image
              className="avatar"
              src={m.role === 'user' ? '/images/avatar.jpg' : '/ai-avatar.png'}
              alt="Avatar"
              width={40}
              height={40}
            />
            <div style={{ width: '100%', marginLeft: '16px' }}>
              <p className="message">{m.content}</p>
              {index < messages.length - 1 && <div className="horizontal-line" />}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="chat-form mt-10 flex">
        <input
          type="text"
          name="input"
          onChange={(e) => setInput(e.target.value)}
          value={input}
          disabled={isLoading}
          className="bg-gray-200 text-black px-4 py-2 rounded-l-md w-[70%] shadow-sm outline-none"
        />
        <button
          type="submit"
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default Chat;
