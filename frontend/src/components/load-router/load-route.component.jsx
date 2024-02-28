import React, { useEffect, useMemo } from "react";
import { Route } from "react-router-dom";
import nprogress from "nprogress";

import "nprogress/nprogress.css";

const LoadRouteComponent = (props) => {
  useMemo(() => {
    nprogress.start();
  }, []);

  useEffect(() => {
    nprogress.done();
    // nprogress.start();
    // return () => nprogress.done();
  }, []);

  return <Route {...props} />;
};

export default React.memo(LoadRouteComponent);
