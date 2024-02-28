import React, { useState } from "react";
import Select, { Option } from "rc-select";
import Spinner from "../../spinner/spinner.component";
import { useMutation } from "@apollo/react-hooks";
import { closableNotificationWithClick } from "../../notification/closable-notification-with-click.component";
import { getID } from "../../../utils/calculator.utils";
import Confirmation from "../../confirmation/confirmation";

import { UPDATE_CLIENT_REFERRAL_LEVEL_WITH_LOG } from "../../../graphql/mutations/referral-client-level.mutation";

import { StyledButton } from "../../styles/styled-button";
import { StyledSelect, StyledSelectLabel } from "../../styles/styled-img-select";
import { StyledClientChangeForm, StyledClientChangeWrapper } from "../styled-client-details";

const ReferralClientLevelItem = ({ referralClientLevel, referralLevels, refetch }) => {

  const [selectedReferralLevel, setSelectedReferralLevel] = useState(referralClientLevel.referralLevel);
  const [changeConfirmation, setChangeConfirmation] = useState(false);

  const [updateReferralLevelWithLog] = useMutation(UPDATE_CLIENT_REFERRAL_LEVEL_WITH_LOG, {
    onCompleted: data => {
      refetch().then(data => {
        closableNotificationWithClick(
          `Реферальный уровень успешно изменен.`,
          "success"
        );
      });
    }
  });

  const handleChangeSelect = (id) => {
    setSelectedReferralLevel(referralLevels.find(referralLevel => referralLevel.id === id));
  };

  const handleChangeButton = (event) => {
    event.preventDefault();

    updateReferralLevelWithLog({
      variables: {
        referralClientLevelID: getID(referralClientLevel.id),
        referralLevelID: getID(selectedReferralLevel.id)
      }
    });

  };

  if (!selectedReferralLevel) {
    return <Spinner color="#EC6110" type="moonLoader" size="35px" />;
  }

  const style = {
    textTransform: "inherit"
  };

  return (
    <StyledClientChangeWrapper>
      {changeConfirmation && <Confirmation
        question={"Вы действительно хотите изменить реферальный уровень?"}
        handler={() => {
          updateReferralLevelWithLog({
            variables: {
              referralClientLevelID: getID(referralClientLevel.id),
              referralLevelID: getID(selectedReferralLevel.id)
            }
          });
        }}
        setVisible={setChangeConfirmation}
        visible={changeConfirmation}
      />
      }
      <div className="client-change-info__title">
        Реферальный уровень {selectedReferralLevel.level} = {selectedReferralLevel.percent}%
      </div>
      <StyledClientChangeForm>
        <StyledSelect className="input-group">
          <StyledSelectLabel as="label">Изменить % {referralClientLevel.referralLevel.level} уровня:</StyledSelectLabel>
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
          color="info"
          onClick={() => setChangeConfirmation(true)}
          weight="normal"
        >
          Изменить
        </StyledButton>
      </StyledClientChangeForm>
    </StyledClientChangeWrapper>
  );
};

export default ReferralClientLevelItem;
