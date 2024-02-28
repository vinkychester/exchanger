import React, { useState } from "react";
import Pagination from "rc-pagination";

// import "rc-pagination/assets/index.css";
import Spinner from "../spinner/spinner.component";

const CustomPagination = ({ currentPage, onPaginationPageChange, ...otherProps }) => {

  const [current, setCurrent] = useState(currentPage);

  const handleChange = (page) => {
    setCurrent(page);
    onPaginationPageChange(page);
  };

  if (otherProps.loading) {
    return <Spinner color="#EC6110" display="block" size="50px" />;
  }

  return (
    <Pagination
      className="default-pagination"
      onChange={handleChange}
      current={current}
      {...otherProps}
    />
  );
};
export default CustomPagination;
