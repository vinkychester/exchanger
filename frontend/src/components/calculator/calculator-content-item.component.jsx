import React, { useContext, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { useHistory } from "react-router-dom";

import AlertMessage from "../alert/alert.component";

import { StyledTabContentItem, StyledTabWrapper } from "./styled-calculator";

import { CalculatorContext, CalculatorTabContext } from "./calculator.component";
import { CalculatorContentContext } from "./calculator-tab.component";
import { isActive } from "../../utils/calculator.utils";

const CalculatorContentItem = ({ match, collection, data }) => {
  const {
    handleChangeExchangeValue,
    handleChangeRequisitionDetails,
    isHandleSwap
  } = useContext(CalculatorContext);
  const {
    direction,
    exchangeValue,
    inverseExchangeValue,
    tab,
    handleChangeCollection
  } = useContext(CalculatorTabContext);
  const { handleChangeTab, exchangeItem, setExchangeItem } = useContext(CalculatorContentContext);

  const regexp = /^([a-z-_0-9&]+)-to-([a-z-_0-9&]+)/g;
  const bestChangeRegexp = /cur_from=[A-Za-z0-9]*&cur_to=[A-Za-z0-9]*/g;

  let history = useHistory();

  // const regexp = /^([a-z-_%\[\w\]]+)-to-([a-z-_%\[\w\]]+)/g;
  const field = `${direction}Collection`;

  useEffect(() => {
    let param = match.params.id;
    if (data) {

      let element = undefined;

      const { collection } = data.calculatorCollectionQueryPairUnits;
      handleChangeCollection(field, collection);
      const { search } = history.location;

      if (search && search.match(bestChangeRegexp)) {
        const str = search.match(bestChangeRegexp)[0].split("&");
        let link = "payment" === direction ? str[0].split("=")[1] : str[1].split("=")[1];

        let unit = collection.find(item => item.currency.asset === link.slice(-3));
        let isFiat = !!(unit && unit.currency.tag === "CURRENCY");

        let paymentSystem = link;
        let asset = link;

        if (isFiat) {
          paymentSystem = link.slice(0, -3);
          asset = link.slice(-3);
        }

        if (link.includes("USDT")) {
          paymentSystem = link.slice(0, 4);
          asset = link.slice(4) === "ERC" ? "USDT (ERC20)" : link.slice(4) === "TRC" ? "USDT (TRC20)" : link.slice(4) === "OMNI" ? "USDT (OMNI)" : "USDT";
        }

        element = collection.find(
          (item) =>
            asset === item.currency.asset &&
            paymentSystem === (isFiat ? item.paymentSystem.tag : item.paymentSystem.subName)
        );
      }

      if (param) {
        if (collection.length !== 0) {
          const array = [...param.matchAll(regexp)];

          if (array.length !== 0) {
            let info = array[0];
            let link = "payment" === direction ? info[1] : info[2];
            link = link.split("-");

            let asset = link[1];

            if (asset.includes("usdt")) {
              asset = asset.slice(4) === "erc20" ? "usdt (erc20)" : asset.slice(4) === "trc20" ? "usdt (trc20)" : asset.slice(4) === "omni" ? "usdt (omni)" : "usdt";
            }
            // if (/&/g.test(link[1])) {
            //   asset = link[1].replace(/&/g, " ").split(" ")[0] + " (" + link[1].split("&")[1] + ")";
            // }

            element = collection.find(
              (item) =>
                // link[0] === item.service.tag.toLowerCase() &&
                asset === item.currency.asset.toLowerCase() &&
                link[2] === (item.currency.tag === "CURRENCY" ? item.paymentSystem.tag.toLowerCase() : item.paymentSystem.subName.toLowerCase())
            );
          }
        }
      }

      if (search && search.match(bestChangeRegexp) || param) {
        if (element) {
          const { name } = element.pairUnitTabs;
          handleChangeTab(name);
          setExchangeItem(element);
        } else {
          handleChangeTab("all");
        }
      }
    }
  }, []);

  useEffect(() => {
    if (!isHandleSwap) {
      if (collection.length !== 0) {
        if (exchangeItem) handleChangeExchangeValue(exchangeItem, direction);
        else handleChangeExchangeValue(collection[0], direction);
      } else {
        handleChangeExchangeValue(null, direction);
        handleChangeRequisitionDetails("pair", null);
      }
      // set default exchange point for requisition
      handleChangeRequisitionDetails("exchangePoint", "bank");
    }
  }, [tab, exchangeItem]);

  const renderClassname = (id, isActive) => {
    if (isActive && exchangeValue && exchangeValue.id === id)
      return "exchange-item_current";
    if (exchangeValue && exchangeValue.id === id)
      return "exchange-item_current exchange-item_no-exchange";
    if (!isActive) return "exchange-item_no-exchange";
    return null;
  };

  if (!collection.length) {
    window.history.pushState({}, document.title, "/");
    return (
      <AlertMessage type="warning" message="Не найдено." margin="0 3px 0 0" />
    );
  }

  return (
    <StyledTabWrapper>
      {collection &&
        collection.map((node) => {
          const { id, currency, paymentSystem } = node;
          const { asset } = currency;
          const { tag, name } = paymentSystem;
          return (
            <StyledTabContentItem
              id={direction + name + asset.replace(/\s+/g, "")}
              key={id}
              className={renderClassname(
                id,
                isActive(inverseExchangeValue, node)
              )}
              onChange={() => handleChangeExchangeValue(node, direction)}
            >
              <div
                className={`exchange-icon-${paymentSystem.tag === "CRYPTO" ? asset : tag
                  }`}
              />
              <div className="exchange-item-name">
                {name}
                <input
                  type="radio"
                  name="test"
                  value={tag + asset}
                  hidden="hidden"
                />
              </div>
              <div className="exchange-item-currency">{asset}</div>
            </StyledTabContentItem>
          );
        })}
    </StyledTabWrapper>
  );
};

export default React.memo(withRouter(CalculatorContentItem));
