import styled from 'styled-components';

export const StyledBreadcrumb = styled.ul`
  ${({mt}) => mt && `margin-top: ${mt}px`};
  ${({mb}) => mb && `margin-bottom: ${mb}px`};
  display: flex;
  span {
    color: ${({theme}) => theme.defaultColor};
    opacity: 1;
  }
`;
export const StyledBreadcrumbItem = styled.li`
  padding-right: 25px;
  white-space: nowrap;
  position: relative;
  &:after {
    content: '\\e912';
    color: ${({theme}) => theme.defaultColor};
    font-family: 'theme-icon', serif;
    position: absolute;
    top: 3px;
    right: 8px;
  }
  &:last-child {
    max-width: 120px;
    width: 100%;
    padding-right: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    &:after {
      display: none;
    }
  }
`;
export const StyledBreadcrumbLink = styled.button`
  opacity: 0.4;
  transition: all .1s ease;
  &:hover {
    color: ${({theme}) => theme.defaultColor};
    opacity: 1;
  }
`;