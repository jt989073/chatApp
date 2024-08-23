import { useNavigate } from "react-router-dom";
import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "../../config/firebase";
import assets from "../../assets/assets";
import "./LeftSideBar.css";
import { useContext, useState } from "react";
import { AppContext } from "../../contexts/AppContext";
import { toast } from "react-toastify";

const LeftSideBar = () => {
  const navigate = useNavigate();
  const { userData, chatData } = useContext(AppContext);
  const [search, setSearch] = useState([]);
  const [user, setUser] = useState(null)
  const [showSearch, setShowSearch] = useState(false)

  const handleSearch = async (e) => {
    try {
      
      const input = e.target.value.toLowerCase();
      if (input) {
        setShowSearch(true)
        const userRef = collection(db, "Users");
        
        const q = query(
          userRef,
          where("username", ">=", input),
          where("username", "<=", input + "\uf8ff")
        );
        
        const querySnap = await getDocs(q);
        
        const results = querySnap.docs
        .map((doc) => doc.data())
        .filter((user) => user.id !== userData.id);
        
        setSearch(results || []);

        let userExist = false
        chatData.forEach((user) => {
          console.log(user.rId, results[0].id)
          if(user.rId === results[0].id){
            userExist = true
          }
        })

        if(!userExist){
          setUser(results[0].id)
        }


      } else {
        setShowSearch(false)
        setSearch([]);
      }
    } catch (e) {
    }
  };

  const addChat = async (e, user) => {
    if(!userData){
      toast.error('You are not logged in, or the other profile does not exist')
      navigate('/')
    }

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
    } catch (e) {
      toast.error(e.message)
      console.error(e)
    }

  }

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
            onChange={handleSearch}
            type="text"
            placeholder="Search here.."
          />
        </div>
      </div>
      <div className="ls-list">
        
        {showSearch && search ?
          search.map((user, idx) => (
            <div onClick={(e) => {
              addChat(e, user)
            }} key={idx} className="friends add-user">
              <img src={user.avatar} alt="" />
              <div>
                <p>{user.name}</p>
                <span>Hello, How are you?</span>
              </div>
            </div>
          ))
        :
          null
        }
      </div>
    </div>
  );
};

export default LeftSideBar;
