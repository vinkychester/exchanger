import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import { UPDATE_TRAFFIC_CONVERSION } from "../../graphql/mutations/traffic-links.mutation";
import Spinner from "../spinner/spinner.component";
import AlertMessage from "../alert/alert.component";
import { useCookies } from "react-cookie";
import { checkAndSetSingle } from "../../utils/cookies.utils";

const TrafficClickConversionOldFormat = ({ setConversionUpdated }) => {

  const urlParams = useParams();

  const trustedCookies = ["refToken", "traffic"];
  const [cookies, setCookie] = useCookies(trustedCookies);

  const [updateTrafficConversion, { data, loading, error }] = useMutation(
    UPDATE_TRAFFIC_CONVERSION,
    {
      variables: { token: urlParams.traffic },
      onCompleted: (data) => {
        if (!!data) {
          setConversionUpdated(true);
        }
      }
    }
  );

  useEffect(() => {
    if (!!urlParams.traffic) {
      checkAndSetSingle("traffic", urlParams.traffic, setCookie);
      updateTrafficConversion();
    }
  }, []);

  if (loading) return <Spinner color="#EC6110" type="moonLoader" size="50px" />;
  if (error) return <AlertMessage type="error" message={error.message} />;

  return <></>;
};

export default TrafficClickConversionOldFormat;
