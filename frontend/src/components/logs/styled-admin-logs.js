import styled from "styled-components";

const colorRole = {
  status: String
}

const styleRole = (role) => {
  switch (role) {
    case 'Admin':
      return `
        background-color: #FF5B5B;
    `;
    case 'Manager':
      return `
        background-color: #FFA800;
    `;
    case 'Seo':
      return `
        background-color: #FFA800;
    `;
    case 'SystemEvent':
      return `
        background-color: #8c8c8c;
    `;
    default:
      return `
        background-color: #465798;
    `;
  }
}

export const StyledAdminLogsWrapper = styled.div`
  .admin-logs-title {
    margin: 0;
    padding: 20px 0;
  }
  .admin-logs-table {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid ${({theme}) => theme.defaultColor};
    &__head, &__row {
      grid-template-columns: 125px minmax(150px, 350px) 100px minmax(225px, 1fr) 160px 125px;
    }
    &__role, &__level {
      display: inline-grid;
      justify-content: start;
    }
    &__email {
      word-break: break-word;
    }
    &__message p {
      opacity: 0.55;
      word-break: break-word;
    }
    &__row {
      @media screen and (max-width: 992px) {
        margin: 15px 0;
        background-color: ${({theme}) => theme.bgElements};
        border-radius: 10px;
        grid-template-columns: repeat(2, 1fr);
        grid-template-areas: 'email email'
                             'role levelAction'
                             'message message'
                             'ip date';
      }
    }
    @media screen and (max-width: 992px) {
      margin-top: 15px;
      padding-top: 0;
      &__role {
        grid-area: role;
      }
      &__email {
        grid-area: email;
      }
      &__level {
        grid-area: levelAction;
      }
      &__message {
        grid-area: message;
      }
      &__ip {
        grid-area: ip;
      }
      &__date{
        grid-area: date;
      }
    }
  }
`;


export const StyledLogsRole = styled('div', colorRole)`
  padding: 2px 6px;
  color: #fff;
  font-weight: 700;
  border-radius: 5px;
  ${({role}) => styleRole(role)};
`;

export const StyledLogsLevel = styled.div`
  padding: 2px 6px;
  color: #fff;
  font-weight: 600;
  background-color: ${({level}) => level === "ERROR" ? "#FF5B5B" : level === "#FFA800" ? "yellow" : "#465798"};
  border-radius: 5px;
`;