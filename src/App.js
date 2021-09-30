import React from "react"
import { BrowserRouter as Router, Route } from "react-router-dom"
import Login from "./Views/Login/Login"
import { AuthProvider } from "./Views/Components/Auth"
import PrivateRoute from "./Views/Components/PrivateRoute"
import QuestionBaseDashboard from './Views/QuestionBase/QuestionBaseDashboard'
import NewsDashboard from './Views/News/NewsDashboard'
import MainDashboard from "./Views/Home/MainDashboard"
import TestMaker from './Views/TestMaker/TestMaker'
import AddTopic from './Views/QuestionBase/AddTopic'
import DisplayTopic from './Views/QuestionBase/DisplayTopics'


const App = () => {
  return (
    <AuthProvider>
      <Router>
          <Route exact path="/login" component={Login} />
          <PrivateRoute exact path="/" component={MainDashboard}/>
          <PrivateRoute path="/news" component={NewsDashboard} />
          <PrivateRoute path="/questionbase" component={QuestionBaseDashboard} />
          <PrivateRoute path="/createtest" component={TestMaker} />
          <PrivateRoute path="/addtopic" component={AddTopic} />
          <PrivateRoute path="/displaytopics" component={DisplayTopic} />

      </Router>
    </AuthProvider>
  );
};

export default App;
