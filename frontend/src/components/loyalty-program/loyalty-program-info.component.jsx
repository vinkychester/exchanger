import React, { useState } from "react";
import { useQuery, useApolloClient } from "@apollo/react-hooks";
import { NavLink } from "react-router-dom";
import Tooltip from "rc-tooltip";

import Spinner from "../spinner/spinner.component";
import SkeletonInput from "../skeleton/skeleton-input";
import AlertMessage from "../alert/alert.component";
import CopyInputComponent from "../input-group/copy-input-group";
import ReferralPayoutForm from "./referral-payout-form.component";
import ReferralClientLevel from "./referral-system/referral-client-level.component";
import LoyaltyProgramCommission from "./loyalty-program-commission.component";
import CashbackLevelStarts from "./cashback-level-starts";

import {
  StyledCashbackBalance,
  StyledReferralBalance,
  StyledReferralInfo,
  StyledReferralStatistics,
  StyledReferralStatisticsWrapper,
} from "./styled-referral";
import {
  StyledBlockText,
  StyledBlockTitle,
  StyledInfoBlock,
} from "../styles/styled-info-block";
import { StyledTooltip } from "../styles/styled-tooltip";

import {
  GET_USER_LOYALTY_PROGRAM_DETAILS,
  GET_USER_RBAC_DETAILS,
} from "../../graphql/queries/user.query";
import { GET_COLLECTION_CASHBACK_LEVELS } from "../../graphql/queries/cashback-level.query";



const ReferralInfo = ({ url, setIsUpdatePayoutHistory }) => {
  const client = useApolloClient();

  const { userId } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const [balance, setBalance] = useState(null);

  const { loading, error, data } = useQuery(GET_USER_LOYALTY_PROGRAM_DETAILS, {
    variables: {
      userUUID: userId,
    },
    onCompleted: (data) => {
      if (data.clientBalance) {
        setBalance(data.clientBalance);
      }
    },
  });

  const { loading:cashbackLevelLoad, data:cashbackLevelData } = useQuery(GET_COLLECTION_CASHBACK_LEVELS);

  if (loading) return <Spinner color="#EC6110" type="moonLoader" size="50px" />;
  if (error)
    return (
      <AlertMessage type="error" message={error.message} margin="15px 0" />
    );
  if (!data) return <AlertMessage type="warning" message="Not found." />;

  const {
    balances,
    referralToken,
    nextCashbackLevel,
    referralClientLevels: { collection: clientReferralLevels },
    cashbackClientLevels: { collection: clientCashbackLevels },
    first,
    second
  } = data.programLoyaltyClient;

  const { collection } = balances;


  const cashbackProfit = collection.find(item => item.field === "cashbackProfit") ? collection.find(item => item.field === "cashbackProfit").value : 0;
  const referralProfit = collection.find(item => item.field === "referralProfit") ? collection.find(item => item.field === "referralProfit").value : 0;
  const balanceProfit = collection.find(item => item.field === "balance") ? collection.find(item => item.field === "balance").value : 0;
  const monthPaymentAmount = collection.find(item => item.field === "monthPaymentAmount") ? collection.find(item => item.field === "monthPaymentAmount").value : 0;


  return (
    <StyledReferralInfo>
      {!loading && clientReferralLevels ? (
        <CopyInputComponent
          label="Реферальная ссылка"
          value={`${url}/?refToken=${referralToken}`}
          readOnly
        />
      ) : loading && clientReferralLevels ? (
        <SkeletonInput width="70" label="Реферальная ссылка" />
      ) : (
        "Реферальная ссылка не доступна. Обратитесь к администрации."
      )}
      <AlertMessage
        type="info"
        message={
          <React.Fragment>
            Детальный с программой лояльности, можно ознакомиться на <NavLink to="/partners" className="default-link"> этой странице</NavLink>.
          </React.Fragment>}
        margin="10px 0" />

      <StyledReferralStatisticsWrapper>
        {loading ? (
          <Spinner color="#EC6110" type="moonLoader" size="35px" />
        ) : (
          <StyledReferralStatistics>
            {clientReferralLevels?.length > 0 ? (
              clientReferralLevels.map((clientReferralLevel) => {
                return (
                  <ReferralClientLevel
                    key={clientReferralLevel.id}
                    clientReferralLevel={clientReferralLevel}
                    totalCount={clientReferralLevel.referralLevel.level === 1 ? first.paginationInfo.totalCount : second.paginationInfo.totalCount}
                  />
                );
              })
            ) : (
              <div className="not-found">
                <AlertMessage
                  type="warning"
                  message="Реферальные уровни не доступны."
                />
              </div>
            )}
          </StyledReferralStatistics>
        )}
      </StyledReferralStatisticsWrapper>
      <StyledCashbackBalance className="referral-statistics">
        {clientCashbackLevels[0] && (
          <StyledInfoBlock
            title={`Персональный кешбэк ${clientCashbackLevels[0].cashbackLevel?.level} уровня`}
          >
            {clientCashbackLevels[0]?.cashbackLevel && (
              <>
                <StyledBlockTitle className="referral-statistics__label">
                  Персональный кешбэк:
                  <Tooltip
                    placement="top"
                    overlay="Уровень персонального кешбэка"
                  >
                    <StyledTooltip className="icon-question" />
                  </Tooltip>
                </StyledBlockTitle>
                <StyledBlockText>
                  <CashbackLevelStarts currentLevel={clientCashbackLevels[0].cashbackLevel?.level}/>
                </StyledBlockText>
                <StyledBlockTitle className="referral-statistics__label">
                  Персональный процент кешбэка:
                  <Tooltip
                    placement="top"
                    overlay="Процент начисления кешбэка текущего уровня"
                  >
                    <StyledTooltip className="icon-question" />
                  </Tooltip>
                </StyledBlockTitle>
                <StyledBlockText>
                  <b>{clientCashbackLevels[0].cashbackLevel?.percent}%</b>
                </StyledBlockText>
                <StyledBlockTitle className="referral-statistics__label">
                  Общая сумма баланса кешбэка:
                  <Tooltip
                    placement="top"
                    overlay="Заработання бонусная сумма, с собственных обменов"
                  >
                    <StyledTooltip className="icon-question" />
                  </Tooltip>
                </StyledBlockTitle>
                <StyledBlockText>
                  <div
                    className="exchange-icon-USDT referral-balance__icon"
                    style={{ marginRight: "10px" }}
                  />
                  <div className="referral-balance__main">
                    {cashbackProfit} <b>USDT</b>
                  </div>
                </StyledBlockText>
                <StyledBlockTitle className="referral-statistics__label">
                  Общая сумма баланса рефералов:
                  <Tooltip
                    placement="top"
                    overlay="Заработання бонусная сумма, с обменов рефералов"
                  >
                    <StyledTooltip className="icon-question" />
                  </Tooltip>
                </StyledBlockTitle>
                <StyledBlockText>
                  <div
                    className="exchange-icon-USDT referral-balance__icon"
                    style={{ marginRight: "10px" }}
                  />
                  <div className="referral-balance__main">
                    {referralProfit} <b>USDT</b>
                  </div>
                </StyledBlockText>
              </>
            )}
            {nextCashbackLevel ?
              nextCashbackLevel?.profitRangeFrom >=
              monthPaymentAmount ? (
                <>
                  <StyledBlockTitle className="referral-statistics__label">
                    Текущая сумма обменов:
                    <Tooltip
                      placement="top"
                      overlay="Текущая сумма обменов в этом месяце приведенных к USDT"
                    >
                      <StyledTooltip className="icon-question" />
                    </Tooltip>
                  </StyledBlockTitle>
                  <StyledBlockText>
                    <b>
                      {monthPaymentAmount} <b>USDT</b>
                    </b>
                  </StyledBlockText>
                  <StyledBlockTitle className="referral-statistics__label">
                    Сумма до следующего уровня кешбэка:
                    <Tooltip
                      placement="top"
                      overlay="Необходимая сумма обмена для повышения уровня"
                    >
                      <StyledTooltip className="icon-question" />
                    </Tooltip>
                  </StyledBlockTitle>
                  <StyledBlockText>
                    <b>
                      {nextCashbackLevel.profitRangeFrom - monthPaymentAmount} <b>USDT</b>
                    </b>
                  </StyledBlockText>
                </>
              ) : (
                nextCashbackLevel?.percent && (
                  <AlertMessage
                    type="warning"
                    message={`В начале следующего месяца ваш кешбэк процент изменится на ${nextCashbackLevel.percent}%`}
                  />
                )
              ) : (
                    <>
                      <AlertMessage
                        type="success"
                        message="Вы достигли максимального уровня кешбэка"
                        margin="10px 0"
                      />
                      <StyledBlockTitle className="referral-statistics__label">
                        Текущая сумма обменов:
                        <Tooltip
                          placement="top"
                          overlay="Текущая сумма обменов в этом месяце приведенных к USDT"
                        >
                          <StyledTooltip className="icon-question" />
                        </Tooltip>
                      </StyledBlockTitle>
                      <StyledBlockText>
                        <b>
                          {monthPaymentAmount} <b>USDT</b>
                        </b>
                      </StyledBlockText>
                    </>
                  )
            }
          </StyledInfoBlock>
        )}
        {clientCashbackLevels[0] && balance?.cashbackProfit && (
          <StyledInfoBlock>
            <StyledBlockTitle className="referral-statistics__label">
              Баланс кешбэка
              <Tooltip
                placement="top"
                overlay="Доступный баланс для вывода кешбэка"
              >
                <StyledTooltip className="icon-question" />
              </Tooltip>
            </StyledBlockTitle>
            {balance && (
              <StyledBlockText>
                <b>{balance.cashbackProfit} USDT</b>
              </StyledBlockText>
            )}
          </StyledInfoBlock>
        )}
      </StyledCashbackBalance>
      <StyledReferralBalance>
        <StyledInfoBlock className="referral-balance">
          <StyledBlockTitle>
            Доступный баланс:
            <Tooltip placement="top" overlay="Общий баланс для вывода">
              <StyledTooltip className="icon-question" />
            </Tooltip>
          </StyledBlockTitle>
          <StyledBlockText>
            <div className="exchange-icon-USDT referral-balance__icon" />
            <div className="referral-balance__main">
              {balanceProfit}{" "}
              <b>USDT</b>
            </div>
          </StyledBlockText>
          <LoyaltyProgramCommission />
        </StyledInfoBlock>
        <ReferralPayoutForm
          userUUID={userId}
          clientBalance={
            balanceProfit && balanceProfit.value
          }
          setIsUpdatePayoutHistory={setIsUpdatePayoutHistory}
        />
      </StyledReferralBalance>
    </StyledReferralInfo>
  );
};

export default React.memo(ReferralInfo);
