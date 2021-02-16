import React, { useState} from "react"
import {db, auth} from "./firebase_config"

import firebase from "firebase"


import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

class App extends React.Component{


  uiConfig = {
    signInFlow: "popup",
    signInOption: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSucces: () => false
    }
  }

  //Init data
  state =  {
    data_from_web: null,
    isSignedIn: false,
    name:"",
    photo:"",
  } 

  //Get data
  getData = () => {
    db.collection("schools")
      .get()
      .then( snapshot => {
        const data_from_web = []
        snapshot.forEach(doc => {
          const data = doc.data()
          data_from_web.push(data)
        })
        this.setState({data_from_web: data_from_web})
        console.log(snapshot)
      })
      .catch( error => console.log(error))
  }

  //Add data
  addData = () => {
    db.collection("schools")
      .add({
        id: "negy",
        title: "negy_title",
        desc: "negy_desc"
      })
      .catch( error => console.log(error))
  }

  //-------------- Authentication -------------- 
  componentDidMount = () => {
    console.log('mounted')
    firebase.auth().onAuthStateChanged(user => {
      this.setState({isSignedIn:!!user})
    })
    
    //Check singed in state
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log("User signed in");
        console.log(user)
        this.setState = {
          isSignedIn:true,
          name:user.displayName,
          photo:user.photoURL
        }
      } else {
        console.log("No user is signed in")
      }
    });
  }

  onSubmit = () => {
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

  render(){
    return (
      <div className = "App">
        {this.state.isSignedIn ?
          <div>Signed in!
            <h1>Móka és kacagás</h1>
          <button onClick={()=>firebase.auth().signOut()}>Sign out!</button>{
            
          }
          <button onClick={this.getData}>Get data</button>{
            this.state.data_from_web &&
            this.state.data_from_web.map( data => {
              return (
                <div>
                  <p>{data.id}</p>
                </div>
              )
            })
          }
          <button onClick={this.addData}>Add new data</button>
          {
            this.state.data_from_web &&
            this.state.data_from_web.map( data => {
              return (
                <div>
                  <p>{data.id}</p>
                </div>
              )
            })
          }
          </div> 
          :     
          <div>
            You have to sign in!
            <button
            type = "button"  
            className = "btn btn-primary text white w-100"
            onClick={this.onSubmit}
            >
            Login with Google 
            </button> 
          </div>
          
        }     
      </div>
    )
  }
}

export default App;