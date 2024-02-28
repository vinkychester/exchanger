import React from "react";
import { StyledFormWrapper } from "../../styles/styled-form";
import LoadButton from "../../spinner/button-spinner.component";
import SkeletonInput from "../../skeleton/skeleton-input";
import SelectSkeleton from "../../skeleton/skeleton-select";

const PairFormSkeleton = ({hideCreateForm}) => {
  return (
     <StyledFormWrapper
       className="create-pair-form"
       hide={hideCreateForm}
     >
       <div className="create-pair-form__content">
         <SelectSkeleton optionWidth="55" label="Отдаю" />
         <SelectSkeleton optionWidth="55" label="Получаете" />
         <SkeletonInput className="create-pair-form__percent" />
       </div>
       <LoadButton
         color="success" text="Сохранить"
       />
     </StyledFormWrapper>
  );
};
export default PairFormSkeleton;