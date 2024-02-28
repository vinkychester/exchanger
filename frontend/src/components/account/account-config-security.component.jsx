import React, { useContext, useState } from "react";
import { useMutation, useApolloClient } from "@apollo/react-hooks";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Checkbox from "rc-checkbox";

import Spinner from "../spinner/spinner.component";
import AlertMessage from "../alert/alert.component";

import { StyledGoogleSecurity } from "../../pages/account/styled-account";

import { GET_USER_RBAC_DETAILS } from "../../graphql/queries/user.query";
import { SET_AUTHENTICATOR_SECRET } from "../../graphql/queries/user.query";
import { GET_CLIENT_ACCOUNT_DETAILS } from "../../graphql/queries/account.query";
import { UserAccountContext } from "../../pages/account/account.component";
import TwoFactorModalComponent from "../google-login/two-factor-modal.component";
import { closableNotificationWithClick } from "../notification/closable-notification-with-click.component";

const AccountConfigSecurity = () => {
  const { user } = useContext(UserAccountContext);
  const [visible, setVisible] = useState(false);
  const [twoFactor, setTwoFactor] = useState(user.googleAuthenticatorSecret);

  const client = useApolloClient();

  const { userId, userRole } = client.readQuery({
    query: GET_USER_RBAC_DETAILS,
  });

  const [setAuthenticatorSecret, { loading }] = useMutation(
    SET_AUTHENTICATOR_SECRET,
    {
      onCompleted: () => {
        closableNotificationWithClick(
          "Двухэтапная аутентификация " +
          (twoFactor ? "включена" : "отключена"),
          "success"
        );
      },
      refetchQueries: [
        {
          query: GET_CLIENT_ACCOUNT_DETAILS,
          variables: { id: `/api/${userRole}s/${userId}` },
          fetchPolicy: "network-only",
        },
      ],
    }
  );

  if (loading) return <Spinner color="#EC6110" type="moonLoader" size="35px" />;

  const onChange = (event) => {
    setVisible(true);
    setTwoFactor(event.target.checked);
  };

  return (
    <StyledGoogleSecurity>
      {visible && (
        <TwoFactorModalComponent
          visible={visible}
          setVisible={setVisible}
          setAuthenticatorSecret={setAuthenticatorSecret}
          user={user}
          twoFactor={twoFactor}
        />
      )}
      <h3 className="security-title">Двухэтапная аутентификация</h3>
      <AlertMessage
        type="info"
        margin="15px 0"
        className="security-description"
        message={
          <>
            <p>Используйте приложение для двухэтапной аутентификации.</p>
            <p>
              Authenticator представляет 6 или 8 значный одноразовый цифровой
              пароль, который пользователь должен предоставить в дополнение к
              имени пользователя и пароля, чтобы войти в аккаунт.
            </p>
            <b>
              Установить Google Authenticator на ваш смартфон можно из магазина
              приложений:{" "}
            </b>
            <ul>
              <li>
                <a
                  className="default-link"
                  href="https://apps.apple.com/ru/app/google-authenticator/id388497605"
                  target="_blank"
                  rel="noreferrer"
                >
                  Apple App Store;
                </a>
              </li>
              <li>
                <a
                  className="default-link"
                  href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=ru"
                  target="_blank"
                  rel="noreferrer"
                >
                  Google Play Market.
                </a>
              </li>
            </ul>
          </>
        }
      />
      {!user.googleAuthenticatorSecret ? (
        <AlertMessage
          type="warning"
          margin="15px 0"
          message="Двухэтапная аутентификация не используется"
        />
      ) : (
        <AlertMessage
          type="success"
          margin="15px 0"
          message="Двухэтапная аутентификация включена"
        />
      )}
      <div className="use-security">
        <Checkbox
          id="googleAuth"
          className="default-checkbox"
          checked={!!user.googleAuthenticatorSecret}
          onChange={onChange}
          name="checkedB"
        />
        <label htmlFor="googleAuth">Использовать для входа в аккаунт</label>
      </div>
      {user.googleAuthenticatorSecret && (
        <div className="security-code">
          <h4>{user.googleAuthenticatorSecret}</h4>
          <p>
            Ваш секретый код, используйте его в приложении Google Authenticator.
          </p>
          <LazyLoadImage
            className="google-auth__image"
            src={user.googleAuthQrCode}
            alt={user.googleAuthenticatorSecret} />
        </div>
      )}
    </StyledGoogleSecurity>
  );
};

export default AccountConfigSecurity;
