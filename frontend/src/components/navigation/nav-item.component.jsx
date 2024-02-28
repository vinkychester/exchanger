import React from 'react';
import {NavLink} from 'react-router-dom';

import {StyledMenuItem} from './styled-navigation';

const NavItem = ({to, exact, icon, linkTitle, className}) => {
    return (
        <StyledMenuItem className={`menu-item ${className}`}>
            <NavLink to={to} className="menu-link" activeClassName="menu-link_current" exact={exact}>
                <div className="menu-link__icon">
                    <span className={`icon-${icon}`}/>
                </div>
                <div className="menu-link__title">
                    {linkTitle}
                </div>
            </NavLink>
        </StyledMenuItem>
    )
}

export default NavItem