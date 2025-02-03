import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const useWebSocket = (userId) => {
  const [stompClient, setStompClient] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!userId) return; // Ensure userId is available

    const socket = new WebSocket("http://localhost:8080/ws-chat");
    const client = new Client({
      webSocketFactory: () => new WebSocket("ws://localhost:8080/ws-chat"),
      onConnect: () => console.log("Connected"),
      onDisconnect: () => console.log("Disconnected"),
      onStompError: (frame) => console.error("STOMP Error: ", frame),
    });

    setStompClient(client); // ✅ Set before activating
    client.activate(); // ✅ Activate after setting

    return () => {
      if (client) {
        client.deactivate();
        console.log("WebSocket Client Deactivated");
      }
    };
  }, [userId]);

  const sendMessage = (messageContent, senderId, receiverId) => {
    if (stompClient && stompClient.connected) {
      const message = { senderId, receiverId, content: messageContent };
      stompClient.publish({
        destination: "/app/chat",
        body: JSON.stringify(message),
      });
    } else {
      console.error("STOMP Client not connected");
    }
  };

  return { messages, sendMessage };
};

export default useWebSocket;
