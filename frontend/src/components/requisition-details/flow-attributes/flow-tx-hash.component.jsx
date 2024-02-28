import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { closableNotificationWithClick } from "../../notification/closable-notification-with-click.component";

import {
  StyledBlockText,
  StyledBlockTitle,
  StyledInfoBlock,
} from "../../styles/styled-info-block";

const TxHash = ({ value }) => {
  const [copied, setCopied] = useState(false);

  return (
    <StyledInfoBlock className="flow-data">
      <StyledBlockTitle className="flow-data__label">
        TX Hash:
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
            <span className="icon-copy" title="Скопировать"/>
          </CopyToClipboard>
        </p>
      </StyledBlockText>
    </StyledInfoBlock>
  );
};

export default TxHash;
