import React, { useCallback, useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import {
  SET_CASHBACK_LEVEL_FOR_ALL_CLIENTS,
  SET_CASHBACK_LEVEL_FOR_ALL_EXCEPT_INDIVIDUAL_CLIENTS,
  SET_CASHBACK_LEVEL_FOR_INDIVIDUAL_CLIENTS,
  SET_CASHBACK_LEVEL_FOR_NEW_CLIENTS
} from "../../graphql/mutations/cashback-level.mutation";
import { GET_CASHBACK_LEVELS_BY_DEFAULT } from "../../graphql/queries/cashback-level.query";
import Select, { Option } from "rc-select";
import { StyledSelect } from "../styles/styled-img-select";
import { getID } from "../../utils/calculator.utils";
import Spinner from "../spinner/spinner.component";
import { StyledButton } from "../styles/styled-button";
import { closableNotificationWithClick } from "../notification/closable-notification-with-click.component";

const CashbackLevelActionsSelect = ({
    updateCashbackLevel,
    refetchCashbackLevels,
    id,
    level,
    setCashbackLevel,
    updateLoading
  }) => {
    const [selected, setSelected] = useState("for_all");
    const [defaultLevelsLength, setDefaultLevelsLength] = useState(null);

    const [setCashbackLevelDefault, { loading: setCashbackLevelDefaultLoading }] = useMutation(
      SET_CASHBACK_LEVEL_FOR_NEW_CLIENTS, {
        onCompleted: data => {
          refetchCashbackLevels();
          closableNotificationWithClick(
            `Кешбэк уровень успешно обновлен.`,
            "success"
          );
        }
      });

    const [
      setCashbackLevelForAllExceptVipClients,
      { loading: setAllExceptVipClientsCashbackLevelLoading }
    ] = useMutation(SET_CASHBACK_LEVEL_FOR_ALL_EXCEPT_INDIVIDUAL_CLIENTS, {
      onCompleted: data => {
        refetchCashbackLevels();
        closableNotificationWithClick(
          `Кешбэк уровень успешно обновлен.`,
          "success"
        );
      }
    });

    const [
      setCashbackLevelForIndividualClients,
      { loading: setCashbackLevelForIndividualClientsLoading }
    ] = useMutation(SET_CASHBACK_LEVEL_FOR_INDIVIDUAL_CLIENTS, {
      onCompleted: data => {
        refetchCashbackLevels();
        closableNotificationWithClick(
          `Кешбэк уровень успешно обновлен.`,
          "success"
        );
      }
    });

    const [
      setForAllClients,
      { loading: setForAllClientstLoading }
    ] = useMutation(SET_CASHBACK_LEVEL_FOR_ALL_CLIENTS, {
      onCompleted: data => {
        refetchCashbackLevels();
        closableNotificationWithClick(
          `Кешбэк уровень успешно обновлен.`,
          "success"
        );
      }
    });

    const [
      getDefaultCashbackLevel, {
        data: defaultCashbackLevelsData
      }] = useLazyQuery(GET_CASHBACK_LEVELS_BY_DEFAULT, {
      onCompleted: data => {
        setDefaultLevelsLength(defaultCashbackLevelsData.cashbackLevels.collection.length);
      }
    });

    useEffect(() => {
      if (!defaultCashbackLevelsData) return;

      if (defaultLevelsLength > 0) {
        const isReplaceDefaultLevel =
          window.confirm("Кешбэк уровень с таким уровнем уже используется для всех. Заменить?");

        if (isReplaceDefaultLevel) {
          setCashbackLevelDefault({
            variables: {
              cashbackLevelID: getID(id)
            }
          }).then(() => {
            setCashbackLevel(prevState => {
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
      } else if (defaultLevelsLength === 0) {
        updateCashbackLevel({
          variables: {
            input: {
              id: id,
              isDefault: true,
              isActive: true
            }
          }
        }).then(() => {
          handleApplyAction(selected);
        });
      }

    }, [defaultLevelsLength]);

    const handleApplyAction = useCallback(
      (value) => {
        if (value === "for_new_clients" && !defaultCashbackLevelsData) {
          getDefaultCashbackLevel({ variables: { level, isDefault: true } });

          return;
        }

        if (value === "for_all") {
          const isApplyForAllClients =
            window.confirm("Этот реферальный уровень будет использован для всех пользователей. Применить?");
          if (isApplyForAllClients) {
            setForAllClients({ variables: { cashbackLevelID: getID(id) } });
          } else {
            return;
          }
        }

        if (value === "for_vip_clients") {
          const isApplyForVipClients =
            window.confirm("Этот реферальный уровень будет использован для всех вип пользователей. Применить?");
          if (isApplyForVipClients) {
            setCashbackLevelForIndividualClients({ variables: { cashbackLevelID: getID(id) } });
          } else {
            return;
          }
        }

        if (value === "for_all_except_vip") {
          const isApplyForAllExceptVipClients =
            window.confirm(
              "Этот реферальный уровень будет использован для всех пользователей, кроме вип пользователей. Применить?");
          if (isApplyForAllExceptVipClients) {
            setCashbackLevelForAllExceptVipClients({ variables: { cashbackLevelID: getID(id) } });
          } else {
            return;
          }
        }

        refetchCashbackLevels();

      }, [defaultCashbackLevelsData]);

    const style = {
      textTransform: "inherit"
    };

    return (
      <>
        <StyledSelect className="change-status">
          {
            updateLoading
            || setCashbackLevelDefaultLoading
            || setForAllClientstLoading
            || setCashbackLevelForIndividualClientsLoading
            || setAllExceptVipClientsCashbackLevelLoading
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
            disabled={updateLoading || setCashbackLevelDefaultLoading || setForAllClientstLoading}
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

export default CashbackLevelActionsSelect;
