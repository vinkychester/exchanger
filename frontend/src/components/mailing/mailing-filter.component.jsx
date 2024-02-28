import React, { useContext, useState } from "react";
import { StyledButton } from "../styles/styled-button";
import {
  StyledFilterBlock,
  StyledFilterTitle,
  StyledFilterWrapper,
  StyledHiddenFilterAction
} from "../styles/styled-filter";
import { MailingFilterContext } from "../../pages/mailing/mailing.component";
import DelayInputComponent from "../input-group/delay-input-group";

const MailingFilter = ( { showForm } ) => {

  const { filter, handleChangeFilter, handleClearFilter } = useContext(MailingFilterContext);
  const [hideFilter, setHideFilter] = useState(!Object.keys(filter).length || ("page" in filter && Object.keys(filter).length === 1));
  const toggleFilter = () => {
    setHideFilter(!hideFilter);
  };

  const handleChangeInput = (event) => {
    const { name, value } = event.target;
    handleChangeFilter(name, value.trim());
  };

  const { title, message } = filter;

  return (
    <>
      <StyledHiddenFilterAction col="2">
        <StyledButton type="button" color="main" onClick={showForm}>
          Создать рассылку
        </StyledButton>

        <StyledButton
          type="button"
          title="Фильтр"
          weight="normal"
          onClick={toggleFilter}
        >
          <span className="icon-filter" /> Фильтр
        </StyledButton>
      </StyledHiddenFilterAction>
      <StyledFilterWrapper hide={hideFilter}>
        <StyledFilterTitle>Фильтровать по:</StyledFilterTitle>
        <StyledFilterBlock>
          <DelayInputComponent
            type="text"
            name="title"
            label="Заголовок"
            handleChange={handleChangeInput}
            value={title ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
          <DelayInputComponent
            type="text"
            name="message"
            label="Сообщение"
            handleChange={handleChangeInput}
            value={message ?? ""}
            debounceTimeout={600}
            autoComplete="off"
          />
        </StyledFilterBlock>
        <StyledFilterBlock actions>
          <StyledButton
            type="button"
            color="main"
            className="clear-filter"
            title="Очистить фильтр"
            weight="normal"
            onClick={handleClearFilter}
          >
            <span className="icon-trash" /> Очистить фильтр
          </StyledButton>
        </StyledFilterBlock>
      </StyledFilterWrapper>

    </>

  );
};

export default MailingFilter;