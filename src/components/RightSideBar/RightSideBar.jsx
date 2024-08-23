import { useContext } from "react";
import { AppContext } from "../../contexts/AppContext";
import { logout } from "../../config/firebase";
import assets from "../../assets/assets";
import "./RightSideBar.css";

const RightSideBar = () => {
  const {userData} = useContext(AppContext)
 

  return (
    <div className="rs">
      <div className="rs-profile">
        <img src={userData.avatar} alt="" />
        <h3>
          {userData.username} <img src={assets.green_dot} className="dot" alt="" />
        </h3>
        <p>{userData.bio}</p>
      </div>
      <hr />
      <div className="rs-media">
        <p>Media</p>
        <div>
          <img src={assets.pic1} alt="" />
          <img src={assets.pic2} alt="" />
          <img src={assets.pic3} alt="" />
          <img src={assets.pic4} alt="" />
          <img src={assets.pic1} alt="" />
          <img src={assets.pic2} alt="" />
        </div>
        <button onClick={(e) => logout()}>Logout</button>
      </div>
    </div>
  );
};

export default RightSideBar;
