import React, { useState } from "react";
import Select, { Option } from "rc-select";
import { getID } from "../../../utils/calculator.utils";
import { useMutation } from "@apollo/react-hooks";
import { closableNotificationWithClick } from "../../notification/closable-notification-with-click.component";

import { CREATE_IF_NOT_EXIST_CASHBACK_CLIENT_LEVEL } from "../../../graphql/mutations/cashback-client-level.mutation";

import { StyledSelect } from "../../styles/styled-img-select";
import { StyledButton } from "../../styles/styled-button";
import { StyledClientChangeForm, StyledClientChangeWrapper } from "../styled-client-details";

const ClientCashbackLevelForm = ({ clientUUID, cashbackLevels, refetch }) => {
  const [selectedCashbackLevel, setSelectedCashbackLevel] = useState(cashbackLevels[0]);

  const [createIfNotExistCashbackClientLevel] = useMutation(CREATE_IF_NOT_EXIST_CASHBACK_CLIENT_LEVEL, {
    onCompleted: data => {
      refetch().then(data =>
        closableNotificationWithClick(
        `Кешбэк уровень успешно создан.`,
        "success"
      ));
    },
    onError: data => {
      data.graphQLErrors.map(({ message }, i) => (
        closableNotificationWithClick(
          `${message}.`,
          "error"
        )
      ));
    }
  });

  const handleChangeButton = (event) => {
    event.preventDefault();

    createIfNotExistCashbackClientLevel({
      variables: {
        clientID: clientUUID,
        cashbackLevelID: getID(selectedCashbackLevel.id)
      }
    }).then(data => (
      closableNotificationWithClick(
        `Кешбэк уровень успешно создан.`,
        "success"
      )
    ));
  };

  const handleChangeSelect = (id) => {
    setSelectedCashbackLevel(cashbackLevels.find(cashbackLevel => cashbackLevel.id === id));
  };

  const style = {
    textTransform: "inherit"
  };

  return (
    <StyledClientChangeWrapper>
      <div className="client-change-info__title">
        Добавить кешбэк уровень {selectedCashbackLevel.level}:
      </div>
      <StyledClientChangeForm>
        <StyledSelect className="input-group">
          <Select
            className="custom-select"
            defaultValue={selectedCashbackLevel.id}
            // disabled={mutationLoading}
            onChange={handleChangeSelect}
          >
            {cashbackLevels && cashbackLevels.map(cashbackLevel => (
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
        <StyledButton
          color="main"
          onClick={handleChangeButton}
          weight="normal"
        >
          Добавить
        </StyledButton>
      </StyledClientChangeForm>
    </StyledClientChangeWrapper>
  );
};

export default ClientCashbackLevelForm;
