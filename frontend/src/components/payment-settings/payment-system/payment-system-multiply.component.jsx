import React, { useCallback, useContext, useState } from "react";
import { useMutation } from "@apollo/react-hooks";

import { StyledButton } from "../../styles/styled-button";
import { StyledFormWrapper, StyledHiddenForm, StyledHiddenFormAction } from "../../styles/styled-form";
import { StyledLoadingWrapper } from "../../spinner/styled-spinner";

import { PaymentSystemContext } from "./payment-system.container";
import InputGroupComponent from "../../input-group/input-group.component";
import FragmentSpinner from "../../spinner/fragment-spinner.component";
import { closableNotificationWithClick } from "../../notification/closable-notification-with-click.component";

import { UPDATE_PAYMENT_SYSTEM_DETAILS } from "../../../graphql/mutations/payment-system.mutation";
import { GET_ALL_PAYMENT_SYSTEMS } from "../../../graphql/queries/payment-system.query";

const PaymentSystemMultiply = () => {
  const [hide, setHide] = useState(true);
  const { filter, countChecked, currentPage } = useContext(PaymentSystemContext);
  const { citemsPerPage } = filter;
  const itemsPerPage = citemsPerPage ? +citemsPerPage : 50;
  const [price, setPrice] = useState(0);
  const object = Object.entries(filter).reduce((a, [k, v]) => (a[k.slice(1)] = v, a), {});
  const { active, ...props } = object;
  const [updatePaymentSystemDetails, { loading }] = useMutation(
    UPDATE_PAYMENT_SYSTEM_DETAILS,
    {
      onCompleted: () => {
        closableNotificationWithClick("Себестоимость успешно изменена", "success");
      },
      refetchQueries: () => [
        {
          query: GET_ALL_PAYMENT_SYSTEMS,
          variables: {
            ...props,
            itemsPerPage,
            page: currentPage
          }
        }
      ]
    }
  );
  
  const handleChangeInput = useCallback((event) => {
    setPrice(+event.target.value);
  });
  
  const showForm = () => {
    hide ? setHide(false) : setHide(true);
  };
  
  const onPriceChange = () => {
    let data = document.getElementsByName("applyTo");
    
    for (let i = 0; i < data.length; i++) {
      if (data[i].checked) {
        updatePaymentSystemDetails({
          variables: { id: data[i].id, price }
        });
      }
    }
  };
  
  return (
    <div className="payment-settings-actions">
      <div className="payment-settings-actions__top">
        <StyledButton type="button" weight="normal" onClick={showForm}>
          Множественный выбор
        </StyledButton>
      </div>
      <StyledLoadingWrapper>
        {(loading) && <FragmentSpinner position="center" />}
        <StyledFormWrapper
          className={`payment-settings-form change-multiply ${loading && "loading"}`}
          hide={hide}
        >
          <div className="change-multiply__content">
            <div className="change-multiply__item">
              <InputGroupComponent
                onChange={handleChangeInput}
                value={price}
                name="price"
                type="number"
                label="Себестоимость"
                required="required"
                className="create-pair-form__percent"
              />
              <StyledButton
                type="button"
                color="success"
                className="create-pair-form__button"
                weight="normal"
                onClick={onPriceChange}
              >
                {"Применить к " + countChecked + " из " + itemsPerPage}
              </StyledButton>
            </div>
          </div>
        </StyledFormWrapper>
      </StyledLoadingWrapper>
    </div>
  );
};

export default PaymentSystemMultiply;
