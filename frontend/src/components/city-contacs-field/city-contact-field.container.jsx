import React from "react";
import CityContactFieldForm from "./city-contact-field-form.component";
import CityContactsFieldsList from "./city-contacts-fields-list.component";

const CityContactFieldContainer = () => {

  //TODO: Add type on fields
  return (
    <>
      <CityContactFieldForm />
      <CityContactsFieldsList />
    </>
  )
}

export default CityContactFieldContainer