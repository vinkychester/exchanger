import React, { useEffect, useState } from "react";
import { StyledCol, StyledRow } from "../styles/styled-table";
import DelayInputComponent from "../input-group/delay-input-group";
import { StyledButton } from "../styles/styled-button";
import Spinner from "../spinner/spinner.component";
import { useMutation } from "@apollo/react-hooks";
import { DELETE_CASHBACK_LEVEL, UPDATE_CASHBACK_LEVEL } from "../../graphql/mutations/cashback-level.mutation";
import CashbackLevelActionsSelect from "./admin-action-select.component";
import ModalWindow from "../modal/modal-window";
import { closableNotificationWithClick } from "../notification/closable-notification-with-click.component";

const CashbackLevelItem = ({ cashbackLevel, setPaginationInfo, refetchCashbackLevels }) => {
  const [visible, setVisible] = useState(false);
  const [{
    id,
    name,
    profitRangeFrom,
    profitRangeTo,
    level,
    percent,
    isDefault,
    isActive,
    moreActions
  }, setCashbackLevel] = useState({
    ...cashbackLevel,
    moreActions: false
  });

  const [updateCashbackLevel, { loading: updateLoading }] = useMutation(UPDATE_CASHBACK_LEVEL);
  const [deleteCashbackLevel, { loading: deleteLoading }] = useMutation(DELETE_CASHBACK_LEVEL,
    {
      onCompleted: data => {
        closableNotificationWithClick(
          `Кешбэк уровень успешно удален.`,
          "success"
        );
        setPaginationInfo(prevState => {
            return { ...prevState, totalCount: prevState.totalCount - 1 };
          }
        );
      }
    });

  useEffect(() => {
    setCashbackLevel(cashbackLevel);
  }, [cashbackLevel]);

  const handleChangeInput = (event) => {
    const { name, value } = event.target;

    let localValue = value;
    if (event.target.type === "number") {
      localValue = +localValue;
    }

    setCashbackLevel(prevState => {
        return {
          ...prevState,
          [name]: localValue
        };
      }
    );

    updateCashbackLevel({
      variables: {
        input: {
          id: id,
          [name]: localValue
        }
      }
    });
  };

  const deleteDialog = (id) => {
    return (
      <>
        <div className="default-modal__body-content">
          Вы действительно хотите удалить кешбэк уровень?
        </div>
        <div className="default-modal__body-footer">
          <StyledButton
            color="danger"
            weight="normal"
            onClick={() => {setVisible(false);}}
          >
            Нет
          </StyledButton>
          <StyledButton
            color="success"
            weight="normal"
            onClick={() => {
              deleteCashbackLevel({
                variables: {
                  id
                }
              });
              setVisible(false);
            }}
          >
            Да
          </StyledButton>
        </div>
      </>
    );
  };

  const handleDeleteReferralLevel = (id) => {
    setVisible(true);
  };

  return (
    <>
      {visible && <ModalWindow
        visible={visible}
        setVisible={setVisible}
        title="Внимание!"
        content={deleteDialog(id)}
      />}
      <StyledRow scroll="auto" col="7" className="admin-cashback-table__row">
        <StyledCol data-title="Статус" className="admin-cashback-table__status">
          {
            isDefault && isActive ? "По умолчанию"
              : isDefault && !isActive ? "Старый дефолтный уровень"
              : !isDefault && isActive ? "Используется"
                : "Не используется "
          }
        </StyledCol>

        <StyledCol data-title="Имя уровня" className="admin-cashback-table__title">
          <DelayInputComponent
            id={`${id} + _name`}
            type={"text"}
            name={"name"}
            value={name}
            debounceTimeout={600}
            onChange={handleChangeInput}
          />
        </StyledCol>

        <StyledCol data-title="Уровень" className="admin-cashback-table__level">
          <DelayInputComponent
            id={`${id} + _level`}
            type={"number"}
            name={"level"}
            value={+level}
            disabled={"disabled"}
            debounceTimeout={600}
            onChange={handleChangeInput}
          />
        </StyledCol>

        <StyledCol data-title="Процент" className="admin-cashback-table__percent">
          <DelayInputComponent
            id={`${id} + _percent`}
            type={"number"}
            name={"percent"}
            min={0}
            max={50}
            value={percent.toString()}
            debounceTimeout={600}
            onChange={handleChangeInput}
          />
        </StyledCol>

        <StyledCol data-title="С этого колличества средств" className="admin-cashback-table__profitRangeFrom">
          <DelayInputComponent
            id={`${id} + _profitRangeFrom`}
            type={"number"}
            name={"profitRangeFrom"}
            value={profitRangeFrom.toString()}
            debounceTimeout={600}
            onChange={handleChangeInput}
          />
        </StyledCol>

        <StyledCol data-title="По это колличество средств" className="admin-cashback-table__profitRangeTo">
          <DelayInputComponent
            id={`${id} + profitRangeTo`}
            type={"number"}
            name={"profitRangeTo"}
            value={profitRangeTo.toString()}
            debounceTimeout={600}
            onChange={handleChangeInput}
          />
        </StyledCol>

        <StyledCol data-title="Действие" className="admin-cashback-table__action">
          <StyledButton
            color="info"
            onClick={() => setCashbackLevel(prevState => {
              return { ...prevState, moreActions: !moreActions };
            })}
            weight="normal"
          >
            Изменить
          </StyledButton>

          {
            !isDefault && !isActive &&
            <StyledButton
              color="danger"
              onClick={() => handleDeleteReferralLevel(id)}
              weight="normal"
            >
              Удалить
            </StyledButton>
          }
        </StyledCol>


        {deleteLoading || updateLoading && <div className="default-spinner">
          <Spinner
            color="#EC6110"
            type="moonLoader"
            size="35px"
          />
        </div>}

      </StyledRow>

      {moreActions ?
        <div className="admin-cashback-table__action-block">
          <CashbackLevelActionsSelect
            setCashbackLevel={setCashbackLevel}
            id={id}
            level={level}
            updateLoading={updateLoading}
            updateCashbackLevel={updateCashbackLevel}
            refetchCashbackLevels={refetchCashbackLevels}
          />
        </div>
        : null
      }
    </>
  );
};

export default React.memo(CashbackLevelItem);
