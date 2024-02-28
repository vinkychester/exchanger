import React from "react";
import AdministrationItem from "./administration-item.component";
import Spinner from "../spinner/spinner.component";
import AlertMessage from "../alert/alert.component";
import { StyledAdministrationList } from "./styled-administration-page";

const AdministrationList = ({ data, error, loadingData, discr, type }) => {

  if (loadingData || !data) return <Spinner color="#EC6110" type="moonLoader" size="50px" />;
  if (error) return <AlertMessage type="error" message={error.message} />;
  if (!data) return <AlertMessage type="warning" message="Not found." />;

  const { collection } = data.users;

  if (!collection.length) {
    return <AlertMessage type="warning" message="Записи отсутствуют." margin="15px 0" />;
  }

  return (
    <StyledAdministrationList>
      {collection && collection.map(({ ...user }, key) => (
        <AdministrationItem
          key={key}
          user={user}
          discr={discr}
          type={type}
        />
      ))}
    </StyledAdministrationList>
  );
};

export default AdministrationList;
