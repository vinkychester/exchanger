import React, { useState } from "react";
import SelectType from "./select-type.component";
import SelectCity from "./select-city.component";
import { feedbackTypeCons } from "../../../utils/feedback-status";
import FeedbackForm from "./feedback-form.component";
import ContactDetails from "../../city-contacts/contacts-details.component";

import { StyledContactsForm } from "../../../pages/contacts/styled-contacts";

const ContactsFormContainer = () => {
  const [checkedType, setCheckedType] = useState();
  const [checkedCity, setCheckedCity] = useState();
  const showCity = (type) => {
    switch (type) {
      case feedbackTypeCons.CASH: {
        return true;
      }
      case feedbackTypeCons.BANK: {
        return false;
      }
    }
  };

  return (
    <StyledContactsForm>
      <div className="contact-form-align">
        <SelectType
          checkedType={checkedType}
          setCheckedType={setCheckedType}
          setCheckedCity={setCheckedCity}
        />
        {showCity(checkedType) &&
        <SelectCity
          checkedCity={checkedCity}
          setCheckedCity={setCheckedCity}
        />}

        <div className="contacts-wrapper">
          <ContactDetails checkedCity={checkedCity} checkedType={checkedType} />
          <div className="contacts-wrapper__work-time">
            <p>
              Пн.—Пт. с 10:00 до 18:00.
            </p>
            <p>
              Сб.—Вск. свободный график.
            </p>
          </div>
        </div>
      </div>
      <FeedbackForm
        checkedType={checkedType}
        setCheckedType={setCheckedType}
        checkedCity={checkedCity}
        setCheckedCity={setCheckedCity}
      />
    </StyledContactsForm>
  );

};

export default ContactsFormContainer;
