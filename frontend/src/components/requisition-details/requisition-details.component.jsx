import React, { createContext } from "react";
import { NavLink } from "react-router-dom";
import { useApolloClient } from "@apollo/react-hooks";
import { Helmet } from "react-helmet-async";
import Tooltip from "rc-tooltip";
import ReactPixel from "react-facebook-pixel";

import Can from "../can/can.component";
import AlertMessage from "../alert/alert.component";
import BreadcrumbItem from "../breadcrumb/breadcrumb-item";
import RequisitionDetailsStatus from "./requisition-details-status.component";
import RequisitionDetailsAmountTab from "./requisition-details-amount-tab.component";
import RequisitionDetailsBankTab from "./requisition-details-bank-tab.component";
import RequisitionDetailsStatusButton from "./requisition-details-status-button.component";
import RequisitionDetailsUserTab from "./requisition-details-user-tab.component";
import RequisitionDetailsProfitTab from "./requisition-details-profit-tab.component";
import RequisitionDetailsCommentTab from "./requisition-details-comment-tab.component";
import RequisitionDetailsTimer from "./requisition-details-timer.component";
import RequisitionDetailsPaymentButton from "./requisition-details-payment-button.component";
import RequiistionDetailsInvoiceTab from "./requisition-details-invoice-tab.component";

import { StyledBreadcrumb } from "../styles/styled-breadcrumb";
import { StyledTooltip } from "../styles/styled-tooltip";
import {
  StyledBlockText,
  StyledBlockTitle,
  StyledInfoBlock,
} from "../styles/styled-info-block";
import {
  StyledRequisitionDetailsBody,
  StyledRequisitionDetailsDate,
  StyledRequisitionDetailsHeader,
  StyledRequisitionDetailsTitle,
  StyledRequisitionSubmitForm,
} from "./styled-requisition-details";
import RenderStatus from "../styles/styled-status";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { parseIRI, parseUuidIRI } from "../../utils/response";
import { TimestampToDate } from "../../utils/timestampToDate.utils";
import { requisition } from "../../rbac-consts";
import { requisitionStatusConst } from "../../utils/requsition.status";
import { StyledRequisitionDetailsAmount } from "./styled-requisition-details-amount-tab";
import { StyledAdminRequisitionDetails } from "./styled-requisition-admin-details";
import { romanize } from "../../utils/romanize.utils";

export const RequisitionDetailsContext = createContext();
export const RequisitionDetailsBankContext = createContext();
export const RequisitionDetailsProfitContext = createContext();

const RequisitionDetails = ({
  id,
  createdAt,
  pair,
  payoutAmount,
  paymentAmount,
  // recalculatedAmount,
  status,
  comment,
  client,
  manager,
  bankDetails,
  invoices,
  course,
  profit,
  systemProfit,
  managerProfit,
  requisitionFeeHistories,
  requisitionProfitHistories,
  pairPercent,
  commission,
  exchangePoint
}) => {
  const clientApollo = useApolloClient();

  // facebook pixel event
  ReactPixel.init("900176440455195");
  ReactPixel.track("Purchase", { currency: "USD", value: 10.0 });

  let token = parseUuidIRI(id).split("-")[0];

  const { userRole, userId } = clientApollo.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const { payment, payout } = pair;
  const { verificationInfo } = client;

  const isCash =
    "CASH" === payment.paymentSystem.subName ||
    "CASH" === payout.paymentSystem.subName;

  const isInvoice = invoices.length !== 0;

  const referralProfit = requisitionProfitHistories.find(
    (item) => item.fieldName === "referralProfit"
  );
  const cashbackProfit = requisitionProfitHistories.find(
    (item) => item.fieldName === "cashbackProfit"
  );
  const referralProfitArray = requisitionProfitHistories.filter((item) =>
    item.fieldName.includes("referralsProfit_")
  );

  const feeHistory =
    "CASH" === payment.paymentSystem.subName
      ? requisitionFeeHistories.find((fee) => fee.type === "payment")
      : requisitionFeeHistories.find((fee) => fee.type === "payout");

  // const pairPercent = feeHistory.pairPercent;
  const feeId = feeHistory.id;
  const recalculatedAmount = payoutAmount;

  const paymentPrice = requisitionFeeHistories.find(
    (fee) => fee.type === "payment"
  ).paymentSystemPrice;
  const payoutPrice = requisitionFeeHistories.find(
    (fee) => fee.type === "payout"
  ).paymentSystemPrice;

  return (
    <>
      <Helmet>
        <title>{`Детали заявки #${token} - Coin24`}</title>
      </Helmet>
      <StyledRequisitionDetailsTitle>
        Заявка <span>#{token}</span>
      </StyledRequisitionDetailsTitle>
      <StyledRequisitionDetailsHeader>
        <StyledBreadcrumb>
          <BreadcrumbItem as={NavLink} to="/" title="Главная" />
          <BreadcrumbItem
            as={NavLink}
            to="/panel/requisitions"
            //to={history.goBack()}
            title="Заявки"
          />
          <BreadcrumbItem as="span" title={`Заявка #${token}`} />
        </StyledBreadcrumb>
        <StyledRequisitionDetailsDate>
          {TimestampToDate(createdAt)}
          <RequisitionDetailsTimer
            createdAt={createdAt}
            isCash={isCash}
            status={status}
            requisitionId={id}
            invoices={invoices}
          />
        </StyledRequisitionDetailsDate>
      </StyledRequisitionDetailsHeader>
      <RequisitionDetailsStatus status={status} />
      <StyledRequisitionDetailsBody className="requisition-details">
        <StyledRequisitionDetailsAmount className="requisition-details__amount-tab">
          <RequisitionDetailsAmountTab
            label="Отдаю"
            info={payment}
            amount={paymentAmount}
            className="payment"
            commission={commission}
            fee={requisitionFeeHistories.find((fee) => fee.type === "payment")}
          />
          <RequisitionDetailsAmountTab
            label="Получаю"
            info={payout}
            amount={payoutAmount}
            className="payout"
            commission={commission}
            fee={requisitionFeeHistories.find((fee) => fee.type === "payout")}
          />
          <StyledInfoBlock className="requisition-info requisition-tab_rate rate">
            <StyledBlockTitle>
              Курс:{" "}
              <Tooltip
                placement="top"
                overlay="Курс на момент оплаты может быть пересчитан."
              >
                <StyledTooltip className="icon-question" />
              </Tooltip>
            </StyledBlockTitle>
            <StyledBlockText>
              <div className="rate__in">
                1 <b>{payment.currency.tag === "CRYPTO" ? payment.currency.asset : payout.currency.asset}</b>
              </div>
              <span className="icon-arrow-right rate__arrow" />
              <div className="rate__out">
                {course} <b>{payment.currency.tag === "CRYPTO" ? payout.currency.asset : payment.currency.asset}</b>
              </div>
            </StyledBlockText>
            <StyledBlockTitle>Статус:</StyledBlockTitle>
            <StyledBlockText>
              <RenderStatus status={status} />
            </StyledBlockText>
          </StyledInfoBlock>
        </StyledRequisitionDetailsAmount>
        <RequisitionDetailsContext.Provider
          value={{ requisitionId: id, status, payment, payout }}
        >
          <RequisitionDetailsBankContext.Provider
            value={{
              bankDetails,
              isCash,
              isInvoice,
              pairPercent,
              feeId,
              recalculatedAmount,
              commission,
              paymentPrice,
              payoutPrice,
              manager,
              exchangePoint,
              status,
              pairUnit:
                payment.paymentSystem.subName === "CASH"
                  ? parseIRI(payment.id)
                  : parseIRI(payout.id),
            }}
          >
            <RequisitionDetailsBankTab manager={manager} />
          </RequisitionDetailsBankContext.Provider>
          {!isCash &&
            "client" === userRole &&
            verificationInfo.length !== 0 &&
            !verificationInfo.status && (
              <AlertMessage
                type="warning"
                margin="30px 0 0"
                message={
                  <>
                    Для совершения обмена необходимо{" "}
                    <NavLink
                      className="default-link"
                      to="/panel/document/verification"
                    >
                      {" "}
                      произвести верификацию документов
                    </NavLink>
                    .
                  </>
                }
              />
            )}
          <RequiistionDetailsInvoiceTab
            invoices={invoices}
            tag={payment.currency.tag}
          />
          <StyledRequisitionSubmitForm>
            {userRole !== "client" &&
              status !== requisitionStatusConst.FINISHED && status !== requisitionStatusConst.CANCELED && (
                <RequisitionDetailsStatusButton
                  status={requisitionStatusConst.FINISHED}
                  message="Вы действительно хотите финализировать заявку?"
                  btnText="Выполнить"
                  color="success"
                />
              )}
            {userRole !== "client" && status !== requisitionStatusConst.CANCELED && status !== requisitionStatusConst.FINISHED && (
              <RequisitionDetailsStatusButton
                status={requisitionStatusConst.CANCELED}
                message="Вы действительно хотите отменить заявку?"
                btnText="Отменить"
                color="danger"
              />
            )}
            <Can
              role={userRole}
              perform={requisition.ACTIONS}
              data={{ userId, ownerId: parseUuidIRI(client.id) }}
              yes={() =>
                status === requisitionStatusConst.NEW &&    (
                  <>
                    <RequisitionDetailsStatusButton
                      status={requisitionStatusConst.CANCELED}
                      message="Вы действительно хотите отменить заявку?"
                      btnText="Отменить"
                      color="danger"
                    />
                    {!isCash &&
                      "client" === userRole &&
                      (verificationInfo.length === 0 ||
                        verificationInfo.status) && (
                        <RequisitionDetailsPaymentButton label="Оплатить" cardStatus={payment.isCardVerification} status={status} />
                      )}
                  </>
                )
              }
            />
          </StyledRequisitionSubmitForm>
          {status === requisitionStatusConst.NEW && (
            <RequisitionDetailsCommentTab comment={comment} />
          )}
          {status === requisitionStatusConst.FINISHED && "client" === userRole && (
            <AlertMessage
              type="success"
              margin="30px 0 0"
              message={
                <>
                  Спасибо за то, что Выбрали наш сервис! <br />
                  Будем Вам благодарны, если{" "}
                  <NavLink
                    className="default-link"
                    to="/reviews"
                    target="_blank"
                    rel="noreferrer"
                  >
                    оставите отзыв
                  </NavLink>{" "}
                  о сервисе, используя любую удобную для Вас площадку, или же
                  непосредственно на данном сайте. <br />
                  Будем рады видеть Вас снова!
                </>
              }
            />
          )}
        </RequisitionDetailsContext.Provider>
      </StyledRequisitionDetailsBody>
      {/* MANAGER */}
      {/* {isCash && (
        <Can
          role={userRole}
          perform={requisition.SET_MANAGER}
          yes={() => (
            <RequisitionDetailsManager
              requisitionId={id}
              managerId={manager ? manager.id : null}
            />
          )}
        />
      )} */}
      <StyledAdminRequisitionDetails>
        <Can
          role={userRole}
          perform={requisition.USER_INFO}
          yes={() => (
            <div className="user-info requisition-info">
              {client && (
                <RequisitionDetailsUserTab label="Клиент" user={client} />
              )}
              {manager && (
                <RequisitionDetailsUserTab label="Менеджер" user={manager} />
              )}
            </div>
          )}
        />
        <RequisitionDetailsProfitContext.Provider
          value={{
            rate: requisitionFeeHistories.find((fee) => fee.type === "payment")
              .rate,
            currency: payment.currency,
          }}
        >
          <Can
            role={userRole}
            perform={requisition.ADMINISTRATION_DETAILS}
            yes={() => (
              <>
                {referralProfitArray.length !== 0 && (
                  <div className="profit-info requisition-info">
                    {referralProfitArray &&
                      referralProfitArray.map(
                        ({ id, fieldName, value }, key) =>
                          fieldName === `referralsProfit_${key + 1}` && (
                            <RequisitionDetailsProfitTab
                              key={id}
                              label={`Прибыль по рефералам ${romanize(
                                key + 1
                              )} уровня`}
                              profit={value ?? 0}
                            />
                          )
                      )}
                  </div>
                )}
                <div className="profit-info requisition-info">
                  {/* I II уровня */}
                  <RequisitionDetailsProfitTab
                    label="Общая прибыль по рефералам"
                    profit={referralProfit ? referralProfit.value : 0}
                  />
                  <RequisitionDetailsProfitTab
                    label="Прибыль по кешбеку"
                    profit={cashbackProfit ? cashbackProfit.value : 0}
                  />
                </div>
                <div className="profit-info requisition-info">
                  <RequisitionDetailsProfitTab
                    label="Прибыль по заявке"
                    profit={profit}
                  />
                  <RequisitionDetailsProfitTab
                    label="Прибыль системы"
                    profit={systemProfit}
                  />
                </div>
              </>
            )}
          />
          <Can
            role={userRole}
            perform={requisition.MANAGER_PROFIT}
            yes={() => (
              <>
                <div className="profit-info requisition-info">
                  <RequisitionDetailsProfitTab
                    label="Прибыль менеджера"
                    profit={managerProfit}
                  />
                </div>
                <div className="profit-info requisition-info">
                  <StyledInfoBlock className="requisition-info__item">
                    <StyledBlockTitle>Комиссия системы:</StyledBlockTitle>
                    <StyledBlockText className="requisition-info__title">
                      <div>
                        Процент пары: <b>{pairPercent}%</b> <br />
                        Конечная комиссия: <b>{commission}%</b> <br />
                        Себестоимость (покупка): <b>{paymentPrice}</b> <br />
                        Себестоимость (продажа): <b>{payoutPrice}</b> <br />
                      </div>
                    </StyledBlockText>
                  </StyledInfoBlock>
                </div>
              </>
            )}
          />
        </RequisitionDetailsProfitContext.Provider>
      </StyledAdminRequisitionDetails>
    </>
  );
};

export default RequisitionDetails;
