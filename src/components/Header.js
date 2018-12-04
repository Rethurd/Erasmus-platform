import React from 'react';
import {NavLink} from 'react-router-dom';
import {connect} from 'react-redux';
import {startLogout} from '../actions/auth';

export const Header = () =>(
    <header>
        <h1>Erasmus platform</h1>
        <NavLink to="/info" activeClassName="is-active">Announcements/Information</NavLink>
        <NavLink to="/calendar" activeClassName="is-active">Calendar</NavLink>
        <NavLink to="/todo" activeClassName="is-active" >Things to do</NavLink>
        <NavLink to="/chat" activeClassName="is-active" >Group chat</NavLink>
        <NavLink to="/help" activeClassName="is-active" >Help section</NavLink>
        <button onClick={startLogout}>Logout</button>
    </header>
);

const mapDispatchToProps = (dispatch)=>({
    startLogout: () => dispatch(startLogout())
})

export default connect(null,mapDispatchToProps,null,{pure:false})(Header);