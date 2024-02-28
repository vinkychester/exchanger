import React, { useContext, createContext } from "react";
import { useQuery, useApolloClient } from "@apollo/react-hooks";
import { useHistory } from "react-router-dom";
import queryString from "query-string";

import Spinner from "../spinner/spinner.component";
import AlertMessage from "../alert/alert.component";
import CustomPagination from "../pagination/pagination.component";
import BankDetailsItem from "./bank-details-item.component";

import {
  StyledCol,
  StyledColHead,
  StyledRow,
  StyledTable,
  StyledTableBody,
  StyledTableHeader,
} from "../styles/styled-table";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { GET_CLIENT_BANK_DETAILS } from "../../graphql/queries/bank-detail.query";
import { BankDetailsFilterContext } from "./bank-details.container";

export const BankDetailsAttributesContext = createContext();

const BankDetailsList = () => {
  let history = useHistory();
  const client = useApolloClient();

  const { userId } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const { filter, itemsPerPage, currentPage, handleChangeFilter } = useContext(BankDetailsFilterContext);
  const { page, ...props } = filter;

  const { data, loading, error } = useQuery(GET_CLIENT_BANK_DETAILS, {
    variables: {
      itemsPerPage,
      page: currentPage,
      client_id: userId,
      ...props,
    },
    fetchPolicy: "network-only",
  });

  const handlePaginationChange = (page) => {
    handleChangeFilter("page", page);
    history.replace({
      search: queryString.stringify({ page, ...filter }),
    });
  };

  if (loading) return <Spinner color="#EC6110" type="moonLoader" size="50px" />;
  if (error) return <AlertMessage type="error" message={error} />;
  if (!data) return <AlertMessage type="warning" message="Not found." />;

  const { collection, paginationInfo } = data.bankDetails;

  if (!collection.length)
    return (
      <AlertMessage type="info" message="Нет реквизитов." margin="15px 0" />
    );

  const { totalCount, lastPage } = paginationInfo;

  const style = {
    text: {
      textTransform: "inherit",
    },
    direction: {
      opacity: "0.5",
      fontSize: "12px",
    },
  };

  return (
    <>
      <StyledTable className="bank-details-table">
        <StyledTableHeader col="4" className="bank-details-table__head">
          <StyledColHead>Платежная система</StyledColHead>
          <StyledColHead>Название</StyledColHead>
          <StyledColHead>Реквизиты</StyledColHead>
          <StyledColHead />
        </StyledTableHeader>
        <StyledTableBody>
          {collection &&
            collection.map(({ id, title, attributes, pairUnit }) => (
              <StyledRow col="4" className="bank-details-table__row" key={id}>
                <StyledCol
                  className="bank-details-table__payment-system payment-system"
                  data-title="Платежная система"
                >
                  <div
                    className={`exchange-icon-${
                      pairUnit.paymentSystem.tag === "CRYPTO"
                        ? pairUnit.currency.asset
                        : pairUnit.paymentSystem.tag
                    } payment-system__icon`}
                  />
                  <div className="payment-system__name">
                    <div>
                      <b>{pairUnit.paymentSystem.name}</b>{" "}
                      {pairUnit.currency.asset}
                    </div>
                    <span
                      className="bank-details-form-select__direction"
                      style={style.direction}
                    >
                      {pairUnit.direction === "payment"
                        ? "(Покупка)"
                        : "(Продажа)"}
                    </span>
                  </div>
                </StyledCol>
                <BankDetailsAttributesContext.Provider
                  value={{
                    id,
                    attributes,
                    title,
                    totalCount,
                    lastPage,
                    asset: pairUnit.currency.asset,
                  }}
                >
                  <BankDetailsItem />
                </BankDetailsAttributesContext.Provider>
              </StyledRow>
            ))}
        </StyledTableBody>
      </StyledTable>
      <CustomPagination
        total={totalCount}
        pageSize={itemsPerPage}
        onPaginationPageChange={handlePaginationChange}
        currentPage={currentPage}
      />
    </>
  );
};

export default BankDetailsList;
