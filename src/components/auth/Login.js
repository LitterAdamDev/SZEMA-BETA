import React, { useCallback, useContext } from "react";
import { withRouter, Redirect } from "react-router";
import { AuthContext } from "./Auth.js";
import '../../css/App.css';
import backgroundIMG from '../../SZEMA_WEB_background_1.svg'
import firebase from "firebase/app";
import "firebase/auth";
import googleIcon from '../../Google__G__Logo.svg.png'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import SingedOutLinks from '../SignedOutLinks'
const Login = ({ history }) => {

  const handleLogin = useCallback(
    async event => {
      event.preventDefault();
      const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
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
    <div className="App" style={{backgroundImage: `url(${backgroundIMG})`,backgroundRepeat: 'no-repeat',backgroundSize: 'cover', backgroundColor:'white'}}>
      <header>
        <AppBar style={{ background: '#2196f3'}} position="relative">
          <Toolbar>
            <SingedOutLinks />
          </Toolbar>
        </AppBar>
      </header>
      <main>
        <div className="login">
          <div class="title-container">
            SZEMA
          </div>
          <div class="login-title-container">
            Bejelentkezés
          </div>
          <div class="button-container">
              <button onClick={handleLogin}>
                <div class='google-icon'>
                  <img
                    src={googleIcon}
                    alt="google icon"
                  />
                </div>
                <div class='google-title'>
                  Google
                </div>
                <div class="rest-google-title">

                </div>
                
              </button>
          </div>
          <div class="rest-container"></div>
        </div>
      </main>
    </div>
    
  
  );
};

export default withRouter(Login);
