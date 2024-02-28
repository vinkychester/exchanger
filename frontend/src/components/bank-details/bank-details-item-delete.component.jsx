import React, { useContext, useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";

import LoadButton from "../spinner/button-spinner.component";
import AlertMessage from "../alert/alert.component";

import BankDetailsToggleButton from "./bank-details-toggle-button.component";

import { GET_CLIENT_BANK_DETAIL_WITH_REQUISITIONS } from "../../graphql/queries/bank-detail.query";
import { BankDetailsAttributesContext } from "./bank-details-list.component";
import { getPaidRequisitions } from "../../utils/requisition.util";

const BankDetailsItemDelete = () => {
  const { id } = useContext(BankDetailsAttributesContext);
  const [isPaidRequisition, setPaidRequisition] = useState(false);

  const { data, loading, error } = useQuery(
    GET_CLIENT_BANK_DETAIL_WITH_REQUISITIONS,
    {
      variables: { id },
    }
  );

  useEffect(() => {
    if (data) {
      const { requisitions } = data.bankDetail;
      if (requisitions.length !== 0) {
        const { collection } = requisitions;
        if (getPaidRequisitions(collection).length > 0) {
          setPaidRequisition(true);
        }
      }
    }
  }, [data]);

  if (loading) return <LoadButton color="danger" weight="normal" text="Удалить" />;
  if (error) return <AlertMessage type="error" message={error} />;
  if (!data) return <AlertMessage type="warning" message="Not found." />;

  return (
    <>
      {isPaidRequisition ? (
        <LoadButton color="warning" weight="normal" text="Заявка в оплате" />
      ) : loading ? (
        <LoadButton color="danger" weight="normal" text="Удалить" />
      ) : (
        <BankDetailsToggleButton />
      )}
    </>
  );
};

export default BankDetailsItemDelete;