import { createContext, useEffect, useState } from "react";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db, auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(() => {
    const savedUserData = sessionStorage.getItem("userData");
    return savedUserData ? JSON.parse(savedUserData) : null;
  });
  const [chatData, setChatData] = useState(() => {
    const savedChatData = sessionStorage.getItem("chatData");
    return savedChatData ? JSON.parse(savedChatData) : null;
  });
  const [messagesId, setMessagesId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatUser, setChatUser] = useState(null);

  const loadUserData = async (uid) => {
    try {
      const userRef = doc(db, "Users", uid);
      const userSnap = await getDoc(userRef);
      let userData = userSnap.data();

      if (!userData) {
        userData = JSON.parse(sessionStorage.getItem("userData")) || {};
      }

      if (!userData.id) userData.id = uid;
      setUserData(userData);
      sessionStorage.setItem("userData", JSON.stringify(userData));

      if (userData.avatar && userData.name) {
        navigate("/chat");
      } else {
        navigate("/profile");
      }

      await updateDoc(userRef, {
        lastSeen: Date.now(),
      });

      setInterval(async () => {
        if (auth.currentUser) {
          await updateDoc(userRef, {
            lastSeen: Date.now(),
          });
        }
      }, 60000);
    } catch (e) {
      toast.error(e.message);
      console.error(e);
    }
  };

  useEffect(() => {
    if (userData) {
      const chatRef = doc(db, "Chats", userData.id);
      const unSub = onSnapshot(chatRef, async (res) => {
        const chatItems = res.data().chatsData
        const tempData = []
        for (const item of chatItems){
          const  userRef = doc(db, 'users', item.rId)
          const userSnap = await getDoc(userRef)
          const data = userSnap.data()
          tempData.push({...item, data})
        }
        setChatData(tempData.sort((a, b) => b.updatedAt - a.updatedAt))
      })

      return () => {
        unSub()
      }
    }
  }, [userData]);

  const value = {
    userData,
    setUserData: (data) => {
      setUserData(data);
      sessionStorage.setItem("userData", JSON.stringify(data));
    },
    chatData,
    setChatData: (data) => {
      setChatData(data);
      sessionStorage.setItem("chatData", JSON.stringify(data));
    },
    loadUserData,
    messages,
    setMessages,
    messagesId,
    setMessagesId,
    chatUser,
    setChatUser,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
