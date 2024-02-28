import React, { useContext } from "react";

import SystemReportRequisitionTotalCountItem from "./system-report-requisition-total-count-item.component";

import {
  StyledReportStatistics,
  StyledReportStatItem,
} from "../styled-reports";
import { requisitionStatusConst } from "../../../utils/requsition.status";
import { StyledButton } from "../../styles/styled-button";
import axios from "axios";
import authenticationConfig from "../../../utils/authenticationConfig";
import { SystemReportFilterContext } from "./system-report.container";

const SystemReportRequisitionTotalCount = () => {
  const { filter } = useContext(SystemReportFilterContext);
  const downloadExcel = (e) => {
    let config = {
      "responseType": "arraybuffer",
      "params": filter
    };
    axios.get("/api/panel/requisitions/excel", Object.assign(authenticationConfig(), config))
      .then(response => {
        if (response.status === 200) {
          const FileSaver = require("file-saver");
          const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
          FileSaver.saveAs(blob, "requisition-report.xlsx");
        }
      });
  };

  return (
    <StyledReportStatistics>
      <StyledButton
        type="button"
        title="Скачать excel"
        weight="normal"
        onClick={downloadExcel}
      >
        Скачать excel
      </StyledButton>
      <br/>
      <br/>
      <div className="report-statistic__content">
        <StyledReportStatItem>
          <SystemReportRequisitionTotalCountItem
            text="Общее количество заявок за период:"
            icon="icon-exchange"
          />
        </StyledReportStatItem>
        <StyledReportStatItem>
          <SystemReportRequisitionTotalCountItem
            text="Количество новых заявок за период:"
            icon="icon-bitcoin"
            status={requisitionStatusConst.NEW}
          />
        </StyledReportStatItem>
        <StyledReportStatItem>
          <SystemReportRequisitionTotalCountItem
            text="Количество заявок ожидающих оплату за период:"
            icon="icon-donate"
            status={requisitionStatusConst.INVOICE}
          />
        </StyledReportStatItem>
        <StyledReportStatItem>
          <SystemReportRequisitionTotalCountItem
            text="Количество заявок ощидающих верификацию карт за период:"
            icon="icon-credit-card"
            status={requisitionStatusConst.CARD_VERIFICATION}
          />
        </StyledReportStatItem>
        <StyledReportStatItem>
          <SystemReportRequisitionTotalCountItem
            text="Количество ожидающих заявок за период:"
            icon="icon-half-time"
            status={requisitionStatusConst.PENDING}
          />
        </StyledReportStatItem>
        <StyledReportStatItem>
          <SystemReportRequisitionTotalCountItem
            text="Количество обработанных заявок за период:"
            icon="icon-check"
            status={requisitionStatusConst.PROCESSED}
          />
        </StyledReportStatItem>
        <StyledReportStatItem>
          <SystemReportRequisitionTotalCountItem
            text="Количество выплаченых заявок за период:"
            icon="icon-finish"
            status={requisitionStatusConst.FINISHED}
          />
        </StyledReportStatItem>
        <StyledReportStatItem>
          <SystemReportRequisitionTotalCountItem
            text="Количество отмененных пользователем заявок за период:"
            icon="icon-ban"
            status={requisitionStatusConst.CANCELED}
          />
        </StyledReportStatItem>
        <StyledReportStatItem>
          <SystemReportRequisitionTotalCountItem
            text="Количество неоплаченных заявок за период:"
            icon="icon-cancel"
            status={requisitionStatusConst.DISABLED}
          />
        </StyledReportStatItem>
        <StyledReportStatItem>
          <SystemReportRequisitionTotalCountItem
            text="Количество ошибочных заявок за период:"
            icon="icon-danger-triangle"
            status={requisitionStatusConst.ERROR}
          />
        </StyledReportStatItem>
      </div>
    </StyledReportStatistics>
  );
};

export default SystemReportRequisitionTotalCount;
