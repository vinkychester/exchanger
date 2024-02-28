import React from "react";

import CryptoDictionaryHead from "./crypto-dictionary-head";
import { StyledDictionaryItem } from "../styled-crypto-dictionary";

const CryptoDictionaryItemR = () => {
  return (
    <div id="R">
      <CryptoDictionaryHead current="R" />
      <StyledDictionaryItem className="sortedItem" id="Rekt">
        <h2>Rekt</h2>{" "}
        (Рект) – у данного термина есть несколько версий происхождения. Некоторые
        считают, что термин позаимствован из мира компьютерных игр. Официальной версией считается –
        намеренно искаженное слово «Wrecked», что означает «сокрушенный». Дословно подразумевается
        понятие – разгромлен, разбит. Еще одна версия происхождения данного сленгового высказывания,
        которая заключается в том, что это искажение слова «rectal» и буквально означает – «я в
        заднице». Второй вариант более близок трейдерам, хоть и не является официальной трактовкой.
        Понятие подразумевает ситуацию, когда трейдер или инвестор потерял все сбережения из-за
        обвала цен. Получить рект – значит продать крипту слишком рано или поздно. Другими словами,
        потерпеть убытки, не справившись с эмоциями.
      </StyledDictionaryItem>
    </div>
  );
};

export default CryptoDictionaryItemR;