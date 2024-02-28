import React, { useState } from "react";
import Checkbox from "rc-checkbox";
import { useMutation } from "@apollo/react-hooks";
import { getUUID } from "../../utils/calculator.utils";
import Confirmation from "../confirmation/confirmation";
import ContactFieldItem from "./contact-field-item.component";
import AlertMessage from "../alert/alert.component";
import { closableNotificationWithClick } from "../notification/closable-notification-with-click.component";
import { StyledCheckboxLabel, StyledCheckboxWrapper } from "../styles/styled-checkbox";
import { StyledCol, StyledRow } from "../styles/styled-table";
import { DISABLE_CITY } from "../../graphql/mutations/citites.mutation";
import { CREATE_UPDATE_CITY_CONTACT_FIELD_VALUE } from "../../graphql/mutations/city-contact-field-value.mutation";
import { UPDATE_CITY_CONTACT } from "../../graphql/mutations/city-contact.mutation";

const CityContactItem = ({ cityContact, cityFieldsList, editMode }) => {
  const [publishConfirmation, setPublishConfirmation] = useState(false);
  const [disableConfirmation, setDisableConfirmation] = useState(false);
  const [disableCity, setDisableCity] = useState(cityContact?.city?.disable);
  const [existedFields, setExistedFields] = useState(cityContact?.cityContactFieldValues);
  const [isPublic, setIsPublic] = useState(cityContact?.isPublic ?? null);

  const [createUpdateCityContactFieldValue] = useMutation(CREATE_UPDATE_CITY_CONTACT_FIELD_VALUE, {
    onCompleted: data => {
      setIsPublic(data?.createUpdateCityContactFieldValue?.cityContactFieldValue?.cityContact?.isPublic);
    }
  });
  const [updateCityContact] = useMutation(UPDATE_CITY_CONTACT, {
    onCompleted: () => {
      setIsPublic(!isPublic);
      closableNotificationWithClick("Настройки публикации измененны", "success");
    }
  });
  const [updateCityDisable] = useMutation(DISABLE_CITY, {
    onCompleted: () => {
      setDisableCity(!disableCity);
      closableNotificationWithClick("Активность города " + cityContact?.city?.name + " успешно изменена", "success");
    }
  });

  const handleChangeInput = ({ event }) => {
    createUpdateCityContactFieldValue({
      variables: {
        cityID: cityContact.city ? getUUID(cityContact.city.id) : "bank",
        fieldID: +event.target.id,
        fieldValue: event.target.value
      }
    });
    closableNotificationWithClick("Контакт изменен", "success");
  };

  const handleChangeInPublic = () => {
    updateCityContact({
      variables: {
        input: {
          id: cityContact.id,
          isPublic: !isPublic
        }
      }
    });
  };
  const handleChangeDisable = () => {
    updateCityDisable({
      variables: {
        id: cityContact?.city?.id,
        disable: !disableCity
      }
    });
  };

  return (
    <React.Fragment key={cityContact.id}>
      {publishConfirmation && <Confirmation
        handler={handleChangeInPublic}
        question={"Вы действительно хотите изменить значение публикации для город?"}
        visible={publishConfirmation}
        setVisible={setPublishConfirmation}
      />}
      <Confirmation
        handler={handleChangeDisable}
        question={"Вы действительно хотите изменить активность города " + cityContact?.city?.name + " ?"}
        visible={disableConfirmation}
        setVisible={setDisableConfirmation}
      />
      <StyledRow scroll="auto" col={cityFieldsList.length + 3} className="contact-fields-table__row">
        <StyledCol data-title="Активность" className="contact-fields-table__activity">
          <div className="city__name">
            {cityContact.city?.name ?? "Безналичный расчет"}
          </div>
        </StyledCol>
        {cityFieldsList && cityFieldsList.map((field, key) =>
          <StyledCol data-title="Город" className="contact-fields-table__field" key={key}>
            <ContactFieldItem
              field={field}
              existedFields={existedFields}
              handleChangeInput={handleChangeInput}
              disabled={!editMode}
            />
          </StyledCol>
        )}
        {isPublic !== null
          ? <StyledCol data-title="Публикация" className="contact-fields-table__public">
            <StyledCheckboxWrapper>
              <Checkbox
                id={cityContact.id}
                className="default-checkbox"
                onChange={() => setPublishConfirmation(true)}
                value={cityContact.id}
                checked={isPublic}
                disabled={!editMode}
              />
              <StyledCheckboxLabel position="right" htmlFor={cityContact.id}>
                Публикация
              </StyledCheckboxLabel>
            </StyledCheckboxWrapper>
          </StyledCol>
          : cityFieldsList.length > 0
            ? <AlertMessage type="info" message="Заполните хотябы 1 поле для публикации" />
            : <AlertMessage type="warning" message="Добавьте мессенджер" />}
        {cityContact.city ?
          <StyledCol data-title="Активность" className="contact-fields-table__activity">
            <StyledCheckboxWrapper>
              <Checkbox
                id={cityContact.city.id}
                className="default-checkbox"
                onChange={() => setDisableConfirmation(true)}
                value={cityContact.id}
                checked={!disableCity}
                disabled={!editMode}
              />
              <StyledCheckboxLabel position="right" htmlFor={cityContact.city.id}>
                {disableCity ? "Отключить" : "Включить"} город
              </StyledCheckboxLabel>
            </StyledCheckboxWrapper>
          </StyledCol> : <></>
        }
      </StyledRow>

    </React.Fragment>
  );
}

export default CityContactItem;