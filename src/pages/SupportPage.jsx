import React from "react";
import {
  FaWhatsapp,
  FaTelegram,
  FaMoon,
  FaSun,
  FaInfoCircle,
  FaEnvelope,
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";

const WHATSAPP_LINK = "https://wa.me/message/CKIA5RNAIG4WB1";
const TELEGRAM_LINK = "https://t.me/Poshopulencemutualfunds";
const SUPPORT_EMAIL = "poshopulenceglobal@gmail.com";

const SupportPage = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      <h1 className="page-title">Support & Settings</h1>

      <div className="package-card">
        <div className="package-content">
          <h3>Contact Support</h3>
          <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>
            Have questions or need assistance? Reach out to our support team.
          </p>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            <button
              style={{
                marginBottom: "1rem",
                background: "#25D366",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              <FaWhatsapp size={20} />
              Contact on WhatsApp
            </button>
          </a>
          <a
            href={TELEGRAM_LINK}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            <button
              style={{
                background: "#0088cc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              <FaTelegram size={20} />
              Contact on Telegram
            </button>
          </a>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            <button
              style={{
                background: "var(--bg-surface-raised)",
                color: "var(--text-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              <FaEnvelope size={20} />
              Send an Email
            </button>
          </a>
        </div>
      </div>

      <div className="package-card">
        <div className="package-content">
          <h3>Application Info</h3>
          <Link to="/about" style={{ textDecoration: "none" }}>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                background: "var(--bg-surface-raised)",
                color: "var(--text-primary)",
                marginBottom: "1rem",
              }}
            >
              <FaInfoCircle size={20} />
              About Posh Opulence
            </button>
          </Link>

          <button
            onClick={toggleTheme}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              background: "var(--bg-surface-raised)",
              color: "var(--text-primary)",
            }}
          >
            {theme === "light" ? <FaMoon size={20} /> : <FaSun size={20} />}
            Switch to {theme === "light" ? "Dark" : "Light"} Mode
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
