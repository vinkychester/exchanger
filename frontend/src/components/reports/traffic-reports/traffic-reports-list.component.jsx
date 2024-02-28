import React, { useContext, useState } from "react";
import Spinner from "../../spinner/spinner.component";
import AlertMessage from "../../alert/alert.component";
import ModalWindow from "../../modal/modal-window";
import Tooltip from "rc-tooltip";

import TrafficReportsItem from "./traffic-reports-item.component";
import CustomPagination from "../../pagination/pagination.component";

import { StyledTooltip } from "../../styles/styled-tooltip";
import { StyledButton } from "../../styles/styled-button";
import {
  StyledColHead,
  StyledRow,
  StyledTable,
  StyledTableBody,
  StyledTableHeader
} from "../../styles/styled-table";

import { useQuery, useMutation } from "@apollo/react-hooks";
import { useHistory } from "react-router-dom";

import { GET_TRAFFIC_LINKS_ADMIN_PANEL } from "../../../graphql/queries/traffic.query";

import { TrafficFilterContext } from "./traffic-reports-container.component";
import { DELETE_LINK_BY_ID } from "../../../graphql/mutations/traffic-links.mutation";
import { closableNotificationWithClick } from "../../notification/closable-notification-with-click.component";
import { convertDateToTimestampEnd, convertDateToTimestampStart } from "../../../utils/datetime.util";

const TrafficReportsList = () => {
  let history = useHistory();
  const [visible, setVisible] = useState(false);
  const [action, setAction] = useState();
  const { filter, handleChangeFilter } = useContext(TrafficFilterContext);
  const { tdate_gte, tdate_lte, tpage, titemsPerPage, ...props } = filter;
  const currentPage = tpage ? parseInt(tpage) : 1;
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  
  const { data, loading, error, fetchMore } = useQuery(GET_TRAFFIC_LINKS_ADMIN_PANEL, {
    variables: {
      ...props,
      itemsPerPage: titemsPerPage ? +titemsPerPage : 50,
      tpage: currentPage,
      tdate_gte: convertDateToTimestampStart(tdate_gte),
      tdate_lte: convertDateToTimestampEnd(tdate_lte),
    },
    fetchPolicy: "network-only"
  });
  
  
  const handlePaginationChange = (tpage) => {
    handleChangeFilter("tpage", tpage);
  };
  
  const [deleteLink] = useMutation(DELETE_LINK_BY_ID, {
    onCompleted: () => {
      closableNotificationWithClick(
        "Трафиковая ссылка успешно удалена",
        "success"
      )},
  });
  
  if (loading) return <Spinner color="#EC6110" type="moonLoader" size="35px" />;
  if (error) return <AlertMessage type="error" message={error.message} />;
  if (!data) return <AlertMessage type="warning" message="Информация о трафиковых ссылках недоступна" />;
  
  const { collection, paginationInfo } = data.trafficLinks;
  
  if (!collection.length) return <AlertMessage type="warning" message="Трафиковые ссылки отсутствуют" margin="15px 0 0 "/>;
  
  const { totalCount, lastPage } = paginationInfo;
  
  
  const getPageOnRemove = (currentPage) => {
    const a = titemsPerPage ? titemsPerPage : 50;
    let calculatedPage = Math.ceil((totalCount - 1) / a);
    if (currentPage > lastPage) {
      currentPage = lastPage;
    } else if (currentPage > calculatedPage) {
      currentPage = calculatedPage;
    }
    if (currentPage < 1) return 1;
    handleChangeFilter("tpage", currentPage);
    return currentPage;
  };
  
  
  const deleteLinkAction = (id) => {
    deleteLink({
      variables: { id },
      refetchQueries: [
        {
          query: GET_TRAFFIC_LINKS_ADMIN_PANEL,
          variables: {
            ...props,
            itemsPerPage: titemsPerPage ? +titemsPerPage : 50,
            tpage: getPageOnRemove(currentPage),
            tdate_gte: convertDateToTimestampStart(tdate_gte),
            tdate_lte: convertDateToTimestampEnd(tdate_lte),
          },
        },
      ],
    });
  };
  
  
  const onDeleteClick = (link) => {
    setVisible(true);
    setAction(link);
  };

  const handleDelete = (id) => {
    deleteLinkAction(id);
    setVisible(false);
  };


  const deleteDialog = () => {
    return (
      <>
        <div className="default-modal__body-content">
          Вы действительно хотите удалить трафиковую ссылку "{action.siteName}"?
        </div>
        <div className="default-modal__body-footer">
          <StyledButton
            color="danger"
            weight="normal"
            onClick={() => {setVisible(false);}}
          >
            Нет
          </StyledButton>
          <StyledButton
            color="success"
            weight="normal"
            onClick={() => {
              handleDelete(action.id);
            }}
          >
            Да
          </StyledButton>
        </div>
      </>
    );
  };
 
  
  return <>
    {visible && <ModalWindow
      visible={visible}
      setVisible={setVisible}
      title="Внимание!"
      content={deleteDialog()}
    />}
    <StyledTable className="traffic-list-table">
      <StyledTableHeader
        col="8"
        className="traffic-list-table__head"
      >
        <StyledColHead>Сайт</StyledColHead>
        <StyledColHead>Кол-во переходов</StyledColHead>
        <StyledColHead>Кол-во регистраций</StyledColHead>
        <StyledColHead>Кол-во заявок</StyledColHead>
        <StyledColHead>
          Прибыль системы
          <Tooltip
            placement="top"
            overlay="traffic-link 1.1"
          >
            <StyledTooltip className="icon-question" opacity="0.5"/>
          </Tooltip>
        </StyledColHead>
        <StyledColHead>
          Чистая прибыль системы
          <Tooltip
            placement="top"
            overlay="traffic-link 1.2"
          >
            <StyledTooltip className="icon-question" opacity="0.5"/>
          </Tooltip>
        </StyledColHead>
        <StyledColHead>Ссылка</StyledColHead>
        <StyledColHead />
      </StyledTableHeader>
      <StyledTableBody>
        {collection.map((trafficLink) => (
          <StyledRow
            key={trafficLink.id}
            col="8"
            className="traffic-list-table__row"
          >
            <TrafficReportsItem
              trafficLink={trafficLink}
              onDeleteClick={onDeleteClick}/>
          </StyledRow>
        ))}
      </StyledTableBody>
    </StyledTable>
    {!loading &&
    !!data &&
    data.trafficLinks &&
    data.trafficLinks.paginationInfo.lastPage > 1 ? (
      <CustomPagination
        total={data.trafficLinks.paginationInfo.totalCount}
        pageSize={titemsPerPage ? titemsPerPage : 50}
        onPaginationPageChange={handlePaginationChange}
        currentPage={currentPage}
      />
    ) : null}
  </>;
};

export default TrafficReportsList;
