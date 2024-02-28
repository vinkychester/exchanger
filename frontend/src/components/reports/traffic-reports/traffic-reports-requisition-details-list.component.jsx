import React, { useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import { useHistory } from "react-router-dom";
import queryString from "query-string";

import Spinner from "../../spinner/spinner.component";
import AlertMessage from "../../alert/alert.component";
import CustomPagination from "../../pagination/pagination.component";
import RequisitionItem from "../../requisition-list/requisition-item.component";

import {
  StyledColHead,
  StyledScrollTable,
  StyledTable,
  StyledTableBody,
  StyledTableHeader,
} from "../../styles/styled-table";

import { GET_REQUISITION_BY_TRAFFIC_ID } from "../../../graphql/queries/requisition.query";
import { TrafficReportsRequisitionDetailsContext } from "./traffic-reports-requisition-details.container";

const TrafficReportsRequisitionDetailsList = ({ id }) => {
  let history = useHistory();

  const { filter, handleChangeFilter, setTotalCount } = useContext(TrafficReportsRequisitionDetailsContext);
  const { page, itemsPerPage } = filter;

  const currentPage = page ? parseInt(page) : 1;

  const { data, loading, error } = useQuery(
    GET_REQUISITION_BY_TRAFFIC_ID,
    {
      variables: {
        client_trafficLink_id: id,
        ...filter,
        itemsPerPage: itemsPerPage ? parseInt(itemsPerPage) : 50,
        page: currentPage,
      },
      fetchPolicy: "network-only",
    }
  );

  const handlePaginationChange = (page) => {
    // change current page
    handleChangeFilter("page", page);
  };

  if (loading) return <Spinner color="#EC6110" type="moonLoader" size="50px" />;
  if (error) {
    if (error.message === "GraphQL error: Internal server error") {
      error.message = "Ошибка. Обратитесь к службе техподдержки.";
    }
    return <AlertMessage type="error" message="Error" margin="15px 0" />;
  }

  if (!data) return <></>;

  const { collection, paginationInfo } = data.requisitions;

  if (!collection.length) {
    setTotalCount(0);
    return <AlertMessage type="info" message="Нет заявок" margin="15px 0 0" />;
  }

  const { totalCount } = paginationInfo;
  setTotalCount(totalCount);

  return (
    <>
      <StyledScrollTable>
        <StyledTable width="1540" className="requisition-table">
          <StyledTableHeader
            scroll="auto"
            col="10"
            className="requisition-table__header"
          >
            <StyledColHead>Номер</StyledColHead>
            <StyledColHead>Дата</StyledColHead>
            <StyledColHead>Дата выполнения</StyledColHead>
            <StyledColHead className="requisition-table__client-head">
              Клиент
            </StyledColHead>
            <StyledColHead className="requisition-table__payment-system-head">
              Платежная система
            </StyledColHead>
            <StyledColHead>Сумма платежа</StyledColHead>
            <StyledColHead>Сумма к получению</StyledColHead>
            <StyledColHead className="requisition-table__manager-head">
              Менеджер
            </StyledColHead>
            <StyledColHead>Статус</StyledColHead>
            <StyledColHead />
          </StyledTableHeader>
          <StyledTableBody>
            {collection &&
              collection.map(({ ...props }, key) => (
                <RequisitionItem key={key} {...props} />
              ))}
          </StyledTableBody>
        </StyledTable>
      </StyledScrollTable>
      <CustomPagination
        total={totalCount}
        pageSize={itemsPerPage ? itemsPerPage : 50}
        onPaginationPageChange={handlePaginationChange}
        currentPage={currentPage}
      />
    </>
  );
};

export default TrafficReportsRequisitionDetailsList;
