import React, { useState, useEffect, useRef } from 'react';
import './ChatScreen.css'; // We'll create this CSS file next

function Home() {
  const [lang,setLang] = useState("Eng");
  const [waitingReply,setWaitingReply] = useState("");
  const WS_BASE_URL = process.env.REACT_APP_WS_BASE_URL;
  const [authMsgSent,setAuthMsgSent] = useState(true);
  const [sent,setSent] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const ws = useRef(null);
  const handleReceiveRef = useRef();

  //////////////////////////////////////////
  useEffect(() => {
    handleReceiveRef.current = handleReceive;  // Put latest function in box
  });

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (ws.current) return;
    // Create WebSocket connection (replace with your endpoint)
    ws.current = new WebSocket(WS_BASE_URL);

    // Connection opened
    ws.current.addEventListener('open', () => {
      console.log('WebSocket connected');
      if(token){
        ws.current.send("Bearer "+token);
      }
    });

    // Listen for messages
    ws.current.addEventListener('message', (event) => {
      console.log(event.data);
      handleReceiveRef.current(event);
    });

    // Handle errors
    ws.current.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
    });

    // Connection closed
    ws.current.addEventListener('close', () => {
      console.log('WebSocket disconnected');
    });

    // Cleanup function
    return () => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.close();
      }
    };
  },[]);
  /////////////////////////////////////////////////////////////
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleReceive = (event) => {
  
    const jsonData = JSON.parse(event.data);
   
    if(jsonData.firstmessage){
      setMessages(prev => {
        const newId = prev.length + 1;
        const aiResponse = {
          id: newId,
          text: jsonData.firstmessage,
          sender: 'ai'
        };
        const newMessages = [...prev, aiResponse];
        return newMessages;
      });
    }

    if(jsonData.message){
      console.log("mes"+jsonData.message)
    setMessages(prevMessages => 
      prevMessages.map(msg => 
        msg.id === prevMessages.length 
        ? { ...msg, text: msg.text + jsonData.message }  // Append to text
        : msg
      )
    );}

    setSent(false);
  };


  const handleLanguage = () => {
    if (lang === "Eng"){
      setLang("Sin")
    }
    if (lang === "Sin"){
      setLang("Eng")
    }
      
  }

  const handleSend = () => {
    if (inputValue.trim() === '') return;
    setSent(true);
    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user'
    };
 
    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
   
     const jsonString = JSON.stringify({
      lang: lang,
      msg: inputValue
      });

    ws.current.send(jsonString);
    setMessages(prev => {
        const newId = prev.length + 1;
        const aiResponse = {
          id: newId,
          text: "",
          sender: 'ai'
        };
        const newMessages = [...prev, aiResponse];
        return newMessages;
      });

  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-screen">
      <div className="messages-container">
        {messages.map((message) => {
          // Replace newlines with <br> elements
          const formattedText = message.text
            .split('\n')
            .map((line, index, array) => (
              <React.Fragment key={index}>
                {line}
                {index < array.length - 1 && <br />}
              </React.Fragment>
            ));

          return (
            <div 
              key={message.id} 
              className={`message ${message.sender}`}
            >
              <div className="message-bubble">
                {formattedText}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="input-container">
        <button onClick={handleLanguage}>
          {lang}
        </button>

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
        />
        <button onClick={handleSend} disabled={!inputValue.trim() || sent}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
        
      </div>
    </div>
  );
}

export default Home;
