import { useContext, useEffect, useState } from "react";
import assets from "../../assets/assets";
import "./ChatBox.css";
import { AppContext } from "../../contexts/AppContext";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { toast } from "react-toastify";

const ChatBox = () => {
  const { userData, messagesId, chatUser, messages, setMessages } =
    useContext(AppContext);

  const [input, setInput] = useState("");

  useEffect(() => {
    if (messagesId) {
      const unSub = onSnapshot(doc(db, "Messages", messagesId), (res) => {
        setMessages(res.data().messages.reverse());
      });

      return () => {
        unSub();
      };
    }
  }, [messagesId]);

  const sendMessage = async () => {
    try {
      if (input && messagesId) {
        await updateDoc(doc(db, "Messages", messagesId), {
          messages: arrayUnion({
            sId: userData.id,
            text: input,
            createdAt: Date.now(),
          }),
        });

        const userIDs = [chatUser.rId, userData.id];
        userIDs.forEach(async (id) => {
          const userChatsRef = doc(db, "chats", id);
          const userChatsSnapshot = await getDoc(userChatsRef);
          if (userChatsSnapshot.exists()) {
            const userChatData = userChatsSnapshot.data();
            const chatIdx = userChatData.chatsData.findIndex(
              (ele) => ele.messageId === messagesId
            );
            userChatData.chatsData[chatIdx].lastMessage = input.slice(0, 30);
            userChatData.chatsData[chatIdx].updatedAt = Date.now();
            if (userChatData.chatsData[chatIdx].rId === userData.id) {
              userChatData.chatsData[chatIdx].messageSeen = false;
            }
            await updateDoc(userChatsRef, {
              chatsData: userChatData.chatsData,
            });
          }
        });
      }
    } catch (e) {
      toast.error(e.message)
    }
    setInput('')
  };


  const convertTime = time => {
    const date = new Date(time); 
    let hour = date.getHours();
    const minute = date.getMinutes().toString().padStart(2, '0'); 
    const ampm = hour >= 12 ? 'PM' : 'AM';
    
    hour = hour % 12;
    hour = hour ? hour : 12; 
  
    return `${hour}:${minute} ${ampm}`;
  }

  return chatUser ? (
    <div className="chat-box">
      <div className="chat-user">
        <img src={chatUser.userData.avatar} alt="" />
        <p>
          {chatUser.userData.name}{" "}
          <img className="dot" src={assets.green_dot} alt="" />
        </p>
        <img src={assets.help_icon} alt="" />
      </div>

      <div className="chat-msg">
        {messages.map((msg, idx) => (
        <div key={idx} className={msg.sId === userData.id ? 's-msg' : 'r-msg'}>
          <p className="msg">{msg.text}</p>
          <div>
            <img src={msg.sId === userData.id ? userData.avatar : chatUser.userData.avatar} alt="" />
            <p>{convertTime(msg.createdAt)}</p>
          </div>
        </div>

        ))}
      </div>
      <div className="chat-input">
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          placeholder="Send a message"
        />
        <input
          type="file"
          id="image"
          accept="image/png, image/jpeg, image.jpg"
          hidden
        />
        <label htmlFor="image">
          <img src={assets.gallery_icon} alt="" />
        </label>
        <img onClick={sendMessage} src={assets.send_button} alt="" />
      </div>
    </div>
  ) : (
    <div className="chat-welcome">
      <img src={assets.logo_icon} alt="" />
      <p>Chat anytime, anywhere</p>
    </div>
  );
};

export default ChatBox;
