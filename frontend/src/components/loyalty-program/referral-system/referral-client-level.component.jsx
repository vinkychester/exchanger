import React from "react";
import {StyledBlockText, StyledBlockTitle, StyledInfoBlock} from "../../styles/styled-info-block";

const ReferralClientLevel = ({clientReferralLevel, totalCount}) => {
  return (
        <div className="referral-statistics">
            <StyledInfoBlock>
                <StyledBlockTitle className="referral-statistics__label">
                    Реферальный % {clientReferralLevel.referralLevel.level} уровня
                </StyledBlockTitle>
                <StyledBlockText>
                    <b>{clientReferralLevel.referralLevel.percent}%</b>
                </StyledBlockText>
            </StyledInfoBlock>
            <StyledInfoBlock>
                <StyledBlockTitle className="referral-statistics__label">
                    Кол-во рефералов {clientReferralLevel.referralLevel.level} уровня:
                </StyledBlockTitle>
                <StyledBlockText>
                    <b>{totalCount}</b>
                </StyledBlockText>
            </StyledInfoBlock>
            <StyledInfoBlock>
                <StyledBlockTitle className="referral-statistics__label">
                    Прибыль от рефералов {clientReferralLevel.referralLevel.level} уровня:
                </StyledBlockTitle>
                <StyledBlockText>
                    <b>{clientReferralLevel.profit}</b>
                </StyledBlockText>
            </StyledInfoBlock>
        </div>
    )
}

export default ReferralClientLevel;
