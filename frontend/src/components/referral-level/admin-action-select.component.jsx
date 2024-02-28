import React, { useCallback, useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import {
  SET_REFERRAL_LEVEL_FOR_ALL_CLIENTS,
  SET_REFERRAL_LEVEL_FOR_ALL_EXCEPT_INDIVIDUAL_CLIENTS,
  SET_REFERRAL_LEVEL_FOR_INDIVIDUAL_CLIENTS,
  SET_REFERRAL_LEVEL_FOR_NEW_CLIENTS
} from "../../graphql/mutations/referral-level.mutation";
import { GET_REFERRAL_LEVELS_BY_DEFAULT } from "../../graphql/queries/referral-level.query";
import Select, { Option } from "rc-select";
import { getID } from "../../utils/calculator.utils";
import Spinner from "../spinner/spinner.component";
import { closableNotificationWithClick } from "../notification/closable-notification-with-click.component";

import { StyledSelect } from "../styles/styled-img-select";
import { StyledButton } from "../styles/styled-button";

const ReferralLevelActionsSelect = ({
    updateReferralLevel,
    getAllReferralLevels,
    id,
    level,
    setReferralLevel,
    updateLoading
  }) => {
    const [selected, setSelected] = useState("for_all");
    const [defaultLevelsLength, setDefaultLevelsLength] = useState(null);

    const [setReferralLevelDefault, { loading: setReferralLevelDefaultLoading }] = useMutation(
      SET_REFERRAL_LEVEL_FOR_NEW_CLIENTS, {
        onCompleted: data => {
          closableNotificationWithClick("Реферальный уровень успешно обновлен.", "success");
          getAllReferralLevels();
        }
      });
    const [
      setReferralLevelForAllExceptVipClients,
      { loading: setAllExceptVipClientsReferralLevelLoading }
    ] = useMutation(SET_REFERRAL_LEVEL_FOR_ALL_EXCEPT_INDIVIDUAL_CLIENTS, {
      onCompleted: data => {
        closableNotificationWithClick("Реферальный уровень успешно обновлен.", "success");
        getAllReferralLevels();
      }
    });
    const [
      setReferralLevelForIndividualClients,
      { loading: setReferralLevelForIndividualClientsLoading }
    ] = useMutation(SET_REFERRAL_LEVEL_FOR_INDIVIDUAL_CLIENTS, {
      onCompleted: data => {
        closableNotificationWithClick("Реферальный уровень успешно обновлен.", "success");
        getAllReferralLevels();
      }
    });
    const [
      setForAllClients,
      { loading: setForAllClientstLoading }
    ] = useMutation(SET_REFERRAL_LEVEL_FOR_ALL_CLIENTS, {
      onCompleted: data => {
        closableNotificationWithClick("Реферальный уровень успешно обновлен.", "success");
        getAllReferralLevels();
      }
    });

    const [
      getDefaultReferralLevel, {
        data: defaultReferralLevelsData
      }] = useLazyQuery(GET_REFERRAL_LEVELS_BY_DEFAULT, {
      onCompleted: data => {
        setDefaultLevelsLength(defaultReferralLevelsData.referralLevels.collection.length);
      }
    });

    useEffect(() => {
      if (!defaultReferralLevelsData) return;

      if (defaultLevelsLength > 0) {
        const isReplaceDefaultLevel =
          window.confirm("Реферальный уровень с таким уровнем уже используется для всех. Заменить?");

        if (isReplaceDefaultLevel) {
          setReferralLevelDefault({
            variables: {
              referralLevelID: getID(id)
            }
          }).then(() => {
            setReferralLevel(prevState => {
                return {
                  ...prevState,
                  isDefault: true
                };
              }
            );

            handleApplyAction(selected);
          });
        }
      } else if (defaultLevelsLength === 0) {
        updateReferralLevel({
          variables: {
            input: {
              id: id,
              isDefault: true,
              isActive: true
            }
          }
        }).then(() => {
          setReferralLevel(prevState => {
              return {
                ...prevState,
                isDefault: true,
                isActive: true
              };
            }
          );

          handleApplyAction(selected);
        });
      }

    }, [defaultLevelsLength]);

    const handleApplyAction = useCallback(
      (value) => {

        if (value === "for_new_clients") {

          if (!defaultReferralLevelsData) {
            getDefaultReferralLevel({
              variables: {
                level, isDefault: true
              }
            });

            return;
          }
        }

        if (value === "for_all") {
          const isApplyForAllClients =
            window.confirm("Этот реферальный уровень будет использован для всех пользователей. Применить?");
          if (isApplyForAllClients) {
            setForAllClients({
              variables: {
                referralLevelID: getID(id)
              }
            });
          } else {
            return;
          }
        }

        if (value === "for_vip_clients") {
          const isApplyForVipClients =
            window.confirm("Этот реферальный уровень будет использован для всех вип пользователей. Применить?");
          if (isApplyForVipClients) {
            setReferralLevelForIndividualClients({
              variables: {
                referralLevelID: getID(id)
              }
            });
          } else {
            return;
          }
        }

        if (value === "for_all_except_vip") {
          const isApplyForAllExceptVipClients =
            window.confirm(
              "Этот реферальный уровень будет использован для всех пользователей, кроме вип пользователей. Применить?");
          if (isApplyForAllExceptVipClients) {
            setReferralLevelForAllExceptVipClients({
              variables: {
                referralLevelID: getID(id)
              }
            });
          } else {
            return;
          }
        }

        getAllReferralLevels();
      }, [defaultReferralLevelsData]);

    const style = {
      textTransform: "inherit"
    };

    return (
      <>
        <StyledSelect className="change-status">
          {
            updateLoading
            || setReferralLevelDefaultLoading
            || setForAllClientstLoading
            || setReferralLevelForIndividualClientsLoading
            || setAllExceptVipClientsReferralLevelLoading
            && <div className="default-spinner">
              <Spinner
                color="#EC6110"
                type="moonLoader"
                size="35px"
              />
            </div>
          }
          <Select
            className="custom-select-img"
            defaultValue={selected}
            onChange={(value) => setSelected(value)}
            value={selected}
            disabled={updateLoading || setReferralLevelDefaultLoading || setForAllClientstLoading}
          >
            <Option
              value={"for_all"}
              label="Для всех"
            >
              <div className="option-select-item change-status__item" style={style}>Для всех</div>
            </Option>
            <Option
              value={"for_new_clients"}
              label="Для новых клиентов"
            >
              <div className="option-select-item change-status__item" style={style}>Для новых клиентов</div>
            </Option>
            <Option
              value={"for_vip_clients"}
              label="Для клиентов с индивидуальным тарифом"
            >
              <div className="option-select-item change-status__item" style={style}>Для клиентов с индивидуальным
                                                                                    тарифом
              </div>
            </Option>
            <Option
              value={"for_all_except_vip"}
              label="Для всех кроме индивидуальных"
            >
              <div className="option-select-item change-status__item" style={style}>Для всех, кроме индивидуальных</div>
            </Option>
          </Select>
        </StyledSelect>
        <StyledButton
          color="success"
          onClick={() => handleApplyAction(selected)}
          weight="normal"
        >
          Применить
        </StyledButton>
      </>
    );
  }
;

export default ReferralLevelActionsSelect;
