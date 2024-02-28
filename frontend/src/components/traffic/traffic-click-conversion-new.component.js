import React, { useEffect } from "react";
import { useMutation } from "@apollo/react-hooks";
import { UPDATE_TRAFFIC_CONVERSION } from "../../graphql/mutations/traffic-links.mutation";
import Spinner from "../spinner/spinner.component";
import AlertMessage from "../alert/alert.component";
import { useCookies } from "react-cookie";
import { checkCookiesAndSet } from "../../utils/cookies.utils";

const TokenClickConversionNewFormat = () => {

  let urlParams = (new URL(document.location)).searchParams;

  const trustedCookies = ["refToken", "traffic"];
  const [cookies, setCookie] = useCookies(trustedCookies);

  const [updateTrafficConversion, { data, loading, error }] = useMutation(
    UPDATE_TRAFFIC_CONVERSION,
    {
      variables: { token: urlParams.get("traffic") }
    }
  );

  useEffect(() => {
    checkCookiesAndSet(trustedCookies, setCookie);
    if (!!urlParams.get("traffic")) {
      updateTrafficConversion();
    }
  }, []);

  if (loading) return <Spinner color="#EC6110" type="moonLoader" size="50px" />;
  if (error) return <AlertMessage type="error" message={error.message} />;

  return <></>;
};

export default TokenClickConversionNewFormat;
