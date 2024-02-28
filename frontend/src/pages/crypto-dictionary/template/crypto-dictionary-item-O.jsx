import React from "react";

import CryptoDictionaryHead from "./crypto-dictionary-head";
import { StyledDictionaryItem } from "../styled-crypto-dictionary";

const CryptoDictionaryItemO = () => {
  return (
    <div id="O">
      <CryptoDictionaryHead current="O" />
      <StyledDictionaryItem id="Ostrich">
        <h2>Ostrich</h2>{" "}
        (Страус) – это инвестор, который не реагирует на критические ситуации или
        события, которые могут повлиять на инвестиции. По аналогии с самой крупной птицей в мире и
        легендой о том, что страус прячет голову в песок – данные инвесторы предпочитают не обращать
        внимание на изменения на рынке, и ведут себя невозмутимо. Страусиный эффект – это тот, в
        котором инвесторы хоронят головы в песке, надеясь на лучшие дни. Страусы появляются (или
        исчезают) чаще всего на медвежьих рынках, когда люди склонны испытывать наибольший
        финансовый стресс. Людям полюбилось выражение «прятать голову в песок», как символ
        игнорирования проблемы, как и страусы-трейдеры – делают вид, что ничего не происходит.
      </StyledDictionaryItem>
      <StyledDictionaryItem id="OTC">
        <h2>OTC</h2>{" "}
        - "Over the counter" (В обход прилавка) – этим термином обозначается
        внебиржевая торговля, осуществляемая напрямую между клиентами и маркетмейкерами. В таком
        случае продавец и покупатель заключают сделку непосредственно друг с другом, обычно при
        содействии третьих сторон. Долгое время OTC-трейдинг был важным инструментом на традиционном
        финансовом рынке, однако в 2018 году нашел широкое применение и в сфере криптовалют.
        Относится к методу торговли, не использующий обменный сервис. При ОТС-трейдинге покупатели и
        продавцы сами приходят к соглашению об обменном курсе на определенную валюту и, часто с
        помощью доверенного эскроу-лица, осуществляют транзакцию друг с другом напрямую. Внебиржевая
        торговля часто встречается среди команд, которые покупают или продают криптовалюту крупным
        частным инвесторам.
      </StyledDictionaryItem>
    </div>
  );
};

export default CryptoDictionaryItemO;