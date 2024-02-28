import React from "react";

import CryptoDictionaryHead from "./crypto-dictionary-head";
import { StyledDictionaryItem } from "../styled-crypto-dictionary";

const CryptoDictionaryItemJ = () => {
  return (
    <div id="J">
      <CryptoDictionaryHead current="J" />
      <StyledDictionaryItem id="JapaneseCandles">
        <h2>Japanese Candles</h2>{" "}
        (Японские Свечи) – сумма совершенных сделок, на одной конкретной бирже в границах
        определенного временного интервала. Японские свечи известны биржевым трейдерам уже
        несколько веков, и за это долгое время не было представлено более удобного и
        общепринятого способа для представления цены. Да, конечно, есть бары, линии и
        множество других видов визуального отображения, но именно свечи снискали наибольший
        отклик и признание среди трейдеров. И на это есть свои причины: японские свечи
        наглядны и информативны, они позволяют точно определить предельные значения цены за
        прошедший временной интервал. Помимо всего прочего, график из японских свечей
        представляет собой ещё и способ технического анализа, который и называется «свечной
        анализ». Данный вид графика криптовалют, который показывает не только текущую цену, но
        наибольшую и наименьшую цену за период, а также цену открытия и закрытия таймфрейма.
        Японские свечи изобрел торговец рисом Хомма Мунэхиса в XVII веке.
      </StyledDictionaryItem>
    </div>
  );
};

export default CryptoDictionaryItemJ;