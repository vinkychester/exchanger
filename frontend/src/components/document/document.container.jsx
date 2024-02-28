import React from "react";
import { useQuery } from "@apollo/react-hooks";

import Spinner from "../spinner/spinner.component";
import AlertMessage from "../alert/alert.component";
import DocumentVerificationItem from "./document-verification-item.component";

import { GET_VERIFICATION_SCHEMAS } from "../../graphql/queries/verificationSchema.query";

import { StyledDocumentVerificationWrapper } from "../../pages/document/styled-document";

const DocumentContainer = () => {
  const { data, loading, error } = useQuery(GET_VERIFICATION_SCHEMAS);

  if (loading) return <Spinner color="#EC6110" type="moonLoader" size="35px" />;
  if (error) return <AlertMessage type="error" message={error.message} />;
  if (!data)
    return (
      <AlertMessage
        type="warning"
        message="Информация о пользователе недоступна"
      />
    );

  const { collection } = data.verificationSchemas;

  if (!collection.length)
    return (
      <AlertMessage
        type="info"
        message="Информация о верификации документов недоступна"
        margin="15px 0 0"
      />
    );

  return (
    <StyledDocumentVerificationWrapper>
      {collection.map(({ ...schema }, key) => (
        <DocumentVerificationItem schema={schema} key={key} />
      ))}
    </StyledDocumentVerificationWrapper>
  );
};

export default DocumentContainer;
