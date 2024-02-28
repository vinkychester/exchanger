import React, { useState } from "react";
import { requisitionStatusConst } from "../../../utils/requsition.status";
import AlertMessage from "../../alert/alert.component";
import Spinner from "../../spinner/spinner.component";
import TextAreaGroupComponent from "../../input-group/textarea-group.component";

import {
  StyledColHead, StyledScrollTable,
  StyledTable,
  StyledTableBody,
  StyledTableHeader
} from "../../styles/styled-table";
import { StyledButton } from "../../styles/styled-button";
import ReferralPayoutRequisitionItem from "./referal-payout-requisition-item.component";
import ModalWindow from "../../modal/modal-window";

const ReferralPayoutRequisitionList = ({ data, error, loading, onUpdateAction }) => {

  const [visible, setVisible] = useState(false);
  const [action, setAction] = useState({});
  const [comment, setComment] = useState("");

  if (loading) return <Spinner color="#EC6110" type="moonLoader" size="50px" />;
  if (error) return <AlertMessage type="error" message={error.message} />;
  if (!data) return <AlertMessage type="info" message="Нет заявок" />;

  const { collection } = data.payoutRequisitions;

  if (!collection.length) return <AlertMessage type="info" message="Нет заявок" margin="15px 0 0" />;

  const commentChange = (e) => {
    setComment(e.target.value);
  };

  const modalContent = () => {

    const yes = (id, status) => {
      onUpdateAction(id, status, comment);
      setVisible(false);
      setComment("");
    };
    const no = () => {
      setVisible(false);
    };

    const style = {
      padding: "0 0 15px"
    };

    return (
      <>
        <div className="default-modal__body-content">
          <p style={style}>
            Вы действительно хотите {action.status === requisitionStatusConst.CANCELED
            ? "отклонить"
            : "одобрить"} данную
            заявку?
          </p>
          <TextAreaGroupComponent
            placeholder="Оставьте комментрий"
            required="required"
            handleChange={commentChange}
            value={comment}
          />
        </div>
        <div className="default-modal__body-footer">

          <StyledButton
            color="danger"
            onClick={no}
            weight="normal"
          >
            Нет
          </StyledButton>
          <StyledButton
            color="success"
            onClick={() => yes(action.id, action.status)}
            weight="normal"
          >
            Да
          </StyledButton>
        </div>
      </>
    );
  };

  return (
    <>
      <ModalWindow
        visible={visible}
        setVisible={setVisible}
        title="Внимание!"
        content={modalContent()}
      />
      <StyledScrollTable>
        <StyledTable width="1490" className="referral-payout-table">
          <StyledTableHeader scroll="auto" col="9" className="referral-payout-table__head">
            <StyledColHead>Номер</StyledColHead>
            <StyledColHead>Клиент</StyledColHead>
            <StyledColHead>Дата</StyledColHead>
            <StyledColHead>Сума</StyledColHead>
            <StyledColHead>Кошелек</StyledColHead>
            <StyledColHead>Платежная система</StyledColHead>
            <StyledColHead>Комментарий</StyledColHead>
            <StyledColHead>Статус</StyledColHead>
            <StyledColHead />
          </StyledTableHeader>
          <StyledTableBody>
            {collection.map((requisition, key) => (
              <ReferralPayoutRequisitionItem
                key={key}
                requisition={requisition}
                setVisible={setVisible}
                setAction={setAction}
              />
            ))}
          </StyledTableBody>
        </StyledTable>
      </StyledScrollTable>
    </>
  );
};

export default ReferralPayoutRequisitionList;
