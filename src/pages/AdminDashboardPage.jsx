import React, { useState, useEffect } from "react";
import { getPendingPayments, approvePayment, rejectPayment } from "../api";
import { useToast } from "../context/ToastContext";
import { FaCheck, FaTimes, FaExternalLinkAlt } from "react-icons/fa";

const AdminDashboardPage = () => {
  const [pending, setPending] = useState([]);
  const [processingId, setProcessingId] = useState(null);
  const { showToast } = useToast();

  const fetchData = () => {
    getPendingPayments().then((res) => setPending(res.data));
  };
  useEffect(fetchData, []);

  const handleApprove = async (id) => {
    setProcessingId(id);
    try {
      const res = await approvePayment(id);
      showToast(res.data.message, "success");
      fetchData();
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to approve.", "error");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    const reason = prompt("Please provide a reason for rejection:");
    if (reason === null) return;
    setProcessingId(id);
    try {
      const res = await rejectPayment(
        id,
        reason || "Invalid proof of payment."
      );
      showToast(res.data.message, "info");
      fetchData();
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to reject.", "error");
    } finally {
      setProcessingId(null);
    }
  };

  const renderPaymentDetails = (p) => {
    if (p.payment_method === "crypto") {
      return (
        <a
          href={p.payment_proof_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "var(--primary-blue)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            textDecoration: "none",
            marginBottom: "1rem",
          }}
        >
          View Crypto Proof <FaExternalLinkAlt />
        </a>
      );
    }
    if (p.payment_method === "bank_transfer") {
      return (
        <div
          style={{
            background: "#101418",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "1rem",
            fontSize: "0.9rem",
          }}
        >
          <p>
            <strong>Method:</strong> Bank Transfer
          </p>
          <p>
            <strong>Depositor:</strong> {p.depositor_name}
          </p>
          <p>
            <strong>Bank:</strong> {p.depositor_bank}
          </p>
          <p>
            <strong>Amount Claimed:</strong> ₦
            {Number(p.deposited_amount).toLocaleString()}
          </p>
        </div>
      );
    }
    return (
      <p style={{ color: "var(--danger-color)" }}>
        No payment details submitted.
      </p>
    );
  };

  return (
    <div>
      <h1 className="page-title">Pending Payments</h1>
      {pending.length > 0 ? (
        pending.map((p) => (
          <div key={p.user_package_id} className="package-card">
            <div className="package-content">
              <p>
                <strong>User:</strong> {p.user_name}
              </p>
              <p>
                <strong>Package:</strong> {p.package_name}
              </p>
              <p>
                <strong>Investment:</strong> ₦
                {Number(p.investment_amount).toLocaleString()}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(p.purchase_date).toLocaleString()}
              </p>
              {renderPaymentDetails(p)}
              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  onClick={() => handleReject(p.user_package_id)}
                  style={{ background: "var(--danger-color)" }}
                  disabled={processingId === p.user_package_id}
                >
                  {processingId === p.user_package_id ? (
                    "Rejecting..."
                  ) : (
                    <>
                      <FaTimes /> Reject
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleApprove(p.user_package_id)}
                  style={{ background: "var(--success-color)" }}
                  disabled={processingId === p.user_package_id}
                >
                  {processingId === p.user_package_id ? (
                    "Approving..."
                  ) : (
                    <>
                      <FaCheck /> Approve
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
            <p>No pending payments to review.</p>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminDashboardPage;
