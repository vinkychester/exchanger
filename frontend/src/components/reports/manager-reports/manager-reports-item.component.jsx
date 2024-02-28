import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { TimestampToDateWithoutTime } from "../../../utils/timestampToDate.utils";
import { parseUuidIRI } from "../../../utils/response";
import Menu, { Item as MenuItem } from "rc-menu";
import Dropdown from "rc-dropdown";

import { StyledList } from "../../styles/styled-document-elemets";
import {
  StyledCardBody,
  StyledCardHeader,
  StyledDropdownButton,
  StyledMenuLink,
  StyledUserCard
} from "../../styles/styled-user-card";
import { StyledBlockText, StyledBlockTitle, StyledInfoBlock } from "../../styles/styled-info-block";
import { useQuery } from "@apollo/react-hooks";
import { GET_MANAGERS_PROFIT_BY_PERIOD } from "../../../graphql/queries/profit.query";
import { convertDateToTimestampEnd, convertDateToTimestampStart } from "../../../utils/datetime.util";
import { ManagersReportsFilterContext } from "./managers-reports.container";
import Spinner from "../../spinner/spinner.component";
import AlertMessage from "../../alert/alert.component";

const ManagerReportsItem = ({ manager }) => {
  const {
    id,
    firstname,
    lastname,
    email,
    isBank,
    isEnabled,
    cities,
    bank,
    cash,
  } = manager;

  const { filter } = useContext(ManagersReportsFilterContext);
  const { date_gte, date_lte } = filter;

  const { data, loading, error } = useQuery(GET_MANAGERS_PROFIT_BY_PERIOD,{
    variables: {
      date_gte: convertDateToTimestampStart(date_gte),
      date_lte: convertDateToTimestampEnd(date_lte),
      manager: parseUuidIRI(id),
      fieldName: 'systemProfit'
    },
    fetchPolicy: "no-cache",
  });

  if (loading) return <Spinner color="#EC6110" type="moonLoader" size="35px" />;
  if (error) return <AlertMessage type="error" message={error.message} />;
  if (!data) return <></>;

  const { managersQueryProfits } = data;

  if (!managersQueryProfits.length)
    return <AlertMessage type="info" message="Нет заявок" margin="15px 0" />;
  const { profits } = managersQueryProfits[0];

  const menu = () => {
    return (
      <Menu className="card-submenu">
        <MenuItem key="1">
          <StyledMenuLink as={NavLink} to={`/panel/reports-manager-details/${parseUuidIRI(id)}`}>
            Подробнее
          </StyledMenuLink>
        </MenuItem>
      </Menu>
    );
  };

  return (
    <StyledUserCard key={id} className="manager-card">
      <StyledCardHeader>
        <h4>
          <NavLink to={`/panel/reports-manager-details/${parseUuidIRI(id)}`}>
            {firstname} {lastname}
          </NavLink>
        </h4>
        <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
          <StyledDropdownButton>
            <span className="icon-sub-menu" />
          </StyledDropdownButton>
        </Dropdown>
      </StyledCardHeader>
      <StyledCardBody>
        <StyledInfoBlock>
          <StyledBlockTitle>
            E-mail:
          </StyledBlockTitle>
          <StyledBlockText>
            {email} {!isEnabled &&
          <span
            title="E-mail не подтвержден"
            className="icon-danger-triangle is-verified"
          />}
          </StyledBlockText>
        </StyledInfoBlock>
        <StyledInfoBlock>
          <StyledBlockTitle>
            Статус:
          </StyledBlockTitle>
          <StyledBlockText>
            Наличный {isBank ? "и Безналичный расчет" : ""}
          </StyledBlockText>
        </StyledInfoBlock>
        <StyledInfoBlock>
          <StyledBlockTitle>
            Процент прибыли от безнал. заявок:
          </StyledBlockTitle>
          <StyledBlockText className="clients-card__text">
            {bank.length !== 0 ? bank.map((value, index) =>
              <div>
                <span className="orange">{value.percent + "%"}</span> - {TimestampToDateWithoutTime(value.createdAt)} {index === bank.length - 1 && "- настоящее время"}
              </div>
            ) : <span className="red">отсутствуют</span>}
          </StyledBlockText>
        </StyledInfoBlock>
        <StyledInfoBlock className="clients-card__row">
          <StyledBlockTitle>
            Процент прибыли от нал. заявок:
          </StyledBlockTitle>
          <StyledBlockText>
            {cash.length !== 0 ? cash.map((value, index) =>
              <div>
                 <span className="orange">{value.percent + "%"}</span> - {TimestampToDateWithoutTime(value.createdAt)}&nbsp;{index === cash.length - 1 && "- настоящее время"}
              </div>
            ) : <span className="red">отсутствуют</span>}
          </StyledBlockText>
        </StyledInfoBlock>
        <StyledInfoBlock>
          <StyledBlockTitle>
            Ответственные города:
          </StyledBlockTitle>
          <StyledBlockText>
            <div className="manager-card__cities">
              {cities.length !== 0 ? cities.map(city => <span>{city.name}</span>) : "отсутствуют"}
            </div>
          </StyledBlockText>
        </StyledInfoBlock>
        <StyledList>
          <li>
            Количество обработанных заявок: <span className="orange">{profits.totalCount}</span>
          </li>
          <li>
            Общая прибыль системы за период: <span className="orange">{profits.systemProfit.toFixed(2) + " USD"}</span>
          </li>
          <li>
            Общая прибыль менеджера за период: <span className="orange">{profits.managerProfit.toFixed(2) + " USD"}</span>
          </li>
          <li>
            Общая прибыль менеджера по наличному расчету за период: <span className="orange">{profits.managerProfitCash.toFixed(2) + " USD"}</span>
          </li>
          <li>
            Общая прибыль менеджера по безналичному расчету за период:: <span className="orange">{profits.managerProfitBank.toFixed(2) + " USD"}</span>
          </li>
          <li>
            Общая прибыль рефералов за период: <span className="orange">{profits.referralProfit.toFixed(2) + " USD"}</span>
          </li>
        </StyledList>
      </StyledCardBody>
    </StyledUserCard>
  );
};

export default ManagerReportsItem;