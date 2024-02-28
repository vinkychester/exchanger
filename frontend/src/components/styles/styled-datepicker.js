import styled from "styled-components";

export const StyledDatepicker = styled.div`
  display: grid;
  grid-template-columns: 100%;
  .react-date-picker__wrapper {
    padding: 4px 10px;
    border: 1px solid ${({theme}) => theme.defaultColor};
    border-radius: 5px;
    cursor: pointer;
    input, span {
      font-size: 16px;
    }
    button {
      margin: 3px;
      padding: 3px;
      background-color: ${({theme}) => theme.hoverColor};
      border: 1px solid ${({theme}) => theme.hoverShadow};
      border-radius: 3px;
      outline: none;
      svg {
        height: 14px;
        stroke: ${({theme}) => theme.defaultColor};
      }
      &:hover, &:focus {
        svg {
          stroke: ${({theme}) => theme.defaultColor} !important;
        }
      }
      &:active {
        transform: scale(0.95);
      }
    }
  }
  .react-calendar {
    background-color: ${({theme}) => theme.bgElements};
    border-radius: 5px;
    border: 1px solid ${({theme}) => theme.borderElements};
    .react-calendar__navigation__arrow,
    .react-calendar__navigation__label,
    .react-calendar__tile {
      color: ${({theme}) => theme.text};
      &:hover {
        background-color: ${({theme}) => theme.hoverColor};
        border-radius: 3px;
      }
    }
    .react-calendar__month-view__days__day--weekend {
      color: #FF5B5B;
    }
    .react-calendar__tile--now, .react-calendar__tile--active {
      border-radius: 3px;
    }
    .react-calendar__tile--now {
      background-color: ${({theme}) => theme.hoverShadow};
    }
    .react-calendar__tile--active {
      color: #fff;
      background-color: ${({theme}) => theme.defaultColor};
    }
    .react-calendar__navigation button:enabled:hover, .react-calendar__navigation button:enabled:focus {
      background-color: ${({theme}) => theme.hoverColor};
    }
    .react-calendar__navigation button[disabled] {
      background-color: inherit;
      opacity: 0.5;
    }
  }
`;

export const StyledDatepickerLabel = styled.label`
  margin-bottom: 5px;
  font-size: 16px;
  font-weight: 700;
`;