import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useApolloClient } from "@apollo/react-hooks";
import Select, { Option } from "rc-select";

import Can from "../can/can.component";
import SkeletonMSCashContainer from "./mc-cash-attributes/skeleton/skeleton-ms-cash-container";
import AlertMessage from "../alert/alert.component";
import LoadButton from "../spinner/button-spinner.component";
import DelayInputComponent from "../input-group/delay-input-group";
import RequisitionDetailsPaymentButton from "./requisition-details-payment-button.component";
import RequisitionDetailsContact from "./requisition-details-contact.component";

import { StyledBankWrapper } from "./styled-requisition-details-bank";
import { StyledBlockText } from "../styles/styled-info-block";
import { StyledSelect, StyledSelectLabel } from "../styles/styled-img-select";
import { StyledMSCashWrapper } from "./mc-cash-attributes/styled-ms-cash-container";
import { StyledButton } from "../styles/styled-button";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { CALCULATE_REQUISITION_AMOUNT, UPDATE_REQUISITION_MANAGER } from "../../graphql/mutations/requisition.mutation";
import { GET_NETWORKS } from "../../graphql/queries/network.query";
import { GET_REQUISITION_DETAILS } from "../../graphql/queries/requisition.query";
import {
  UPDATE_ATTRIBUTE_DETAILS,
  UPDATE_ITTERABLE_ATTRIBUTE_DETAILS
} from "../../graphql/mutations/attribute.mutation";
import { RequisitionDetailsBankContext, RequisitionDetailsContext } from "./requisition-details.component";
import { mcCashComponentMapping } from "./mc-cash-attributes/mc-cash-components";
import { parseUuidIRI } from "../../utils/response";
import { requisition } from "../../rbac-consts";
import { closableNotificationWithClick } from "../notification/closable-notification-with-click.component";

import translate from "../../i18n/translate";
import RequisitionDetailsManager from "./requisition-details-manager.component";
import { NavLink } from "react-router-dom";
import { requisitionStatusConst } from "../../utils/requsition.status";

export const RequisitionDetailsAttributesContext = createContext();

const networkName = "networkId";

const RequisitionDetailsBankTab = ({ manager }) => {
  const client = useApolloClient();

  const { userRole, userId, username } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const { bankDetails, isCash, isInvoice, exchangePoint, status } = useContext(RequisitionDetailsBankContext);
  const { requisitionId } = useContext(RequisitionDetailsContext);

  const [updateRequisitionManager, { loading: mutationLoading, data }] = useMutation(UPDATE_REQUISITION_MANAGER);
  const [updateAttributeDetail] = useMutation(UPDATE_ATTRIBUTE_DETAILS);

  const [network, setNetwork] = useState("");
  const [external, setExternal] = useState(""); // city id
  const [attributes, setAttributes] = useState([]);

  const { collection } = bankDetails;

  const regex = /\d+/g;

  const handleSetManager = () => {
    const element = attributes.find((item) => item.name === "cashierId");
    if (element && regex.test(username)) {
      let found = username.match(regex);
      updateAttributeDetail({ variables: { id: element.id, value: found[0] } });
    }
    updateRequisitionManager({
      variables: { id: requisitionId, manager: "/api/managers/" + userId },
      refetchQueries: [
        {
          query: GET_REQUISITION_DETAILS,
          variables: { id: requisitionId, isManager: "client" !== userRole }
        }
      ]
    });
  };

  useEffect(() => {
    if (isCash) {
      const attributes = collection.find((bankDetails) =>
        bankDetails.attributes.find((attribute) => attribute.name === "cityId")).attributes;
      setAttributes(attributes);
      setNetwork(attributes.find((item) => item.name === "networkId").value);
      setExternal(parseInt(attributes.find((item) => item.name === "cityId").value));
    }
  }, [bankDetails, collection, isCash]);

  if (!collection.length)
    return <AlertMessage type="warning" message="Not found." />;

  const isCashDetails = (isHidden, name, value) => {
    return (
      isCash && isInvoice && network && isHidden && value !== "" && name !== "referenceId" && name !== "min" && name !== "max" && name !== "networkId" && name !== "cashierId"
    );
  };

  let permissions = {};
  if ("manager" === userRole && manager)
    permissions = { userId, ownerId: parseUuidIRI(manager.id) };

  return (
    <StyledBankWrapper>
      <div className="bank-title">
        <h2>Реквизиты:</h2>
      </div>
      {isCash && !isInvoice && !network && (
        <Can
          role={userRole}
          perform={requisition.ASSIGN_MESSAGE}
          yes={() => (
            status !== requisitionStatusConst.CANCELED &&
            <AlertMessage
              type="info"
              message={<React.Fragment>
                <span>Дополнительная информация появится после обработки менеджером.</span> <br />
                <span>
                  Регламент обработки 30 минут. Если возникли вопросы - обратитесь к менеджерам сервиса, пожалуйста. Контакты менеджеров Вы сможете найти ниже в заявке или в <NavLink to="/contacts" className="default-link">соответствующем разделе сайта</NavLink>.
                </span>
              </React.Fragment>}
            />
          )}
        />
      )}
      {collection &&
      collection.map(({ attributes, title }) =>
        attributes.map(({ id, name, value, isHidden, ...props }) => (
          <React.Fragment key={id}>
            {!isHidden && value !== "" && (
              <BankTabItem name={name} value={value} {...props} />
            )}
            {isCash &&
            isInvoice &&
            network &&
            isHidden &&
            value !== "" &&
            name === "networkId" &&
            userRole !== "client" && (
              <BankTabItem name={name} value={value} {...props} />
            )}
            {isCashDetails(isHidden, name, value) && (
              <BankTabItem name={name} value={value} {...props} />
            )}
            {name === "cityId" && userRole === "client" && (
              <RequisitionDetailsContact cityExternalId={parseInt(value)} />
            )}
          </React.Fragment>
        ))
      )}
      {isCash && isInvoice && manager && userRole !== "client" && <p>Менеджер назначен: {manager.email}</p>}
      {isCash && !isInvoice && (
        <>
          {"manager" === userRole &&
          !manager &&
          (mutationLoading ? (
            <LoadButton
              color="info"
              text="Взять в работу"
              weight="normal"
              type="button"
            />
          ) : (
            !data && (
              <StyledButton
                as="button"
                color="info"
                weight="normal"
                type="button"
                onClick={handleSetManager}
              >
                Взять в работу
              </StyledButton>
            )
          ))}
          {"admin" === userRole && !manager && (
            <RequisitionDetailsManager
              requisitionId={requisitionId}
              cities_externalId={parseInt(exchangePoint)}
            />
          )}
        </>
      )}
      {isCash &&
      !isInvoice &&
      manager &&
      ("manager" === userRole ? (
        <Can
          role={userRole}
          perform={requisition.ASSIGN_CASH_ATTRIBUTES}
          data={permissions}
          yes={() => (
            <RequisitionDetailsAttributesContext.Provider
              value={{ network, external, attributes }}
            >
              <MCCashNetworkSelect />
            </RequisitionDetailsAttributesContext.Provider>
          )}
          no={() =>
            "client" !== userRole && (
              <AlertMessage
                type="error"
                message="Заявка в обработке другим менеджером"
              />
            )
          }
        />
      ) : (
        <>
          <p>Менеджер назначен: {manager.email}</p>
          <RequisitionDetailsAttributesContext.Provider
            value={{ network, external, attributes }}
          >
            <MCCashNetworkSelect />
          </RequisitionDetailsAttributesContext.Provider>
        </>
      ))}
    </StyledBankWrapper>
  );
};

const BankTabItem = ({ name, information, value }) => {
  const regex = /([+-]?([0-9]*[.])?[0-9]+)\,\s?([+-]?([0-9]*[.])?[0-9]+)$/;
  const regexNew = /(https?:\/\/[^\s]+)/g;

  if (name === "networkId") {
    let array = information.split('-');
    information = `${array[0]} (${array[1] === "internal" ? "Внутренняя сеть" : "Внешняя сеть"})`;
  }

  return (
    <StyledBlockText className="requisite__item">
      <b>{translate(name)}:</b>
      {"exchangePointId" === name ? (
        <a
          href={information.match(regexNew) ? information.match(regexNew)[0] : `https://www.google.com/maps?q=loc:${information.match(regex)[0]}`}
          target="_blank"
          rel="noreferrer"
          className="default-link"
        >
          {information.match(regexNew) ?  information.replace(regexNew, "") : information.replace(regex, "")}
        </a>
      ) : (
        <p>{name.includes("Id") ? information : value}</p>
      )}
    </StyledBlockText>
  );
};

const MCCashNetworkSelect = () => {
  const { network, external, attributes: collection } = useContext(RequisitionDetailsAttributesContext);
  const { pairUnit } = useContext(RequisitionDetailsBankContext);

  const [mcCashAttributes, setMCCashAttributes] = useState([]);
  const [mcCashDetails, setMCCashDetails] = useState([]);
  const [exchangePoint, setExchangePoint] = useState("");

  const { loading, error, data } = useQuery(GET_NETWORKS, {
    variables: { external_id: external, pairUnit_id: pairUnit },
    fetchPolicy: "network-only"
  });

  const handleSavedAttributes = () => {
    let element = collectionQueryNetworks.find(
      (element) => element.externalId === network
    );
    const { attributes } = element;
    setMCCashAttributes(attributes);
    let array = [];
    attributes &&
    attributes.map((name) => {
      let element = collection.find((item) => item.name === name);
      if (element && element.value) {
        const { id, name, value, information } = element;
        array.push({ id, name, value, information });

        if (name === networkName) setExchangePoint(value);
      }
    });
    setMCCashDetails(array);
  };

  useEffect(() => {
    if (data) {
      const { collectionQueryNetworks } = data;
      if (collectionQueryNetworks.length !== 0) {
        if (network) {
          handleSavedAttributes();
        } else {
          const id = collection.find((item) => item.name === networkName).id;
          const { name, externalId, attributes } = collectionQueryNetworks[0];
          setExchangePoint(externalId);
          setMCCashAttributes(attributes);
          setMCCashDetails([
            {
              id,
              name: networkName,
              value: parseInt(externalId),
              information: name
            }
          ]);
        }
      }
    }
  }, [data, collection, network]);

  const handleChangeMCCashDetails = useCallback(
    (id, name, value, information) => {
      const elementsIndex = mcCashDetails.findIndex(
        (element) => element.id === id
      );
      if (elementsIndex === -1) {
        setMCCashDetails(
          mcCashDetails.concat({ id, name, value, information })
        );
      } else {
        let newArray = [...mcCashDetails];
        newArray[elementsIndex] = {
          ...newArray[elementsIndex],
          value,
          information
        };
        setMCCashDetails(newArray);
      }
    },
    [mcCashDetails]
  );

  const handleChangeSelect = (value, { label, key }) => {
    setExchangePoint(value);
    console.log(key);
    // setMCCashDetails([]);
    // find network id
    const id = collection.find((item) => item.name === networkName).id;
    setMCCashAttributes(label);
    if (network && network === value) {
      handleSavedAttributes();
    } else {
      setMCCashDetails([
        { id, name: networkName, value: parseInt(value), information: key }
      ]);
    }
  };

  if (loading) return <SkeletonMSCashContainer />;
  if (error) return <AlertMessage type="error" message={error.message} />;
  if (!data) return <AlertMessage type="warning" message="Not found." />;

  const { collectionQueryNetworks } = data;

  if (!collectionQueryNetworks.length)
    return <AlertMessage type="warning" message="Not found." />;

  const style = {
    textTransform: "inherit"
  };

  const mcCashNetwork = mcCashDetails.find((item) => item.name === networkName);

  return (
    <StyledMSCashWrapper>
      <StyledSelect className="mscash-field">
        <StyledSelectLabel as="label">
          Выбрать направление сети:
        </StyledSelectLabel>
        <Select
          showSearch
          className="custom-select-img"
          value={mcCashNetwork && mcCashNetwork.value.toString()}
          onChange={handleChangeSelect}
        >
          {collectionQueryNetworks &&
          collectionQueryNetworks.map(
            ({ name, type, attributes, externalId }) => (
              <Option key={name + '-' + type} value={externalId} label={attributes}>
                <div className="option-select-item" style={style}>
                  {name} ({translate(type)})
                </div>
              </Option>
            )
          )}
        </Select>
      </StyledSelect>
      {mcCashAttributes.length !== 0 && (
        <MCCashAttributes
          mcCashAttributes={mcCashAttributes}
          networkId={
            parseInt(mcCashDetails.find((item) => item.name === networkName).value)
          }
          mcCashDetails={mcCashDetails}
          handleChangeMCCashDetails={handleChangeMCCashDetails}
          exchangePoint={exchangePoint}
        />
      )}
    </StyledMSCashWrapper>
  );
};

const MCCashAttributes = ({
  mcCashAttributes,
  mcCashDetails,
  networkId,
  handleChangeMCCashDetails,
  exchangePoint
}) => {
  const client = useApolloClient();

  const { userRole } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const { attributes, external } = useContext(RequisitionDetailsAttributesContext);
  const {
    pairUnit,
    pairPercent,
    recalculatedAmount,
    paymentPrice,
    payoutPrice,
    commission
  } = useContext(RequisitionDetailsBankContext);
  const { requisitionId } = useContext(RequisitionDetailsContext);

  const [percent, setPercent] = useState(pairPercent);
  const [amount, setAmount] = useState(recalculatedAmount);
  const [tmpCommission, setTmpCommission] = useState(commission);

  let exchangePointId = attributes.find(attribute => attribute.name === networkName).value;

  const [updateItterableAttributeDetails, { loading }] = useMutation(UPDATE_ITTERABLE_ATTRIBUTE_DETAILS, {
    onCompleted: () => closableNotificationWithClick("Данные сохранены.", "success")
  });

  const [calculateRequisitionAmount, { loading: mutationLoading }] = useMutation(CALCULATE_REQUISITION_AMOUNT, {
    onCompleted: ({ calculateAmountRequisition }) => {
      setAmount(calculateAmountRequisition.requisition.amount);
      setTmpCommission(calculateAmountRequisition.requisition.tmpCommission);
    }
  });

  const handleSaveMCCashAttributes = (event) => {
    let isEmpty = false;
    const filteredAttributes = mcCashAttributes.filter(item => item !== "cityId" && item !== networkName && item !== "contacts");

    filteredAttributes && filteredAttributes.map((item) => {
      let detail = mcCashDetails.find(detail => detail.name === item);
      if (!detail) {
        isEmpty = true;
      } else {
        if (detail.value === "") {
          isEmpty = true;
        }
      }
    });

    if (percent < 0) {
      return closableNotificationWithClick("Процент должен быть больше 0.", "error");
    }

    const filteredCollection = attributes.filter(
      (item) =>
        item.name !== "cityId" &&
        item.name !== networkName &&
        item.name !== "referenceId" &&
        item.name !== "min" &&
        item.name !== "max" &&
        item.name !== "cashierId" &&
        item.name !== "contacts"
    );

    let details = mcCashDetails;

    filteredCollection && filteredCollection.map(({ id, name }) => {
      let detail = mcCashDetails.find(detail => detail.name === name);
      if (!detail) {
        details.push({ id, name, value: "", information: "" });
      }
    });

    if (!isEmpty) {
      updateItterableAttributeDetails({
        variables: {
          bank_details: details,
          requisition_id: parseUuidIRI(requisitionId),
          pairPercent: percent,
          amount
        },
        refetchQueries: [
          {
            query: GET_REQUISITION_DETAILS,
            variables: {
              id: requisitionId,
              isManager: "client" !== userRole
            }
          }
        ]
      });
    } else {
      closableNotificationWithClick("Заполните все поля атрибутов.", "error");
    }
  };

  const handleChangePercent = (event) => {
    const { value } = event.target;
    setPercent(+value.trim());
    calculateRequisitionAmount({
      variables: {
        id: requisitionId,
        tmpPercent: +value.trim()
      }
    });
  };

  return (
    <>
      {mcCashAttributes &&
      mcCashAttributes.map((item, index) => {
        let attribute = attributes.find((element) => element.name === item);
        let id = attribute && attribute.id;
        let element = mcCashDetails.find((element) => element.name === item);
        const Component = mcCashComponentMapping[item];
        if (!Component) {
          return <span key={item}></span>;
        }
        return (
          <Component
            id={id}
            key={index}
            name={item}
            value={element ? element.value : ""}
            networkId={networkId}
            external={external}
            pairUnit={pairUnit}
            handleChangeMCCashDetails={handleChangeMCCashDetails}
          />
        );
      })}
      <DelayInputComponent
        type="number"
        name="pairPercent"
        label="Процент пары"
        className="mscash-field"
        value={percent === 0 ? "0" : percent}
        handleChange={handleChangePercent}
        debounceTimeout={1500}
        disabled={mutationLoading}
        required
      />
      <strong>Значение: </strong> {mutationLoading ? "пересчет" : amount} <br />
      <strong>Конечная комиссия: </strong> {mutationLoading ? "пересчет" : tmpCommission} <br />
      <strong>Себестоимость (покупка): </strong> {paymentPrice} <br />
      <strong>Себестоимость (продажа): </strong> {payoutPrice} <br />
      <div className="mscash-action">
        {loading ? (
          <LoadButton
            color="info"
            text="Подтвердить данные"
            weight="normal"
            type="button"
          />
        ) : (
          <StyledButton
            as="button"
            color="info"
            weight="normal"
            type="button"
            disabled={exchangePointId === exchangePoint}
            onClick={handleSaveMCCashAttributes}
          >
            Подтвердить данные
          </StyledButton>
        )}
        <RequisitionDetailsPaymentButton
          label="Оформить инвойс"
          id={requisitionId}
          isDisabled={
            !attributes.find((item) => item.name === networkName).value ||
            exchangePointId !== exchangePoint
          }
        />
      </div>
    </>
  );
};

export default RequisitionDetailsBankTab;
