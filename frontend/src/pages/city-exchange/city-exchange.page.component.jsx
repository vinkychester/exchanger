import React from "react";

import CityExchange from "../../components/cities/city.component";

const CityExchangePage = ({ match }) => {
  const { cityUrl } = match.params;

  return (
    <>
      <CityExchange cityUrl={cityUrl} />
    </>
  );
};

export default React.memo(CityExchangePage);
