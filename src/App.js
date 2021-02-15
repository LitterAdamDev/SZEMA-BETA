import { BrowserRouter, Switch, Route } from 'react-router-dom'
import React from 'react';
import ButtonAppBar from './components/ButtonAppBar'
import LeftDrawer from './components/LeftDrawer'
import Dashboard from './components/Dashboard'
import SignInDashboard from './components/SignInDashboard'
import CreateNews from './components/CreateNews'
import NewsDashboard from './components/NewsDashboard'

function App() {
  const darkmode = false;
  return (
    <BrowserRouter>
      <div className="App">
        <ButtonAppBar />
        <Switch>
          <Route exact path='/' component={Dashboard} />
          <Route path='/signin' component={SignInDashboard} />
          <Route path='/news' component={NewsDashboard} />
          <Route path='/createnews' component={CreateNews} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
