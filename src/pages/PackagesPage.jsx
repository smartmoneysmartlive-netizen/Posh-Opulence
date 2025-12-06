import React, { useState, useEffect } from "react";
import { getPackages, selectPackage } from "../api";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { FaCheck, FaClock, FaChartLine, FaMoneyBillWave } from "react-icons/fa";

const InvestmentModal = ({ pkg, onConfirm, onCancel }) => {
  const [amount, setAmount] = useState(pkg.min_price.toString());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleConfirm = async () => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      showToast("Please enter a valid amount.", "error");
      return;
    }
    if (numericAmount < pkg.min_price) {
      showToast(
        `Amount must be at least ₦${pkg.min_price.toLocaleString()}`,
        "error"
      );
      return;
    }
    if (pkg.max_price && numericAmount > pkg.max_price) {
      showToast(
        `Amount cannot exceed ₦${pkg.max_price.toLocaleString()}`,
        "error"
      );
      return;
    }
    setIsSubmitting(true);
    await onConfirm(pkg, numericAmount);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Invest in {pkg.name}</h2>
        <p style={{ color: "var(--text-secondary)", textAlign: "center" }}>
          This plan's range is ${pkg.min_price_usd.toLocaleString()} to{" "}
          {pkg.max_price_usd
            ? `$${pkg.max_price_usd.toLocaleString()}`
            : "Unlimited"}
          .
        </p>
        <div
          style={{
            textAlign: "center",
            padding: "0.5rem",
            background: "var(--bg-surface-raised)",
            borderRadius: "8px",
            border: "1px solid var(--border-color)",
            marginBottom: "1rem",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "0.9rem",
              color: "var(--text-secondary)",
            }}
          >
            Current Rate: <strong>$1 = ₦1,500</strong>
          </p>
        </div>
        <p
          style={{
            color: "var(--text-primary)",
            textAlign: "center",
            marginTop: 0,
          }}
        >
          Please enter your desired investment amount in Naira (NGN).
        </p>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter Investment Amount (NGN)"
          style={{
            fontSize: "1.5rem",
            textAlign: "center",
            fontWeight: "bold",
          }}
        />
        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            onClick={onCancel}
            style={{ backgroundColor: "#555" }}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button onClick={handleConfirm} disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Continue to Payment"}
          </button>
        </div>
      </div>
    </div>
  );
};

const PackagesPage = ({ user }) => {
  const [packages, setPackages] = useState([]);
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const packagesRes = await getPackages();
        setPackages(packagesRes.data);
      } catch (error) {
        showToast("Failed to load page data.", "error");
      }
    };
    fetchData();
  }, [showToast]);

  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg);
    setShowInvestmentModal(true);
  };

  const handleConfirmInvestment = async (pkg, amount) => {
    try {
      const res = await selectPackage(user.id, pkg.id, amount);
      const userPackageId = res.data.user_package_id;
      navigate(`/payment/${userPackageId}`, {
        state: { pkg: { ...pkg, investment_amount: amount } },
      });
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to select package.",
        "error"
      );
    }
  };

  const getDisplayDuration = (duration) => {
    if (duration === 14) return 10;
    return duration;
  };

  return (
    <div className="app-container">
      <h1 className="page-title">Investment Plans</h1>
      <p
        style={{
          color: "var(--text-secondary)",
          fontSize: "1rem",
          marginBottom: "2rem",
          textAlign: "center",
          lineHeight: "1.4",
        }}
      >
        Choose the perfect plan for your financial goals.
      </p>

      {packages.map((p) => (
        <div key={p.id} className="package-card">
          <div className="package-image-container">
            <img src={p.image_url} alt={p.name} className="package-image" />
            <div className="package-badge">{p.dividend_percentage}% ROI</div>
          </div>

          <div className="package-content">
            <h3>{p.name} Plan</h3>

            <div className="package-highlight">
              <div className="package-highlight-label">Expected Dividend</div>
              <div className="package-highlight-value">
                {p.dividend_percentage}%
              </div>
            </div>

            <div className="package-stats">
              <div className="package-stat">
                <span className="package-stat-label">
                  <FaClock style={{ marginRight: "0.25rem" }} />
                  Duration
                </span>
                <span className="package-stat-value">
                  {getDisplayDuration(p.duration_days)} days
                </span>
              </div>

              <div className="package-stat">
                <span className="package-stat-label">
                  <FaChartLine style={{ marginRight: "0.25rem" }} />
                  Min. Amount
                </span>
                <span className="package-stat-value">
                  ${p.min_price_usd.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="package-range">
              <div className="package-range-title">
                <FaMoneyBillWave style={{ marginRight: "0.5rem" }} />
                Investment Range (USD)
              </div>
              <div className="package-range-values">
                <span className="package-range-amount">
                  ${p.min_price_usd.toLocaleString()}
                </span>
                <span className="package-range-separator">→</span>
                <span className="package-range-amount">
                  {p.max_price_usd
                    ? `$${p.max_price_usd.toLocaleString()}`
                    : "Unlimited"}
                </span>
              </div>
            </div>

            <ul className="package-features">
              <li className="package-feature">
                <FaCheck className="package-feature-icon" />
                {p.dividend_percentage}% returns in{" "}
                {getDisplayDuration(p.duration_days)} days
              </li>
              <li className="package-feature">
                <FaCheck className="package-feature-icon" />
                Flexible investment amounts
              </li>
              <li className="package-feature">
                <FaCheck className="package-feature-icon" />
                Secure and transparent process
              </li>
            </ul>

            <div className="package-cta">
              <button onClick={() => handleSelectPackage(p)}>
                Start Investing Now
              </button>
            </div>
          </div>
        </div>
      ))}

      {showInvestmentModal && selectedPackage && (
        <InvestmentModal
          pkg={selectedPackage}
          onConfirm={handleConfirmInvestment}
          onCancel={() => setShowInvestmentModal(false)}
        />
      )}
    </div>
  );
};

export default PackagesPage;
