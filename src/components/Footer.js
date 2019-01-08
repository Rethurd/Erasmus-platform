import React from 'react';
import { NavLink } from 'react-router-dom'

const Footer = () => {
    return ( 
        <div className="footer"> 
            <div >
                <NavLink className="footer__logo" to="/">Erasmus Platform</NavLink>
            </div>
            <div className="footer__copyright">
                <div>Kamil Grzegorek</div>
                <div>Copyright © 2019</div>
            </div>
        </div>
     );
}
 
export default Footer;