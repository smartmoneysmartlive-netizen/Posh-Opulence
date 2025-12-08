import React from "react";

const Preloader = () => {
  return (
    <div className="preloader-container">
      <div className="preloader-content">
        <img
          src="/images/logo.jpeg"
          alt="Posh Opulence Logo"
          className="preloader-logo"
        />
        <h1 className="preloader-title">Posh Opulence</h1>
        <p className="preloader-subtitle">Mutual Funds, since 2022</p>
      </div>
    </div>
  );
};

export default Preloader;
