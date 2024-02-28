import React, { useState } from "react";
import QRCode from "qrcode.react";
import { closableNotificationWithClick } from "../../notification/closable-notification-with-click.component";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { StyledBlockText, StyledBlockTitle, StyledInfoBlock } from "../../styles/styled-info-block";

import { requisitionStatusConst } from "../../../utils/requsition.status";

const Address = ({ value, requisitionStatus }) => {
  const [copied, setCopied] = useState(false);

  if (requisitionStatus === requisitionStatusConst.ERROR) return <></>;

  return (
    <StyledInfoBlock className="flow-data">
      <StyledBlockTitle className="flow-data__label">
        Реквизиты системы для оплаты (кошелек):
      </StyledBlockTitle>
      <StyledBlockText className="requisite__item flow-data__value">
        <p>
          {value}
          <CopyToClipboard
            text={value}
            onCopy={() => {
              setCopied(true);
              closableNotificationWithClick("Скопировано", "success");
            }}
          >
            <span className="icon-copy" title="Скопировать" />
          </CopyToClipboard>
        </p>
      </StyledBlockText>
      <QRCode
        size={200}
        bgColor="transparent"
        fgColor="#ff7d31"
        className="flow-data__qrcode"
        value={value}
      />
    </StyledInfoBlock>
  );
};

export default Address;
