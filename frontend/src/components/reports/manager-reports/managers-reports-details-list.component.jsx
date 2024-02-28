import React, { useContext } from "react";
import { useQuery } from "@apollo/react-hooks";

import Spinner from "../../spinner/spinner.component";
import AlertMessage from "../../alert/alert.component";
import CustomPagination from "../../pagination/pagination.component";
import RequisitionItemReport from "./manager-reports-requisition-item.component";

import { StyledColHead, StyledTable, StyledTableBody, StyledTableHeader } from "../../styles/styled-table";
import { StyledRequisitionWrapper } from "../../requisition-list/styled-requisition";

import { GET_MANAGER_REQUISITIONS_REPORT } from "../../../graphql/queries/requisition.query";
import { ManagersReportsDetailsFilterContext } from "./managers-reports-details.container";
import {
  convertDateToTimestampEnd,
  convertDateToTimestampStart
} from "../../../utils/datetime.util";
import ManagerReportRequisitionStatisticBlock from "./manager-report-requisition-statistic-block.component";

const ManagersReportsDetailsList = () => {
  const { filter, manager_id, handleChangeFilter } = useContext(ManagersReportsDetailsFilterContext);
  const itemsPerPage = 20;
  const { date_gte, date_lte, page } = filter;
  const currentPage = page ? parseInt(page) : 1;
  
  const { data, loading, error } = useQuery(GET_MANAGER_REQUISITIONS_REPORT, {
    variables: {
      date_gte: convertDateToTimestampStart(date_gte),
      date_lte: convertDateToTimestampEnd(date_lte),
      manager_id,
      itemsPerPage,
      page: currentPage
    },
    fetchPolicy: "network-only"
  });
  
  if (loading) return <Spinner color="#EC6110" type="moonLoader" size="50px" />;
  if (error) return <AlertMessage type="error" message={error.message} />;
  if (!data) return <></>;
  
  const { collection, paginationInfo } = data.requisitions;
  if (!collection.length)
    return <AlertMessage type="info" message="Нет заявок за данный период" margin="15px 0" />;
  
  const { totalCount } = paginationInfo;
  
  const handlePaginationChange = (page) => {
    // change current page
    handleChangeFilter("page", page);
  };
  
  return (
    <>
      <ManagerReportRequisitionStatisticBlock  />
      <StyledRequisitionWrapper style={{padding: 0}}>
        <StyledTable className="requisition-table requisition-table_manager">
          <StyledTableHeader
            col="11"
            className="requisition-table__header requisition-table_manager__header"
          >
            <StyledColHead>Номер</StyledColHead>
            <StyledColHead>Дата</StyledColHead>
            <StyledColHead>Клиент</StyledColHead>
            <StyledColHead>Платежная система</StyledColHead>
            <StyledColHead>Сумма платежа</StyledColHead>
            <StyledColHead>Сумма к получению</StyledColHead>
            <StyledColHead>Статус</StyledColHead>
            <StyledColHead />
          </StyledTableHeader>
          <StyledTableBody>
            {collection &&
            collection.map(({ ...props }, key) => (
              <RequisitionItemReport key={key} {...props} />
            ))}
          </StyledTableBody>
        </StyledTable>
      </StyledRequisitionWrapper>
      <CustomPagination
        total={totalCount}
        pageSize={itemsPerPage}
        onPaginationPageChange={handlePaginationChange}
        currentPage={currentPage}
      />
    </>
  );
};

export default ManagersReportsDetailsList;