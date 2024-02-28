import React, { useContext, useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import axios from "axios";

import FragmentSpinner from "../../spinner/fragment-spinner.component";
import DelayInputComponent from "../../input-group/delay-input-group";

import { StyledFormWrapper, StyledHiddenForm, StyledHiddenFormAction } from "../../styles/styled-form";
import { StyledButton } from "../../styles/styled-button";
import { StyledLoadingWrapper } from "../../spinner/styled-spinner";

import { CREATE_TRAFFIC_LINK, GET_TRAFFIC_LINKS_ADMIN_PANEL } from "../../../graphql/queries/traffic.query";
import { TrafficFilterContext } from "./traffic-reports-container.component";
import { parseApiErrors } from "../../../utils/response";
import { convertDateToTimestampEnd, convertDateToTimestampStart } from "../../../utils/datetime.util";
import { closableNotificationWithClick } from "../../notification/closable-notification-with-click.component";

import authenticationConfig from "../../../utils/authenticationConfig";

const TrafficReportsForm = () => {
  const { filter } = useContext(TrafficFilterContext);
  const [hide, setHide] = useState(true);
  const [load, setLoad] = useState(false);
  
  const [{ siteName, siteUrl }, setTrafficLink] = useState({ siteName: "", link: "" });
  const [errors, setErrors] = useState([]);
  const { tdate_gte, tdate_lte, tpage, titemsPerPage, ...props } = filter;
  let currentPage = tpage ? parseInt(tpage) : 1;
  
  
  const [createTrafficLink] = useMutation(CREATE_TRAFFIC_LINK, {
    onCompleted: () => {
      closableNotificationWithClick("Трафиковая ссылка успешно создана", "success");
      setErrors([]);
    },
    onError: ({ graphQLErrors }) =>
      setErrors(parseApiErrors(graphQLErrors))
  });

  const handleChangeInput = (event) => {
    const { name, value } = event.target;
    setTrafficLink(prevState => ({ ...prevState, [name]: value }));
  };

  const onSubmit = (event) => {
    event.preventDefault();

    createTrafficLink({
      variables: {
        siteName,
        siteUrl
      },
      refetchQueries: [
        {
          query: GET_TRAFFIC_LINKS_ADMIN_PANEL,
          variables: {
            ...props,
            tpage: currentPage,
            itemsPerPage: titemsPerPage ? +titemsPerPage : 50,
            tdate_gte: convertDateToTimestampStart(tdate_gte),
            tdate_lte: convertDateToTimestampEnd(tdate_lte),
          }
        }
      ]
    })
  };

  const showForm = () => {
    hide ? setHide(false) : setHide(true);
  };

  const downloadExcel = (e) => {
    let config = {
      "responseType": "arraybuffer",
      "params": filter
    };
    
    axios.get("/api/panel/traffic/excel", Object.assign(authenticationConfig(), config))
      .then(response => {
        if (response.status === 200) {
          const FileSaver = require("file-saver");
          const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
          FileSaver.saveAs(blob, "traffic.xlsx");
        }
      });
  };
  
  return (
    <StyledHiddenForm className="hidden-create-traffic-form">
      <StyledHiddenFormAction className="hidden-create-traffic-form__action">
        <StyledButton
          type="button"
          color="main"
          onClick={showForm}
        >
          Генерировать ссылку
        </StyledButton>
        <StyledButton
          type="button"
          title="Скачать excel"
          weight="normal"
          onClick={downloadExcel}
        >
          Скачать excel
        </StyledButton>
      </StyledHiddenFormAction>
      <StyledLoadingWrapper className="loading-create-traffic-form">
        {load && <FragmentSpinner position="center" />}
        <StyledFormWrapper
          onSubmit={onSubmit}
          className={`create-traffic-form ${load && "loading"}`}
          hide={hide}
        >
          <div className="create-traffic-form__content">
            <DelayInputComponent
              label="Введите имя сайта"
              name="siteName"
              value={siteName}
              autoComplete="off"
              debounceTimeout={600}
              handleChange={handleChangeInput}
              errorMessage={errors.siteName}
            />
            <DelayInputComponent
              label="Введите ссылку"
              name="siteUrl"
              value={siteUrl}
              autoComplete="off"
              debounceTimeout={600}
              handleChange={handleChangeInput}
              errorMessage={errors.siteUrl}
            />
          </div>
          <StyledButton
            type="submit"
            color="success"
            className="create-traffic-form__button"
            weight="normal"
          >
            Сохранить
          </StyledButton>
        </StyledFormWrapper>
      </StyledLoadingWrapper>
    </StyledHiddenForm>
  );
};

export default TrafficReportsForm;
