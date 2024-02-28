import React, { useState } from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useQuery } from "@apollo/react-hooks";
import axios from "axios";

import FragmentSpinner from "../spinner/fragment-spinner.component";
import InputGroupComponent from "../input-group/input-group.component";
import DialogTwoFactorConfirm from "../dialog/dialog-two-factor-confirm.component";

import { StyledGoogleSecurity } from "../../pages/account/styled-account";

import { GET_AUTHENTICATOR_SECRET } from "../../graphql/queries/user.query";
import { closableNotificationWithClick } from "../notification/closable-notification-with-click.component";
import { parseUuidIRI } from "../../utils/response";

const TwoFactorModalComponent = ({ visible, setVisible, setAuthenticatorSecret, user, twoFactor }) => {

  const [code, setCode] = useState("");
  const [QR, setQR] = useState({});
  const [loading, setLoading] = useState(false);

  const { loading: queryLoading } = useQuery(GET_AUTHENTICATOR_SECRET,
    {
      variables: { id: user.id },
      onCompleted: data => {
        setQR(data?.getAuthenticatorSecretClient);
      },
      fetchPolicy: "network-only"
    });

  const handleConfirm = () => {
    const data = {
      id: parseUuidIRI(user.id),
      code: code,
      tempSecret: QR.tempSecret,
      on: twoFactor
    };
    axios.post("google_two_factor_confirm", data, {
      baseURL: "/api/",
      headers: {
        "Content-Type": "application/json"
      }
    }).then(response => {
      if (response.status === 200) {
        if (twoFactor) {
          setAuthenticatorSecret({ variables: { id: user.id, secret: QR.tempSecret, QR: QR?.tempQRCode } });
        } else {
          setAuthenticatorSecret({ variables: { id: user.id, secret: "", QR: "" } });
        }
        setQR({});
        setVisible(false);
      }
      setLoading(false);
    }).catch(error => {
      if (error.response.status === 403) {
        closableNotificationWithClick("Неверный код подтверждения", "error");
      }
      if (error.response.status === 409) {
        setVisible(false);
        closableNotificationWithClick("Вы заблокированы. Обратитесь к администрации сайта для разблокировки", "error");
      }
      setLoading(false);
    });
  };

  return (
    <>
      {loading && <FragmentSpinner position="center" />}
      {visible && (
        <DialogTwoFactorConfirm
          visible={visible}
          userId={user.id}
          setAuthenticatorSecret={setAuthenticatorSecret}
          message={
            <DialogMessage
              code={code}
              setCode={setCode}
              QR={QR}
              twoFactor={twoFactor}
            />
          }
          title="Использование 2FA"
          setVisible={setVisible}
          handler={handleConfirm}
        />
      )}
    </>
  );

};
const DialogMessage = ({ code, setCode, QR, twoFactor }) => {
  return (
    <StyledGoogleSecurity className="security-modal">
      <p className="security-modal__message">{twoFactor ? "Отсканируйте QR код внутри мобильного приложения" : "Для отключения двухэтапной аутентификации"}</p>
      <InputGroupComponent
        type="text"
        autocomplete="off"
        label="Введите шестизначный код"
        value={code}
        handleChange={(event) => setCode(event.target.value)}
        className="security-modal__input"
        maxLength="6"
      />
      {twoFactor && (
        <div className="security-code security-modal__code">
          <h4>{QR?.tempSecret}</h4>
          <p>
            Ваш секретый код, используйте его в приложении Google Authenticator.
          </p>
          <LazyLoadImage
            className="google-auth__image"
            src={QR?.tempQRCode}
            alt={QR?.tempSecret} />
        </div>
      )}
    </StyledGoogleSecurity>
  );
};

export default TwoFactorModalComponent;