import React, { useContext } from "react";
import { useQuery } from "@apollo/react-hooks";

import PairUnitSkeleton from "../skeleton/pair-unit-skeleton.component";
import AlertMessage from "../../alert/alert.component";
import CustomPagination from "../../pagination/pagination.component";
import PaymentSystemItem from "./payment-system-item.component";

import { StyledColHead, StyledTable, StyledTableBody, StyledTableHeader } from "../../styles/styled-table";

import { GET_ALL_PAYMENT_SYSTEMS } from "../../../graphql/queries/payment-system.query";
import { PaymentSystemContext } from "./payment-system.container";

const PaymentSystemList = () => {
  const { handleChangeFilter, filter } = useContext(PaymentSystemContext);
  const { citemsPerPage } = filter;
  const object = Object.entries(filter).reduce((a, [k, v]) => (a[k.slice(1)] = v, a), {});
  const { ...props } = object;

  const currentPage = filter.cpage ? parseInt(filter.cpage) : 1;

  const { loading, error, data } = useQuery(
    GET_ALL_PAYMENT_SYSTEMS,
    {
      variables: {
        ...props,
        itemsPerPage: citemsPerPage ? +citemsPerPage : 50,
        page: currentPage,
      },
      fetchPolicy: "network-only",
    }
  );

  const handlePaginationChange = (page) => {
    handleChangeFilter("cpage", page);
  };

  if (loading) return <PairUnitSkeleton />;
  if (error) return <AlertMessage type="error" message={error.message} />;
  if (!data) return <AlertMessage type="warning" message="Not found." />;

  const { collection, paginationInfo } = data.paymentSystems;

  if (!collection.length)
    return (
      <AlertMessage
        type="info"
        message="Нет платежных систем"
        margin="15px 0"
      />
    );

  const { totalCount } = paginationInfo;

  return (
    <>
      <StyledTable className="payment-system-price-table">
        <StyledTableHeader col="4" className="payment-system-price-table__head">
          <StyledColHead>Применить к</StyledColHead>
          <StyledColHead>Название</StyledColHead>
          <StyledColHead>Тег</StyledColHead>
          <StyledColHead>Ключ</StyledColHead>
          <StyledColHead>Себестоимость</StyledColHead>
        </StyledTableHeader>
        <StyledTableBody>
          {collection &&
            collection.map(({ ...props }, key) => (
              <PaymentSystemItem key={key} {...props} />
            ))}
        </StyledTableBody>
      </StyledTable>
      <CustomPagination
        total={totalCount}
        pageSize={citemsPerPage ? citemsPerPage : 50}
        onPaginationPageChange={handlePaginationChange}
        currentPage={currentPage}
      />
    </>
  );
};

export default PaymentSystemList;
