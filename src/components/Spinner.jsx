import React from "react";
import "./Spinner.css";

const Spinner = () => {
  return (
    <div className="bunny-spinner-container">
      <div className="bunny">
        <div className="ear ear-left"></div>
        <div className="ear ear-right"></div>
        <div className="head">
          <div className="face"></div>
        </div>
      </div>
      <div className="loading-text">Loading...</div>
    </div>
  );
};

export default Spinner;
