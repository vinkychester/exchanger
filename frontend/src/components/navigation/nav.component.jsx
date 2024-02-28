import React from "react";
import Dropdown from "rc-dropdown";

import Toggle from "../theme-toggler/theme-toggler.component";
import NavItem from "./nav-item.component";
import Sidebar from "../sidebar/sidebar.component";
import InformationMenu from "./dropdown-items/nav-information-menu";

import { StyledDropdownMenuItem, StyledMenuList, StyledNavigation } from "./styled-navigation";

const Nav = ({ theme, toggleTheme, isLoggedIn }) => {

  return (
    <StyledNavigation id="nav">
      {/*
        To control the states of the garland, add the
         <StyledButtonOn
          title={light === true ? "Выключить лампочки" : "Включить лампочки"}
          />
        (Uncomment the code below)
      */}

      {/*<StyledButtonOn
        title={light === true ? "Выключить лампочки" : "Включить лампочки"}
        light={light}
        onClick={() => {setLight(!light);}}
      />*/}
      <Toggle
        theme={theme}
        toggleTheme={toggleTheme}
      />
      <StyledMenuList>
        <NavItem
          to="/"
          exact={true}
          icon="exchange"
          linkTitle="Обмен"
        />
        <NavItem
          to="/rates"
          icon="rates"
          linkTitle="Курсы"
        />
        <Dropdown
          getPopupContainer={() => document.getElementById('nav')}
          overlay={InformationMenu}
          trigger={["click"]}
          placement="bottomCenter"
          animation="slide-up"
        >
          <StyledDropdownMenuItem
            className="menu-item"
            onClick={(event) => event.preventDefault()}
          >
            Информация <span className="icon-chevron-down button-down" />
          </StyledDropdownMenuItem>
        </Dropdown>
        {/* mobile menu item start*/}
        <NavItem
          to="/info"
          icon="info"
          linkTitle="Информация"
          className="information-link"
        />
        {/* mobile menu item end*/}

        <NavItem
          to="/contacts"
          icon="contacts"
          linkTitle="Контакты"
        />
        {!isLoggedIn ? <NavItem
            to="/login"
            icon="user"
            linkTitle="Войти"
            className="login-link"
          /> :
          <NavItem
            to="/panel/account"
            icon="user"
            linkTitle="Аккаунт"
            className="account-link"
          />}
      </StyledMenuList>
      {isLoggedIn && <Sidebar />}
    </StyledNavigation>
  );
};

export default Nav;