import { Switch, Route, Redirect } from 'react-router-dom'
import React from 'react'
import Dashbord from './components/template/conteudo/dashbord'
import Admin from './components/template/conteudo/admin'
import ArticleByCategory from './components/componentUtil/articleByCategory'
import ArticleById from './components/componentUtil/articleById'
import {isAuthorization, isAuthAdmin} from './config/authorization'


const PrivateRoute = ({component: Component, ...rest})=>(
    <Route {...rest}
        render={props => isAuthorization() 
            ? 
            (<Component {...props}/>) 
            : 
            (<Redirect to={{pathname: '/', state: {from: props.location}}}/>) }   
    />
);

const PrivateRouteAdmin = ({component: Component, ...rest})=>(
    <Route {...rest}
        render={props => isAuthAdmin() 
            ? 
            (<Component {...props}/>) 
            : 
            (<Redirect to={{pathname: '/app/dashbord', state: {from: props.location}}}/>) }   
    />
);

export default function Routes(){

    
    return(
        <Switch>
            <PrivateRoute  path='/app/dashbord' component={Dashbord}/>
            <PrivateRouteAdmin  path='/app/admin' component={Admin}/>
            <Route  path='/app/categories/:id/articles' component={ArticleByCategory}/>
            <Route  path='/app/articles/:id' component={ArticleById}/>         
        </Switch>
    )
}