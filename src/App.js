import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/auth/Login";
import { AuthProvider } from "./components/auth/Auth";
import PrivateRoute from "./components/auth/PrivateRoute";
import QuestionBaseDashboard from './components/dashboards/QuestionBaseDashboard'
import CreateTestDashboard from './components/dashboards/CreateTestDashboard'
import NewsDashboard from './components/dashboards/NewsDashboard'

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Route exact path="/login" component={Login} />
          <PrivateRoute exact path="/" component={NewsDashboard} />
          <PrivateRoute  path="/questionbase" component={QuestionBaseDashboard} />
          <PrivateRoute  path="/createtest" component={CreateTestDashboard} />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
