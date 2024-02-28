import React from 'react';
import {func, string} from 'prop-types';

import {StyledToggler} from './styled-toggler';


const Toggle = ({theme, toggleTheme}) => {
    return (
        <StyledToggler onClick={toggleTheme} title={theme === 'light' ? 'Ночная тема' : 'Дневная тема'}/>
    )
};

Toggle.protoTypes = {
    theme: string.isRequired,
    toggleTheme: func.isRequired
}

export default Toggle;