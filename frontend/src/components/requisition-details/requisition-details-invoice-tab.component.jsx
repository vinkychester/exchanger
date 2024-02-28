import React, { createContext, useContext, useEffect } from "react";
import { useQuery, useApolloClient } from "@apollo/react-hooks";
import { NavLink } from "react-router-dom";

import Spinner from "../spinner/spinner.component";
import AlertMessage from "../alert/alert.component";

import { StyledInvoiceWrapper } from "./styled-requisition-details-invoice";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { GET_FLOW_DATA_BY_STATUS } from "../../graphql/queries/flow-data.query";
import { RequisitionDetailsContext } from "./requisition-details.component";
import { flowComponentMapping } from "./flow-attributes/flow-components";
import { requisitionStatusConst } from "../../utils/requsition.status";
import { findInvoice } from "../../utils/requisition.util";
import { mercureUrl, parseUuidIRI } from "../../utils/response";
import { StyledList } from "../styles/styled-document-elemets";

const RequiistionDetailsInvoiceContext = createContext();

const RequiistionDetailsInvoiceTab = ({ invoices, tag }) => {
  const client = useApolloClient();

  const { userRole } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  if (!invoices.length) return <></>;

  let paymentInvoice = findInvoice(invoices, "payment");
  let payoutInvoice = findInvoice(invoices, "payout");

  return (
    <StyledInvoiceWrapper>
      <div className="bank-title">
        <h2>Подробнее:</h2>
      </div>
      {userRole !== "client" && (
        <>
          <AlertMessage
            margin="0 0 10px"
            type={
              invoices
                ? paymentInvoice && paymentInvoice.isPaid
                  ? "success"
                  : "warning"
                : "warning"
            }
            message={
              invoices
                ? paymentInvoice && paymentInvoice.isPaid
                  ? "Заявка оплачена клиентом"
                  : "Заявка не оплачена клиентом"
                : "Заявка не оплачена клиентом"
            }
          />
          <AlertMessage
            margin="0 0 10px"
            type={
              invoices
                ? payoutInvoice && payoutInvoice.isPaid
                  ? "success"
                  : "warning"
                : "warning"
            }
            message={
              invoices
                ? payoutInvoice && payoutInvoice.isPaid
                  ? "Заявка выплачена системой"
                  : "Заявка не выплачена системой"
                : "Заявка не выплачена системой"
            }
          />
        </>
      )}
      {userRole === "client" && (
        <AlertMessage
          margin="0 0 10px"
          type={
            invoices
              ? paymentInvoice && paymentInvoice.isPaid ? "success"
              : "info"
              : "info"
          }
          message={
            invoices
              ? paymentInvoice && paymentInvoice.isPaid
              ? "Средства зачисленны"
              : "Ожидается оплата"
              : "Ожидается оплата"
          }
        />
      )}
      <RequiistionDetailsInvoiceContext.Provider
        value={{ invoice: paymentInvoice, tag }}
      >
        <InvoiceContent />
      </RequiistionDetailsInvoiceContext.Provider>
      <RequiistionDetailsInvoiceContext.Provider
        value={{ invoice: payoutInvoice, tag }}
      >
        <InvoiceContent />
      </RequiistionDetailsInvoiceContext.Provider>
    </StyledInvoiceWrapper>
  );
};

const InvoiceContent = () => {
  const { invoice } = useContext(RequiistionDetailsInvoiceContext);

  if (!invoice) return <></>;
  return <FlowContent />;
};

const FlowContent = () => {
  const client = useApolloClient();

  const { userRole } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });
  
  const { invoice, tag } = useContext(RequiistionDetailsInvoiceContext);
  const { requisitionId, status, payment, payout } = useContext(
    RequisitionDetailsContext
  );

  const { data, loading, error, refetch } = useQuery(GET_FLOW_DATA_BY_STATUS, {
    variables: {
      status: invoice.status,
      invoice_requisition_id: parseUuidIRI(requisitionId),
      invoice_id: parseUuidIRI(invoice.id),
    },
    fetchPolicy: "network-only",
  });

  mercureUrl.searchParams.append(
    "topic",
    `http://coin24/callback/${parseUuidIRI(requisitionId)}`
  );

  useEffect(() => {
    const eventSource = new EventSource(mercureUrl);
    eventSource.onmessage = (event) => {
      refetch({
        variables: {
          status: JSON.parse(event.data).status,
          invoice_requisition_id: parseUuidIRI(requisitionId),
          invoice_id: parseUuidIRI(invoice.id),
        },
      });
    };

    return () => {
      eventSource.close();
    };
  }, []);

  if (loading) return <Spinner color="#EC6110" type="moonLoader" size="20px" />;
  if (error) return <AlertMessage type="error" message={error} />;
  if (!data) return <AlertMessage type="warning" message="Not found." />;

  const { flowDatas } = data;

  if (
    status === requisitionStatusConst.ERROR &&
    invoice.direction === "payment" &&
    payment.currency.tag === "CURRENCY" &&
    (payment.service.name === "UaPay" || payment.service.name === "Kuna")
  ) {
    return (
      <AlertMessage
        type="error"
        message={
          <React.Fragment>
            <p>
              Заявка отклонена системой,{" "}
              <NavLink className="default-link" to="/contacts">
                обратитесь к администрации сайта
              </NavLink>
              .
            </p>
            <StyledList>
              <b>Возможные причины:</b>
              <li>
                На вашей карте нет достаточного интернет лимита для проведения
                транзакции.
              </li>
              <li>Удостоверьтесь, что ваша карта не заблокирована.</li>
              <li>Ошибка при вводе данных банковской карты.</li>
              <li>Недостаточно средств на банковской карте.</li>
            </StyledList>
          </React.Fragment>
        }
      />
    );
  }


  if (
    status === requisitionStatusConst.ERROR &&
    invoice.direction === "payout" &&
    payout.currency.tag === "CURRENCY" &&
    (payout.service.name === "UaPay" || payout.service.name === "Kuna")
  ) {
    return (
      <AlertMessage
        type="error"
        message={
          <React.Fragment>
            <p>
              Заявка отклонена системой,{" "}
              <NavLink className="default-link" to="/contacts">
                обратитесь к администрации сайта
              </NavLink>
              .
            </p>
            <p>
              {/*TODO Заменить цифры из шаблона*/}
              Заявленная сума:{" "}
              <b>
                {invoice.amount} {payout.currency.asset}
              </b>
              , выплаченно:{" "}
              <b>
                {invoice.paidAmount} {payout.currency.asset}
              </b>
              , остаток:{" "}
              <b>
                {invoice.amount - invoice.paidAmount} {payout.currency.asset}
              </b>
              .
            </p>
            <StyledList>
              <b>Возможные причины:</b>
              <li>Превышен лимит на разовый платеж.</li>
              <li>Превышен суточный или месячный лимит.</li>
            </StyledList>
          </React.Fragment>
        }
      />
    );
  }

  if (status === requisitionStatusConst.CARD_VERIFICATION) {
    return (
      <>
        {flowDatas &&
          flowDatas.map(({ id, name, value }) => {
            const Component = flowComponentMapping[name];
            if (name === "cardMask")
              return (
                <Component
                  key={id}
                  value={value}
                  requisitionStatus={status}
                  tag={tag}
                  userRole={userRole}
                />
              );
            if (!Component) return <span key={id}></span>;
          })}
        <AlertMessage
          type="warning"
          message={
            <>
              Заявка оплачена, для завершения обмена необходимо{" "}
              <NavLink className="default-link" to="/panel/card-verification">
                {" "}
                произвести верификацию карты
              </NavLink>
              .
            </>
          }
        />
      </>
    );
  }

  if (status === requisitionStatusConst.FINISHED && !flowDatas.length)
    return (
      <AlertMessage
        margin="0 0 10px"
        type="success"
        message="Заявка успешно проведена"
      />
    );

  if (!flowDatas.length) return <></>;

  return (
    flowDatas &&
    flowDatas.map(({ id, name, value }) => {
      const Component = flowComponentMapping[name];
      if (!Component) return <span key={id}></span>;
      return (
        <Component
          key={id}
          value={value}
          requisitionStatus={status}
          tag={tag}
          userRole={userRole}
        />
      );
    })
  );
};

export default RequiistionDetailsInvoiceTab;
