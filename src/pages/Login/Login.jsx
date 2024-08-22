import { useState } from "react";
import assets from "../../assets/assets";

import "./Login.css";

const Login = () => {
    const [currState, setCurrState] = useState('Sign up')


  return (
    <div className="login">
      <img src={assets.logo_big} className="logo" alt="" />
      <form className="login-form">
        <h2>{currState}</h2>
        <></>
       {currState === 'Sign up' ? <input type="text" placeholder="username" className="form-input" required /> : null}
        <input type="email" placeholder="Email Address" className="form-input" required/>
        <input type="password" placeholder="Password" className="form-input" required/>
        <button type='submit'>{currState === 'Sign up' ? 'Create account' : 'login'}</button>
        <div className="login-term">
            <input type="checkbox" />
            <p>Agree to the terms of use & privacy policy.</p>
        </div>
        <div className="login-forgot">
        {currState === 'Sign up' && <p className="login-toggle">Already have an account <span onClick={() => setCurrState('Login')}>Login here</span></p>}
        {currState === 'Login' && <p className="login-toggle">Create an account <span onClick={() => setCurrState('Sign up')}>click here</span></p>}
        </div>
      </form>
    </div>
  );
};

export default Login;
