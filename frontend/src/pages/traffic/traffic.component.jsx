import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import TrafficClickConversionOldFormat from "../../components/traffic/traffic-click-conversion-old.component";

const TrafficComponent = () => {

    const [conversionUpdated, setConversionUpdated] = useState(false);

    return <>
      <TrafficClickConversionOldFormat setConversionUpdated={setConversionUpdated} />
      {conversionUpdated && <Redirect to={"/rates"} />}
    </>;
  }
;

export default React.memo(TrafficComponent);
