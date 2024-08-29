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
  const { userData,  setMessagesId,} = useContext(AppContext);
  // const [search, setSearch] = useState([]);
  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);





  const handleSearch = async e => {
    try {
      const input = e.target.value.toLowerCase()
      if(input){
        setShowSearch(true)
        const userRef = collection(db, 'Users')
        
        //#TODO: make this query dynamic
        const q = query(userRef, where('username', '==', input))
        
        const querySnap = await getDocs(q)
        if(!querySnap.empty && querySnap.docs[0].data().id !== userData.id){
          setUser(querySnap.docs[0].data())
        }else{
          setUser(null)
        }
      } else{
        setShowSearch(false)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const addChat = async () => {

    const messagesRef = collection(db, 'Messages')
    const chatsRef = collection(db, 'Chats')
    try {
      const newMessageRef = doc(messagesRef)

      await setDoc(newMessageRef, {
        createdAt: serverTimestamp(),
        messages: []
      })

      await updateDoc(doc(chatsRef, user.id), {
        chatsData:arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: '',
          rId: userData.id,
          updatedAt: Date.now(),
          messageSeen: true
        })
      })

      await updateDoc(doc(chatsRef, userData.id), {
        chatsData:arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: '',
          rId: user.id,
          updatedAt: Date.now(),
          messageSeen: true
        })
      })

    } catch (error) {
      toast.error(error.message)
    }
  }

  const setChat = async (item) => {
    setMessagesId(item.messageId)
    // setChatUser(item)
  }



  return (
    <div className="ls">
      <div className="ls-top">
        <div className="ls-nav">
          <img src={assets.logo} alt="" className="logo" />
          <div className="menu">
            <img src={assets.menu_icon} alt="" />
            <div className="sub-menu">
              <p onClick={() => navigate("/profile")}>Edit Profile</p>
              <hr />
              <p>Logout</p>
            </div>
          </div>
        </div>
        <div className="ls-search">
          <img src={assets.search_icon} alt="" />
          <input
            onChange={handleSearch}
            type="text"
            placeholder="Search here.."
          />
        </div>
      </div>
      <div className="ls-list">
        {showSearch && user
          ? 
              <div
                onClick={(e) => {
                  addChat(e, user);
                }}
                className="friends add-user"
              >
                <img src={user.avatar} alt="" />
                <div>
                  <p>{user.name}</p>
                  <span>{user.lastMessage || 'start a convo'}</span>
                </div>
              </div>
          : Array(12).fill('').map((item, idx) => (
              <div onClick={() => setChat(item)}key={idx} className="friends">
                <img src={item?.userData?.avatar} alt="" />
                <div>
                  <div>testing</div>
                  <p>{item?.userData?.name}</p>
                  <span>{item?.lastMessage}</span>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default LeftSideBar;
