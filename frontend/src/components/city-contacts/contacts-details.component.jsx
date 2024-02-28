import React, { useEffect, useState } from "react";
import { GET_PUBLIC_CITY_CONTACTS } from "../../graphql/queries/city-contact.query";
import { useQuery } from "@apollo/react-hooks";
import { LazyLoadImage } from 'react-lazy-load-image-component';

import Spinner from "../spinner/spinner.component";
import AlertMessage from "../alert/alert.component";

import { StyledContactsDetails } from "../../pages/contacts/styled-contacts";

const ContactDetails = ({ checkedCity, checkedType }) => {
  const [cityContact, setCityContact] = useState(null);

  const { data, error, loading } = useQuery(GET_PUBLIC_CITY_CONTACTS, {
    fetchPolicy: "network-only"
  });

  useEffect(() => {
    if (data) {
      if (checkedType === "bank") {
        setCityContact(data.cityContacts.collection.find(cityContact => cityContact?.city === null));
        return;
      }
      if (checkedType === "cash" && checkedCity) {
        setCityContact(data.cityContacts.collection.find(cityContact => cityContact.city?.id === checkedCity.split('_')[0]));
      }
    }
  }, [checkedCity, checkedType, data]);

  if (loading) return <Spinner color="#EC6110" type="moonLoader" size="50px" />;
  if (error) return <AlertMessage type="error" message={error.message} />;
  if (!data) return <></>;

  const { collection } = data.cityContacts;

  if (!collection.length)
    return <AlertMessage type="info" message="Контакты не добавлены" margin="15px 0" />;

  return (
    <StyledContactsDetails>
      {cityContact &&
        <div>
          {cityContact.city &&
            <div className="city-icon">
              <LazyLoadImage
                src={`/cities/${cityContact.city.transliteName}.svg`}
                alt={cityContact.city.transliteName}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/cities/Default.svg";
                }} />
            </div>}
          <b>
            {cityContact.city ? cityContact.city.name : "Безналичный расчет"}
          </b>
          <div className="contact-details">
            {cityContact.cityContactFieldValues.map(cityContactFieldValue => (
              cityContactFieldValue.value.length > 0 &&
              <a
                key={cityContactFieldValue.id}
                href={cityContactFieldValue.value}
                target="_blank"
                rel="noreferrer"
                className="contact-details__item"
              >
                <span className={`icon-${cityContactFieldValue.cityContactField.name.toLowerCase()}`} />
              </a>
            ))}
          </div>
        </div>
      }

    </StyledContactsDetails>
  );
};

export default ContactDetails;