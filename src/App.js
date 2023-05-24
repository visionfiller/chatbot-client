import React, { useEffect, useRef } from "react";
import "./App.css";

const data = {
  headerText: "Hello hello ✨",
  pText: "I'm a cute chatbot!",
  p2Text: "I can help you with your horoscope",
  conversation: [],
  isLoading: false
};

function App() {
  const [conversation, setConversation] = React.useState(data.conversation);
  const [isLoading, setIsLoading] = React.useState(data.isLoading);
  const [loadingConvo, setLoadingConvo] = React.useState([])

  const updateUserMessages = (newMessage) => {
    if (!newMessage) {
      return;
    }
    setIsLoading(true) //we set loading to true here to display the balls in the assistant message bubble while we wait for the response from the server
    const newConversation = [
      ...conversation,
      { role: "user", content: newMessage }
    ]
    // const loadingConversation = [
    //   ...newConversation,
    //   { role: "assistant", content: "Loading" }
    // ]

    // send POST request to local server with the conversation payload for chat response 
    // "http://localhost:8088/chat", {//i will fill in this function later
    // it is necessary to temporarily use 'loading' as a message until we get a reponse from the server if we want to display the ellipses 
    setConversation([
      ...newConversation
    ])
    setLoadingConvo([
      ...newConversation,
      { role: "assistant", content: "Loading" }
    ])

    // setConversation(loadingConversation)

    fetch('http://localhost:8088/chat', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newConversation)
    }).then(res => res.json())
      .then((response) => setConversation([
        ...newConversation,
        { role: "assistant", content: response }
      ])).then(() => setIsLoading(false))



    //then i will set the assistant message in this conversation with the actual response from the assistant  



  };
  const showMessages = () => {
    if (isLoading) {
      return loadingConvo.map((message, index) => (
        <MessageBubble
          key={index}
          message={message.content}
          role={message.role}
          isLoading={isLoading}
        />
      ))
    }
    return conversation.map((message, index) => (
      <MessageBubble
        key={index}
        message={message.content}
        role={message.role}
        isLoading={isLoading}
      />
    ));
  };

  const onInput = (event) => {
    if (event.key === "Enter" && isLoading === false) {
      const userInput = event.target.value;

      updateUserMessages(userInput);
      event.target.value = "";
    }
  };

  const onClick = () => {
    if (isLoading === false) {
      const inp = document.getElementById("chat");
      const userInput = inp.value;
      updateUserMessages(userInput);
      inp.value = "";
    }
  };

  return (
    <div className="app-container">
      <Header
        headerText={data.headerText}
        pText={data.pText}
        p2Text={data.p2Text}
      />
      <div className="chat-container">
        <ChatHeader />
        <div className="msg-container">{showMessages()}</div>
        <UserInput onInput={onInput} onClick={onClick} />
      </div>
    </div>
  );
}

function MessageBubble(props) {
  const messageClass = props.role === "user" ? "user" : "assistant";
  //if is loading from props
  return (
    <div className={`message-container ${messageClass}-message-container`}>
      {props.role === "assistant" && props.isLoading && props.message === 'Loading' ? (
        <div className={`chat-bubble ${messageClass}`}>
          <div className="assistant-avatar">
            <div className="balls">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
      ) : (
        <div className={`chat-bubble ${messageClass}`}>
          {props.message}
        </div>
      )}
    </div>
  );
}


function Header(props) {
  return (
    <div className="header">
      <div className="header-img" />
      <h1> {props.headerText} </h1>
      <h2> {props.pText} </h2>
      <p> {props.p2Text} </p>
    </div>
  );
}

function ChatHeader() {
  return (
    <div className="chat-header">
      <div className="dot" />
      <div className="dot" />
      <div className="dot" />
    </div>
  );
}

function UserInput(props) {
  return (
    <div className="input-container">
      <input
        id="chat"
        type="text"
        onKeyPress={props.onInput}
        placeholder="Type something..."
      />
      <button className="input-submit" onClick={props.onClick} />
    </div>
  );
}

export default App;