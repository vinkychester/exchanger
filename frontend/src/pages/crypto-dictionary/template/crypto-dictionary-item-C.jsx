import React from "react";

import CryptoDictionaryHead from "./crypto-dictionary-head";
import { StyledDictionaryItem } from "../styled-crypto-dictionary";

const CryptoDictionaryItemC = () => {
  return (
    <div id="C">
      <CryptoDictionaryHead current="C" />
      <StyledDictionaryItem id="CirculatingSupply">
        <h2>Circulating Supply</h2>{" "}
        (Оборотное предложение) – это количество монет или токенов,
        которые были добыты или выпущены в оборот. Это приблизительное число монет, которое в
        настоящее время находится в обороте и распространяется на рынке. Данный термин ещё называют
        «Циркулирующее предложение». Термином обозначают количество монет в свободном обороте на
        рынке. Цена монеты не имеет значения сама по себе. Тем не менее, цена монеты, умноженная на
        количество монет в обороте, дает рыночную капитализацию монеты. Этот критерий используется
        для определения капитализации рынка и критерия рейтинга, а также в целом влияет на торги криптовалют.
      </StyledDictionaryItem>
      <StyledDictionaryItem id="Crowdsale">
        <h2>Crowdsale</h2>{" "}
        (Краудсейл) – это первичная покупка токенов новой криптовалюты до ее
        выхода на <a href="#ICO">ICO</a>. Впервые такое событие в мире криптовалют произошло на
        рубеже 2013-2014 гг.,
        когда было запущено первое <a href="#ICO">ICO</a> в истории криптовалютного мира, и
        называлось оно – «Mastercoin» (современно название – Omni). В дальнейшем термин токен был присвоен первичным
        монетам и началось его повсеместное использование. Краудсейл, как правило, происходит до
        того, как проект официально начинает свою работу. Он предназначен для сбора средств на
        развитие проекта, оплату работы разработчиков программного обеспечения и остальных вещей,
        которые нужны криптовалютному стартапу. В ходе проведения краудсейла желающим предлагается
        приобрести токены будущего проекта, а вырученные деньги идут на его развитие и проведение <a
        href="#ICO"
      >ICO</a>. С момента появления технология блокчейн получила широкое
        применение. На ее основе функционирует множество интересных и полезных проектов, а также постоянно выпускаются
        новые.
        Для реализации большинства идей требуется внушительное финансирование, привлечь которое
        новаторы пытаются еще на ранних стадиях различными способами, в том числе и краудсейлом.
      </StyledDictionaryItem>
    </div>
  );
};

export default CryptoDictionaryItemC;