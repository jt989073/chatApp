import { useContext, useEffect,useState } from 'react'
import './RightSidebar.css'
import assets from '../../assets/assets'
import { logout } from '../../config/firebase'
import { AppContext } from '../../context/AppContext'

const RightSidebar = () => {

  const { messages, userData } = useContext(AppContext);
  const [msgImages,setMsgImages] = useState([]);

  useEffect(()=>{
    let tempVar = [];
    messages.map((msg)=>{
      if (msg.image) {
        tempVar.push(msg.image)
      }
    })
    setMsgImages(tempVar);
  },[messages])
  

  
  return (
    <div className='rs'>
      <div className='rs-profile'>
        <img src={userData.avatar} alt="" />
        <h3>{(Date.now() - userData.lastSeen) < 70000 ? <img className='dot' src={assets.green_dot} alt=''/> : null}{userData.name}</h3>
        <p>{userData.bio}</p>
      </div>
      <hr />
      <button onClick={()=>logout()}>Logout</button>
    </div>
  ) 
}

export default RightSidebar
