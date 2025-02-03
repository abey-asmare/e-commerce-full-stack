import React, { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    // Create a SockJS instance
    const socket = new SockJS("http://localhost:8080/chat-websocket");

    // Create a STOMP client over the SockJS instance
    const client = Stomp.over(() => socket);

    // Debugging: Log WebSocket lifecycle events
    socket.onopen = () => {
      console.log("SockJS connection opened");
    };

    socket.onclose = () => {
      console.log("SockJS connection closed");
    };

    socket.onerror = (error) => {
      console.error("SockJS error:", error);
    };

    // Connect to the WebSocket
    client.connect(
      {}, // No headers needed
      () => {
        setStompClient(client);
        console.log("STOMP connection established");

        // Subscribe to the public topic
        client.subscribe("/topic/public", (message) => {
          const newMessage = JSON.parse(message.body);
          console.log("Received message:", newMessage);
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        });
      },
      (error) => {
        console.error("STOMP connection error:", error);
      }
    );

    // Cleanup on component unmount
    return () => {
      if (client.connected) {
        client.disconnect(() => {
          console.log("STOMP connection disconnected");
        });
      }
    };
  }, []);

  const sendMessage = () => {
    if (stompClient && input.trim()) {
      const message = {
        content: input,
        sender: "User", // Replace with a dynamic username if needed
      };
      stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(message));
      console.log("Sent message:", message);
      setInput("");
    }
  };

  return (
    <div>
      <h1>Real-Time Chat</h1>
      <div>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>
              <strong>{msg.sender}:</strong> {msg.content}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
