import styled from 'styled-components';

export const StyledSkeletonBg = styled.div`
  ${({width}) => width ? `width: ${width}%` : 'width: 100%'};
  height: ${({height}) => height !== '100' ? (height + 'px') : '100%'};
  background-color: ${({color, theme}) => color === 'theme' ? theme.skeletonBg : theme.hoverColor};
  ${({border}) => border === 'orange' && 'border: 1px solid rgba(236,97,16,0.07)'};
  ${({borderRadius}) => borderRadius && `border-radius: ${borderRadius}px`};
  display: block;
  overflow: hidden;
  position: relative;
  &:first-child {
    ${({first, theme}) => first && `
     background-color: ${theme.hoverColor};
     &::after {
       background: linear-gradient(90deg, transparent, rgba(215, 90, 50, 0.06), transparent);
     }
    `}
  }
  &::after {
    content: '';
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: absolute;
    animation: load 1.4s linear 0.5s infinite;
    transform: translateX(-100%);
    background: ${({color, theme}) => color === 'theme' ? theme.skeletonBgGradient : 'linear-gradient(90deg, transparent, rgba(215, 90, 50, 0.06), transparent)'};
  }

  @keyframes load {
    0% {
      transform: translateX(-100%);
    }
    60% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(100%);
    }
  }

`;