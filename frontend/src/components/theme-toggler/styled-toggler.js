import styled from 'styled-components';
import bgImg from '../../assets/images/sun-or-moon.svg'

export const StyledToggler = styled.button`
    height: 22px;
    width: 40px;
    padding: 0;
    background-image: url('${bgImg}');
    background-repeat: no-repeat;
    background-size: 80%;
    background-position: 35% 55%;
    background-color: transparent;
    border: 1px solid #EC6110;
    border-radius: 12px;
    outline: none;
    cursor: pointer;
    position: relative;
    &:after {
      content: '';
      height: 18px;
      width: 18px;
      background-color: #EC6110;
      border-radius: 50%;
      position: absolute;
      top: 1px;
      left: ${({theme}) => theme.switchPosition};
      transition: all .1s ease;
    }
`;
