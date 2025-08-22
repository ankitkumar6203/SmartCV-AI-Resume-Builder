import React, { useState, useEffect, useRef } from "react";


const AIChatBox = () => {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("aiChatMessages");
    return saved ? JSON.parse(saved) : [];
  });
  const [userMessage, setUserMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("aiChatMessages", JSON.stringify(messages));
  }, [messages]);

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    const newMessages = [...messages, { sender: "user", text: userMessage }];
    setMessages(newMessages);
    setUserMessage("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/ai/resume-helper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();

      setMessages([
        ...newMessages,
        { sender: "ai", text: data.response || "No response" },
      ]);
    } catch (err) {
      console.error("AI request failed:", err);
      setMessages([
        ...newMessages,
        { sender: "ai", text: "⚠️ Error connecting to AI service." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    localStorage.removeItem("aiChatMessages");
  };

  return (
    <div className="flex flex-col bg-white rounded-xl shadow-lg p-4 h-[400px] sm:h-[500px]">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold">🤖 AI Resume Assistant</h2>
        <button
          onClick={handleClearChat}
          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
        >
          Clear Chat
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto mb-2 p-2 border rounded-lg bg-gray-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`my-2 p-2 rounded-lg max-w-[80%] ${
              msg.sender === "user"
                ? "bg-blue-500 text-white self-end ml-auto"
                : "bg-gray-200 text-gray-800 self-start mr-auto"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && <div className="italic text-gray-500">AI is typing...</div>}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex">
        <input
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border p-2 rounded-lg mr-2"
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button
          onClick={handleSendMessage}
          className="px-4 py-2 bg-green-600 text-white rounded-lg"
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AIChatBox;
