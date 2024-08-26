import { useNavigate } from "react-router-dom";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import assets from "../../assets/assets";
import "./LeftSideBar.css";
import { useContext, useState } from "react";
import { AppContext } from "../../contexts/AppContext";
import { toast } from "react-toastify";

const LeftSideBar = () => {
  const navigate = useNavigate();
  const {
    userData,
    chatData,
    chatUser,
    setChatUser,
    setMessagesId,
    messagesId,
  } = useContext(AppContext);
  const [search, setSearch] = useState([]);
  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  // const uniqueUsers = new Set(); // To track unique users
  // const filtered = chatData.filter((item) => {
  //   if (uniqueUsers.has(item.userData.id)) {
  //     return false; // Skip if user already added
  //   } else {
  //     uniqueUsers.add(item.userData.id); // Add user to the set
  //     return true; // Include the user in the list
  //   }
  // });

  const inputHandler = async (e) => {
    try {
      const input = e.target.value;
      const userRef = collection(db, 'Users')
      const q = query(userRef, where('username', '==', input.toLowerCase()))
      const querySnap = await getDocs(q)
      if(!querySnap.empty){
        console.log(querySnap.docs[0].data())
      }

    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  // const handleSearch = async e => {
  //   try {
  //     const input = e.target.value.toLowerCase()
  //     if(input){
  //       setShowSearch(true)
  //       const userRef = collection(db, 'Users')

  //       //#TODO: make this query dynamic
  //       const q = query(userRef, where('username', '==', input))

  //       const querySnap = await getDocs(q)
  //       if(!querySnap.empty && querySnap.docs[0].id !== userData.id){
  //         let userExists = false
  //         chatData.map(chat => {
  //           if(chat.rId === querySnap.docs[0].id){
  //             userExists = true
  //           }
  //           if(!userExists){
  //               console.log(querySnap.docs[0].data())
  //               setUser(querySnap.docs[0])
  //             }
  //         })
  //       }else{
  //         setUser(null)
  //       }
  //     } else{
  //       setShowSearch(false)
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  // const handleSearch = async (e) => {
  //   try {
  //     const input = e.target.value.toLowerCase();
  //     if (input) {
  //       setShowSearch(true);
  //       const userRef = collection(db, "Users");

  //       const q = query(
  //         userRef,
  //         where("username", ">=", input),
  //         where("username", "<=", input + "\uf8ff")
  //       );

  //       const querySnap = await getDocs(q);

  //       const results = querySnap.docs
  //         .map((doc) => doc.data())
  //         .filter((user) => user.id !== userData.id);

  //       setSearch(results || []);

  //       let userExist = false;
  //       chatData.forEach((user) => {
  //         console.log(user.rId, results[0].id);
  //         if (user.rId === results[0].id) {
  //           userExist = true;
  //         }
  //       });

  //       if (!userExist) {
  //         setUser(results[0].id);
  //       }
  //     } else {
  //       setShowSearch(false);
  //       setSearch([]);
  //     }
  //   } catch (e) {}
  // };

  const addChat = async () => {
    const messagesRef = collection(db, "Messages");
    const chatsRef = collection(db, "Chats");
    try {
      const newMessageRef = doc(messagesRef);

      await setDoc(newMessageRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(chatsRef, user.id), {
        chatsData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: userData.id,
          updatedAt: Date.now(),
          messageSeen: true,
        }),
      });

      await updateDoc(doc(chatsRef, userData.id), {
        chatsData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: user.id,
          updatedAt: Date.now(),
          messageSeen: true,
        }),
      });
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  // const addChat = async (e, user) => {
  //   if (!userData || !user) {
  //     toast.error("User data is missing or you are not logged in.");
  //     navigate("/");
  //     return;
  //   }

  //   const messagesRef = collection(db, "Messages");
  //   const chatsRef = collection(db, "Chats");

  //   try {
  //     const newMessageRef = doc(messagesRef);

  //     await setDoc(newMessageRef, {
  //       createdAt: serverTimestamp(),
  //       messages: [],
  //     });

  //     const userChatRef = doc(chatsRef, user.id);
  //     const currentUserChatRef = doc(chatsRef, userData.id);

  //     await updateDoc(userChatRef, {
  //       chatsData: arrayUnion({
  //         messageId: newMessageRef.id,
  //         lastMessage: "",
  //         rId: userData.id,
  //         updatedAt: Date.now(),
  //         messageSeen: true,
  //       }),
  //     });

  //     await updateDoc(currentUserChatRef, {
  //       chatsData: arrayUnion({
  //         messageId: newMessageRef.id,
  //         lastMessage: "",
  //         rId: user.id,
  //         updatedAt: Date.now(),
  //         messageSeen: true,
  //       }),
  //     });
  //   } catch (e) {
  //     toast.error("Error adding chat: " + e.message);
  //     console.error(e);
  //   }
  // };

  const setChat = async (item) => {
    setMessagesId(item.messageId);
    setChatUser(item);
  };

  // chatData.filter(ele => ele !== undefined)
  console.log(chatData);

  return (
    <div className="ls">
      <div className="ls-top">
        <div className="ls-nav">
          <img src={assets.logo} alt="" className="logo" />
          <div className="menu">
            <img src={assets.menu_icon} alt="" />
            <div className="sub-menu">
              <p onClick={(e) => navigate("/profile")}>Edit Profile</p>
              <hr />
              <p>Logout</p>
            </div>
          </div>
        </div>
        <div className="ls-search">
          <img src={assets.search_icon} alt="" />
          <input
            onChange={inputHandler}
            type="text"
            placeholder="Search here.."
          />
        </div>
      </div>
      <div className="ls-list">
        {showSearch && user ? (
          <div
            onClick={(e) => {
              addChat(e, user);
            }}
            className="friends add-user"
          >
            <img src={user.avatar} alt="" />
            <div>
              <p>{user.name}</p>
              <span>{user.lastMessage || "start a convo"}</span>
            </div>
          </div>
        ) : (
          chatData.map((item, idx) => (
            <div onClick={() => setChat(item)} key={idx} className="friends">
              <div>{item.userData}</div>
              <img src={item.userData.avatar} alt="" />
              <div>
                <p>{item.userData.name}</p>
                <span>{item.lastMessage}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LeftSideBar;
