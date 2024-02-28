import React from "react";
import UserRating from "./user-rating.component";

import { StyledUserStatisticsWrapper } from "../../pages/account/styled-account";

const UserStatistics = () => {
  return (
    <StyledUserStatisticsWrapper>
      <h4>Статистика:</h4>
      <div className="statistics-data">
        Выполенных обменов: <span>2</span>
      </div>
      <div className="statistics-data">
        Сумма обменов: <span>1001.53086 USD</span>
      </div>
      <div className="statistics-data">
        Рейтинг: <UserRating rating="1" />
      </div>
      <div className="statistics-data">
        Персональный кешбэк: <span>0.05%</span>
      </div>
    </StyledUserStatisticsWrapper>
  );
};

export default UserStatistics;
