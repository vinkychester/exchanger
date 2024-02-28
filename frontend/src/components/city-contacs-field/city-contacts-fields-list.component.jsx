import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import CityContactsFieldItem from "./city-contacts-field-item.component";
import AlertMessage from "../alert/alert.component";

import { GET_CITY_CONTACT_FIELDS_LIST } from "../../graphql/queries/city-contact-filed.query";

import { StyledColHead, StyledTable, StyledTableBody, StyledTableHeader } from "../styles/styled-table";
import Spinner from "../spinner/spinner.component";

const CityContactsFieldsList = () => {
  const [pagination, setPagination] = useState({
    itemsPerPage: 10,
    page: 1
  });

  const { data } = useQuery(GET_CITY_CONTACT_FIELDS_LIST);

  if (!data) return <Spinner color="#EC6110" type="moonLoader" size="50px" />;
  if (data.cityContactFields.length === 0) return <AlertMessage type="warning" message="Мессенджер отсутствуют" margin="15px 0 0"/>;

  return (
    <StyledTable className="messenger-table">
      <StyledTableHeader col="8" className="messenger-table__head">
        <StyledColHead>
          Мессенджер
        </StyledColHead>
        <StyledColHead />
      </StyledTableHeader>
      <StyledTableBody>
        {data?.cityContactFields && data.cityContactFields.length > 0 && data.cityContactFields.map((field, key) =>
          (<CityContactsFieldItem key={`${key}__${field.id}`} field={field} />)
        )}
      </StyledTableBody>
    </StyledTable>
  );
};

export default CityContactsFieldsList;