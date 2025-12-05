import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaInfoCircle } from "react-icons/fa";

const icons = {
  success: <FaCheckCircle />,
  error: <FaTimesCircle />,
  info: <FaInfoCircle />,
};

const Toast = ({ message, type, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Wait for the animation to finish before calling dismiss
      setTimeout(onDismiss, 300);
    }, 2700);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className={`toast-container ${isVisible ? "visible" : ""}`}>
      <div className={`toast toast-${type}`}>
        <div className="toast-icon">{icons[type] || icons.info}</div>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Toast;
