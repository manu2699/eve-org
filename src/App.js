import React from 'react';
import AuthContextProvider from "./context/AuthContext";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import Home from './components/home';
import NavBar from './components/navbar';
import Dashboard from './components/dashboard';
import Profile from './components/profile';
import Log from './components/login';

const App = () => {
  return (
    <AuthContextProvider>
      <Router>
        <NavBar />
        <div className="main">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/event/:id" render={(props) => <Home {...props} idVisit={true} />} />
            <Route exact path="/dashboard" component={Dashboard} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/log" component={Log} />
          </Switch>
        </div>
      </Router>
    </AuthContextProvider>
  );
}

export default App;
