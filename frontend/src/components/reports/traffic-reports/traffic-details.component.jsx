import React, { useContext, useEffect, useState } from "react";
import Spinner from "../../spinner/spinner.component";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import { StyledContainer } from "../../styles/styled-container";
import { Helmet } from "react-helmet-async";
import Title from "../../title/title.component";
import { StyledBreadcrumb } from "../../styles/styled-breadcrumb";
import BreadcrumbItem from "../../breadcrumb/breadcrumb-item";
import { NavLink, useHistory } from "react-router-dom";
import {
  StyledCol,
  StyledColHead,
  StyledRow,
  StyledTable,
  StyledTableBody,
  StyledTableHeader
} from "../../styles/styled-table";
import { GET_TRAFFIC_DETAIL, GET_TRAFFIC_LINK_BY_ID } from "../../../graphql/queries/traffic.query";
import { TimestampToDate } from "../../../utils/timestampToDate.utils";
import CustomPagination from "../../pagination/pagination.component";
import queryString from "query-string";
import AlertMessage from "../../alert/alert.component";
import PageSpinner from "../../spinner/page-spinner.component";
import { StyledTrafficDetailsWrapper } from "../styled-reports";

export const PaginationContext = React.createContext({
  currentPage: 1,
  itemsPerPage: 10
});

const TrafficDetails = ({ match }) => {
  const history = useHistory();
  const searchParams = queryString.parse(history.location.search);
  const currentPage = parseInt(searchParams.page ?? 1);
  const [filter, setFilter] = useState(searchParams);
  const paginationContext = useContext(PaginationContext);
  const [paginationInfo, setPaginationInfo] = useState({
    ...paginationContext,
    currentPage
  });
  const [trafficLink, setTrafficLink] = useState();

  const { data: dataTrafficLink, loading: loadingTrafficLink } = useQuery(GET_TRAFFIC_LINK_BY_ID, {
    onCompleted: data => {
      setTrafficLink(dataTrafficLink.trafficLink);
    },
    variables: {
      id: "/api/traffic_links/" + match.params.id
    }
  });

  const [executeSearch, { data, loading, error }] = useLazyQuery(GET_TRAFFIC_DETAIL,
    {
      fetchPolicy: "network-only"
    }
  );

  const onPaginationPageChange = (page) => {
    setPaginationInfo((prevState) => ({
      ...prevState,
      currentPage: page
    }));
    setFilter((prevState) => ({
      ...prevState,
      page
    }));
  };

  const prepareParamsToQuery = (filter) => {
    let preparedParams = { ...filter };
    preparedParams.itemsPerPage = paginationInfo.itemsPerPage;
    if (!!filter.page) {
      preparedParams.page = parseInt(filter.page);
    }
    preparedParams.trafficLinkId = Number(match.params.id);
    return preparedParams;
  };

  useEffect(() => {
      setPaginationInfo((prevState) => ({
        ...prevState,
        currentPage: filter.page
      }));
      history.replace({
        search: queryString.stringify(filter)
      });
      executeSearch({ variables: prepareParamsToQuery(filter) });
    }, [filter]
  );

  if (loading) return <PageSpinner />;
  if (error) return <AlertMessage type="error" message={error.message} />;
  if (!data) return (
    <StyledContainer>
      <StyledTrafficDetailsWrapper className="traffic-details">
        <Title as="h1" title="Детали посещений" className="traffic-details__title" />
        <StyledBreadcrumb>
          <BreadcrumbItem as={NavLink} to="/" title="Главная" />
          <BreadcrumbItem as={NavLink} to="/panel/reports?currentTab=traffic" title="Отчеты" />
          <BreadcrumbItem as="span" title=".." />
        </StyledBreadcrumb>
        <AlertMessage type="warning" message="Детальная информация о трафиковых ссылках недоступна" margin="20px 0" />
      </StyledTrafficDetailsWrapper>
    </StyledContainer>
  );

  const { collection } = data.trafficDetails;
  if (collection.length === 0) return (
    <StyledContainer>
      <StyledTrafficDetailsWrapper className="traffic-details">
        <Title as="h1" title="Детали посещений" className="traffic-details__title" />
        <StyledBreadcrumb>
          <BreadcrumbItem as={NavLink} to="/" title="Главная" />
          <BreadcrumbItem as={NavLink} to="/panel/reports?currentTab=traffic" title="Отчеты" />
          <BreadcrumbItem as="span" title={`${trafficLink.siteName}`} />
        </StyledBreadcrumb>
        <AlertMessage type="warning" message="Детальная информация о трафиковых ссылках недоступна" margin="20px 0" />
      </StyledTrafficDetailsWrapper>
    </StyledContainer>
  );

  return (
    <>
      {(collection && trafficLink) ?
        <StyledContainer>
          <Helmet>
            <title>Детали посещений</title>
          </Helmet>
          <StyledTrafficDetailsWrapper className="traffic-details">
            <Title as="h1" title="Детали посещений" className="traffic-details__title" />
            <StyledBreadcrumb>
              <BreadcrumbItem as={NavLink} to="/" title="Главная" />
              <BreadcrumbItem as={NavLink} to="/panel/reports?currentTab=traffic" title="Отчеты" />
              <BreadcrumbItem as="span" title={`${trafficLink.siteName}`} />
            </StyledBreadcrumb>
            <StyledTable className="traffic-details-table">
              <StyledTableHeader
                col="2"
                className="traffic-details-table__head"
              >
                <StyledColHead>IP адрес</StyledColHead>
                <StyledColHead>Дата</StyledColHead>
              </StyledTableHeader>
              <StyledTableBody>
                {collection.map((trafficDetail) => (
                  <StyledRow
                    key={trafficDetail.id}
                    col="2"
                    className="traffic-details-table__row"
                  >
                    <StyledCol
                      data-title="IP адрес"
                      className="traffic-details-table__ip"
                    >
                      {trafficDetail.ip}
                    </StyledCol>
                    <StyledCol
                      data-title="Дата"
                      className="traffic-details-table__date"
                    >
                      {TimestampToDate(trafficDetail.createdAt)}
                    </StyledCol>
                  </StyledRow>
                ))}
              </StyledTableBody>
            </StyledTable>
          </StyledTrafficDetailsWrapper>
          <CustomPagination
            total={data.trafficDetails.paginationInfo.totalCount}
            pageSize={paginationContext.itemsPerPage}
            onPaginationPageChange={onPaginationPageChange}
            currentPage={currentPage}
          />
        </StyledContainer>
        : <Spinner
          color="red"
          type="moonLoader"
          size="50px"
        />
      }
    </>
  );
};

export default TrafficDetails;