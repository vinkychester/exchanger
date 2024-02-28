import React, { useState } from "react";
import Spinner from "../../spinner/spinner.component";
import { TimestampToDate } from "../../../utils/timestampToDate.utils";
import ManagerCity from "./manager-city.component";
import Confirmation from "../../confirmation/confirmation";

import { closableNotificationWithClick } from "../../notification/closable-notification-with-click.component";
import { useMutation } from "@apollo/react-hooks";
import { UPDATE_MANAGER } from "../../../graphql/mutations/user.mutation";
import { parseApiErrors } from "../../../utils/response";
import { CREATE_MANAGER_PERCENT_PROFIT_HISTORY } from "../../../graphql/mutations/manager-percent-profit-history.mutation";
import DelayInputComponent from "../../input-group/delay-input-group";
import { UPDATE_DETAILS_MANAGER } from "../../../graphql/mutations/account.mutation";
import Avatar from "../../avatar/avatar.component";

import { StyledButton } from "../../styles/styled-button";
import { StyledBlockText, StyledBlockTitle, StyledInfoBlock } from "../../styles/styled-info-block";
import {
  StyledAdministrationCard,
  StyledAdministrationCardBody,
  StyledAdministrationCardHead,
  StyledAdministrationName
} from "../styled-administration-details";
import Switch from "rc-switch";

const ManagerDetailsContainer = ({ manager }) => {
  const { id, firstname, lastname, email, createdAt } = manager;

  const [percentCash, setPercentCash] = useState(manager.percentCash);
  const [profitCashConfirmation, setProfitCashConfirmation] = useState(false);

  const [managerBank, setManagerBank] = useState(manager.isBank);
  const [bankConfirmation, setBankConfirmation] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState({ firstname: firstname, lastname: lastname });
  const [errors, setErrors] = useState(null);

  const [updateManager] = useMutation(UPDATE_MANAGER, {
    onCompleted: () => {
      closableNotificationWithClick("Безналичный расчет успешно изменен", "success");
      setManagerBank(!managerBank);
    }
  });

  const [updateManagerName] = useMutation(UPDATE_DETAILS_MANAGER, {
    onCompleted: () => {
      setEditMode(false);
      closableNotificationWithClick("Данные успешно обновлены", "success");
    }
  });

  const [createManagerPercentProfitHistory] = useMutation(CREATE_MANAGER_PERCENT_PROFIT_HISTORY, {
    onError: ({ graphQLErrors }) => {
      setErrors(parseApiErrors(graphQLErrors));
    },
    onCompleted: data => {
      setProfitCashConfirmation(false);
      closableNotificationWithClick("Наличный процент успешно изменен", "success");
    }
  });

  const handleChangeName = (event) => {
    const { name, value } = event.target;
    setName((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const updateName = () => {
    updateManagerName({
      variables: {
        id: id,
        firstname: name.firstname,
        lastname: name.lastname
      }
    });
  };

  const createPercentProfitHistory = (percent) => {
    createManagerPercentProfitHistory({
      variables: {
        input: {
          manager: id,
          percent,
          percentName: "cash"
        }
      }
    });
  };

  const handleChangeManager = () => {
    updateManager({
      variables: {
        input: {
          id,
          isBank: !managerBank
        }
      }
    });
  };

  return (
    <>
      {manager ?
        <StyledAdministrationCard>
          <Confirmation
            handler={handleChangeManager}
            question={"Изменить безналичный расчет для этого менеджера?"}
            visible={bankConfirmation}
            setVisible={setBankConfirmation}
          />
          <Confirmation
            handler={() => createPercentProfitHistory(+percentCash)}
            question={"Изменить процент прибыли(cash) для этого менеджера?"}
            visible={profitCashConfirmation}
            setVisible={setProfitCashConfirmation}
          />
          <StyledAdministrationCardHead>
            <Avatar user={manager} />
            <StyledInfoBlock>
              <StyledAdministrationName className="change-manager-name">
                {editMode ?
                  <div className="change-manager-name__fields">
                    <DelayInputComponent
                      handleChange={handleChangeName}
                      errorMessage={errors?.firstname}
                      value={name.firstname}
                      name="firstname"
                      type="text"
                      debounceTimeout={600}
                      autoComplete="off"
                    />
                    <DelayInputComponent
                      handleChange={handleChangeName}
                      errorMessage={errors?.lastname}
                      value={name.lastname}
                      name="lastname"
                      type="text"
                      debounceTimeout={600}
                      autoComplete="off"
                    />
                  </div> :
                  <h4>
                    {name.firstname} {name.lastname}
                  </h4>
                }
                <div>
                  {editMode ?
                    <StyledButton
                      color="success"
                      weight="normal"
                      className="change-manager-name__btn"
                      onClick={updateName}
                    >
                      Сохранить
                    </StyledButton> :
                    <StyledButton
                      color="info"
                      weight="normal"
                      className="change-manager-name__btn"
                      onClick={() => { setEditMode(!editMode);}}
                    >
                      Изменить имя
                    </StyledButton>
                  }
                </div>
              </StyledAdministrationName>
              <StyledBlockTitle>
                E-mail:
              </StyledBlockTitle>
              <StyledBlockText>
                {email}
              </StyledBlockText>
            </StyledInfoBlock>
          </StyledAdministrationCardHead>

          <StyledAdministrationCardBody>
            <StyledInfoBlock>
              <StyledBlockTitle>
                Дата регистрации:
              </StyledBlockTitle>
              <StyledBlockText>
                {TimestampToDate(createdAt)}
              </StyledBlockText>
            </StyledInfoBlock>

            <StyledInfoBlock>
              <ManagerCity manager={manager} />
            </StyledInfoBlock>

            <StyledInfoBlock>
              <StyledBlockTitle>
                Безналичный расчет:
              </StyledBlockTitle>
              <StyledBlockText>
                <Switch
                  className="default-switch"
                  name="active"
                  checked={managerBank}
                  onChange={() => setBankConfirmation(true)}
                  defaultChecked={managerBank}
                />
              </StyledBlockText>
            </StyledInfoBlock>
            <StyledInfoBlock>
              <StyledBlockTitle>
                Процент прибыли менеджера по наличным(cash) заявкам:
              </StyledBlockTitle>
              <DelayInputComponent
                handleChange={(event) => {
                  if (event.target.value) {
                    setPercentCash(event.target.value);
                    setProfitCashConfirmation(true);
                  }
                }}
                errorMessage={errors?.percent}
                value={percentCash === 0 ? "" : percentCash}
                name="percentCash"
                type="number"
                debounceTimeout={600}
                autoComplete="off"
              />
            </StyledInfoBlock>

          </StyledAdministrationCardBody>
        </StyledAdministrationCard>
        : <Spinner
          color="red"
          type="moonLoader"
          size="50px"
        />
      }
    </>
  );
};
export default ManagerDetailsContainer;
