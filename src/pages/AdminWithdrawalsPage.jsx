import React, { useState, useEffect } from "react";
import { getPendingWithdrawals, approveWithdrawal } from "../api";
import { useToast } from "../context/ToastContext";
import { FaCheck } from "react-icons/fa";

const AdminWithdrawalsPage = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [processingId, setProcessingId] = useState(null);
  const { showToast } = useToast();

  const fetchData = () => {
    getPendingWithdrawals()
      .then((res) => setWithdrawals(res.data))
      .catch(() => showToast("Failed to fetch withdrawals", "error"));
  };

  useEffect(fetchData, [showToast]);

  const handleApprove = async (id) => {
    setProcessingId(id);
    try {
      const res = await approveWithdrawal(id);
      showToast(res.data.message, "success");
      fetchData();
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to approve.", "error");
    } finally {
      setProcessingId(null);
    }
  };

  const formatPrice = (price) => `₦${Number(price).toLocaleString("en-US")}`;

  const renderDetails = (w) => {
    if (w.withdrawal_method === "crypto") {
      return (
        <div
          style={{
            background: "var(--bg-surface-raised)",
            padding: "1rem",
            borderRadius: "12px",
          }}
        >
          <p>
            <strong>Method:</strong> Crypto
          </p>
          <p>
            <strong>Network:</strong> {w.crypto_network}
          </p>
          <p>
            <strong>Wallet:</strong>{" "}
            <span style={{ wordBreak: "break-all" }}>{w.wallet_address}</span>
          </p>
        </div>
      );
    }

    return (
      <div
        style={{
          background: "var(--bg-surface-raised)",
          padding: "1rem",
          borderRadius: "12px",
        }}
      >
        <p>
          <strong>Method:</strong> Bank Transfer
        </p>
        <p>
          <strong>Bank:</strong> {w.bank_name}
        </p>
        <p>
          <strong>Account:</strong> {w.account_number} ({w.account_name})
        </p>
      </div>
    );
  };

  return (
    <div>
      <h1 className="page-title">Pending Withdrawals</h1>
      {withdrawals.length > 0 ? (
        withdrawals.map((w) => (
          <div key={w.withdrawal_id} className="package-card">
            <div className="package-content">
              <p>
                <strong>User:</strong> {w.user_name}
              </p>
              <p>
                <strong>Package:</strong> {w.package_name}
              </p>
              <p>
                <strong>Amount:</strong> {formatPrice(w.amount)}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(w.request_date).toLocaleString()}
              </p>
              <div style={{ margin: "1rem 0" }}>{renderDetails(w)}</div>
              <div style={{ marginTop: "1rem" }}>
                <button
                  onClick={() => handleApprove(w.withdrawal_id)}
                  style={{ background: "var(--success-color)" }}
                  disabled={processingId === w.withdrawal_id}
                >
                  {processingId === w.withdrawal_id ? (
                    "Processing..."
                  ) : (
                    <>
                      <FaCheck /> Mark as Paid
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="package-card">
          <div className="package-content">
            <p>No pending withdrawals to process.</p>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminWithdrawalsPage;
