import React, { useState } from "react";
import { managers } from "../../../rbac-consts";
import Can from "../../can/can.component";
import DelayInputComponent from "../../input-group/delay-input-group";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { GET_MANAGERS_CASH_PERCENT } from "../../../graphql/queries/manager-percent-profit-history.query";
import Spinner from "../../spinner/spinner.component";
import AlertMessage from "../../alert/alert.component";
import { CREATE_MANAGERS_CASH_PERCENT_PROFIT_HISTORY } from "../../../graphql/mutations/manager-percent-profit-history.mutation";
import Confirmation from "../../confirmation/confirmation";
import { closableNotificationWithClick } from "../../notification/closable-notification-with-click.component";

const ManagersBankPercent = ({ userRole }) => {
  const [managersBankPercent, setManagersBankPercent] = useState(0);
  const [profitBankConfirmation, setProfitBankConfirmation] = useState(false);
  const [errors, setErrors] = useState(null);

  const { data, error, loading } = useQuery(GET_MANAGERS_CASH_PERCENT, {
    onCompleted: data => {
      setManagersBankPercent(data?.getLastBankManagerPercentProfitHistory?.percent);
    }
  });

  const [createManagersPercent] = useMutation(CREATE_MANAGERS_CASH_PERCENT_PROFIT_HISTORY, {
    onError: ({ graphQLErrors }) => {
      let errors = JSON.parse(graphQLErrors[0].debugMessage);
      setErrors(errors.percent ?? errors.managers);
    },
    onCompleted: () => {
      closableNotificationWithClick("Процент изменен", "success");
    }
  });

  if (loading) return <Spinner color="#EC6110" type="moonLoader" size="50px" />;
  if (error) return <AlertMessage type="error" message={error.message} margin="15px 0" />;
  if (!data) return <></>;

  const createBankPercent = () => {
    if (managersBankPercent) {
      createManagersPercent({
        variables: {
          percent: +managersBankPercent
        }
      }).then(data => {
          setProfitBankConfirmation(false);
        }
      );
    }
  };

  const handleChangeBankPercent = (event) => {
    const { value } = event.target;
    if (value) {
      setManagersBankPercent(value);
      setProfitBankConfirmation(true);
    }
  };

  return (
    <>
      <Confirmation
        handler={createBankPercent}
        question={"Изменить процент прибыли по безналичному расчету?"}
        visible={profitBankConfirmation}
        setVisible={setProfitBankConfirmation}
      />
      <Can
        role={userRole}
        perform={managers.EDIT}
        yes={() => (
          <DelayInputComponent
            className="edit-profit-percent"
            handleChange={handleChangeBankPercent}
            errorMessage={errors}
            value={managersBankPercent === 0 || managersBankPercent === null ? "" : managersBankPercent}
            name="percentBank"
            type="number"
            label="% прибыли по безналичным заявкам"
            debounceTimeout={600}
            autoComplete="off"
          />
        )}
      />
    </>
  );
};

export default ManagersBankPercent;