import React, { useState, useEffect } from "react";
import { getAdminHistory } from "../api";

const AdminHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    getAdminHistory().then((res) => setHistory(res.data));
  }, []);

  const filteredHistory = history.filter(
    (item) => filter === "all" || item.status === filter
  );

  return (
    <div>
      <h1 className="page-title">Transaction History</h1>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
        {["all", "paid", "rejected", "expired", "withdrawn"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            style={{
              flex: 1,
              padding: "0.5rem",
              fontSize: "0.8rem",
              textTransform: "capitalize",
              background:
                filter === status
                  ? "var(--primary-accent)"
                  : "var(--bg-surface-raised)",
              color: filter === status ? "white" : "var(--text-primary)",
              boxShadow: "none",
              transform: "none",
            }}
          >
            {status}
          </button>
        ))}
      </div>

      {filteredHistory.length > 0 ? (
        filteredHistory.map((item) => (
          <div
            key={item.user_package_id}
            className={`history-item history-item-${item.status}`}
          >
            <div className="history-item-info">
              <p className="history-item-title">
                {item.user_name} - <strong>{item.package_name}</strong>
              </p>
              <p className="history-item-date">
                {new Date(item.date).toLocaleString()}
              </p>
              {item.status === "rejected" && (
                <p className="history-item-reason">Reason: {item.reason}</p>
              )}
            </div>
            <span className={`status-tag status-${item.status}`}>
              {item.status}
            </span>
          </div>
        ))
      ) : (
        <div className="package-card">
          <div className="package-content">
            <p>No transaction history found for this filter.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHistoryPage;
