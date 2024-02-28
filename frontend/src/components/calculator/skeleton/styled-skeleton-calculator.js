import styled from 'styled-components';

export const StyledCalcSkeletonNavigation = styled.div`
  padding: 10px 0;
  display: grid;
  grid-gap: 15px;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: 1fr;
`;


export const StyledCalcSkeletonContent = styled.div`
  height: 240px;
  padding: 15px 0;
  display: grid;
  grid-gap: 5px;
  grid-template-rows: repeat(auto-fill, 1fr);
  border: 1px solid ${({theme}) => theme.defaultColor};
  border-radius: 10px;
  overflow-y: auto;
`;

export const StyledCalcSkeletonUser = styled.div`
  .user-alert span {
    display: inline-flex;
    align-items: center;
  }
`;