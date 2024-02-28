import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import PageSpinner from "../spinner/page-spinner.component";
import BreadcrumbItem from "../breadcrumb/breadcrumb-item";
import { NavLink } from "react-router-dom";
import ReactHtmlParser from "react-html-parser";
import { Helmet } from "react-helmet-async";
import Title from "../title/title.component";
import AlertMessage from "../alert/alert.component";
import TopExchangeContainer from "../top-exchange/top-exchange.container";

import { GET_CITY_DESCRIPTION_BY_CITY_URL } from "../../graphql/queries/cities-description.query";

import { StyledContainer } from "../styles/styled-container";
import { StyledCityDetails } from "../../pages/cities/styled-cities";
import { StyledBreadcrumb } from "../styles/styled-breadcrumb";
import { StyledHtmlParserWrapper } from "../styles/styled-html-parser";

const CityDescription = ({ cityUrl }) => {
  const [meta, setMeta] = useState({});

  const { data, loading, error } = useQuery(GET_CITY_DESCRIPTION_BY_CITY_URL, {
    fetchPolicy: "network-only",
    variables: { cityUrl: cityUrl },
    onCompleted: data => {
      if (data.cityDescriptions.length > 0) {
        setMeta({
          title: data.cityDescriptions[0].metaTitle,
          description: data.cityDescriptions[0].metaDescription
        });
      }
    }
  });

  if (loading) return <PageSpinner />;
  if (error) return <AlertMessage type="error" message={error.message} />;
  if (!data) return <></>;

  if (!data.cityDescriptions.length) return <AlertMessage type="warning" message="City not found" />;

  const {
    cityName,
    description
  } = data.cityDescriptions[0];

  return (
    <StyledContainer>
      <Helmet>
        <title>{meta.title}</title>
        <meta
          name="description"
          content={meta.description}
        />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <StyledCityDetails>
        <div className="city-details__head">
          <Title
            as="h1"
            title={cityName}
            className="city-details__title"
          />
          <StyledBreadcrumb>
            <BreadcrumbItem
              as={NavLink}
              to="/"
              title="Главная"
            />
            <BreadcrumbItem
              as={NavLink}
              to="/cities"
              title="Города"
            />
            <BreadcrumbItem
              as="span"
              title={cityName}
            />
          </StyledBreadcrumb>
        </div>
        <div className="city-details__content">
          <StyledHtmlParserWrapper>
            {ReactHtmlParser(description)}
          </StyledHtmlParserWrapper>
        </div>
        <div className="city-details__top-exchange top-exchange">
          <Title
            as="div"
            title="Топ самых популярных направлений обмена"
            description="Рейтинг"
            className="top-exchange__title"
          />
          <TopExchangeContainer />
        </div>
      </StyledCityDetails>


    </StyledContainer>
  );
};

export default CityDescription;