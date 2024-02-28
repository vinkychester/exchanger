import React, { useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import Tooltip from "rc-tooltip";

import PairUnitSkeleton from "../skeleton/pair-unit-skeleton.component";
import AlertMessage from "../../alert/alert.component";
import CustomPagination from "../../pagination/pagination.component";
import PairUnitItem from "./pair-unit-item.component";

import {
  StyledColHead,
  StyledScrollTable,
  StyledTable,
  StyledTableBody,
  StyledTableHeader
} from "../../styles/styled-table";
import { StyledTooltip } from "../../styles/styled-tooltip";

import { GET_PAIR_UNITS_LIST_WITH_FEE } from "../../../graphql/queries/pair-unit.query";
import { PairUnitFilterContext } from "./pair-unit.container";

const PairUnitList = () => {
  const { filter, handleChangeFilter } = useContext(PairUnitFilterContext);
  const { uitemsPerPage } = filter;

  const object = Object.entries(filter).reduce((a, [k, v]) => (a[k.slice(1)] = v, a), {});
  const { active, ...props } = object;

  const currentPage = filter.upage ? parseInt(filter.upage) : 1;

  const { data, loading, error } = useQuery(GET_PAIR_UNITS_LIST_WITH_FEE, {
    variables: {
      ...props,
      itemsPerPage: uitemsPerPage ? +uitemsPerPage : 50,
      page: currentPage,
      active: active ? active === "true" : null,
    },
    fetchPolicy: "network-only",
  });

  const handlePaginationChange = (page) => {
    handleChangeFilter("upage", page);
  };

  if (loading) return <PairUnitSkeleton />;
  if (error) return <AlertMessage type="error" message="Error" />;
  if (!data) return <AlertMessage type="warning" message="Not found." />;

  const { collection, paginationInfo } = data.pairUnits;

  if (!collection.length)
    return (
      <AlertMessage
        type="warning"
        message="Валюты отсутствуют."
        margin="15px 0"
      />
    );

  const { totalCount } = paginationInfo;

  return (
    <>
      <StyledScrollTable>
        <StyledTable width="2185" className="pair-unit-table">
          <StyledTableHeader
            scroll="auto"
            col="13"
            className="pair-unit-table__header"
          >
            <StyledColHead>Применить к</StyledColHead>
            <StyledColHead>Активность</StyledColHead>
            <StyledColHead>Платежная система</StyledColHead>
            <StyledColHead>Валюта</StyledColHead>
            <StyledColHead>Баланс</StyledColHead>
            <StyledColHead>
              Провайдер
              <Tooltip placement="top" overlay="Сервис процессинга транзакций">
                <StyledTooltip className="icon-question" opacity="0.5" />
              </Tooltip>
            </StyledColHead>
            <StyledColHead>Тип</StyledColHead>
            <StyledColHead>
              Процент
              <Tooltip placement="top" overlay="Процент провайдера за проведение транзакции">
                <StyledTooltip className="icon-question" opacity="0.5" />
              </Tooltip>
            </StyledColHead>
            <StyledColHead>
              Константа
              <Tooltip placement="top" overlay="Константа провайдера за проведение транзакции">
                <StyledTooltip className="icon-question" opacity="0.5" />
              </Tooltip>
            </StyledColHead>
            <StyledColHead>
              Минимум
              <Tooltip placement="top" overlay="Минимальный лимит провайдера">
                <StyledTooltip className="icon-question" opacity="0.5" />
              </Tooltip>
            </StyledColHead>
            <StyledColHead>
              Максимум
              <Tooltip placement="top" overlay="Максимальный лимит провайдера">
                <StyledTooltip className="icon-question" opacity="0.5" />
              </Tooltip>
            </StyledColHead>
            <StyledColHead>
              Себестоимость
              <Tooltip placement="top" overlay="Себестоимость платежной системы">
                <StyledTooltip className="icon-question" opacity="0.5" />
              </Tooltip>
            </StyledColHead>
            <StyledColHead>
              Приоритет
              <Tooltip placement="top" overlay="Позиция полупары в списке калькулятора">
                <StyledTooltip className="icon-question" opacity="0.5" />
              </Tooltip>
            </StyledColHead>
            <StyledColHead>
              Верификация карт
              <Tooltip placement="top" overlay="Включение и отключение верификации карт для данного провайдера">
                <StyledTooltip className="icon-question" opacity="0.5" />
              </Tooltip>
            </StyledColHead>
            <StyledColHead>
              Пункт калькулятора
              <Tooltip placement="top" overlay="Пункт в списке калькулятора отображение полупары">
                <StyledTooltip className="icon-question" opacity="0.5" />
              </Tooltip>
            </StyledColHead>
          </StyledTableHeader>
          <StyledTableBody>
            {collection.map(({ id, ...props }) => (
              <PairUnitItem key={id} id={id} {...props} />
            ))}
          </StyledTableBody>
        </StyledTable>
      </StyledScrollTable>
      <CustomPagination
        total={totalCount}
        pageSize={uitemsPerPage ? uitemsPerPage : 50}
        onPaginationPageChange={handlePaginationChange}
        currentPage={currentPage}
      />
    </>
  );
};

export default PairUnitList;
