import { useState } from "react";
import { signup, login } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
import assets from "../../assets/assets";

import "./Login.css";

const Login = () => {
  const [currState, setCurrState] = useState("Sign up");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currState === "Sign up") {
      await signup(userName, email, password);
      // navigate('/profile')
    }
    if (currState === "Login") {
      await login(email, password);
      // navigate('/profile')
    }
    navigate("/profile");
  };

  return (
    <div className="login">
      <img src={assets.logo_big} className="logo" alt="" />
      <form onSubmit={handleSubmit} className="login-form">
        <h2>{currState}</h2>
        <></>
        {currState === "Sign up" ? (
          <input
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
            type="text"
            placeholder="username"
            className="form-input"
            required
          />
        ) : null}
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          placeholder="Email Address"
          className="form-input"
          required
          autoComplete="email"
        />
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          placeholder="Password"
          className="form-input"
          autoComplete="new-password"
          required
        />
        <button type="submit">
          {currState === "Sign up" ? "Create account" : "login"}
        </button>
        <div className="login-term">
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>
        <div className="login-forgot">
          {currState === "Sign up" && (
            <p className="login-toggle">
              Already have an account{" "}
              <span onClick={() => setCurrState("Login")}>Login here</span>
            </p>
          )}
          {currState === "Login" && (
            <p className="login-toggle">
              Create an account{" "}
              <span onClick={() => setCurrState("Sign up")}>click here</span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
