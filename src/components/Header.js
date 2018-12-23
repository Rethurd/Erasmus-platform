import React from 'react';
import {NavLink} from 'react-router-dom';
import {connect} from 'react-redux';
import {startLogout} from '../actions/auth';
import {firebase} from '../firebase/firebase';
export const Header = () =>(
    <header className="header">
        <h1 className="header__logo">Erasmus platform</h1>
        <div className="header__links"> 
            <NavLink className="header__link--first" to="/info" activeClassName="is-active">Announcements/Information</NavLink>
            <NavLink className="header__link" to="/calendar" activeClassName="is-active">Calendar</NavLink>
            <NavLink className="header__link" to="/todo" activeClassName="is-active" >Things to do</NavLink>
            <NavLink className="header__link" to="/chat" activeClassName="is-active" >Group chat</NavLink>
            <NavLink className="header__link" to="/help" activeClassName="is-active" >Help section</NavLink>
            {firebase.auth().currentUser ? 
            
                <div className="header__link--logout" onClick={startLogout}>
                    <div>{firebase.auth().currentUser.displayName}</div>
                    <div className="logoutIcon"><i className="fas fa-sign-out-alt"></i></div>
                </div>
            : null}
            
        </div>
        
    </header>
);

const mapDispatchToProps = (dispatch)=>({
    startLogout: () => dispatch(startLogout())
})

export default connect(null,mapDispatchToProps,null,{pure:false})(Header);