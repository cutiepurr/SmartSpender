import React from "react";

const SquareStickyLeftContainer = (props) => (
  <div
    className="float-start px-2 bg-white border-end sticky-left"
    {...props}
    style={{ width: 50, height: 50, zIndex: 2 }}
  >
    {props.children}
  </div>
);

export default SquareStickyLeftContainer;
