import React from "react";
import Spinner from "../spinner/spinner.component";
import AlertMessage from "../alert/alert.component";
import { useQuery } from "@apollo/react-hooks";

import { GET_ACTIVE_PAIR_UNITS_FOR_TARIFF } from "../../graphql/queries/pair-unit.query";

import {
  StyledCol,
  StyledColHead,
  StyledRow,
  StyledTable,
  StyledTableBody,
  StyledTableHeader
} from "../styles/styled-table";

const TariffList = ({ direction }) => {

  const { data: data, loading, error } = useQuery(GET_ACTIVE_PAIR_UNITS_FOR_TARIFF, {
    variables: { "direction": direction }
  });

  if (loading) return <Spinner color="#EC6110" type="moonLoader" size="50px" />;
  if (error) return <AlertMessage type="error" message="Error" />;
  if (!data) return null;

  const { collection } = data.pairUnits;

  if (!collection.length) return <AlertMessage
    type="info"
    message="Информация по тарифы отсутствует"
    margin="15px 0 0"
  />;

  return (
    <StyledTable className="tariff-table">
      <StyledTableHeader col="5" className="tariff-table__head">
        <StyledColHead>
          Название
        </StyledColHead>
        <StyledColHead>
          Аббревиатура
        </StyledColHead>
        <StyledColHead>
          Константа
        </StyledColHead>
        {/*<StyledColHead>
          Процент
        </StyledColHead>*/}
        <StyledColHead>
          Минимум
        </StyledColHead>
        <StyledColHead>
          Максимум
        </StyledColHead>
      </StyledTableHeader>
      <StyledTableBody>
        {collection.map((tariff) => (
          <StyledRow col="5" className="tariff-table__row">
            <StyledCol
              data-title="Название"
              className="tariff-table__name"
            >
              <span className={`exchange-icon-${tariff.currency.asset}`} />
              {tariff.paymentSystem.name}
            </StyledCol>
            <StyledCol
              data-title="Аббревиатура"
              className="tariff-table__tag"
            >
              {tariff.currency.asset}
            </StyledCol>
            <StyledCol
              data-title="Константа"
              className="tariff-table__const"
            >
              {tariff.fee.constant}
            </StyledCol>
            {/*<StyledCol
              data-title="Процент"
              className="tariff-table__percent"
            >
              {tariff.fee.percent}
            </StyledCol>*/}
            <StyledCol
              data-title="Минимум"
              className="tariff-table__min"
            >
              {tariff.fee.min}
            </StyledCol>
            <StyledCol
              data-title="Максимум"
              className="tariff-table__max"
            >
              {tariff.fee.max}
            </StyledCol>
          </StyledRow>
        ))}
      </StyledTableBody>
    </StyledTable>
  );
};

export default TariffList;