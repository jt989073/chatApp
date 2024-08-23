import { useContext, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { onAuthStateChanged } from "firebase/auth";

import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Login";
import ProfileUpdate from "./pages/ProfileUpdate";
import Chat from "./pages/Chat";
import { auth } from "./config/firebase";
import { AppContext } from "./contexts/AppContext";

const App = () => {
  const navigate = useNavigate();
  const { loadUserData } = useContext(AppContext);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        await loadUserData(user.uid)
        navigate("/chat");
      } else {
        navigate("/");
      }
    });
  }, []);

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<ProfileUpdate />} />
      </Routes>
    </>
  );
};

export default App;
