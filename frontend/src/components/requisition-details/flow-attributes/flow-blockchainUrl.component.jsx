import React, { useState } from "react";
import { closableNotificationWithClick } from "../../notification/closable-notification-with-click.component";
import { CopyToClipboard } from "react-copy-to-clipboard";
import AlertMessage from "../../alert/alert.component";

import { StyledBlockText, StyledBlockTitle, StyledInfoBlock } from "../../styles/styled-info-block";

const BlockchainUrl = ({ value }) => {
  const [copied, setCopied] = useState(false);
  const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

  return (
    <StyledInfoBlock className="flow-data">
      <StyledBlockTitle className="flow-data__label">
        Ссылка на blockchain:
      </StyledBlockTitle>
      <StyledBlockText className="requisite__item flow-data__value">
        {regex.test(value) ?
          <p>
            <a href={value} className="default-link" target="_blank" rel="noreferrer">
              {value}
            </a>
            <CopyToClipboard
              text={value}
              onCopy={() => {
                setCopied(true);
                closableNotificationWithClick("Скопировано", "success");
              }}
            >
              <span className="icon-copy" title="Скопировать" />
            </CopyToClipboard>
          </p> :
          <AlertMessage
            className="flow-data__info"
            type="info"
            message={value}
          />}
      </StyledBlockText>
    </StyledInfoBlock>
  );
};

export default BlockchainUrl;
