import React from "react";
import CityDescription from "../../components/cities/city.component";

const CityDescriptionPage = ({ match }) => {
  const { cityUrl } = match.params;

  return (
    <CityDescription cityUrl={cityUrl} />
  );
};

export default React.memo(CityDescriptionPage);