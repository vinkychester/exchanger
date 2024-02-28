import React, { useState } from "react";
import InputGroupComponent from "../../input-group/input-group.component";
import { useMutation } from "@apollo/react-hooks";

import { UPDATE_PAIR_PERCENT } from "../../../graphql/mutations/pair.mutation.js";

const PairPercent = ({ payPercent, name, pairId }) => {
  const [percent, setPercent] = useState(payPercent);
  const [updatePairPercent] = useMutation(UPDATE_PAIR_PERCENT);

  const handleChange = (event) => {
    setPercent(event.target.value);
    updatePairPercent({
      variables: { id: pairId, percent: +event.target.value },
    });
  };

  return (
    <InputGroupComponent
      type="number"
      value={percent}
      handleChange={handleChange}
    />
  );
};

export default PairPercent;
