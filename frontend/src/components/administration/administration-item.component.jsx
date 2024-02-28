import React, { useContext, useState } from "react";
import { useApolloClient } from "@apollo/react-hooks";
import { NavLink } from "react-router-dom";
import Menu, { Item as MenuItem } from "rc-menu";
import Dropdown from "rc-dropdown";

// import "rc-dropdown/assets/index.css";

import Can from "../can/can.component";
import ModalWindow from "../modal/modal-window";

import {
  StyledCardBody,
  StyledCardHeader,
  StyledDropdownButton,
  StyledMenuLink,
  StyledUserCard,
} from "../styles/styled-user-card";
import {
  StyledBlockText,
  StyledBlockTitle,
  StyledInfoBlock,
} from "../styles/styled-info-block";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { parseUuidIRI } from "../../utils/response";
import { TimestampToDate } from "../../utils/timestampToDate.utils";
import { managers } from "../../rbac-consts";
import { StyledButton } from "../styles/styled-button";
import { PaginationContext } from "./administration.container";

const AdministrationItem = ({ user, discr, type }) => {
  const client = useApolloClient();

  const { userRole } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const [visible, setVisible] = useState(false);
  const [action, setAction] = useState(false);

  const { updateManagerBanned } = useContext(PaginationContext);

  const banDialog = (user) => {
    return (
      <>
        <div className="default-modal__body-content">
          Вы действительно хотите {action ? "заблокировать" : "разблокировать"}{" "}
          {user.firstname} {user.lastname}?
        </div>
        <div className="default-modal__body-footer">
          <StyledButton
            color="danger"
            weight="normal"
            onClick={() => {
              setVisible(false);
            }}
          >
            Нет
          </StyledButton>
          <StyledButton
            color="success"
            weight="normal"
            onClick={() => {
              banUser(user.id, action);
            }}
          >
            Да
          </StyledButton>
        </div>
      </>
    );
  };

  const banUserDialog = (isBanned) => {
    setVisible(true);
    setAction(isBanned);
  };

  const banUser = (id, isBanned) => {
    updateManagerBanned({
      variables: { id, isBanned },
    });
    setVisible(false);
  };

  const menu = () => {
    return (
      <Menu className="card-submenu">
        <MenuItem key="1">
          <StyledMenuLink
            as={NavLink}
            to={`/panel/${discr}/${parseUuidIRI(user.id)}`}
          >
            Подробнее
          </StyledMenuLink>
        </MenuItem>
        <MenuItem key="2">
          <Can
            role={userRole}
            perform={managers.BAN_ACTIONS}
            yes={() =>
              discr === "manager" && (
                <>
                  {type === "A" ? (
                    <StyledMenuLink onClick={() => banUserDialog(true)}>
                      Заблокировать
                    </StyledMenuLink>
                  ) : null}
                  {type === "B" ? (
                    <StyledMenuLink onClick={() => banUserDialog(false)}>
                      Разблокировать
                    </StyledMenuLink>
                  ) : null}
                </>
              )
            }
          />
        </MenuItem>
      </Menu>
    );
  };

  return (
    <>
      {visible && (
        <ModalWindow
          visible={visible}
          setVisible={setVisible}
          title="Внимание!"
          content={banDialog(user)}
        />
      )}
      <StyledUserCard className="administration-card">
        <StyledCardHeader>
          <h4>
            <NavLink to={`/panel/${discr}/${parseUuidIRI(user.id)}`}>
              {user.firstname} {user.lastname}
            </NavLink>
          </h4>
          <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
            <StyledDropdownButton onClick={(event) => event.preventDefault()}>
              <span className="icon-sub-menu" />
            </StyledDropdownButton>
          </Dropdown>
        </StyledCardHeader>
        <StyledCardBody>
          <StyledInfoBlock className="administration-card__row">
            <StyledBlockTitle>E-mail:</StyledBlockTitle>
            <StyledBlockText className="administration-card__text">
              {user.email}
            </StyledBlockText>
          </StyledInfoBlock>
          <StyledInfoBlock className="administration-card__row">
            <StyledBlockTitle>Дата регистрации:</StyledBlockTitle>
            <StyledBlockText className="administration-card__text">
              {TimestampToDate(user.createdAt)}
            </StyledBlockText>
          </StyledInfoBlock>
        </StyledCardBody>
      </StyledUserCard>
    </>
  );
};

export default AdministrationItem;
