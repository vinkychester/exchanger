import React from "react";
import { useQuery } from "@apollo/react-hooks";

import Spinner from "../../spinner/spinner.component";
import AlertMessage from "../../alert/alert.component";
import ClientReferralLevelForm from "./client-details-referral-level-form.component";
import ReferralClientLevelItem from "./client-referral-level-item.component";

import { GET_CLIENT_REFERRAL_LEVELS_BY_USER_ID } from "../../../graphql/queries/referral-client-level.query";
import { parseUuidIRI } from "../../../utils/response";
import { GET_REFERRAL_LEVELS } from "../../../graphql/queries/referral-level.query";

const ClientDetailsReferralLevels = ({ id }) => {
  const clientId = parseUuidIRI(id);

  const {
    data: dataReferralLevels,
    loading: loadingReferralLevels,
    error: errorReferralLevels,
  } = useQuery(GET_REFERRAL_LEVELS);

  const {
    data: dataReferralClientLevels,
    loading: loadingReferralClientLevels,
    error: errorReferralClientLevels,
    refetch,
  } = useQuery(GET_CLIENT_REFERRAL_LEVELS_BY_USER_ID, {
    variables: {
      clientId,
    },
  });

  if (loadingReferralLevels || loadingReferralClientLevels)
    return <Spinner color="#EC6110" type="moonLoader" size="20px" />;
  if (errorReferralLevels)
    return <AlertMessage type="error" message={errorReferralLevels.message} />;
  if (errorReferralClientLevels)
    return (
      <AlertMessage type="error" message={errorReferralClientLevels.message} />
    );
  if (!dataReferralClientLevels || !dataReferralLevels)
    return (
      <AlertMessage type="warning" message="Oops, Something Went Wrong. =(" />
    );

  const { collection: collectionReferralClientLevels } =
    dataReferralClientLevels.referralClientLevels;
  const { collection: collectionReferralLevels } =
    dataReferralLevels.referralLevels;

  if (!collectionReferralLevels.length)
    return (
      <AlertMessage
        type="info"
        message="Реферальные уровни не найдены."
        margin="0 0 15px"
      />
    );

  // if (!collectionReferralClientLevels.length) return <AlertMessage
  //   type="info"
  //   message="Реферальные уровни клиента не найдены."
  //   margin="0 0 15px"
  // />;

  return (
    <>
      <ClientReferralLevelForm
        clientId={clientId}
        referralLevels={collectionReferralLevels}
        refetch={refetch}
      />

      {collectionReferralClientLevels.map((referralClientLevel, key) => (
        <ReferralClientLevelItem
          key={key}
          refetch={refetch}
          referralClientLevel={referralClientLevel}
          referralLevels={collectionReferralLevels.filter(
            (referralLevel) =>
              referralLevel.level === referralClientLevel.referralLevel.level
          )}
        />
      ))}
    </>
  );
};

export default ClientDetailsReferralLevels;
