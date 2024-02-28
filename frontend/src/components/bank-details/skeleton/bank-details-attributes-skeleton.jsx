import React from "react";

import SkeletonInput from "../../skeleton/skeleton-input";
import LoadButton from "../../spinner/button-spinner.component";

const BankDetailsAttrSkeleton = () => {
  return (
    <>
      <SkeletonInput width="10" label="skeleton" className="bank-details-form__input"/>
      <LoadButton text="Сохранить" color="success"/>
    </>
  );
};

export default BankDetailsAttrSkeleton;