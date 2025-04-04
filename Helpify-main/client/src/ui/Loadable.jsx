/* eslint-disable react/display-name */
import React, { Suspense } from "react";

const Loadable = (Component) => (props) => (
  <Suspense fallback={<div id="preloader"></div>}>
    <Component {...props} />
  </Suspense>
);

export default Loadable;
