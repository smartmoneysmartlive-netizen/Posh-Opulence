import React, { createContext, useState, useContext, useCallback } from "react";
import Toast from "../components/Toast";

const ToastContext = createContext(null);

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    // Default to 'info' if type is not recognized
    const toastType = ["success", "error", "info"].includes(type)
      ? type
      : "info";
    setToast({ message, type: toastType });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}
    </ToastContext.Provider>
  );
};
