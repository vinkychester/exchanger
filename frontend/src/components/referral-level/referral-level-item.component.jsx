import React, { useContext, useEffect, useState } from "react";
import DelayInputComponent from "../input-group/delay-input-group";
import { useMutation } from "@apollo/react-hooks";
import { DELETE_REFERRAL_LEVEL, UPDATE_REFERRAL_LEVEL } from "../../graphql/mutations/referral-level.mutation";
import Spinner from "../spinner/spinner.component";
import { PaginationContext } from "./referral-level.container";
import ReferralLevelActionsSelect from "./admin-action-select.component";
import Confirmation from "../confirmation/confirmation";
import { closableNotificationWithClick } from "../notification/closable-notification-with-click.component";

import { StyledCol, StyledRow } from "../styles/styled-table";
import { StyledButton } from "../styles/styled-button";

const ReferralLevelItem = ({ getAllReferralLevels, referralLevel }) => {
    const [visible, setVisible] = useState(false);
    const [{ id, name, percent, level, isDefault, isActive, moreActions }, setReferralLevel] = useState({
      ...referralLevel,
      moreActions: false
    });

    const [updateReferralLevel, { loading: updateLoading }] = useMutation(UPDATE_REFERRAL_LEVEL);
    const [deleteReferralLevel, { loading: deleteLoading }] = useMutation(DELETE_REFERRAL_LEVEL, {
      onCompleted: data => setPaginationInfo(prevState => {
        const page = Math.ceil(totalCount - 1 / itemsPerPage);
        closableNotificationWithClick(
          `Реферальный уровень успешно удален.`,
          "success"
        );
        return { ...prevState, totalCount: totalCount - 1, currentPage: currentPage };
      })
    });

    const {
      paginationInfo: { currentPage, lastPage, totalCount, itemsPerPage },
      setPaginationInfo
    } = useContext(PaginationContext);

    useEffect(() => {
      setReferralLevel(prevState => {
        return { ...prevState, ...referralLevel };
      });
    }, [referralLevel]);

    const handleChangeInput = (event) => {
      const { name, value } = event.target;

      let localValue = value;
      if (event.target.type === "number") {
        localValue = +localValue;
      }

      setReferralLevel(prevState => {
          return {
            ...prevState,
            [name]: localValue
          };
        }
      );

      updateReferralLevel({
        variables: {
          input: {
            id: id,
            [name]: localValue
          }
        }
      });
    };

    return (
      <>
        {visible && <Confirmation
          question={"Вы действительно хотите удалить реферальный уровень?"}
          handler={() => {
            deleteReferralLevel({
              variables: {
                id
              }
            });
          }}
          setVisible={setVisible}
          visible={visible}
        />
        }
        <StyledRow
          scroll="auto"
          col="5"
          className="admin-referral-table__row"
        >

          <StyledCol
            data-title="Статус"
            className="admin-referral-table__status"
          >
            {
              isDefault && isActive ? "По умолчанию"
                : isDefault && !isActive ? "Старый дефолтный уровень"
                : !isDefault && isActive ? "Используемый"
                  : "Не используется "
            }
          </StyledCol>

          <StyledCol
            data-title="Имя уровня"
            className="admin-referral-table__title"
          >
            <DelayInputComponent
              id={`${id} + _name`}
              type={"text"}
              name={"name"}
              value={name}
              debounceTimeout={600}
              onChange={handleChangeInput}
            />
          </StyledCol>

          <StyledCol
            data-title="Уровень"
            className="admin-referral-table__level"
          >
            <DelayInputComponent
              id={`${id} + _level`}
              type={"number"}
              name={"level"}
              value={+level}
              debounceTimeout={600}
              disabled={"disabled"}
              onChange={handleChangeInput}
            />
          </StyledCol>

          <StyledCol
            data-title="Процент"
            className="admin-referral-table__percent"
          >
            <DelayInputComponent
              id={`${id} + _percent`}
              type={"number"}
              name={"percent"}
              value={percent.toString()}
              debounceTimeout={600}
              onChange={handleChangeInput}
            />
          </StyledCol>

          <StyledCol
            data-title="Действие"
            className="admin-referral-table__action"
          >
            <StyledButton
              color="info"
              onClick={() => setReferralLevel(prevState => {
                return { ...prevState, moreActions: !moreActions };
              })}
              weight="normal"
            >
              Изменить
            </StyledButton>
            {!isDefault && !isActive ?
              <StyledButton
                color="danger"
                onClick={() => setVisible(true)}
                weight="normal"
              >
                Удалить
              </StyledButton>
              : null
            }
          </StyledCol>


          {deleteLoading && <div className="default-spinner">
            <Spinner
              color="#EC6110"
              type="moonLoader"
              size="35px"
            />
          </div>}

        </StyledRow>

        {moreActions ?
          <div
            className="admin-referral-table__action-block"
          >
            <ReferralLevelActionsSelect
              setReferralLevel={setReferralLevel}
              id={id}
              level={level}
              updateLoading={updateLoading}
              updateReferralLevel={updateReferralLevel}
              getAllReferralLevels={getAllReferralLevels}
            />
          </div>
          : null
        }
      </>
    );
  }
;

export default React.memo(ReferralLevelItem);
