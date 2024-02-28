import styled from 'styled-components';

export const StyledDirectionType = styled.div`
  padding-left: 18px;
  color: ${({type}) => (type === 'purchase' || type === 'payment') ? '#1FC173' : '#FF5B5B'};
  text-transform: lowercase;
  display: inline-flex;
  align-items: center;
  position: relative;
  &:before {
    content:  '${({type}) => (type === 'purchase' || type === 'payment') ? '\\e909' : '\\e908'}';
    font-family: 'theme-icon', serif;
    position: absolute;
    top: 4px;
    left: 0;
  }
`;