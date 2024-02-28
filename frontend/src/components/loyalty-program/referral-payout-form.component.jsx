import React, { useState } from "react";
import DelayInputComponent from "../input-group/delay-input-group";
import { useMutation } from "@apollo/react-hooks";

import LoadButton from "../spinner/button-spinner.component";
import ReferralPayoutUsdtSelect from "./referral-payout-usdt-select.component";
import LoyaltyProgramAttributes from "./loyalty-program-attributes.component";

import { StyledFormTitle, StyledFormWrapper } from "../styles/styled-form";
import { StyledButton } from "../styles/styled-button";

import { CREATE_PAYOUT_REQUISITION } from "../../graphql/mutations/payout-requisition.mutation";
import { parseAllMessages, validateForm } from "../../utils/form-validator.utils";
import { closableNotificationWithClick } from "../notification/closable-notification-with-click.component";
import AlertMessage from "../alert/alert.component";

const ReferralPayoutForm = ({ userUUID, clientBalance, setIsUpdatePayoutHistory }) => {
  const [errors, setErrors] = useState([]);
  const [amount, setAmount] = useState("");
  const [sum, setSum] = useState("");
  const [wallet, setWallet] = useState("");
  const [usdtType, setUsdtType] = useState("");
  console.log(usdtType, sum);

  const [createPayoutRequisition, { loading }] = useMutation(CREATE_PAYOUT_REQUISITION);

  let validatedField = {};
  const handleSubmit = (event) => {
    event.preventDefault();

    // validatedField = {
    //   ...validatedField,
    //   wallet: "required|wallet:" + "USDT"
    // };

    let validated = validateForm(event.target, validatedField);

    if (Object.keys(validated.errors).length) {
      parseAllMessages(validated).forEach((messages, key) => {
        closableNotificationWithClick(messages, "error");
      });

      return false;
    }

    if (amount > clientBalance) {
      closableNotificationWithClick(
        `Указанная сумма больше вашего баланса.`,
        "error"
      );
      return false;
    }

    if (amount < 10) {
      closableNotificationWithClick(
        `Минимальная сумма вывоа становит 10 USDT.`,
        "error"
      );
      return false;
    }

    createPayoutRequisition({
      variables: {
        amount: +amount,
        wallet,
        usdtType,
        client: "/api/clients/" + userUUID
      }
    }).then(() => {
      closableNotificationWithClick(
        "Вы успешно оформили заявку. Подождите одобрения менеджеров.",
        "success"
      );
      setIsUpdatePayoutHistory(true);
      setWallet("");
      setAmount("");
      setUsdtType("");
    });
  };


  return (
    <StyledFormWrapper
      onSubmit={handleSubmit}
      className="referral-payout-form"
    >
      <StyledFormTitle
        as="h3"
        className="referral-payout-form__title"
      > Создать заявку на вывод </StyledFormTitle>
      <div className="referral-payout-form__content">
        <DelayInputComponent
          type="number"
          name="amount"
          value={amount}
          min={10}
          label="Введите кол-во USDT"
          debounceTimeout={600}
          handleChange={(event) => setAmount(event.target.value)}
          errorMessage={errors.amount}
          className="referral-payout-form__field"
          required
        />
        <ReferralPayoutUsdtSelect setUsdtType={setUsdtType} setSum={setSum} setWallet={setWallet} />
        <DelayInputComponent
          type="text"
          name="wallet"
          value={wallet}
          label="USDT кошелек"
          debounceTimeout={600}
          handleChange={(event) => setWallet(event.target.value)}
          errorMessage={errors.wallet}
          className="referral-payout-form__field"
          required
        />
        {usdtType !== "" && <LoyaltyProgramAttributes asset={usdtType} setWallet={setWallet} />}
        {/*<DelayInputComponent
          type="number"
          name="amount_end"
          value={amount ? amount-sum : ""}
          min={10}
          label="Сумма к зачисления"
          debounceTimeout={600}
          handleChange={(event) => setAmount(event.target.value)}
          errorMessage={errors.sum}
          className="referral-payout-form__field"
          required
        />*/}
        {amount && sum ?
          <AlertMessage
            type="info"
            message={<>Сумма зачисления c учетом комиссии: <b>{amount ? amount-sum : ""} USDT</b></>}
          /> : ""}
        <div className="referral-payout-form__action">
          {loading ?
            <LoadButton color="main" text="Создать заявку" /> :
            <StyledButton
              type="submit"
              color="main"
              onSubmit={handleSubmit}
            >
              Создать заявку
            </StyledButton>}
        </div>
      </div>
    </StyledFormWrapper>
  );
};

export default ReferralPayoutForm;