import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { useApolloClient } from "@apollo/react-hooks";

import Can from "../can/can.component";
import LoadButton from "../spinner/button-spinner.component";

import { StyledCalculatorAlignBtn } from "./styled-calculator";
import { StyledButton } from "../styles/styled-button";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { CalculatorContext, CalculatorExchangeContext } from "./calculator.component";
import { calculator } from "../../rbac-consts";
import Tooltip from "rc-tooltip";

const CalculatorExchangeButton = () => {
  const client = useApolloClient();

  const { userRole, managerClientRequisition } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const { pair } = useContext(CalculatorContext);
  const { isCollectionLoading, isShowRequisites, setShowRequisites } = useContext(CalculatorExchangeContext);

  return (
    <StyledCalculatorAlignBtn className="calculator__footer">
      {!isCollectionLoading ? (
        <Can
          role={userRole}
          perform={calculator.EXCHANGE}
          data={managerClientRequisition}
          yes={() =>
            pair && !isShowRequisites && (
              <StyledButton
                type="button"
                color="main"
                onClick={() => setShowRequisites(!isShowRequisites)}
                //disabled={"" !== paymentMessage || "" !== payoutMessage}
              >
                Обменять
              </StyledButton>
            )
          }
          no={() =>
            pair && (
              <div className="exchange-btn">
                {userRole !== "anonymous" &&
                <Tooltip
                  placement="top"
                  overlay="Для совершения обмена, нужно войти в аккаунт клиента"
                >
                  <div className="exchange-btn__tooltip" />
                </Tooltip>}

                <Tooltip
                  placement="top"
                  overlay="Для совершения обмена, нужно войти в аккаунт пользователя"
                >
                  <StyledButton
                    as={NavLink}
                    to="/login"
                    color="main"
                    disabled={userRole !== "anonymous"}
                  >
                    Обменять
                  </StyledButton>
                </Tooltip>
              </div>
            )
          }
        />
      ) : (
        <LoadButton color="main" text="Обменять" />
      )}
    </StyledCalculatorAlignBtn>
  );
};

export default React.memo(CalculatorExchangeButton);
