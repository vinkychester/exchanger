import React from "react";
import { Helmet } from "react-helmet-async";
import Title from "../../components/title/title.component";
import CryptoDictionaryItemA from "./template/crypto-dictionary-item-A";
import CryptoDictionaryItemB from "./template/crypto-dictionary-item-B";
import CryptoDictionaryItemC from "./template/crypto-dictionary-item-C";
import CryptoDictionaryItemD from "./template/crypto-dictionary-item-D";
import CryptoDictionaryItemE from "./template/crypto-dictionary-item-E";
import CryptoDictionaryItemF from "./template/crypto-dictionary-item-F";
import CryptoDictionaryItemH from "./template/crypto-dictionary-item-H";
import CryptoDictionaryItemI from "./template/crypto-dictionary-item-I";
import CryptoDictionaryItemJ from "./template/crypto-dictionary-item-J";
import CryptoDictionaryItemL from "./template/crypto-dictionary-item-L";
import CryptoDictionaryItemM from "./template/crypto-dictionary-item-M";
import CryptoDictionaryItemN from "./template/crypto-dictionary-item-N";
import CryptoDictionaryItemO from "./template/crypto-dictionary-item-O";
import CryptoDictionaryItemP from "./template/crypto-dictionary-item-P";
import CryptoDictionaryItemR from "./template/crypto-dictionary-item-R";
import CryptoDictionaryItemS from "./template/crypto-dictionary-item-S";
import CryptoDictionaryItemT from "./template/crypto-dictionary-item-T";
import CryptoDictionaryItemW from "./template/crypto-dictionary-item-W";

import { StyledContainer } from "../../components/styles/styled-container";
import { StaticInfoContent } from "../../components/static-information/styled-static-info";
import { StyledCryptoDictionaryWrapper } from "./styled-crypto-dictionary";

const CryptoDictionary = () => {

  const anchors = document.querySelectorAll('a[href*="#"]')

  for (let anchor of anchors) {
    anchor.addEventListener('click', function (e) {
      e.preventDefault()

      const blockID = anchor.getAttribute('href').substr(1)

      document.getElementById(blockID).scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    })
  }

  return (
    <StyledContainer>
      <Helmet>
        <title>Криптословарь: основные термины и сленг в мире криптовалют · Coin24</title>
        <meta
          name="description"
          content="Словарь основной терминологии и сокращений из криптовалютного мира. Самые важные термины, которые нужно знать о криптовалютах. Словарь крипто терминов для начинающего трейдера."
        />
      </Helmet>
      <StyledCryptoDictionaryWrapper>
        <Title
          as="h1"
          title={`"Криптовалютный сленг" или "Основная терминология в мире криптовалют"`}
          className="crypto-dictionary__title"
        />
        <StaticInfoContent>
          <CryptoDictionaryItemA />
          <CryptoDictionaryItemB />
          <CryptoDictionaryItemC />
          <CryptoDictionaryItemD />
          <CryptoDictionaryItemE />
          <CryptoDictionaryItemF />
          <CryptoDictionaryItemH />
          <CryptoDictionaryItemI />
          <CryptoDictionaryItemJ />
          <CryptoDictionaryItemL />
          <CryptoDictionaryItemM />
          <CryptoDictionaryItemN />
          <CryptoDictionaryItemO />
          <CryptoDictionaryItemP />
          <CryptoDictionaryItemR />
          <CryptoDictionaryItemS />
          <CryptoDictionaryItemT />
          <CryptoDictionaryItemW />
        </StaticInfoContent>
      </StyledCryptoDictionaryWrapper>
    </StyledContainer>
  );
};

export default React.memo(CryptoDictionary);
