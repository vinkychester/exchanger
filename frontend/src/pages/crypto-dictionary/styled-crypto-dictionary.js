import styled from "styled-components";

export const StyledCryptoDictionaryWrapper = styled.div`
  padding: 20px 0;
  .crypto-dictionary__title {
    margin-bottom: 0;
    padding: 25px 0;
    text-align: center;
  }
`;

export const StyledDictionaryItemHead = styled.div`
  height: 65px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  background-color: ${({theme}) => theme.body};;
  border-bottom: 1px solid ${({theme}) => theme.borderElements};
  position: sticky;
  top: 55px;
  @media screen and (max-width: 992px) {
    top: 0;
  }
`;

export const StyledDictionaryHeadItemCurrent = styled.div`
  width: 50px;
  margin-right: 5px;
  text-align: center;
  color: ${({theme}) => theme.defaultColor};
  font-size: 30px;
  font-weight: 700;
  border-right: 1px solid ${({theme}) => theme.borderElements};
`;

export const StyledDictionaryHeadItemList = styled.ul`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .item a {
    padding: 0 5px;
    font-weight: 700;
    opacity: 0.85;
    &:hover {
      color: ${({theme}) => theme.defaultColor};
    }
  }
  .current a {
    color: ${({theme}) => theme.defaultColor};
    opacity: 1;
  }
`;

export const StyledDictionaryItem = styled.div`
  padding-bottom: 15px;
  text-align: justify;
  &:last-child {
    padding-bottom: 0;
  }
  h2 {
    padding: 0;
    margin: 0;
    color: ${({theme}) => theme.defaultColor};
    font-size: 16px;
    display: inline-block;
  }
  a {
    color: ${({theme}) => theme.defaultColor};
  }
`;