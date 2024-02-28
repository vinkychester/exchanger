import React, { useContext, useState } from "react";
import { useApolloClient, useMutation } from "@apollo/react-hooks";
import { NavLink } from "react-router-dom";
import Menu, { Item as MenuItem } from "rc-menu";
import Dropdown from "rc-dropdown";

import Can from "../can/can.component";
import DialogModal from "../dialog/dialog.component";
import ClientDelete from "./client-delete.component";

import "rc-dropdown/assets/index.css";
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
import { StyledButton } from "../styles/styled-button";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { UPDATE_CLIENT_DETAILS } from "../../graphql/mutations/client.mutation";
import { ClientFilterContext } from "./client.container";
import { parseUuidIRI } from "../../utils/response";
import { TimestampToDate } from "../../utils/timestampToDate.utils";
import { clients } from "../../rbac-consts";

const ClientItem = ({
  id,
  firstname,
  lastname,
  email,
  status,
  isEnabled,
  isBanned,
  createdAt,
  registrationType,
  handleChange,
  isDeleted
}) => {
  const client = useApolloClient();

  const { userRole } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const { sign } = useContext(ClientFilterContext);
  const [visible, setVisible] = useState(false);
  const [updateClient, { loading: mutationLoading }] = useMutation(UPDATE_CLIENT_DETAILS, { 
    onCompleted: () => {
      setVisible(false);
      handleChange();
    }
  })

  const handleToggleClientBanned = () => {
    updateClient({ variables: { id, isBanned: !isBanned }});
  };

  const menu = () => {
    return (
      <Menu className="card-submenu">
        <MenuItem key="1">
          <StyledMenuLink
            as={NavLink}
            to={`/panel/clients/${parseUuidIRI(id)}`}
          >
            Подробнее
          </StyledMenuLink>
        </MenuItem>
        <MenuItem key="2">
          <Can
            role={userRole}
            perform={clients.BAN_ACTIONS}
            yes={() => (
              <>
                {sign === "a" ? (
                  <StyledMenuLink onClick={() => setVisible(true)}>
                    Заблокировать
                  </StyledMenuLink>
                ) : null}
                {sign === "b" ? (
                  <StyledMenuLink onClick={() => setVisible(true)}>
                    Разблокировать
                  </StyledMenuLink>
                ) : null}
              </>
            )}
          />
        </MenuItem>
        {!isDeleted &&
        <MenuItem key="3">
          <ClientDelete id={id}/>
        </MenuItem>}
      </Menu>
    );
  };

  return (
    <>
      {visible && (
        <DialogModal
          visible={visible}
          message={`Вы уверены, что хотите ${
            sign === "a" ? "заблокировать" : "разблокировать"
          } пользователя ${firstname} ${lastname}?`}
          title="Внимание!"
          setVisible={setVisible}
          handler={handleToggleClientBanned}
        />
      )}
      <StyledUserCard className="clients-card" key={id}>
        <StyledCardHeader isDeleted={isDeleted}>
          <h4>
            <NavLink to={`/panel/clients/${parseUuidIRI(id)}`}>
              {firstname} {lastname}
            </NavLink>
            {isDeleted && <span className="icon-ban" title="Аккаунт удален"/>}
          </h4>
          <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
            <StyledDropdownButton>
              <span className="icon-sub-menu" />
            </StyledDropdownButton>
          </Dropdown>
        </StyledCardHeader>
        <StyledCardBody isDeleted={isDeleted}>
          <StyledInfoBlock className="clients-card__row">
            <StyledBlockTitle>E-mail:</StyledBlockTitle>
            <StyledBlockText className="clients-card__text">
              {email}{" "}
              {!isEnabled && (
                <span
                  title="E-mail не подтвержден"
                  className="icon-danger-triangle is-verified"
                />
              )}
            </StyledBlockText>
          </StyledInfoBlock>
          <StyledInfoBlock className="clients-card__row">
            <StyledBlockTitle>Дата регистрации:</StyledBlockTitle>
            <StyledBlockText>{TimestampToDate(createdAt)}</StyledBlockText>
          </StyledInfoBlock>
          <StyledInfoBlock className="clients-card__row">
          </StyledInfoBlock>
          <StyledInfoBlock className="clients-card__row">
            <StyledBlockTitle>Статус:</StyledBlockTitle>
            <StyledBlockText>
              {status === "trusted"
                ? "доверенный"
                : status === "suspicious"
                ? "подозрительный"
                : "стабильный"}
            </StyledBlockText>
          </StyledInfoBlock>
          <StyledInfoBlock className="clients-card__row">
            <StyledBlockTitle>Тип регистрации:</StyledBlockTitle>
            <StyledBlockText>
              {registrationType === "referral"
                ? "Регистрация по реферальной ссылке"
                : registrationType === "traffic"
                ? "Регистрация по трафиковой ссылке"
                : "Прямой переход"}
            </StyledBlockText>
          </StyledInfoBlock>
        </StyledCardBody>
      </StyledUserCard>
    </>
  );
};

export default ClientItem;
