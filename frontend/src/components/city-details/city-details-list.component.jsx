import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import CityDetailsItem from "./city-details-item.component";
import { GET_CITIES_DESCRIPTION } from "../../graphql/queries/cities-description.query";
import PageSpinner from "../spinner/page-spinner.component";

import { StyledColHead, StyledTable, StyledTableBody, StyledTableHeader } from "../styles/styled-table";

const CityDetailsList = () => {
  const [pagination, setPagination] = useState({
    itemsPerPage: 10,
    page: 1
  });

  const { data, loading } = useQuery(GET_CITIES_DESCRIPTION, {
    fetchPolicy: "network-only",
  });

  if (loading) return <PageSpinner/>;

  return (
    <StyledTable className="admin-cities-table">
      <StyledTableHeader col="4" className="admin-cities-table__head">
        <StyledColHead>Опубликовать</StyledColHead>
        <StyledColHead>Город</StyledColHead>
        <StyledColHead>Описание</StyledColHead>
        <StyledColHead />
      </StyledTableHeader>
      <StyledTableBody>
        {data?.cityDescriptions?.length > 0 && data.cityDescriptions.map((cityDescription) =>
          <CityDetailsItem key={cityDescription.id} cityDescription={cityDescription} />)}
      </StyledTableBody>
    </StyledTable>
  );
};

export default CityDetailsList;