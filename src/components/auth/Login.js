import React, { useCallback, useContext } from "react";
import { withRouter, Redirect } from "react-router";
import { AuthContext } from "./Auth.js";
import '../../css/App.css';
import "./style.scss"; 
import loginImg from "../img/login.svg";
import firebase from "firebase/app";
import "firebase/auth";
const Login = ({ history }) => {

  const handleLogin = useCallback(
    async event => {
      event.preventDefault();
      const googleAuthProvider = new firebase.auth.GoogleAuthProvider(); 
      ;
      try {
        await firebase.auth()
        .signInWithPopup(googleAuthProvider)
        history.push("/");
      } catch (error) {
        alert(error);
      }
    },
    [history]
  );

  const { currentUser } = useContext(AuthContext);

  if (currentUser) {
    return <Redirect to="/" />;
  }

  return (
    <div className="App">
    <div className="login">
      <div className="container">
        <div className="base-container" >
          <div className="header">Széchenyi István Egyetem -<strong> SZEMA</strong><p></p></div>
          <div className="headerLogin">Bejelentkezés</div><p></p>
            <div className="content">
              <div className="image">
                <img src={loginImg}></img>
              </div>
              <div className="form"></div>
            </div>
            <div className="footer">
              <button type="button" onClick={handleLogin} className="btn">
                Bejelentkezés Google fiókkal
              </button>
            </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default withRouter(Login);
