import React from 'react';
import { StyledLoadingSidebar, StyledShowSidebar } from '../styled-sidebar';
import Spinner from '../../spinner/spinner.component';

const SidebarButtonSkeleton = ({text, type}) => {
  return (
    <StyledLoadingSidebar type={type}>
      <StyledShowSidebar className="sidebar-btn loading-sidebar">
        <div className="sidebar-btn__icon loading-sidebar__icon">
          {/*<span className="icon-bar"/>*/}
          <Spinner color="#EC6110" type="moonLoader" size="14px"/>
        </div>
        <div className="sidebar-btn__title">{text}</div>
      </StyledShowSidebar>
    </StyledLoadingSidebar>
  );
};

export default SidebarButtonSkeleton;