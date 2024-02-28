import React, { useContext } from "react";
import { useQuery, useApolloClient } from "@apollo/react-hooks";

import Can from "../can/can.component";
import Spinner from "../spinner/spinner.component";
import AlertMessage from "../alert/alert.component";
import CustomPagination from "../pagination/pagination.component";
import RequisitionItem from "./requisition-item.component";

import {
  StyledColHead,
  StyledScrollTable,
  StyledTable,
  StyledTableBody,
  StyledTableHeader,
} from "../styles/styled-table";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { GET_REQUISITIONS } from "../../graphql/queries/requisition.query";
import { RequisitionFilterContext } from "../../pages/requisition/requisition.component";
import { requisition } from "../../rbac-consts";
import {
  convertDateToTimestampEnd,
  convertDateToTimestampStart,
} from "../../utils/datetime.util";
import { arrayValue } from "../../utils/requsition.status";

const RequisitionList = () => {
  let permissions = {};
  const client = useApolloClient();

  const { userRole, userId, managerCity } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const { filter, handleChangeFilter, setTotalCount } = useContext(RequisitionFilterContext);
  const { date_gte, date_lte, end_date_gte, end_date_lte, page, itemsPerPage, status, ...props } = filter;

  const currentPage = page ? parseInt(page) : 1;
  let requisitionStatus = arrayValue(status);
  // const requisitionStatus  = status === undefined && userRole !== "client" ? arrayValue(requisitionStatusArray.NOT_PROCESSING) : status;
  // const requisitionStatus  = arrayValue(status );



  switch (userRole) {
    case "manager":
      permissions = { exchangePoint_list: managerCity.length !== 0 ? managerCity : "" };
      break;
    case "client":
      permissions = { client_id: userId };
      break;
    default:
      permissions = {};
      break;
  }

  const { data, loading, error } = useQuery(GET_REQUISITIONS, {
    variables: {
      ...permissions,
      ...props,
      ...requisitionStatus,
      itemsPerPage: itemsPerPage ? parseInt(itemsPerPage) : 50,
      page: currentPage,
      date_gte: convertDateToTimestampStart(date_gte),
      date_lte: convertDateToTimestampEnd(date_lte),
      end_date_gte: convertDateToTimestampStart(end_date_gte),
      end_date_lte: convertDateToTimestampEnd(end_date_lte),
    },
    fetchPolicy: "network-only",
    onCompleted: ({ requisitions }) => {
      const { paginationInfo } = requisitions;
      setTotalCount(paginationInfo.totalCount);
    },
  });

  const handlePaginationChange = (page) => {
    // change current page
    handleChangeFilter("page", page);
  };

  if (loading) return <Spinner color="#EC6110" type="moonLoader" size="50px" />;
  if (error) {
    if (error.message === "GraphQL error: Internal server error") {
      error.message = "Ошибка. Обратитесь к службе техподдержки.";
    }
    return (
      <AlertMessage type="error" message={error.message} margin="15px 0" />
    );
  }

  if (!data) return <></>;

  const { collection, paginationInfo } = data.requisitions;

  if (!collection.length) {
    return <AlertMessage type="info" message="Нет заявок" margin="15px 0 0" />;
  }

  const { totalCount } = paginationInfo;

  return (
    <>
      <StyledScrollTable>
        <StyledTable width="1540" className="requisition-table">
          <StyledTableHeader
            scroll="auto"
            col={userRole !== "client" ? "10" : "7"}
            className="requisition-table__header"
          >
            <StyledColHead>Номер</StyledColHead>
            <StyledColHead>Дата создания</StyledColHead>
            <Can
              role={userRole}
              perform={requisition.CLIENT_DETAILS}
              yes={() => <StyledColHead>Дата выполнения</StyledColHead>}
            />
            <Can
              role={userRole}
              perform={requisition.DATE_INFO}
              yes={() => (
                <StyledColHead className="requisition-table__client-head">
                  Клиент
                </StyledColHead>
              )}
            />
            <StyledColHead className="requisition-table__payment-system-head">
              Платежная система
            </StyledColHead>
            <StyledColHead>Сумма платежа</StyledColHead>
            <StyledColHead>Сумма к получению</StyledColHead>
            <Can
              role={userRole}
              perform={requisition.USER_INFO}
              yes={() => (
                <StyledColHead className="requisition-table__manager-head">
                  Менеджер
                </StyledColHead>
              )}
            />
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

export default React.memo(RequisitionList);
