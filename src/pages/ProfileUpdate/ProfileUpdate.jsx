import { useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import upload from "../../lib/upload";
import { AppContext } from "../../contexts/AppContext";
import assets from "../../assets/assets";
import "./ProfileUpdate.css";

const ProfileUpdate = () => {
  const navigate = useNavigate();

  const [image, setImage] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [uid, setUid] = useState("");
  const [prevImage, setPrevImage] = useState("");

  const {setUserData } = useContext(AppContext);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        const docRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.data().name) {
          setName(docSnap.data().name);
        }
        if (docSnap.data().bio) {
          setBio(docSnap.data().bio);
        }
        if (docSnap.data().avatar) {
          setPrevImage(docSnap.data().avatar);
        }
      } else {
        navigate("/");
      }
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!prevImage && !image) {
        toast.error("Upload profile Picture");
        return;
      }
      const docRef = doc(db, "Users", uid);
      if (image) {
        const imageUrl = await upload(image);
        setPrevImage(imageUrl);
        await updateDoc(docRef, {
          avatar: imageUrl,
          bio,
          name,
        });
      } else {
        await updateDoc(docRef, {
          bio,
          name,
        });
      }
      const snap = await getDoc(docRef);
      setUserData(snap.data());
      navigate("/chat");
    } catch (e) {
      console.error(e);
      toast.error(e.message);
    }
  };

  return (
    <div className="profile">
      <div className="profile-container">
        <form onSubmit={handleSubmit}>
          <h3>Profile Details</h3>
          <label htmlFor="avatar">
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id="avatar"
              accept=".png, .jpg, .jpeg"
              hidden
            />
            <img
              src={image ? URL.createObjectURL(image) : assets.avatar_icon}
              alt=""
            />
            Upload profile image
          </label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Your name"
            required
          />
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            placeholder="Write profile bio"
            required
          ></textarea>
          <button type="submit">Save</button>
        </form>
        <img
          className="profile-pic"
          src={
            image
              ? URL.createObjectURL(image)
              : prevImage
              ? prevImage
              : assets.logo_icon
          }
        />
      </div>
    </div>
  );
};

export default ProfileUpdate;
