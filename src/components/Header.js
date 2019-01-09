import React from 'react';
import {NavLink} from 'react-router-dom';
import {connect} from 'react-redux';
import {startLogout} from '../actions/auth';
import {firebase} from '../firebase/firebase';
import {Nav, Navbar, NavItem,NavDropdown,MenuItem} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import classNames from 'classnames';

export const Header = () =>(

    <Navbar  collapseOnSelect className={classNames("header","navbar-expand-*")} >
  <Navbar.Header>
    <Navbar.Brand>
     <h1 className="header__logo">Erasmus platform</h1>
    </Navbar.Brand>
    <Navbar.Toggle />
  </Navbar.Header>
  <Navbar.Collapse>
    
    <Nav pullRight className="header__links">
        <LinkContainer  to="/info" activeClassName="is-active"  className="header__link--first">
        <NavItem eventKey={1} href="#">
            Announcements
        </NavItem>
        </LinkContainer>
        <LinkContainer  to="/calendar" activeClassName="is-active"  className="header__link">
        <NavItem eventKey={2} href="#">
            Calendar
        </NavItem>
        </LinkContainer>
        <LinkContainer  to="/todo" activeClassName="is-active" className="header__link" >
        <NavItem eventKey={3} href="#">
            Things to do
        </NavItem>
        </LinkContainer>
        <LinkContainer  to="/chat" activeClassName="is-active" className="header__link" >
        <NavItem eventKey={4} href="#">
            Group chat
        </NavItem>
        </LinkContainer>
        <LinkContainer  to="/help" activeClassName="is-active"  className="header__link">
        <NavItem eventKey={5} href="#">
            Help section
        </NavItem>
        </LinkContainer>
        <NavDropdown eventKey={6} title="More" className={classNames("header__link","header__link--dropdownList")} id="user-options">

            <MenuItem eventKey={6.1}>
                <div className="header__link--dropdown">
                <LinkContainer  to="/friends" activeClassName="is-active">
                    <div className="header__link--dropdown__text">
                            Friends
                    </div>
                    </LinkContainer>
                </div>  
                </MenuItem>

            <MenuItem eventKey={6.2}>
                {firebase.auth().currentUser ? 
                <div onClick={startLogout} className="header__link--dropdown">
                    <div className="header__link--dropdown__text">
                        <span>Logout &nbsp;</span>
                        <i className="fas fa-sign-out-alt"></i>
                    </div>
                    
                </div>
                : null}
             </MenuItem>
            
        </NavDropdown>
        
    </Nav>
  </Navbar.Collapse>
</Navbar>


    // <header className="header">
    //     <h1 className="header__logo">Erasmus platform</h1>
        // <div className="header__links"> 
        //     <NavLink className="header__link--first" to="/info" activeClassName="is-active">Announcements/Information</NavLink>
        //     <NavLink className="header__link" to="/calendar" activeClassName="is-active">Calendar</NavLink>
        //     <NavLink className="header__link" to="/todo" activeClassName="is-active" >Things to do</NavLink>
        //     <NavLink className="header__link" to="/chat" activeClassName="is-active" >Group chat</NavLink>
        //     <NavLink className="header__link" to="/help" activeClassName="is-active" >Help section</NavLink>
            // {firebase.auth().currentUser ? 
            
            //     <div className="header__link--logout" onClick={startLogout}>
            //         <div>{firebase.auth().currentUser.displayName}</div>
            //         <div className="logoutIcon"><i className="fas fa-sign-out-alt"></i></div>
            //     </div>
            // : null}
            
        // </div>
        
    // </header>
);

const mapDispatchToProps = (dispatch)=>({
    startLogout: () => dispatch(startLogout())
})

export default connect(null,mapDispatchToProps,null,{pure:false})(Header);