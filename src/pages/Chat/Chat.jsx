import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../contexts/AppContext";
import "./Chat.css";
import ChatBox from "../../components/ChatBox";
import RightSideBar from "../../components/RightSideBar";
import LeftSideBar from "../../components/LeftSideBar";

const Chat = () => {
  const { chatData, userData } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (chatData && userData) {
      setLoading(false);
    }
  }, [chatData, userData]);

  return (
    <div className="chat">
      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <div className="chat-container">
          <LeftSideBar />
          <ChatBox />
          <RightSideBar />
        </div>
      )}
    </div>
  );
};

export default Chat;
