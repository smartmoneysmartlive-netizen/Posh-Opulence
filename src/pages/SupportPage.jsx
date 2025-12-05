import React from "react";
import { FaWhatsapp, FaTelegram, FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

const WHATSAPP_NUMBER = "1234567890";
const TELEGRAM_USERNAME = "YourAdminUsername";

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
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
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
            href={`https://t.me/${TELEGRAM_USERNAME}`}
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
              }}
            >
              <FaTelegram size={20} />
              Contact on Telegram
            </button>
          </a>
        </div>
      </div>

      <div className="package-card">
        <div className="package-content">
          <h3>Theme Settings</h3>
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
