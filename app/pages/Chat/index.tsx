import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useZGlobalVar } from "../../stores/useZGlobalVar";

export const ChatPage = () => {
  const { socketRef } = useZGlobalVar();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<
    { id: string | undefined; text: string }[]
  >([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const handleReceiveMessage = (data: { id: string; text: string }) => {
      setMessages((prev) => [...prev, data]);
    };

    if (socketRef) {
      socketRef.on("receiveMessage", (data) => handleReceiveMessage(data));
    }

    return () => {
      if (socketRef)
        socketRef.off("receiveMessage", (data) => handleReceiveMessage(data));
    };
  }, [socketRef]);

  const sendMessage = (body: unknown) => {
    socketRef.emit("sendMessage", body);
  };

  const handleSend = () => {
    if (input.trim()) {
      const messageData = { id: socketRef.id, text: input };
      setMessages((prev) => [...prev, messageData]);
      sendMessage(messageData);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-3xl mx-auto bg-gradient-to-br from-gray-50 to-gray-200 shadow-lg rounded-none md:rounded-2xl overflow-hidden border border-gray-300">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-200 py-3 px-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition active:scale-95"
          >
            ← Home
          </button>
          <h2 className="font-semibold text-lg text-gray-700">💬 Chat Room</h2>
        </div>
        <span className="text-sm text-gray-500">{messages.length} msgs</span>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex flex-col ${
              msg.id === socketRef?.id ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`relative px-4 py-2 rounded-2xl text-sm md:text-base shadow-sm ${
                msg.id === socketRef?.id
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </main>

      {/* Footer / Input */}
      <footer className="sticky bottom-0 bg-white border-t border-gray-200 px-3 py-2 flex items-center gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 px-3 py-2 text-sm md:text-base rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none transition"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-md transition active:scale-95"
        >
          Send
        </button>
      </footer>
    </div>
  );
};
