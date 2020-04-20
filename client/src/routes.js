import React from 'react';
import {BrowserRouter, Route,Switch} from 'react-router-dom';

import App from './App';
import Login from './pages/login/index';

export default function Routes(){
  return(
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Login}/>
        <Route path="/player" component={App}/>
      </Switch>
    </BrowserRouter>
  )
}