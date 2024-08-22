import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import ProfileUpdate from "./pages/ProfileUpdate";
import Chat from "./pages/Chat";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<Chat / >} />
        <Route path="/profile" element={<ProfileUpdate />} />
      </Routes>
    </>
  );
};

export default App;
