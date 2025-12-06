import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            width: "auto",
            padding: "0.8rem",
            background: "var(--bg-surface-raised)",
            color: "var(--text-primary)",
            boxShadow: "none",
          }}
        >
          <FaArrowLeft />
        </button>
        <h1 className="page-title" style={{ margin: 0 }}>
          About Us
        </h1>
      </div>

      <div className="package-card" style={{ cursor: "default" }}>
        <div className="package-content" style={{ lineHeight: 1.6 }}>
          <h2 style={{ marginTop: 0, color: "var(--primary-accent)" }}>
            Posh Opulence Mutual Funds
          </h2>
          <p style={{ color: "var(--text-secondary)" }}>
            Since 2023, Posh Opulence Mutual Fund has offered a platform that
            acts as a large aggregator of mutual funds online, providing retail
            investors access to a wide range of funds from various professional
            fund managers.
          </p>

          <h3>Professional Management</h3>
          <p style={{ color: "var(--text-secondary)" }}>
            All funds available on the platform are managed by experienced fund
            managers who handle the buying and selling of commodities and
            currencies online and offline to meet the fund's objectives.
          </p>

          <h3>Diversification and Risk Management</h3>
          <p style={{ color: "var(--text-secondary)" }}>
            Investing in a mutual fund on Posh Opulence Mutual Funds provides
            instant diversification because your money is pooled with that of
            other investors to fund a variety of investments, which helps to
            reduce risk.
          </p>

          <h3>Accessibility and Affordability</h3>
          <p style={{ color: "var(--text-secondary)" }}>
            The platform democratizes access to investments by offering low
            minimum investment amounts, starting from as little as ₦15,000 for
            Naira funds and $10 for Dollar funds.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
