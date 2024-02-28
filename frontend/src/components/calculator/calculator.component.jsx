import React, { createContext, useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useMutation, useApolloClient } from "@apollo/react-hooks";

import Can from "../can/can.component";
import CalculatorTab from "./calculator-tab.component";
import CalculatorSwap from "./calculator-swap.component";
import CalculatorExchangeButton from "./calculator-exchange-btn.component";
import CalculatorAttributes from "./calculator-attributes.component";
import CalculatorRequisites from "./calculator-requisites.component";
import CalculatorNoExchange from "./calculator-no-exchange.component";
import CalculatorUserTab from "./calculator-user-tab.component";

import { StyledCalculatorSection, StyledCalculatorWrapper, StyledRequisitesWrapper } from "./styled-calculator";
import { StyledContainer } from "../styles/styled-container";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { CREATE_REQUISITION } from "../../graphql/mutations/requisition.mutation";
import { GET_CALCULATED_DETAILS } from "../../graphql/mutations/pair.mutation";
import { CLEAN_MANAGER_CLIENT_REQUISITION } from "../../graphql/queries/manager.query";
import { findPair, generateUrl, getID, getUUID } from "../../utils/calculator.utils";
import { parseApiErrors } from "../../utils/response";
import { validateCryptoWallet } from "../../utils/crypto.utils";
import { calculator } from "../../rbac-consts";
import { closableNotificationWithClick } from "../notification/closable-notification-with-click.component";

export const CalculatorContext = createContext();
export const CalculatorTabContext = createContext();
export const CalculatorFooterContext = createContext();
export const CalculatorExchangeContext = createContext();
export const CalculatorAttributesContext = createContext();

const INITIAL_EXCHANGE_VALUE_STATE = { paymentExchangeValue: null, payoutExchangeValue: null };
const INITIAL_LINK_STATE = { paymentLinkParameter: "", payoutLinkParameter: "" };
const INITIAL_REFETCH_STATE = { refetchPayment: false, refetchPayout: false };
const INITIAL_COLLECTION_STATE = { paymentCollection: [], payoutCollection: [] };
const INITIAL_REQUISITION_STATE = {
  paymentAmount: "",
  payoutAmount: "",
  pair: null,
  savePaymentBankDetails: false,
  savePayoutBankDetails: false,
  paymentAttributes: [],
  payoutAttributes: [],
  exchangePoint: "bank"
};

const Calculator = () => {
  let history = useHistory();
  const client = useApolloClient();
  
  const { userRole, userId, managerClientRequisition } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const [state, setState] = useState("payment");
  const [isShowRequisites, setShowRequisites] = useState(false);
  const [isCollectionLoading, setCollectionLoadingState] = useState(true);
  const [isHandleSwap, setHandleSwap] = useState(false);
  const [tab, setTab] = useState({ paymentTab: "bank", payoutTab: "coin" });
  const [requisitionDetails, setRequisitionDetails] = useState(INITIAL_REQUISITION_STATE);
  const [exchangeValue, setExchangeValue] = useState(INITIAL_EXCHANGE_VALUE_STATE);
  const [linkParameter, setLinkParameter] = useState(INITIAL_LINK_STATE);
  const [refetch, setRefetch] = useState(INITIAL_REFETCH_STATE);
  const [collection, setCollection] = useState(INITIAL_COLLECTION_STATE);
  const [errors, setErrors] = useState({});

  const [getCalculatedDetails, { loading: calculatedDetailsLoading }] = useMutation(GET_CALCULATED_DETAILS, {
    onCompleted: ({ calculatorDetailsMutationPair }) => {
      const { pair } = calculatorDetailsMutationPair;
      const { amount } = pair[state];
      handleChangeRequisitionDetails(`${state}Amount`, amount);
      setErrors({});
    },
    onError: ({ graphQLErrors }) => setErrors(parseApiErrors(graphQLErrors))
  });

  const [cleanManagerClientRequisition] = useMutation(CLEAN_MANAGER_CLIENT_REQUISITION);
  const [createRequisition, { loading: createRequisitionLoading }] = useMutation(CREATE_REQUISITION, {
    onCompleted: ({ createRequisition }) => {
      setErrors({});
      if (managerClientRequisition) {
        cleanManagerClientRequisition();
      }
      history.push(`/panel/requisition-details/${getUUID(createRequisition.requisition.id)}`);
    },
    onError: ({ graphQLErrors }) => {
      let messages = parseApiErrors(graphQLErrors);
      setErrors(messages)

      if (messages.min) {
        return closableNotificationWithClick(messages.min, "error");
      }

      if (messages.max) {
        return closableNotificationWithClick(messages.max, "error");
      }

      if (messages.attributes) {
        return closableNotificationWithClick(messages.attributes, "error");
      }
    }
  });

      useEffect(() => {
        const { paymentExchangeValue, payoutExchangeValue } = exchangeValue;
        if (paymentExchangeValue && payoutExchangeValue) {
          const pairIRI = findPair(paymentExchangeValue, payoutExchangeValue);
          handleChangeRequisitionDetails("pair", pairIRI);
          // show components while loading stop
          setCollectionLoadingState(false);
          setHandleSwap(false);
          if (pairIRI) {
            const { paymentLinkParameter, payoutLinkParameter } = linkParameter;
            // create user friendly link
            window.history.pushState({}, "", `${paymentLinkParameter}-${payoutLinkParameter}`);
            if (history.location.state) {
              const { cryptoCurrency, fiatCurrency } = history.location.state;
              let cryptoId = document.getElementById(cryptoCurrency);
              let fiatId = document.getElementById(fiatCurrency);
              handleScrollTo(cryptoId, fiatId);
              const { paymentAmount, payoutAmount } = requisitionDetails;
              if (paymentAmount && payoutAmount) history.replace({ state: null });
            }
            const { refetchPayment, refetchPayout } = refetch;
            setRefetch({ refetchPayment: !refetchPayment, refetchPayout: !refetchPayout });
          } else {
            window.history.pushState({}, document.title, "/");
          }
        }
      }, [exchangeValue]);

      const handleScrollTo = (cryptoId, fiatId) => {
        fiatId && fiatId.scrollIntoView({ block: "center", behavior: "smooth" });
        setTimeout(
          ()=> {
            cryptoId && cryptoId.scrollIntoView({ block: "center", behavior: "smooth" });
          }, 275
        );
      };

  const handleChangeRequisitionDetails = useCallback(
    (name, value) => {
      setRequisitionDetails((prevState) => ({
        ...prevState,
        [name]: value
      }));
    },
    [requisitionDetails]
  );

  const handleChangeRequisitionAmount = useCallback(
    (amount, direction) => {
      handleChangeRequisitionDetails(`${direction}Amount`, amount);
      setState(direction === "payment" ? "payout" : "payment");
      getCalculatedDetails({
        variables: { pairID: getID(pair), direction, amount: amount.replace(/,/g, ".") }
      });
    },
    [requisitionDetails.paymentAmount, requisitionDetails.payoutAmount]
  );

  const handleChangeExchangeValue = useCallback(
    (node, direction) => {
      setShowRequisites(false);
      setErrors({});
      // set url by direction
      const link = `${direction}LinkParameter`;
      setLinkParameter((prevState) => ({
        ...prevState,
        [link]: generateUrl(node, direction)
      }));
      // set exchange value
      const exchangeValue = `${direction}ExchangeValue`;
      setExchangeValue((prevState) => ({
        ...prevState,
        [exchangeValue]: node
      }));
    },
    [exchangeValue]
  );

  const handleChangeCollection = useCallback((name, value) => {
    setCollection((prevState) => ({
      ...prevState,
      [name]: value
    }));
  }, [collection]);

  const handleCreateRequisition = (event) => {
    event.preventDefault();
    const { paymentAmount, payoutAmount, exchangePoint, paymentAttributes, payoutAttributes,  ...props } = requisitionDetails;

    const uniquePayment = Array.from(
      new Set(paymentAttributes.map((a) => a.name))
    ).map((name) => {
      return paymentAttributes.find((a) => a.name === name);
    });

    const uniquePayout = Array.from(
      new Set(payoutAttributes.map((a) => a.name))
    ).map((name) => {
      return payoutAttributes.find((a) => a.name === name);
    });

    let min = +document.getElementById("payment-exchange-min").innerHTML;
    let max = +document.getElementById("payment-exchange-max").innerHTML;
    let isWalletError = false;

    let wallet =
      paymentAttributes.find((item) => item.name === "wallet") ||
      payoutAttributes.find((item) => item.name === "wallet");
    if (wallet) {
      const { paymentExchangeValue, payoutExchangeValue } = exchangeValue;
      let crypto =
        paymentExchangeValue.currency.tag === "CRYPTO"
          ? paymentExchangeValue.currency.asset
          : payoutExchangeValue.currency.asset;
      let regex = /\(\w+\)/;

      // if (!regex.test(crypto)) {
        if (!validateCryptoWallet(crypto, wallet.value.trim())) {
          setErrors({ wallet: "Невалидный кошелек" });
          isWalletError = true;
        }
      // }
    }

    // if (+paymentAmount < min) {
    //   return closableNotificationWithClick("Невозможно создать заявку меньше минимальной заявленной суммы", "error");
    // }

    // if (+paymentAmount > max) {
    //   return closableNotificationWithClick("Невозможно создать заявку больше максимальной заявленной суммы", "error");
    // }

    if (+payoutAmount > exchangeValue.payoutExchangeValue.balance) {
      return closableNotificationWithClick(
        "Невозможно создать заявку, сумма заявки превышает баланс данного направления. Обратитесь к Администрации.",
        "error"
      );
    }

    if (!isWalletError) {
      createRequisition({
        variables: {
          paymentAmount: +paymentAmount,
          payoutAmount: +payoutAmount,
          client_id: managerClientRequisition ? getUUID(managerClientRequisition) : userId,
          exchangePoint: exchangePoint.toString(),
          paymentAttributes: uniquePayment,
          payoutAttributes: uniquePayout,
          ...props
        }
      });
    }
  };

  const { paymentTab, payoutTab } = tab;
  const { refetchPayment, refetchPayout } = refetch;
  const {
    pair,
    paymentAmount,
    payoutAmount,
    paymentAttributes,
    payoutAttributes,
    savePaymentBankDetails,
    savePayoutBankDetails
  } = requisitionDetails;

  return (
    <StyledCalculatorSection>
      <StyledContainer wrapper="content">
        <StyledCalculatorWrapper onSubmit={handleCreateRequisition}>
          <CalculatorContext.Provider
            value={{
              pair,
              errors,
              isHandleSwap,
              setErrors,
              handleChangeRequisitionDetails,
              handleChangeExchangeValue,
              setTab
            }}
          >
            <CalculatorTabContext.Provider
              value={{
                direction: "payment",
                tab: paymentTab,
                exchangeValue: exchangeValue.paymentExchangeValue,
                inverseExchangeValue: exchangeValue.payoutExchangeValue,
                handleChangeCollection
              }}
            >
              <CalculatorFooterContext.Provider
                value={{
                  amount: paymentAmount,
                  handleChangeRequisitionAmount,
                  loading: calculatedDetailsLoading && state === "payment",
                  refetch: refetchPayment
                }}
              >
                <CalculatorTab label="Отдаете" />
              </CalculatorFooterContext.Provider>
            </CalculatorTabContext.Provider>
            <CalculatorSwap
              exchangeValue={exchangeValue}
              collection={collection}
              setHandleSwap={setHandleSwap}
            />
            <CalculatorTabContext.Provider
              value={{
                direction: "payout",
                tab: payoutTab,
                exchangeValue: exchangeValue.payoutExchangeValue,
                inverseExchangeValue: exchangeValue.paymentExchangeValue,
                handleChangeCollection
              }}
            >
              <CalculatorFooterContext.Provider
                value={{
                  amount: payoutAmount,
                  handleChangeRequisitionAmount,
                  loading: calculatedDetailsLoading && state === "payout",
                  refetch: refetchPayout
                }}
              >
                <CalculatorTab label="Получаете" />
              </CalculatorFooterContext.Provider>
            </CalculatorTabContext.Provider>
            <CalculatorExchangeContext.Provider
              value={{
                isCollectionLoading,
                isShowRequisites,
                setShowRequisites
              }}
            >
              <CalculatorExchangeButton />

              <Can
                role={userRole}
                perform={calculator.SET_REQUISITES}
                data={managerClientRequisition}
                yes={() =>
                  isShowRequisites && (
                    <StyledRequisitesWrapper className="calculator__footer">
                      {/*TODO Вывод имения клиента при создании заявки из под менеджера */}
                      {managerClientRequisition && <CalculatorUserTab id={managerClientRequisition} />}
                      <CalculatorAttributesContext.Provider
                        value={{
                          direction: "payment",
                          saveBankDetails: savePaymentBankDetails,
                          attributes: paymentAttributes,
                          pairUnitId: getID(exchangeValue.paymentExchangeValue.id),
                          subName: exchangeValue.paymentExchangeValue.paymentSystem.subName
                        }}
                      >
                        <CalculatorAttributes />
                      </CalculatorAttributesContext.Provider>
                      <CalculatorAttributesContext.Provider
                        value={{
                          direction: "payout",
                          saveBankDetails: savePayoutBankDetails,
                          attributes: payoutAttributes,
                          pairUnitId: getID(exchangeValue.payoutExchangeValue.id),
                          subName: exchangeValue.payoutExchangeValue.paymentSystem.subName
                        }}
                      >
                        <CalculatorAttributes />
                      </CalculatorAttributesContext.Provider>
                      <CalculatorRequisites createRequisitionLoading={createRequisitionLoading} />
                    </StyledRequisitesWrapper>
                  )
                }
              />
              <CalculatorNoExchange />
            </CalculatorExchangeContext.Provider>
          </CalculatorContext.Provider>
        </StyledCalculatorWrapper>
      </StyledContainer>
    </StyledCalculatorSection>
  );
};

export default React.memo(Calculator);
