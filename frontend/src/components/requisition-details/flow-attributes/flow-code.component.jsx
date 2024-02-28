import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { closableNotificationWithClick } from "../../notification/closable-notification-with-click.component";

import { StyledBlockText, StyledBlockTitle, StyledInfoBlock } from "../../styles/styled-info-block";
import { StyledTooltip } from "../../styles/styled-tooltip";
import Tooltip from "rc-tooltip";

const Code = ({ value }) => {
  const [copied, setCopied] = useState(false);

  return (
    <StyledInfoBlock className="flow-data">
      <StyledBlockTitle className="flow-data__label">
        Секретный код <Tooltip
        placement="top"
        overlay="Секретный код служит для идентификации личности при встрече с менеджером для наличного обмена"
      >
        <StyledTooltip className="icon-question" opacity="0.5" />
      </Tooltip>:
      </StyledBlockTitle>
      <StyledBlockText className="requisite__item flow-data__value">
        <p className="flow-data__secret-code">
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
    </StyledInfoBlock>
  );
};

export default Code;
