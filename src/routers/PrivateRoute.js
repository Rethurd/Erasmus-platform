import React from 'react';
import Header from '../components/Header';
import {connect} from 'react-redux';
import {Route, Redirect} from 'react-router-dom';

const PrivateRoute = ({ 
    isAuthenticated,
    component:Component,
    ...otherProps  //everthing else
}) =>(
    <Route {...otherProps} component={(props) =>(
        isAuthenticated ?  
        (
            <div>
                <Component {...props} />
            </div>
        ):(
            <Redirect to ="/" />
        )
    )}/>
        
);

const mapStateToProps = (state) =>({
    isAuthenticated: !!state.auth.uid
});

export default connect(mapStateToProps)(PrivateRoute);