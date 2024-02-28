import React from "react";
import { useQuery } from "@apollo/react-hooks";

import Spinner from "../spinner/spinner.component";
import AlertMessage from "../alert/alert.component";

import { GET_COLLECTION_CASHBACK_LEVELS } from "../../graphql/queries/cashback-level.query";

const CashbackLevelStarts = ({ currentLevel }) => {
  const { loading, data } = useQuery(GET_COLLECTION_CASHBACK_LEVELS);

  if (loading) return <Spinner color="#EC6110" margin="0" type="moonLoader" size="11px" />
  if (!data) return <AlertMessage type="warning" message="Not found." />;

  const { cashbackLevels } = data;

  return cashbackLevels.collection.map((item, key) => {
    if (key < currentLevel) {
      return <span key={key} className="icon-star-solid" />;
    } else {
      return <span key={key} className="icon-star-regular" />;
    }
  });
};

export default React.memo(CashbackLevelStarts);