import React, { useCallback, useContext, useState, useEffect } from "react";
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
import 'firebase/firestore'
import {db} from '../../config/base'
const Login = ({ history }) => {
  const [currentUser, setCurrenUser] = useState(null);

  useEffect(() => {
    if(currentUser !== undefined && currentUser !== null){
      var data_IDs = []
      var data_Data = []
      db.collection('users')
        .get()
        .then( snapshot => {
          snapshot.forEach(doc => {
            let data = doc.data()
            data_IDs.push(doc.id)
            data_Data.push({...data, id:doc.id})
          })
          if(data_IDs.includes(currentUser.user.uid)){
            var pos = data_Data.findIndex(obj => obj['id'] === currentUser.user.uid)
            if(!['Fejlesztő', 'Oktató'].includes(data_Data[pos].title)){
              firebase.auth().signOut();
              history.push("/troubleshooting");
            }else{
              history.push("/");
            }
          }else{
            firebase.auth().signOut();
            history.push("/troubleshooting");
          }
        })
        .catch( error => console.log(error))
    }
  }, [currentUser]);
  useEffect(() => {
    var headerHeight = document.getElementsByTagName("header")[0].offsetHeight
    document.getElementsByClassName('main')[0].setAttribute("style","height: calc(100vh - "+ headerHeight +")");
  }, []);
  const handleLogin = useCallback(
   
    async event => {
      event.preventDefault();
      const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
      try {
        await firebase.auth()
        .signInWithPopup(googleAuthProvider).then((result) =>{
          setCurrenUser(result)
        })
      } catch (error) {
        console.log(error)
      }
      
    },
    [history]
  );
  
  return (
    <div className="App" style={{backgroundImage: `url(${backgroundIMG})`,backgroundRepeat: 'no-repeat',backgroundSize: 'cover', backgroundColor:'white'}}>
      <header>
        <AppBar style={{ background: '#2196f3'}} position="relative">
          <Toolbar>
            <SingedOutLinks />
          </Toolbar>
        </AppBar>
      </header>
      <div class="main">
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
      </div>
    </div>
  
  );
};

export default withRouter(Login);
