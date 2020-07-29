import React from 'react';
import './global.css'
import Template from './components/template/template'
import Login from './components/pageLogin'
import Register from './components/pageRegister'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
    <div>
      <Switch>
         <Route  path='/app' component={Template}/>          
         <Route exact path='/' component={Login}/>
         <Route exact path='/register' component={Register}/>
      </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
