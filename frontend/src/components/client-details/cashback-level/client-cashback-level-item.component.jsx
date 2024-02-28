import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { getID } from "../../../utils/calculator.utils";
import Select, { Option } from "rc-select";
import Confirmation from "../../confirmation/confirmation";
import { closableNotificationWithClick } from "../../notification/closable-notification-with-click.component";

import {
  SET_CURRENT_CASHBACK_CLIENT_LEVEL,
  UPDATE_CLIENT_CASHBACK_LEVEL_WITH_LOG
} from "../../../graphql/mutations/cashback-client-level.mutation";

import { StyledButton } from "../../styles/styled-button";
import { StyledSelect, StyledSelectLabel } from "../../styles/styled-img-select";
import { StyledClientChangeForm, StyledClientChangeWrapper } from "../styled-client-details";

const CashbackClientLevelItem = ({ cashbackLevels, cashbackClientLevel, refetch }) => {
  const [selectedCashbackLevel, setSelectedCashbackLevel] = useState(cashbackClientLevel.cashbackLevel);
  const [changeConfirmation, setChangeConfirmation] = useState(false);
  const [currentConfirmation, setCurrentConfirmation] = useState(false);

  const [updateCashbackClientLevel] = useMutation(UPDATE_CLIENT_CASHBACK_LEVEL_WITH_LOG, {
    onCompleted: data => {
      closableNotificationWithClick(
        `Кешбэк уровень обновлен.`,
        "success"
      );
    }
  });

  const [setCurrentCashbackClientLevel] = useMutation(SET_CURRENT_CASHBACK_CLIENT_LEVEL, {
    onCompleted: data => {
      refetch().then(data => (
        closableNotificationWithClick(
          `Кешбэк уровень теперь является текущим.`,
          "success"
        )
      ));
    }
  });

  const handleChangeSelect = (id) => {
    setSelectedCashbackLevel(cashbackLevels.find(cashbackLevel => cashbackLevel.id === id));
  };

  const handleSetCurrent = () => {
    setCurrentCashbackClientLevel({
      variables: {
        cashbackClientLevelID: getID(cashbackClientLevel.id)
      }
    });
  };

  const handleChange = () => {
    updateCashbackClientLevel({
      variables: {
        cashbackClientLevelID: getID(cashbackClientLevel.id),
        cashbackLevelID: getID(selectedCashbackLevel.id)
      }
    });

  };

  const style = {
    textTransform: "inherit"
  };

  return (
    <StyledClientChangeWrapper>
      {changeConfirmation && <Confirmation
        question={"Вы действительно хотите изменить кешбэк уровень?"}
        handler={handleChange}
        setVisible={setChangeConfirmation}
        visible={changeConfirmation}
      />}
      {currentConfirmation && <Confirmation
        question={"Вы действительно хотите сделать кешбэк уровень текущим?"}
        handler={handleSetCurrent}
        setVisible={setCurrentConfirmation}
        visible={currentConfirmation}
      />}
      <div className="client-change-info__title">
        Кешбэк уровень {selectedCashbackLevel.level} - "{selectedCashbackLevel.name}" = {selectedCashbackLevel.percent}%
      </div>
      <StyledClientChangeForm>
        <StyledSelect className="input-group">
          <StyledSelectLabel as="label">
            Изменить % {selectedCashbackLevel.level} уровня:
          </StyledSelectLabel>
          <Select
            className="custom-select"
            defaultValue={cashbackClientLevel.cashbackLevel.id}
            // disabled={mutationLoading}
            onChange={handleChangeSelect}
          >
            {cashbackLevels && cashbackLevels.filter((cashbackLevel) =>
              cashbackLevel.level === cashbackClientLevel.cashbackLevel.level
            ).map(cashbackLevel => (
              <Option
                key={cashbackLevel.id}
                value={cashbackLevel.id}
                label={cashbackLevel.name}
              >
                <div className="option-select-item" style={style}>
                  {`${cashbackLevel.name} percent: ${cashbackLevel.percent}`}
                </div>
              </Option>
            ))}
          </Select>
        </StyledSelect>
        <div className="client-change-info__action">
          <StyledButton
            color="info"
            onClick={() => setChangeConfirmation(true)}
            weight="normal"
          >
            Изменить
          </StyledButton>
          {!cashbackClientLevel.isCurrent && <StyledButton
            color="main"
            onClick={() => setCurrentConfirmation(true)}
            weight="normal"
          >
            Сделать текущим
          </StyledButton>}
        </div>
      </StyledClientChangeForm>
    </StyledClientChangeWrapper>
  );
};

export default CashbackClientLevelItem;