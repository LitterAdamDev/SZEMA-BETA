import './App.css';
import {BrowserRouter, Link, Route, Router, Switch} from 'react-router-dom';
import HomeDashboard from './components/HomeDashboard';
import React, { useState} from "react";
import { config } from "./components/config";
import firebase from "firebase/app";
import "firebase/auth";
import "./components/login/style.scss";
import { FirebaseAuthProvider, IfFirebaseAuthed, IfFirebaseUnAuthed } from "@react-firebase/auth";
import loginImg from "./login.svg";
import ButtonAppBar from './components/ButtonAppBar';
import QuestionBaseDashboard from './components/QuestionBaseDashboard';
import CreateTestDashboard from './components/CreateTestDashboard';
import NewsDashboard from './components/NewsDashboard';




const App = () => {
  const { providerId, isSignedIn} = config
  return (
    <FirebaseAuthProvider {...config} firebase={firebase}>
          <IfFirebaseAuthed>
            {() => {
              return(
              <BrowserRouter>
                <Switch>
                  <Route exact path="/" component={HomeDashboard} />
                  <Route  path="/questionbase" component={QuestionBaseDashboard} />
                  <Route  path="/createtest" component={CreateTestDashboard} />
                  <Route  path="/news" component={NewsDashboard} />
                </Switch>
              </BrowserRouter>)
            }}
          </IfFirebaseAuthed>
          <IfFirebaseUnAuthed>
          {() => {
            return(
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
                          <button type="button" onClick={() => { const googleAuthProvider = new firebase.auth.GoogleAuthProvider(); firebase.auth().signInWithPopup(googleAuthProvider); }} className="btn">
                            Bejelentkezés Google fiókkal
                          </button>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            )}}
          </IfFirebaseUnAuthed>
    </FirebaseAuthProvider>
  );
};

export default App;
