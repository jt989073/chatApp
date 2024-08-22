import assets from "../../assets/assets";
import { logout } from "../../config/firebase";
import "./RightSideBar.css";

const RightSideBar = () => {
  return (
    <div className="rs">
      <div className="rs-profile">
        <img src={assets.profile_img} alt="" />
        <h3>
          James Thompsom <img src={assets.green_dot} className="dot" alt="" />
        </h3>
        <p>Hey, I am james</p>
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
