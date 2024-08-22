import assets from "../../assets/assets";
import "./ChatBox.css";

const ChatBox = () => {
  return (
    <div className="chat-box">
      <div className="chat-user">
        <img src={assets.profile_img} alt="" />
        <p>
          James Thompson <img className="dot" src={assets.green_dot} alt="" />
        </p>
        <img src={assets.help_icon} alt="" />
      </div>

      <div className="chat-msg">
        <div className="s-msg">
          <p className="msg">Lorem ipsum placehlder</p>
          <div>
            <img src={assets.profile_img} alt="" />
            <p>9:00AM</p>
          </div>
        </div>
        <div className="r-msg">
          <p className="msg">Lorem ipsum placehlder</p>
          <div>
            <img src={assets.profile_img} alt="" />
            <p>9:00AM</p>
          </div>
        </div>
      </div>

      <div className="chat-input">
        <input type="text" placeholder="Send a message" />
        <input
          type="file"
          id="image"
          accept="image/png, image/jpeg, image.jpg"
          hidden
        />
        <label htmlFor="image">
          <img src={assets.gallery_icon} alt="" />
        </label>
        <img src={assets.send_button} alt="" />
      </div>
    </div>
  );
};

export default ChatBox;
