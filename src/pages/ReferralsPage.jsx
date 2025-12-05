import React, { useState, useEffect } from "react";
import { getUserReferrals } from "../api";
import { useToast } from "../context/ToastContext";

// This is the object Telegram injects into the window
const tg = window.Telegram.WebApp;

const ReferralsPage = ({ user }) => {
  const [referrals, setReferrals] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    getUserReferrals(user.id).then((res) => setReferrals(res.data));
  }, [user.id]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    showToast("Copied to clipboard!", "info");
  };

  if (!referrals) return <div>Loading...</div>;

  // You should replace YOUR_BOT_USERNAME with your actual bot's username
  const referralLink = `https://t.me/YOUR_BOT_USERNAME/app?startapp=${referrals.referral_code}`;

  return (
    <div>
      <h1 className="page-title">Referral Program</h1>
      <div className="package-card">
        <div className="package-content">
          <h3>Your Referral Link</h3>
          <p style={{ color: "var(--text-secondary)" }}>
            Share this link with friends. You get a 2% commission on the first
            successful investment of every new member you invite.
          </p>
          <input
            type="text"
            readOnly
            value={referralLink}
            onClick={() => handleCopy(referralLink)}
            style={{ cursor: "pointer", textAlign: "center" }}
          />
          <button onClick={() => handleCopy(referralLink)}>Copy Link</button>
        </div>
      </div>

      <div className="package-card">
        <div className="package-content">
          <h3>Your Referrals</h3>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              textAlign: "center",
              marginBottom: "1rem",
            }}
          >
            <div>
              <p style={{ margin: 0, color: "var(--text-secondary)" }}>
                Total Referrals
              </p>
              <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold" }}>
                {referrals.referrals.length}
              </p>
            </div>
            <div>
              <p style={{ margin: 0, color: "var(--text-secondary)" }}>
                Commission Earned
              </p>
              <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold" }}>
                ₦{referrals.commission_earned.toLocaleString()}
              </p>
            </div>
          </div>
          {referrals.referrals.length > 0 && (
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                maxHeight: "200px",
                overflowY: "auto",
              }}
            >
              {referrals.referrals.map((ref) => (
                <li
                  key={ref.id}
                  style={{
                    background: "var(--bg-surface-raised)",
                    padding: "0.5rem 1rem",
                    borderRadius: "8px",
                    marginBottom: "0.5rem",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  {ref.first_name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReferralsPage;
