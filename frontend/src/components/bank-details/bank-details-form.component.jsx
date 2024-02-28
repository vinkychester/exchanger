import React, { useCallback, useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useApolloClient } from "@apollo/react-hooks";
import Select, { Option } from "rc-select";

import AlertMessage from "../alert/alert.component";
import LoadButton from "../spinner/button-spinner.component";
import FragmentSpinner from "../spinner/fragment-spinner.component";
import BankDetailsAttributes from "./bank-details-attributes.component";

import { StyledFormWrapper, StyledHiddenForm, StyledHiddenFormAction } from "../styles/styled-form";
import { StyledButton } from "../styles/styled-button";
import { StyledSelect, StyledSelectLabel } from "../styles/styled-img-select";
import { StyledLoadingWrapper } from "../spinner/styled-spinner";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { GET_CLIENT_BANK_DETAILS } from "../../graphql/queries/bank-detail.query";
import { GET_ACTIVE_PAIR_UNITS } from "../../graphql/queries/pair.query";
import { CREATE_BANK_DETAILS } from "../../graphql/mutations/bank-detail.mutation";
import { BankDetailsFilterContext } from "./bank-details.container";
import { parseApiErrors } from "../../utils/response";
import { closableNotificationWithClick } from "../notification/closable-notification-with-click.component";
import { validateCryptoWallet } from "../../utils/crypto.utils";

const INITIAL_STATE = {
  title: "",
  pairUnit: "",
  direction: ""
};

const BankDetailsForm = () => {
  const client = useApolloClient();

  const { userId } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const { filter, itemsPerPage, currentPage } = useContext(BankDetailsFilterContext);
  const { page, ...props } = filter;

  const [errors, setErrors] = useState([]);
  const [collection, setCollection] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [hide, setHide] = useState(true);
  const [requisitesDetails, setRequisitesDetails] = useState(INITIAL_STATE);
  const [asset, setAsset] = useState("");

  const { data, loading, error } = useQuery(GET_ACTIVE_PAIR_UNITS, { fetchPolicy: "network-only" });

  const [createBankDetail, { loading: mutationLoading, error: mutationError }] = useMutation(CREATE_BANK_DETAILS, {
    onCompleted: () => {
      setRequisitesDetails((prevState) => ({ ...prevState, title: "" }));
      setAttributes([]);
      setErrors([]);
      closableNotificationWithClick("Новый реквизит успешно добавлен.", "success");
    },
    onError: ({ graphQLErrors }) => setErrors(parseApiErrors(graphQLErrors))
  });

  const handleChangeRequisitesDetails = useCallback(
    (obj) => {
      setRequisitesDetails((prevState) => ({
        ...prevState,
        ...obj
      }));
    },
    [requisitesDetails]
  );

  useEffect(() => {
    if (data && data.pairUnits) {
      const { collection } = data.pairUnits;
      if (collection.length !== 0) {
        let result = collection.filter(item => item.paymentSystem.name !== "Cash");
        // set currency abbreviation
        setAsset(result[0].currency.asset);
        handleChangeRequisitesDetails({
          pairUnit: result[0].id,
          direction: result[0].direction
        });
        setCollection(result);
      }
    }
  }, [data]);

  const handleChangeSelect = (value, { label, key }) => {
    setAttributes([]);
    let info = label.split("-");
    setAsset(info[0]);
    handleChangeRequisitesDetails({ pairUnit: value, direction: info[1] });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { title, pairUnit, direction } = requisitesDetails;
    let isWalletError = false;
    let regex = /\(\w+\)/;

    let wallet = attributes.find((item) => item.name === "wallet");
    if (wallet && !regex.test(asset) && !validateCryptoWallet(asset, wallet.value.trim())) {
      setErrors({ wallet: "Невалидный кошелек" });
      isWalletError = true;
    }

    if (!isWalletError) {
      createBankDetail({
        variables: {
          attributes,
          title,
          pairUnit,
          direction,
          client: `/api/clients/${userId}`,
        }, 
        refetchQueries: [
          {
            query: GET_CLIENT_BANK_DETAILS,
            variables: {
              client_id: userId,
              itemsPerPage,
              page: currentPage,
              ...props
            },
          },
        ],
      });
    }
  };

  if (loading) return <LoadButton color="main" text="Добавить реквизиты" mb="20"/>;
  if (error) return <AlertMessage type="error" message={error} />;
  if (!data) return <AlertMessage type="warning" message="Not found." />;

  if (!collection.length) return <AlertMessage type="warning" message="Нет платежных систем." />;

  const showForm = () => {
    hide ? setHide(false) : setHide(true);
  };

  const style = {
    text: {
      textTransform: "inherit"
    },
    direction: {
      paddingLeft: "8px",
      opacity: "0.5",
      fontSize: "12px"
    }
  };

  return (
    <StyledHiddenForm className="hidden-bank-details-form">
      <StyledHiddenFormAction className="hidden-bank-details-form__action">
        <StyledButton type="button" color="main" onClick={showForm}>
          Добавить реквизиты
        </StyledButton>
      </StyledHiddenFormAction>
      <StyledLoadingWrapper>
        {mutationLoading && <FragmentSpinner position="center" />}
        <StyledFormWrapper
          hide={hide}
          onSubmit={handleSubmit}
          className={`bank-details-form ${mutationLoading && "loading"}`}
          name="form_name"
        >
          <StyledSelect className="bank-details-form__select-wrapper">
            <StyledSelectLabel>Выбрать платежную систему: </StyledSelectLabel>
            <Select
              className="custom-select-img bank-details-form-select"
              defaultValue={collection[0].id}
              onChange={handleChangeSelect}
              name="pair_units"
            >
              {collection &&
                collection.map(({ id, paymentSystem, currency, direction }) => (
                  <Option
                    key={id}
                    value={id}
                    label={`${currency.asset}-${direction}`}
                  >
                    <div
                      className="option-select-item bank-details-form-select__item"
                      style={style.text}
                    >
                      <span
                        role="img"
                        className={`exchange-icon-${
                          paymentSystem.tag === "CRYPTO"
                            ? currency.asset
                            : paymentSystem.tag
                        }`}
                        aria-label={`${currency.tag}`}
                      />
                      <b>{paymentSystem.name}</b>
                      <span className="bank-details-form-select__abbr">
                        {currency.asset}
                      </span>
                      <span
                        className="bank-details-form-select__direction"
                        style={style.direction}
                      >
                        {direction === "payment" ? "(Покупка)" : "(Продажа)"}
                      </span>
                    </div>
                  </Option>
                ))}
            </Select>
          </StyledSelect>
          {requisitesDetails.pairUnit && requisitesDetails.direction ? (
            <BankDetailsAttributes
              details={requisitesDetails}
              attributes={attributes}
              setAttributes={setAttributes}
              handleChangeRequisitesDetails={handleChangeRequisitesDetails}
              errors={errors}
            />
          ) : null}
        </StyledFormWrapper>
      </StyledLoadingWrapper>
    </StyledHiddenForm>
  );
};

export default BankDetailsForm;
