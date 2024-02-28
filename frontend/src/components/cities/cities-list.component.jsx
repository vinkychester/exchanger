import React from "react";
import { NavLink } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { StyledCitiesList } from "../../pages/cities/styled-cities";
import CityItemSkeleton from "./skeleton/city-item-skeleton";
import { GET_CITIES_DESCRIPTION_NAME } from "../../graphql/queries/cities-description.query";
import AlertMessage from "../alert/alert.component";

const CitiesList = () => {
  const { data, loading, error } = useQuery(GET_CITIES_DESCRIPTION_NAME, {
    fetchPolicy: "network-only"
  });

  if (loading) return <CityItemSkeleton />;
  if (error) return <AlertMessage type="error" message={error.message} />;
  if (!data) return <></>;

  const { cityDescriptions } = data;

  if (!cityDescriptions.length)
    return <AlertMessage type="info" message="Нет городов" margin="15px 0" />;

  return (
    <StyledCitiesList>
      {cityDescriptions.map(cityDescription =>
        <div key={cityDescription.id} id={cityDescription.id} className="city">
          <NavLink to={`/city/${cityDescription.cityUrl}`} className="default-link city__link">
            {cityDescription.cityName}
          </NavLink>
        </div>)}
    </StyledCitiesList>
  );
};

export default CitiesList;