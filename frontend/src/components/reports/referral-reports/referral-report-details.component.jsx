import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@apollo/react-hooks";
import { NavLink } from "react-router-dom";
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { StyledBlockText, StyledBlockTitle, StyledInfoBlock } from "../../styles/styled-info-block";
import { StyledContainer } from "../../styles/styled-container";
import { StyledBreadcrumb } from "../../styles/styled-breadcrumb";

import Title from "../../title/title.component";
import BreadcrumbItem from "../../breadcrumb/breadcrumb-item";
import AlertMessage from "../../alert/alert.component";
import AvatarSkeleton from "../../account/skeleton/avatar-skeleton.component";

import { GET_CLIENT_LOYALTY_STATISTICS_DETAILS } from "../../../graphql/queries/clients.query";
import {
  StyledClientCard, StyledClientCardBody, StyledClientCardHead,
  StyledClientDetailsContent,
  StyledClientDetailsWrapper, StyledClientName, StyledClientPhoto
} from "../../client-details/styled-client-details";
import PageSpinner from "../../spinner/page-spinner.component";

const ReferralReportDetails = ({ match }) => {
  const [profit, setProfit] = useState({cashback: 0, referral: 0, referralSystem: 0, profit: 0, balance: 0});
  let payoutRequisitionsSum = 0;
  const { data, loading, error } = useQuery(GET_CLIENT_LOYALTY_STATISTICS_DETAILS, {
    variables: {
      id: `/api/clients/${match.params.id}`
    }
  });

  useEffect(() => {
    if (data) {
      setProfit((prevState) => ({
        ...prevState,
        cashback: client.balances?.collection.find(({ field }) => field === "cashbackProfit")?.value ?? 0,
        referral: client.balances?.collection.find(({ field }) => field === "referralProfit")?.value ?? 0,
        referralSystem: client.balances?.collection.find(({ field }) => field === "systemProfit")?.value ?? 0,
        profit: client.balances?.collection.find(({ field }) => field === "profit")?.value ?? 0,
        balance: client.balances?.collection.find(({ field }) => field === "balance")?.value ?? 0
      }));
    }

  }, [data]);

  if (loading) return <PageSpinner />;
  if (error) return <AlertMessage type="error" message={error.message} margin="20px 0 0" />;
  if (!data) return <AlertMessage type="warning" message="Информация о статистике недоступна" margin="20px 0 0" />;

  const { client } = data;

  const {
    firstname,
    lastname,
    email,
    payoutRequisitions,
    mediaObject,
    first,
    second,
  } = client;

  const { collection } = payoutRequisitions;
  collection && collection.map(({ amount }) => {
    payoutRequisitionsSum += amount;
  })
  return (
    <>
      <StyledContainer size="xl">
        <Helmet>
          <title>Отчеты клиента - Coin24</title>
        </Helmet>
        <StyledClientDetailsWrapper className="client-details">
          <Title as="h1" title="Отчеты клиента" className="client-details__title" />
          <StyledBreadcrumb>
            <BreadcrumbItem as={NavLink} to="/" title="Главная" />
            <BreadcrumbItem as={NavLink} to="/panel/reports?currentTab=loyaltyProgram" title="Отчеты" />
            <BreadcrumbItem as="span" title={`${firstname} ${lastname}`} />
          </StyledBreadcrumb>
          <StyledClientDetailsContent>
            <div className="client-card-wrapper">
              <StyledClientCard>
                <StyledClientCardHead>
                  {mediaObject ? (
                    <StyledClientPhoto>
                      <LazyLoadImage
                        src={mediaObject.base64} alt="profile image" />
                    </StyledClientPhoto>
                  ) : (
                    <AvatarSkeleton firstname={firstname} lastname={lastname} />
                  )}
                  <StyledInfoBlock>
                    <StyledClientName>
                      {firstname} {lastname}
                    </StyledClientName>
                    <StyledBlockTitle>
                      E-mail:
                    </StyledBlockTitle>
                    <StyledBlockText>
                      {email}
                    </StyledBlockText>
                  </StyledInfoBlock>
                </StyledClientCardHead>
                <StyledClientCardBody>
                  {first ?
                    <StyledInfoBlock>
                      <StyledBlockTitle>Реферальных партнеров 1 уровня:</StyledBlockTitle>
                      <StyledBlockText>{" "}{first.paginationInfo.totalCount}</StyledBlockText>
                    </StyledInfoBlock>

                    : <>Рефералы 1 уровня не найдены</>
                  }
                  {second ?
                    <StyledInfoBlock>
                      <StyledBlockTitle>Реферальных партнеров 2 уровня:</StyledBlockTitle>
                      <StyledBlockText>{" "}{second.paginationInfo.totalCount}</StyledBlockText>
                    </StyledInfoBlock>

                    : <>Рефералы 2 уровня не найдены</>
                  }
                  <StyledInfoBlock>
                    <StyledBlockTitle>
                      Общая прибыль по заявкам от оборота партнеров:
                    </StyledBlockTitle>
                    <StyledBlockText>
                      {profit.profit.toFixed(2)} USDT
                    </StyledBlockText>
                  </StyledInfoBlock>
                  <StyledInfoBlock>
                    <StyledBlockTitle>
                      Общая прибыль системы от оборота партнеров:
                    </StyledBlockTitle>
                    <StyledBlockText>
                      {profit.referralSystem.toFixed(2)} USDT
                    </StyledBlockText>
                  </StyledInfoBlock>
                  <StyledInfoBlock>
                    <StyledBlockTitle>
                      Кэшбек прибыль пользователя:
                    </StyledBlockTitle>
                    <StyledBlockText>
                      {profit.cashback.toFixed(2)} USDT
                    </StyledBlockText>
                  </StyledInfoBlock>
                  <StyledInfoBlock>
                    <StyledBlockTitle>
                      Реферальная прибыль пользователя:
                    </StyledBlockTitle>
                    <StyledBlockText>
                      {profit.referral.toFixed(2)} USDT
                    </StyledBlockText>
                  </StyledInfoBlock>
                  <StyledInfoBlock>
                    <StyledBlockTitle>
                      Общее вознаграждение:
                    </StyledBlockTitle>
                    <StyledBlockText>
                      {profit.balance.toFixed(2)} USDT
                    </StyledBlockText>
                  </StyledInfoBlock>
                  <StyledInfoBlock>
                    <StyledBlockTitle>
                      Выплаченное вознаграждение:
                    </StyledBlockTitle>
                    <StyledBlockText>
                      {payoutRequisitionsSum.toFixed(2)} USDT
                    </StyledBlockText>
                  </StyledInfoBlock>
                </StyledClientCardBody>
              </StyledClientCard>
            </div>
          </StyledClientDetailsContent>
        </StyledClientDetailsWrapper>
      </StyledContainer>
    </>
  );
};

export default ReferralReportDetails;