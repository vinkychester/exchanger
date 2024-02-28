import React, { useCallback } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { Helmet } from "react-helmet-async";
import ReactHtmlParser from "react-html-parser";
import Tooltip from "rc-tooltip";

import BreadcrumbItem from "../../components/breadcrumb/breadcrumb-item";
import NewsActualItem from "../../components/news/news-actual-item.component";
import PageSpinner from "../../components/spinner/page-spinner.component";
import ImageMedia from "../../components/media/ImageMedia";
import AlertMessage from "../../components/alert/alert.component";
import NewsCryptoRate from "../../components/news/news-crypto-rate.component";

import { StyledContainer } from "../../components/styles/styled-container";
import { StyledBreadcrumb } from "../../components/styles/styled-breadcrumb";
import { StyledButton } from "../../components/styles/styled-button";
import {
  StyledNewsDetailsAside,
  StyledNewsDetailsBody,
  StyledNewsDetailsContent,
  StyledNewsDetailsHead,
  StyledNewsDetailsTitle,
  StyledNewsDetailsWrapper,
  StyledNewsRates,
  StyledNewsDetailsFooter,
} from "../../components/news/styled-news-details";

import {
  GET_POST_DETAILS,
  GET_POSTS_USER_ACTUAL,
} from "../../graphql/queries/posts.query";
import { generateUrl, getInverseDirection } from "../../utils/calculator.utils";
import { ImageMediaLink } from "../../utils/imageMediaLink.util";

const NewsDetailsPage = ({ match }) => {
  const metaUrl = match.params.metaUrl;
  let history = useHistory();

  const { data, loading, error } = useQuery(GET_POST_DETAILS, {
    variables: { metaUrl },
  });
  const {
    data: actualPosts,
    loading: loadingActual,
    error: errorActual,
  } = useQuery(GET_POSTS_USER_ACTUAL, {
    variables: {
      page: 1,
      itemsPerPage: 4,
    },
    fetchPolicy: "network-only"
  });

  const handleRedirectOnCalculator = useCallback((crypto, fiat, direction) => {
    const inverseDirection = getInverseDirection(direction);
    const fiatUrl = generateUrl(fiat, inverseDirection);
    const cryptoUrl = generateUrl(crypto, direction);
    const url =
      "payment" === direction
        ? `${cryptoUrl}-${fiatUrl}`
        : `${fiatUrl}-${cryptoUrl}`;

    history.push({
      pathname: "/" + url,
      state: {
        amount: 1,
        direction: direction,
        fiatCurrency:
          ("payment" === direction ? "payout" : "payment") +
          fiat.paymentSystem.name +
          fiat.currency.asset.replace(/\s+/g, ""),
        // fiatCurrency:
        cryptoCurrency:
          ("payment" === direction ? "payment" : "payout") +
          crypto.paymentSystem.name +
          crypto.currency.asset.replace(/\s+/g, ""),
      },
    });
  });

  if (loading || loadingActual) return <PageSpinner />;
  if (error || errorActual) return <StyledContainer><AlertMessage type="error" message="Error"/></StyledContainer>;

  let { collection } = actualPosts.posts;
  collection = collection.filter((item) => item.metaUrl !== metaUrl);

  const { collection: postCollection } = data.collectionQueryPosts;

  const post = postCollection[0];

  const {
    metaTitle,
    metaDescription,
    title,
    createdAt,
    mediaObjects,
    imageDescription,
    pairUnits,
    prevElement,
    nextElement,
  } = post;

  const {collection: pairsCollection} = pairUnits;

  return (
    <StyledContainer>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta content={ImageMediaLink(mediaObjects, 1)} property="og:image" />
        <meta content="article" property="og:type" />
      </Helmet>
      <StyledNewsDetailsWrapper className="article-details">
        <StyledNewsDetailsHead className="article-details__head">
          <StyledBreadcrumb>
            <BreadcrumbItem as={NavLink} to="/" title="Главная" />
            <BreadcrumbItem as={NavLink} to="/news" title="Статьи" />
            <BreadcrumbItem as="span" title={title} />
          </StyledBreadcrumb>
          <StyledNewsDetailsTitle>{title}</StyledNewsDetailsTitle>
          <p className="article-details__date">
            {new Date(createdAt * 1000).toLocaleDateString()}
          </p>
          <div className="article-details__image">
            <ImageMedia
              alt={imageDescription}
              mediaObjects={mediaObjects}
              index={0}
            />
          </div>
        </StyledNewsDetailsHead>
        <StyledNewsDetailsBody>
          <StyledNewsDetailsContent>
            {ReactHtmlParser(post.content)}
            <StyledNewsDetailsFooter>
              {prevElement !== null && (
                <StyledButton className="perv" as={NavLink} to={`/news/${prevElement}`}>
                  Предыдущая статья
                </StyledButton>
              )}
              {nextElement !== null && (
                <StyledButton className="next" as={NavLink} to={`/news/${nextElement}`}>
                  Следующая статья
                </StyledButton>
              )}
            </StyledNewsDetailsFooter>
          </StyledNewsDetailsContent>
          <StyledNewsDetailsAside className="article-aside">
            {pairUnits && pairsCollection.length !== 0 &&
            <h5 className="article-aside__title">
              Динамика <span>курса</span>
            </h5>}
            {pairUnits && pairsCollection.length !== 0 ? (
              pairsCollection.map((pairUnit) => (
                pairUnit.paymentPairs.collection.length !== 0 ? (
                  <React.Fragment key={pairUnit.id}>
                    <StyledNewsRates>
                      <div className="dynamic-rates">
                        <div className="dynamic-rates__crypto crypto">
                          <div
                            className={`exchange-icon-${pairUnit.paymentSystem.subName}`}
                          />
                          <div className="crypto__name">
                            {pairUnit.paymentSystem.name}
                          </div>
                          <Tooltip
                            placement="top"
                            overlay={
                              <span>
                            {pairUnit.paymentSystem.name} (
                                {pairUnit.currency.asset})
                          </span>
                            }
                          >
                            <span className="icon-info"></span>
                          </Tooltip>
                        </div>
                        <div className="dynamic-rates__direction">Покупка</div>
                        <div className="dynamic-rates__direction">Продажа</div>
                      </div>
                      { pairUnit.paymentPairs.collection.map((payment) => (
                        <NewsCryptoRate
                          payment={payment}
                          pairUnit={pairUnit}
                          key={payment.id}
                          handleRedirectOnCalculator={handleRedirectOnCalculator}
                        />
                      ))}
                    </StyledNewsRates>
                  </React.Fragment>
                ) : null
              ))
            ) : null}
            <h5 className="article-aside__title">
              Актуальные <span>статьи</span>
            </h5>
            {collection.length !== 0 ? (
              collection.map((post, index) => {
                if (index < 3) {
                  return <NewsActualItem key={index} post={post} />;
                }
              })
            ) : (
              <AlertMessage
                type="warning"
                message="Актуальные статьи отсутствуют."
              />
            )}
          </StyledNewsDetailsAside>
        </StyledNewsDetailsBody>
      </StyledNewsDetailsWrapper>
    </StyledContainer>
  );
};

export default React.memo(NewsDetailsPage);
