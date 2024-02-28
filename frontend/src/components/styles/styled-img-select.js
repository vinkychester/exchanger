import styled from 'styled-components';

export const StyledSelect = styled.div`
  cursor: pointer;
  .custom-select-img, .custom-select, .custom-multiselect {
    z-index: 1;
    width: 100%;
    border: 1px solid ${({theme}) => theme.defaultColor};
    border-radius: 5px;
    overflow: hidden;
    .option-select-item {
      width: calc(100% - 30px);
      color: ${({theme}) => theme.text};
      font-size: 14px;
      display: flex;
      align-items: center;
      text-transform: uppercase;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      [class^='exchange-icon-'], [class*='exchange-icon-'] {
        padding-right: 10px;
      }
      b {
        padding-right: 5px;
      }
    }
  }
  
  .custom-multiselect {
    .rc-select-selection-item {
      margin: 5px;
      padding: 0 5px;
      display: inline-flex;
      background-color: ${({theme}) => theme.hoverColor};
      border: 1px solid ${({theme}) => theme.hoverShadow};
      border-radius: 3px;
      &:hover {
        .option-select-item {
          color: ${({theme}) => theme.defaultColor};
        }
      }
      /*&:first-child {
        margin-left: 10px;
      }*/
      .rc-select-selection-item-content {
        width: 100%;
      }
    }
    .option-select-item {
      width: 100%;
    }
  }
  
  .custom-select {
    .option-select-item {
      text-transform: inherit;
    }
  }
  .rc-select-arrow {
    height: 100%;
    z-index: -1;
    .rc-select-arrow-icon {
      border: none;
      position: relative;
      top: 4px;
      left: -5px;
      margin: 0;
      &:before {
        content: '\\e910';
        height: 16px;
        width: 16px;
        color: ${({theme}) => theme.defaultColor};
        font-size: 12px;
        font-family: 'theme-icon', serif;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background-color: ${({theme}) => theme.hoverColor};
        border: 1px solid ${({theme}) => theme.hoverShadow};
        border-radius: 3px;
      }
    }
  }
  .rc-select-selection-item-remove-icon {
    margin-left: 5px;
    color: ${({theme}) => theme.defaultColor};
    opacity: 0.85;
    &:hover {
      opacity: 1;
    }
  }
  .rc-select-selection-search {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    
    .rc-select-selection-search-input {
      width: 100%;
      height: 100%;
      padding: 0 10px;
      color: ${({theme}) => theme.text};
      background-color: transparent;
    }
  }
  .rc-select-open .rc-select-arrow .rc-select-arrow-icon:before {
    content: '\\e913';
  }
`;

export const StyledSelectLabel = styled.div`
  margin-bottom: 5px;
  font-size: 16px;
  font-weight: 700;
`;