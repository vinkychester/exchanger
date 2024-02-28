import React, { useCallback, useContext, useEffect, useState } from "react";
import { StyledFormWrapper, StyledHiddenForm } from "../styles/styled-form";
import { StyledButton } from "../styles/styled-button";
import { StyledLoadingWrapper } from "../spinner/styled-spinner";
import InputGroupComponent from "../input-group/input-group.component";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { GET_CITY_CONTACT_FIELDS_LIST } from "../../graphql/queries/city-contact-filed.query";
import { StyledCheckboxLabel, StyledCheckboxWrapper } from "../styles/styled-checkbox";
import Checkbox from "rc-checkbox";
import CitySelectForCityContacts from "./city-select-for-city-contacts.component";
import { CREATE_VALUES_CITY_CONTACT_FIELD_VALUE } from "../../graphql/mutations/city-contact-field-value.mutation";
import { getUUID } from "../../utils/calculator.utils";
import { closableNotificationWithClick } from "../notification/closable-notification-with-click.component";
import { GET_ALL_CITIES_WITHOUT_CITY_CONTACTS } from "../../graphql/queries/cities.query";
import { GET_BANK_CITY_CONTACT, GET_CITY_CONTACTS } from "../../graphql/queries/city-contact.query";
import { CityContactsFilterContext } from "./city-contacs.container";
import PaymentTypeSelect from "../feedback/contact-form/payment-type-select.component";
import FragmentSpinner from "../spinner/fragment-spinner.component";

const CityContactForm = ({ cityContactFields, hideForm, setHideForm, editMode, setEditMode}) => {
  // const [hide, setHide] = useState(true);
  const [checkedCity, setCheckedCity] = useState();
  const [checkedType, setCheckedType] = useState();
  const [contacts, setContacts] = useState({});
  const [isPublic, setIsPublic] = useState(false);
  const [loadForm, setLoadForm] = useState(false);

  const { filter } = useContext(CityContactsFilterContext);
  const { page, itemsPerPage, ...props } = filter;
  
  // const itemsPerPage = 10;
  const currentPage = page ? parseInt(page) : 1;

  const [bankExist, setBankExist] = useState(false);
  const { data, error, loading } = useQuery(GET_BANK_CITY_CONTACT, {
    fetchPolicy: "network-only"
  });

  useEffect(() => {
    if (data) {
      setBankExist(!!data.cityContacts.collection.length);
      if (data.cityContacts.collection.length) {
        setCheckedType("cash");
      }
    }
  }, [data]);

  const [createCityContactValues] = useMutation(CREATE_VALUES_CITY_CONTACT_FIELD_VALUE, {
    refetchQueries: [
      { query: GET_ALL_CITIES_WITHOUT_CITY_CONTACTS },
      { query: GET_CITY_CONTACT_FIELDS_LIST },
      {
        query: GET_CITY_CONTACTS,
        variables: {
          ...props,
          itemsPerPage: itemsPerPage ? +itemsPerPage : 50,
          page: currentPage,
        }
      },
      { query: GET_BANK_CITY_CONTACT }
    ]
  });

  const handleChangeInput = useCallback(
    (event) => {
      const { name, value } = event.target;
      setContacts(prevState => ({ ...prevState, [name]: value }));
    });

  const onSubmit = (event) => {
    event.preventDefault();
    setLoadForm(true);

    createCityContactValues({
      variables: {
        cityID: checkedType === "cash" ? getUUID(checkedCity) : "bank",
        contactNames: Object.keys(contacts),
        contactValues: Object.values(contacts),
        isPublic
      }
    }).then(data => {
      closableNotificationWithClick("Контакты добавлены", "success");
      setContacts({});
      setIsPublic(false);
      setLoadForm(false);
    });
  };

  return (
    <>
      <div className="contacts-head">
        <StyledButton
          type="button"
          color="main"
          onClick={() => {
            setHideForm(!hideForm);
          }}
        >
          Создать контакты
        </StyledButton>

        <StyledButton
          title={`Режим редактировния ${editMode ? "включен" : "выключен"}`}
          type="button"
          color={editMode ? "success" : "danger"}
          onClick={() => {
            setEditMode(!editMode);
          }}
        >
          <span className="icon-edit" />
        </StyledButton>
      </div>
      <StyledHiddenForm className="hidden-create-contact-form">
        {hideForm === false &&
        <StyledLoadingWrapper className="loading-create-contact-form">
          {loadForm && <FragmentSpinner position="center" />}
          <StyledFormWrapper
            onSubmit={onSubmit}
            className={`create-contact-form ${loadForm && "loading"}`}
            hide={hideForm}
          >
            <div className="create-contact-form__content">
              {!bankExist && <PaymentTypeSelect
                checkedType={checkedType}
                setCheckedType={setCheckedType}
              />}
              {/*CitySelect*/}
              {checkedType === "cash"
              && <CitySelectForCityContacts checkedCity={checkedCity} setCheckedCity={setCheckedCity} />}
              {cityContactFields.map(({ id, name }, key) =>
                <InputGroupComponent
                  key={key}
                  handleChange={handleChangeInput}
                  placeholder={`${name}`}
                  name={`${name}`}
                  type="text"
                  value={contacts.hasOwnProperty(name) ? contacts[name] : ""}
                  label={`${name}`}
                  className="create-contact-form__field"
                />)
              }
              <StyledCheckboxWrapper className="create-contact-form__public">
                <Checkbox
                  id={"isPublic"}
                  className="default-checkbox"
                  checked={isPublic}
                  value={isPublic}
                  onChange={() => setIsPublic(!isPublic)
                  }
                />
                <StyledCheckboxLabel position="right" htmlFor={"isPublic"}>
                  Публикация
                </StyledCheckboxLabel>
              </StyledCheckboxWrapper>
            </div>
            <StyledButton
              type="submit"
              color="success"
              className="create-contact-form__button"
              weight="normal"
              disabled={!checkedType}
            >
              Сохранить
            </StyledButton>
          </StyledFormWrapper>
        </StyledLoadingWrapper>}
      </StyledHiddenForm>
    </>
  );
};

export default CityContactForm;