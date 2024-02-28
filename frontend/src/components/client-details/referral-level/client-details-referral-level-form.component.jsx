import React, { useState } from "react";
import Select, { Option } from "rc-select";
import { StyledButton } from "../../styles/styled-button";
import { useMutation } from "@apollo/react-hooks";
import { StyledSelect } from "../../styles/styled-img-select";

import { CREATE_IF_NOT_EXIST_REFERRAL_CLIENT_LEVEL } from "../../../graphql/mutations/referral-client-level.mutation";
import { getID } from "../../../utils/calculator.utils";
import { closableNotificationWithClick } from "../../notification/closable-notification-with-click.component";
import { StyledClientChangeForm, StyledClientChangeWrapper } from "../styled-client-details";

const ClientDetailsReferralLevelForm = ({ clientId, referralLevels, refetch }) => {
  const [selectedReferralLevel, setSelectedReferralLevel] = useState(referralLevels[0]);

  const [createIfNotExistReferralClientLevel] = useMutation(CREATE_IF_NOT_EXIST_REFERRAL_CLIENT_LEVEL, {
    onCompleted: data => {
      closableNotificationWithClick(
        `Реферальный уровень успешно создан.`,
        "success"
      )
      refetch({
        variables: {
          clientId,
        },
      });
    }
  });

  const handleChangeButton = (event) => {
    event.preventDefault();

    createIfNotExistReferralClientLevel({
      variables: {
        clientID: clientId,
        referralLevelID: getID(selectedReferralLevel.id)
      }
    });
  };

  const handleChangeSelect = (id) => {
    setSelectedReferralLevel(referralLevels.find(referralLevel => referralLevel.id === id));
  };

  const style = {
    textTransform: "inherit"
  };

  return (
    <StyledClientChangeWrapper>
      <div className="client-change-info__title">
        Добавить реферальный уровень {selectedReferralLevel.level}:
      </div>
      <StyledClientChangeForm>
        <StyledSelect className="input-group">
          <Select
            className="custom-select"
            defaultValue={selectedReferralLevel.id}
            // disabled={mutationLoading}
            onChange={handleChangeSelect}
          >
            {referralLevels && referralLevels.map(referralLevel => (
              <Option
                key={referralLevel.id}
                value={referralLevel.id}
                label={referralLevel.name}
              >
                <div className="option-select-item" style={style}>
                  {`${referralLevel.name} percent: ${referralLevel.percent}`}
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

export default ClientDetailsReferralLevelForm;
