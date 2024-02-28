import React, { useContext, useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import Checkbox from "rc-checkbox";

import { StyledCol, StyledRow } from "../../styles/styled-table";
import { StyledButton } from "../../styles/styled-button";

import ActiveToggler from "../../active-toggler/active-toggler.component";

import {
  UPDATE_PAIR_ACTIVITY,
  UPDATE_PAIR_PERCENT,
  UPDATE_PAIR_TOP
} from "../../../graphql/mutations/pair.mutation";

import DelayInputComponent from "../../input-group/delay-input-group";
import Confirmation from "../../confirmation/confirmation";
import { closableNotificationWithClick } from "../../notification/closable-notification-with-click.component";
import { StyledTooltip } from "../../styles/styled-tooltip";
import Tooltip from "rc-tooltip";
import { PairFilterContext } from "./pair.container";

const PairItem = ({
  id,
  isActive,
  payment,
  payout,
  percent,
  requisitions,
  deletePairAction,
  top,
}) => {
  const { setCountChecked } = useContext(PairFilterContext);
  const [visible, setVisible] = useState(false);
  const { totalCount } = requisitions.paginationInfo;
  const [checked, setChecked] = useState(false);
  const [
    updatePairActivity,
    { loading: activeLoading, error: errorLoading },
  ] = useMutation(UPDATE_PAIR_ACTIVITY, {
    onCompleted: () => {
      closableNotificationWithClick(
        "Активность пары успешно изменена",
        "success"
      );
    },
  });
  const [updatePairPercent] = useMutation(UPDATE_PAIR_PERCENT, {
    onCompleted: () => {
      closableNotificationWithClick("Процент успешно изменен", "success");
    },
  });

  const [updatePairTop] = useMutation(UPDATE_PAIR_TOP, {
    onCompleted: () => {
      closableNotificationWithClick("Топ пары успешно изменен", "success");
    },
    onError: () => {
      closableNotificationWithClick("Топ может быть только целым числом", "error");
    }
  });

  function onChangeCheckbox({ target }) {
    setChecked(checked);
    target.checked
      ? setCountChecked((prev) => ++prev)
      : setCountChecked((prev) => --prev);
  }

  const updateField = (pairId, value, mutation, field) => {
    mutation({ variables: { id: pairId, [field]: value } });
  };

  const handleDelete = () => {
    deletePairAction(id);
    setVisible(false);
  };

  const handleUpdateTop = (event) => {
    const { name, value } = event.target;
    updatePairTop({
      variables: {
        id,
        [name]: +value.trim(),
      },
    });
  };

  return (
    <>
      {visible && (
        <Confirmation
          question={"Вы действительно хотите удалить пару?"}
          handler={handleDelete}
          setVisible={setVisible}
          visible={visible}
        />
      )}
      <StyledRow scroll="auto" col="7" className="pairs-table__row">
        <StyledCol data-title="Применить к" className="pairs-table__apply-to">
          <Checkbox
            className="default-checkbox"
            onChange={onChangeCheckbox}
            name="applyTo"
            id={id}
          />
        </StyledCol>
        <StyledCol data-title="Активные" className="pairs-table__activity">
          <ActiveToggler
            id={id}
            name="isActive"
            value={isActive}
            text="Вы действительно хотите изменить активность пары?"
            action={(event) =>
              updateField(
                id,
                event.variables.isActive,
                updatePairActivity,
                "isActive"
              )
            }
            loading={activeLoading}
            error={errorLoading}
          />
        </StyledCol>

        <StyledCol data-title="Отдал" className="pairs-table__in">
          <div className="payment-system">
            <div className="payment-system__main">
              <div
                className={`exchange-icon-${
                  payment.paymentSystem.tag === "CRYPTO"
                    ? payment.currency.asset
                    : payment.paymentSystem.tag
                }`}
              />
              <div className="payment-system__name">
                {payment.paymentSystem.name}
              </div>
              <div className="payment-system__asset">
                {payment.currency.asset}
              </div>
            </div>
            <div className="payment-system__service">
              ({payment.service.name})
            </div>
          </div>
        </StyledCol>
        <StyledCol data-title="Получил" className="pairs-table__out">
          <div className="payment-system">
            <div className="payment-system__main">
              <div
                className={`exchange-icon-${
                  payout.paymentSystem.tag === "CRYPTO"
                    ? payout.currency.asset
                    : payout.paymentSystem.tag
                }`}
              />
              <div className="payment-system__name">
                {payout.paymentSystem.name}
              </div>
              <div className="payment-system__asset">
                {payout.currency.asset}
              </div>
            </div>
            <div className="payment-system__service">
              ({payout.service.name})
            </div>
          </div>
        </StyledCol>
        <StyledCol data-title="Топ" className="pairs-table__top">
          <DelayInputComponent
            type="number"
            name="top"
            value={top.toString()}
            handleChange={handleUpdateTop}
            debounceTimeout={600}
          />
        </StyledCol>
        <StyledCol
          data-title="Процент покупки"
          className="pairs-table__in-percent"
        >
          <DelayInputComponent
            type="number"
            value={percent.toString()}
            handleChange={(event) =>
              updateField(id, +event.target.value, updatePairPercent, "percent")
            }
            debounceTimeout={600}
          />
        </StyledCol>
        <StyledCol data-title="Действие" className="pairs-table__active">
          {totalCount === 0 ? (
            <StyledButton
              color="danger"
              onClick={() => setVisible(true)}
              weight="normal"
            >
              Удалить
            </StyledButton>
          ) : (
            <Tooltip
              placement="top"
              overlay="Невозможно удалить пару, на которую есть заявки"
            >
              <StyledTooltip
                size="18"
                opacity="0.5"
                className="icon-question"
              />
            </Tooltip>
          )}
        </StyledCol>
      </StyledRow>
    </>
  );
};

export default PairItem;
