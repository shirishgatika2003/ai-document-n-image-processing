import { useState } from "react";
import { GoogleGenAI } from "@google/genai";
import "./chat.css";

function Chat({ fileUploaded }) {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);

  async function handleSend(e) {
    e.preventDefault();
    if (userInput.trim() !== "") {
      // setMessages([...messages, { role: "user", text: userInput }]);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "user", text: userInput },
      ]);
      setUserInput("");
      try {
        const ai = new GoogleGenAI({
          apiKey: import.meta.env.VITE_GEMINI_API_KEY,
        });
        const base64Data = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(fileUploaded);
          reader.onload = () => resolve(reader.result.split(",")[1]);
          reader.onerror = (error) => reject(error);
        });

        // call ai.models.generateCOntent with model and contents
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: [
            {
              inlineData: {
                data: base64Data,
                mimeType: fileUploaded.type,
              },
            },
            `Answer this question based on the document: ${userInput}
            Answer as a chatbot with short messages adn text only (no markdown, tags, or code blocks).
            Chat history: ${JSON.stringify(messages)}
            `,
          ],
        });
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "model", text: response.text },
        ]);
      } catch (error) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            role: "error",
            text: "Something went wrong, please try again later!",
          },
        ]);
      }
    }
  }

  return (
    <section className="chat-window">
      <hr />
      <h2>Chat</h2>
      {messages.length > 0 && (
        <div className="chat">
          {messages?.map((message, index) => (
            <div key={index} className={`message ${message.role}`}>
              <p>{message.text}</p>
            </div>
          ))}
        </div>
      )}
      <div className="input-area">
        <input
          type="text"
          id="user-input"
          placeholder="Ask a question about the document..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <button id="send-button" onClick={handleSend}>
          Send
        </button>
      </div>
    </section>
  );
}

export default Chat;
