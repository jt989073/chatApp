import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { db, auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(() => {
        // Retrieve userData from sessionStorage on initial load
        const savedUserData = sessionStorage.getItem('userData');
        return savedUserData ? JSON.parse(savedUserData) : null;
    });
    const [chatData, setChatData] = useState(() => {
        // Retrieve chatData from sessionStorage on initial load
        const savedChatData = sessionStorage.getItem('chatData');
        return savedChatData ? JSON.parse(savedChatData) : null;
    });
    const [messagesId, setMessagesId] = useState(null)
    const [messages, setMessages] = useState([])
    const [chatUser, setChatUser] = useState(null)

    const loadUserData = async (uid) => {
        try {
            const userRef = doc(db, 'Users', uid);
            const userSnap = await getDoc(userRef);
            const userData = userSnap.data();

            if (userData.avatar && userData.name) {
                navigate('/chat');
            } else {
                navigate('/profile');
            }

            await updateDoc(userRef, {
                lastSeen: Date.now()
            });

            setInterval(async () => {
                if (auth.chatUser) {
                    await updateDoc(userRef, {
                        lastSeen: Date.now()
                    });
                }
            }, 60000);

            // Set userData and store it in sessionStorage
            setUserData(userData);
            sessionStorage.setItem('userData', JSON.stringify(userData));
        } catch (e) {
            toast.error(e.message);
            console.error(e);
        }
    };

    useEffect(() => {
        if (userData) {
            const chatRef = doc(db, 'Chats', userData.id);
            const unsub = onSnapshot(chatRef, async (res) => {
                const chatItems = res.data().chatsData;
                const tempData = [];
                for (const item of chatItems) {
                    const userRef = doc(db, 'Users', item.rId);
                    const userSnap = await getDoc(userRef);
                    const userData = userSnap.data();
                    tempData.push({ ...item, userData });
                }
                const sortedData = tempData.sort((a, b) => b.updatedAt - a.updatedAt);
                setChatData(sortedData);
                // Store the sorted chatData in sessionStorage
                sessionStorage.setItem('chatData', JSON.stringify(sortedData));
            });
            return () => { unsub(); };
        }
    }, [userData]);

    const value = {
        userData,
        setUserData: (data) => {
            setUserData(data);
            sessionStorage.setItem('userData', JSON.stringify(data));  // Persist userData to sessionStorage
        },
        chatData,
        setChatData: (data) => {
            setChatData(data);
            sessionStorage.setItem('chatData', JSON.stringify(data));  // Persist chatData to sessionStorage
        },
        loadUserData
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;