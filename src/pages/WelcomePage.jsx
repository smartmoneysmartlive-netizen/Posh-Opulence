import React from "react";
import { FaRocket, FaChartLine, FaShieldAlt } from "react-icons/fa";

const WelcomePage = ({ onComplete }) => {
  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1 className="welcome-title">Welcome to Posh Opulence</h1>
        <p className="welcome-subtitle">
          Your journey to financial growth starts now. Invest in a sustainable
          collection of Mutual Funds with consistent dividends.
        </p>

        <div className="welcome-features">
          <div className="welcome-feature">
            <div className="welcome-feature-icon">
              <FaChartLine />
            </div>
            <div className="welcome-feature-text">
              <h4>Watch Your Money Grow</h4>
              <p>Track your investment performance in real-time.</p>
            </div>
          </div>
          <div className="welcome-feature">
            <div className="welcome-feature-icon">
              <FaRocket />
            </div>
            <div className="welcome-feature-text">
              <h4>Effortless Investing</h4>
              <p>Choose a plan and let our professionals do the work.</p>
            </div>
          </div>
          <div className="welcome-feature">
            <div className="welcome-feature-icon">
              <FaShieldAlt />
            </div>
            <div className="welcome-feature-text">
              <h4>Secure & Transparent</h4>
              <p>Your funds are managed with the utmost security.</p>
            </div>
          </div>
        </div>

        <div className="welcome-cta">
          <button onClick={onComplete}>Get Started</button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
