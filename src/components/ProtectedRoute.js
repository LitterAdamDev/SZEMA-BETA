import React from 'react'
import { Redirect, Route} from 'react-router-dom'

function ProtectedRoute({ isAuth :isAuth, component: Component, ...rest}) {
    console.log(isAuth);
    return <Route {...rest} render={(props) =>{
        if(isAuth){
            <Component />;
        }else{
            <Redirect to="/" />;
        }
    }}/>
}
export default ProtectedRoute;
