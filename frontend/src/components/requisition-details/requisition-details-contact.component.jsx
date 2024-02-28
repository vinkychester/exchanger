import React from "react";
import { useQuery } from "@apollo/react-hooks";

import Spinner from "../spinner/spinner.component";
import AlertMessage from "../alert/alert.component";

import { GET_CITY_CONTACT_BY_CITY_NAME } from "../../graphql/queries/city-contact.query";
import { StyledRequisitionDetailsContact } from "./styled-requisition-details-contact";

const RequisitionDetailsContact = ({ cityExternalId }) => {
  const { data, loading, error } = useQuery(GET_CITY_CONTACT_BY_CITY_NAME, {
    fetchPolicy: "network-only",
    variables: {
      cityExternalId
    }
  });

  if (loading) return <Spinner color="#EC6110" type="moonLoader" size="22px" display="inline-block" margin="0 0 5px" />;
  if (error) return <AlertMessage type="error" message={error.message} />;
  if (!data) return <AlertMessage type="warning" message="Not found." />;

  const { getByCityExternalIdCityContact } = data;

  if (!getByCityExternalIdCityContact)
    return <AlertMessage type="warning" message="Нет контактов менеджера" />;

  const { cityContactFieldValues } = data.getByCityExternalIdCityContact;

  return (
    <StyledRequisitionDetailsContact>
      {cityContactFieldValues.map(
        ({ value, id, cityContactField: { name } }) =>
          value.length > 0 && (
            <a
              key={id}
              href={value}
              target="_blank"
              rel="noreferrer"
              className="contact-item"
            >
              <span className={`icon-${name.toLowerCase()}`} />
            </a>
          )
      )}
    </StyledRequisitionDetailsContact>
  );
};

export default RequisitionDetailsContact;
