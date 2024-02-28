import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { getUUID } from "../../../utils/calculator.utils";
import { StyledList } from "../../styles/styled-document-elemets";

const ReferralReportItemDetails = ({ client }) => {
  const [referralProfit, setReferralProfit] = useState(0);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (client.balances.collection.length) {

      const { collection } = client.balances;

      setReferralProfit(collection.find(item => item.field === "referralProfit")?.value);
      setBalance(collection.find(item => item.field === "balance")?.value);
    }
  }, [client.balances]);
  const { first, second } = client;

  return (
    <StyledList>
      {first.paginationInfo.totalCount !== 0 ?
        <li>
          <NavLink to={`/panel/reports/referrals/${getUUID(client.id)}/1`} className="default-link">
            Реферальных партнеров 1 уровня: {first.paginationInfo.totalCount}
          </NavLink>
        </li> : <li><span className="red">Рефералы 1 уровня не найдены</span></li>
      }
      {second.paginationInfo.totalCount !== 0 ?
        <li>
          <NavLink to={`/panel/reports/referrals/${getUUID(client.id)}/2`} className="default-link">
            Реферальных партнеров 2 уровня: {second.paginationInfo.totalCount}
          </NavLink>
        </li> : <li><span className="red">Рефералы 2 уровня не найдены</span></li>
      }
      <li>Прибыль c рефералов: <span className="orange">{referralProfit ? referralProfit.toFixed(2) : 0}</span></li>
      <li>Доступное вознаграждение: <span className="orange">{balance ? balance.toFixed(2) : 0}</span></li>
    </StyledList>
  );
};

export default ReferralReportItemDetails;
