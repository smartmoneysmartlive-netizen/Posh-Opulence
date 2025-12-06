import React, { useState, useRef } from "react";
import {
  useParams,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { submitBankDetails, uploadPaymentProof, cancelSelection } from "../api";
import { useToast } from "../context/ToastContext";
import { FaCopy } from "react-icons/fa";

const BankTransferForm = ({ userPackageId, onComplete }) => {
  const [details, setDetails] = useState({
    depositor_name: "",
    depositor_bank: "",
    deposited_amount: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("ngn");
  const { showToast } = useToast();

  const handleCopy = (textToCopy, fieldName) => {
    navigator.clipboard.writeText(String(textToCopy));
    showToast(`${fieldName} copied!`, "info");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitBankDetails(userPackageId, details);
      showToast("Bank details submitted! Awaiting confirmation.", "success");
      onComplete();
    } catch (error) {
      showToast(error.response?.data?.message || "Submission failed", "error");
      setIsSubmitting(false);
    }
  };

  const renderDetail = (label, value) => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "0.75rem",
        borderBottom: "1px solid var(--border-color)",
        paddingBottom: "0.75rem",
        gap: "1rem",
      }}
    >
      <strong style={{ opacity: 0.8, fontSize: "0.9rem", flexShrink: 0 }}>
        {label}
      </strong>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span
          style={{
            fontWeight: "600",
            textAlign: "right",
            wordBreak: "break-all",
          }}
        >
          {value}
        </span>
        <button
          type="button"
          onClick={() => handleCopy(value, label)}
          style={{
            width: "auto",
            padding: "0.5rem 0.75rem",
            background: "var(--primary-accent)",
            minWidth: "auto",
            boxShadow: "none",
            flexShrink: 0,
          }}
        >
          <FaCopy />
        </button>
      </div>
    </div>
  );

  return (
    <div className="package-card" style={{ cursor: "default" }}>
      <div className="package-content">
        <h3 style={{ marginBottom: "1rem" }}>Bank Transfer Details</h3>
        <div
          style={{
            textAlign: "center",
            padding: "0.5rem",
            background: "var(--bg-surface-raised)",
            borderRadius: "8px",
            border: "1px solid var(--border-color)",
            marginBottom: "1.5rem",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "0.9rem",
              color: "var(--text-secondary)",
            }}
          >
            Exchange Rate: <strong>$1 = ₦1,500</strong>
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
          <button
            type="button"
            onClick={() => setActiveTab("ngn")}
            style={{
              flex: 1,
              background:
                activeTab === "ngn"
                  ? "var(--primary-accent)"
                  : "var(--bg-surface-raised)",
              color: activeTab === "ngn" ? "white" : "var(--text-primary)",
              boxShadow: "none",
            }}
          >
            NGN (Local)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("usd")}
            style={{
              flex: 1,
              background:
                activeTab === "usd"
                  ? "var(--primary-accent)"
                  : "var(--bg-surface-raised)",
              color: activeTab === "usd" ? "white" : "var(--text-primary)",
              boxShadow: "none",
            }}
          >
            USD (International)
          </button>
        </div>

        {activeTab === "ngn" && (
          <div>
            <h4
              style={{
                marginTop: 0,
                borderBottom: "2px solid var(--border-color)",
                paddingBottom: "0.5rem",
              }}
            >
              FCMB (NGN)
            </h4>
            {renderDetail("Account Name", "Posh Opulence Global Services")}
            {renderDetail("Account Number", "2006907533")}
            {renderDetail("Bank", "First City Monument Bank")}

            <h4
              style={{
                marginTop: "2rem",
                borderBottom: "2px solid var(--border-color)",
                paddingBottom: "0.5rem",
              }}
            >
              Wema Bank (NGN)
            </h4>
            {renderDetail("Account Name", "Posh Opulence Global Services")}
            {renderDetail("Account Number", "0127175911")}
            {renderDetail("Bank", "Wema Bank PLC")}
          </div>
        )}
        {activeTab === "usd" && (
          <div>
            <h4 style={{ marginTop: 0 }}>Beneficiary Bank Details</h4>
            {renderDetail("Beneficiary Name", "POSH OPULENCE GLOBAL SERVICES")}
            {renderDetail("Beneficiary Account", "0622074667")}
            {renderDetail("Currency", "USD")}
            {renderDetail("Bank Name", "WEMA BANK PLC")}
            {renderDetail("Bank SWIFT", "WEMANGLA")}
            {renderDetail("Bank Address", "LAGOS, NIGERIA")}

            <h4 style={{ marginTop: "2rem" }}>Intermediary (Routing) Bank</h4>
            {renderDetail("Bank Name", "JPMORGAN CHASE BANK")}
            {renderDetail("Bank SWIFT", "CHASUS33XXX")}
            {renderDetail("Bank Address", "NEW YORK, UNITED STATES")}
            {renderDetail("Wema Account No.", "700609251")}
          </div>
        )}

        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "0.9rem",
            marginTop: "2rem",
          }}
        >
          After making your transfer, please fill the form below to confirm your
          payment.
        </p>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <input
            placeholder="Depositor's Full Name"
            value={details.depositor_name}
            onChange={(e) =>
              setDetails({ ...details, depositor_name: e.target.value })
            }
            required
          />
          <input
            placeholder="Depositor's Bank"
            value={details.depositor_bank}
            onChange={(e) =>
              setDetails({ ...details, depositor_bank: e.target.value })
            }
            required
          />
          <input
            type="number"
            placeholder="Amount Sent"
            value={details.deposited_amount}
            onChange={(e) =>
              setDetails({ ...details, deposited_amount: e.target.value })
            }
            required
          />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Confirm Payment"}
          </button>
        </form>
      </div>
    </div>
  );
};

const CryptoPaymentForm = ({ userPackageId, onComplete }) => {
  const [proof, setProof] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { showToast } = useToast();

  const handleFileChange = (e) => setProof(e.target.files[0]);

  const handleConfirm = async () => {
    if (!proof) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("proof", proof);
      await uploadPaymentProof(userPackageId, formData);
      showToast("Proof submitted! Awaiting confirmation.", "success");
      onComplete();
    } catch (error) {
      showToast(error.response?.data?.message || "Upload failed", "error");
      setIsUploading(false);
    }
  };

  const handleCopy = (textToCopy, fieldName) => {
    navigator.clipboard.writeText(textToCopy);
    showToast(`${fieldName} copied!`, "info");
  };

  const cryptoAddresses = {
    "USDT TRC20": "TQjXKwzgG7aVbyJQgA7oVMh4Btogn5HCzd",
    BTC: "1Jc4TmXqqrp312tK8H7Jo4H3UkRj3k7kTq",
    "ETH (ERC20)": "0xe4753d1da8abd966b2d74165a86dcb72f1b87281",
  };

  const xrpDetails = {
    address: "rJn2zAPdFA193sixJwuFixRkYDUtx3apQh",
    memo: "500228042",
  };

  return (
    <div className="package-card" style={{ cursor: "default" }}>
      <div className="package-content">
        <h3 style={{ marginBottom: "1rem" }}>Crypto Payment</h3>
        <div
          style={{
            backgroundColor: "var(--bg-surface-raised)",
            padding: "1.25rem",
            borderRadius: "16px",
            fontSize: "0.9rem",
            lineHeight: "1.5",
            border: "1px solid var(--border-color)",
          }}
        >
          {Object.entries(cryptoAddresses).map(([name, address]) => (
            <div key={name} style={{ marginBottom: "1rem" }}>
              <strong>{name}:</strong>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "var(--bg-main)",
                  padding: "0.75rem",
                  borderRadius: "12px",
                  marginTop: "0.5rem",
                }}
              >
                <span
                  style={{
                    wordBreak: "break-all",
                    flex: 1,
                    fontSize: "0.85rem",
                  }}
                >
                  {address}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(address, name)}
                  style={{
                    width: "auto",
                    padding: "0.5rem 0.75rem",
                    background: "var(--primary-accent)",
                    minWidth: "auto",
                  }}
                >
                  <FaCopy />
                </button>
              </div>
            </div>
          ))}
          <div style={{ marginBottom: "1rem" }}>
            <strong>XRP:</strong>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "var(--bg-main)",
                padding: "0.75rem",
                borderRadius: "12px",
                marginTop: "0.5rem",
              }}
            >
              <span
                style={{
                  wordBreak: "break-all",
                  flex: 1,
                  fontSize: "0.85rem",
                }}
              >
                {xrpDetails.address}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(xrpDetails.address, "XRP Address")}
                style={{
                  width: "auto",
                  padding: "0.5rem 0.75rem",
                  background: "var(--primary-accent)",
                  minWidth: "auto",
                }}
              >
                <FaCopy />
              </button>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "var(--bg-main)",
                padding: "0.75rem",
                borderRadius: "12px",
                marginTop: "0.5rem",
              }}
            >
              <span
                style={{
                  wordBreak: "break-all",
                  flex: 1,
                  fontSize: "0.85rem",
                }}
              >
                <strong>MEMO:</strong> {xrpDetails.memo}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(xrpDetails.memo, "XRP Memo")}
                style={{
                  width: "auto",
                  padding: "0.5rem 0.75rem",
                  background: "var(--primary-accent)",
                  minWidth: "auto",
                }}
              >
                <FaCopy />
              </button>
            </div>
          </div>
        </div>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "0.9rem",
            marginTop: "1.5rem",
          }}
        >
          After sending crypto, please upload a screenshot of the transaction as
          proof.
        </p>
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          style={{
            backgroundColor: "var(--bg-surface-raised)",
            color: "var(--text-primary)",
            marginBottom: "1rem",
          }}
        >
          {proof ? proof.name : "Select Payment Proof"}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
          accept="image/*"
        />
        <button onClick={handleConfirm} disabled={!proof || isUploading}>
          {isUploading ? "Uploading..." : "Confirm Payment"}
        </button>
      </div>
    </div>
  );
};

const PaymentPage = () => {
  const [method, setMethod] = useState(null);
  const { userPackageId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { pkg } = location.state || {};

  const handleCancel = async () => {
    try {
      await cancelSelection(userPackageId);
      showToast("Selection cancelled.", "info");
      navigate("/packages");
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to cancel.", "error");
    }
  };

  if (!pkg) {
    return <Navigate to="/packages" replace />;
  }

  const handleComplete = () => {
    navigate("/dashboard");
  };

  return (
    <div>
      <h1 className="page-title">Complete Your Payment</h1>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <p style={{ margin: 0, color: "var(--text-secondary)" }}>
          You are investing in the <strong>{pkg.name}</strong> plan.
        </p>
        <p style={{ margin: "0.5rem 0", fontSize: "1.5rem" }}>
          Amount: <strong>₦{pkg.investment_amount.toLocaleString()}</strong>
        </p>
      </div>

      {!method ? (
        <div className="package-card" style={{ cursor: "default" }}>
          <div className="package-content">
            <h3>Choose Payment Method</h3>
            <button onClick={() => setMethod("bank")}>Bank Transfer</button>
            <button
              onClick={() => setMethod("crypto")}
              style={{ marginTop: "1rem" }}
            >
              Crypto Payment
            </button>
          </div>
        </div>
      ) : method === "bank" ? (
        <BankTransferForm
          userPackageId={userPackageId}
          onComplete={handleComplete}
        />
      ) : (
        <CryptoPaymentForm
          userPackageId={userPackageId}
          onComplete={handleComplete}
        />
      )}

      <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
        {method && (
          <button
            onClick={() => setMethod(null)}
            style={{
              background: "var(--bg-surface-raised)",
              color: "var(--text-primary)",
            }}
          >
            Back to Methods
          </button>
        )}
        <button
          onClick={handleCancel}
          style={{
            background: "transparent",
            color: "var(--danger-color)",
            boxShadow: "none",
          }}
        >
          Cancel Investment
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
