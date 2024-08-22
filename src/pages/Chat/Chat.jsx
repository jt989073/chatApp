import "./Chat.css";
import ChatBox from '../../components/ChatBox'
import RightSideBar from '../../components/RightSideBar'
import LeftSideBar from '../../components/LeftSideBar'

const Chat = () => {
  return (
    <div className="chat">
      <div className="chat-container">
        <LeftSideBar />
        <ChatBox />
        <RightSideBar />
      </div>
    </div>
  );
};

export default Chat;
