import { render } from "@testing-library/react";
//import React from "react";
import React, { useState} from "react"          //For AUTH
import {db, auth} from "../../firebase_config"  //For AUTH
import firebase from "firebase"                 //For AUTH

import loginImg from "../../login.svg";


export class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = { //For AUTH
            isSignedIn: false,
            name:""
        };
    }

    //For AUTH - START:
    uiConfig = {
        signInFlow: "popup",
        signInOption: [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID
        ],
        callbacks: {
          signInSucces: () => false
        }
      }
    
    componentDidMount = () => {
        console.log('mounted')
        firebase.auth().onAuthStateChanged(user => {
          this.setState({isSignedIn:!!user})
          console.log("Is user signed in: " + this.state.isSignedIn)        
        })
        
        //Check singed in state
        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            console.log("User signed in")
            console.log(user);
          } else {
            console.log("No user is signed in")
          }
        });
    }
    
    signInGoogle = () => {
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth()
        .signInWithPopup(provider)
        .then((result) => {
            /** @type {firebase.auth.OAuthCredential} */
            var credential = result.credential;
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = credential.accessToken;
            // The signed-in user info.
            var user = result.user;
        }).catch((error) => {
            console.log(error)
        });
    }

    signOutGoogle = () => {
        firebase.auth().signOut();
    } 
    //For AUTH - END.
    
    //just triggering the login button with an alert
    tellIfAuthWasOk(){
        alert("Sikeres bejelentkezés?");
        
    }
    
    //rendering the login page
    render() {
        return (
        <div className="base-container" ref={this.props.containerRef}>
            <div className="header">Bejelentkezés</div>
            <div className="content">
            <div className="image">
                <img src={loginImg}></img>
            </div>
            <div className="form">
             </div>
            </div>
          <div className="footer">
              <button type="button" onClick={this.signInGoogle} className="btn">
                  Login with Google
              </button>
          </div>
          <div className="footer">
              <button type="button" onClick={this.signOutGoogle} className="btn">
                  Sign out
              </button>
          </div>
        </div>
       );
    }
}