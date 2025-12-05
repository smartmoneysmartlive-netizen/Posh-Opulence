import React, { useState, useEffect } from "react";
import { getUserHistory } from "../api";

const UserHistoryPage = ({ user }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getUserHistory(user.id);
        setHistory(res.data);
      } catch (error) {
        console.error("Failed to fetch history", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user.id]);

  if (loading) return <div>Loading history...</div>;

  return (
    <div>
      <h1 className="page-title">My History</h1>
      {history.length > 0 ? (
        history.map((item) => (
          <div
            key={item.user_package_id}
            className={`history-item history-item-${item.status}`}
          >
            <div className="history-item-info">
              <p className="history-item-title">
                <strong>{item.package_name}</strong>
              </p>
              <p className="history-item-date">
                {new Date(item.purchase_date).toLocaleString()}
              </p>
              {item.status === "rejected" && (
                <p className="history-item-reason">
                  Reason: {item.rejection_reason}
                </p>
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
            <p>No transaction history found.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserHistoryPage;
