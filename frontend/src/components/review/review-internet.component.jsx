import React from "react";
import AliceCarousel from "react-alice-carousel";
import ReviewsFromInternetItem from "./review-internet-item";
import "react-alice-carousel/lib/alice-carousel.css";

import { StyledReviewsInternet } from "./styled-reviews";

import bestchange from "../../assets/images/reviews/bestchange.png";
import cryptobrokers from "../../assets/images/reviews/cryptobrokers_u.png";
import bits_media from "../../assets/images/reviews/bits_media.png";
import forum_bits_media from "../../assets/images/reviews/forum_bits_media.png";
import glazok_org from "../../assets/images/reviews/glazok_org.png";
import kurs_expert from "../../assets/images/reviews/kurs_expert.png";
import mmgp_com from "../../assets/images/reviews/mmgp_com.png";
import mmgp_ru from "../../assets/images/reviews/mmgp_ru.png";
import mywot_com from "../../assets/images/reviews/mywot_com.png";
import okchanger_ru from "../../assets/images/reviews/okchanger_ru.png";
import otzyvua_net from "../../assets/images/reviews/otzyvua_net.png";
import searchengines_guru from "../../assets/images/reviews/searchengines_guru.png";
import trustorg_com from "../../assets/images/reviews/trustorg_com.png";
import trustpilot_com from "../../assets/images/reviews/trustpilot_com.png";
import virtuozi_com from "../../assets/images/reviews/virtuozi_com.png";
import webproverka_com from "../../assets/images/reviews/webproverka_com.png";

const ReviewsFromInternet = () => {

  const SampleNextArrow = () => {return <span className="icon-chevron-right" />;};

  const SamplePrevArrow = () => { return <span className="icon-chevron-left" />; };

  const items = [
    <ReviewsFromInternetItem
      link="https://www.bestchange.ru/coin24-exchanger.html"
      image={bestchange}
    />,
    <ReviewsFromInternetItem
      link="https://cryptobrokers.ru/coin24-info/"
      image={cryptobrokers}
    />,
    <ReviewsFromInternetItem
      link="https://bits.media/exchanger/coin24-com-ua"
      image={bits_media}
    />,
    <ReviewsFromInternetItem
      link="https://forum.bits.media/index.php?/topic/160802-coin24comua-обменяйте-любые-виды-криптовалют/&tab=comments#comment-1910806"
      image={forum_bits_media}
    />,
    <ReviewsFromInternetItem
      link="https://glazok.org/exchange/?details=868"
      image={glazok_org}
    />,
    <ReviewsFromInternetItem
      link="https://kurs.expert/ru/obmennik/coin24-com-ua/feedbacks.html"
      image={kurs_expert}
    />,
    <ReviewsFromInternetItem
      link="https://mmgp.com/threads/coin24-com-ua-obmenivajte-kriptovaljutu-momentalno.648010/#post16999190"
      image={mmgp_com}
    />,
    <ReviewsFromInternetItem
      link="https://mmgp.ru/showthread.php?t=706174&highlight=coin24.com.ua"
      image={mmgp_ru}
    />,
    <ReviewsFromInternetItem
      link="https://www.mywot.com/scorecard/coin24.com.ua"
      image={mywot_com}
    />,
    <ReviewsFromInternetItem
      link="https://www.okchanger.ru/exchangers/COIN24"
      image={okchanger_ru}
    />,
    <ReviewsFromInternetItem
      link="https://www.otzyvua.net/coin24comua"
      image={otzyvua_net}
    />,
    <ReviewsFromInternetItem
      link="https://searchengines.guru/ru/forum/1029944"
      image={searchengines_guru}
    />,
    <ReviewsFromInternetItem
      link="https://trustorg.com/site/coin24.com.ua"
      image={trustorg_com}
    />,
    <ReviewsFromInternetItem
      link="https://www.trustpilot.com/review/coin24.com.ua"
      image={trustpilot_com}
    />,
    <ReviewsFromInternetItem
      link="https://virtuozi.com/threads/coin24-com-ua-obmenjajte-momentalno-ljubye-vidy-kriptovaljut.523656/"
      image={virtuozi_com}
    />,
    <ReviewsFromInternetItem
      link="https://webproverka.com/domain.php?coin24.com.ua"
      image={webproverka_com}
    />
  ];

  const responsive = {
    0: {
      items: 1
    },
    768: {
      items: 2
    },
    992: {
      items: 4
    }
  };

  return (
    <StyledReviewsInternet className="reviews-internet">
      <h4 className="reviews-internet__title">
        Отзывы в Интернете
      </h4>
      <div className="reviews-internet-content">
        <AliceCarousel
          responsive={responsive}
          mouseTracking
          items={items}
          renderNextButton={SampleNextArrow}
          renderPrevButton={SamplePrevArrow}
        />
      </div>
    </StyledReviewsInternet>
  );
};

export default ReviewsFromInternet;