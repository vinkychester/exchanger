import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { NavLink } from "react-router-dom";

import AlertMessage from "../../components/alert/alert.component";
import Spinner from "../spinner/spinner.component";
import DelayInputComponent from "../input-group/delay-input-group";
import ClientDetailsRegistrationType from "./client-details-registration-type.component";

import { StyledButton } from "../styles/styled-button";
import {
  StyledBlockText,
  StyledBlockTitle,
  StyledInfoBlock,
} from "../styles/styled-info-block";

import { CREATE_USER_RELATION } from "../../graphql/mutations/referral-user-relation.mutation";
import { GET_REFERRAL_RELATION } from "../../graphql/queries/referral-user-relation.query";
import { closableNotificationWithClick } from "../notification/closable-notification-with-click.component";
import { parseUuidIRI } from "../../utils/response";

const ClientDetailsInviter = ({ id, registrationType, trafficLink }) => {
  const clientId = parseUuidIRI(id);
  const [email, setEmail] = useState("");
  const [referralId, setId] = useState("");
  const [type, setType] = useState(registrationType);

  const { data, loading, error } = useQuery(GET_REFERRAL_RELATION, {
    variables: {
      invitedUserUUID: clientId,
    },
    onCompleted: (data) => {
      if (data) {
        const { collection } = data.referralUserRelations;
        if (collection.length !== 0) {
          const { email, id } = collection[0].client;
          setEmail(email);
          setId(id);
        }
      }
    },
  });

  const [createUserRelation] = useMutation(CREATE_USER_RELATION, {
    onCompleted: () => {
      setType("referral");
      closableNotificationWithClick(
        "Вы указали связь по реферальной программе",
        "success"
      );
    },
  });

  const handleApply = () => {
    createUserRelation({
      variables: {
        inviterEmail: email,
        invitedUserID: clientId,
      },
    });
  };

  if (loading) return <Spinner color="#EC6110" type="moonLoader" size="20px" />;
  if (error) return <AlertMessage type="error" message={error.message} />;
  if (!data) return <AlertMessage type="warning" message="Not found." />;

  return (
    <>
      <StyledInfoBlock className="add-referral">
        <StyledBlockTitle>Тип регистрации:</StyledBlockTitle>
        {/* <StyledBlockText>{type}</StyledBlockText> */}
        <ClientDetailsRegistrationType
          type={type}
          referralId={referralId}
          trafficLink={trafficLink}
        />
        <StyledInfoBlock>
          <StyledBlockTitle>Реферал от:</StyledBlockTitle>
          <DelayInputComponent
            id="email"
            type="email"
            placeholder={"abc@gmail.com"}
            name="email"
            value={email}
            handleChange={(event) => setEmail(event.target.value.trim())}
            debounceTimeout={600}
            disabled={registrationType === "referral"}
            required
          />
          {type && type !== "referral" && (
            <StyledButton
              size="small"
              className="add-referral__btn"
              color="success"
              weight="normal"
              onClick={handleApply}
            >
              Сохранить
            </StyledButton>
          )}
        </StyledInfoBlock>
      </StyledInfoBlock>
    </>
  );
};

export default ClientDetailsInviter;
