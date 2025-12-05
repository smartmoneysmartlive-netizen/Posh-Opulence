import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5001";
const api = axios.create({ baseURL: `${API_BASE_URL}/api` });

// --- AUTH ---
export const authenticateUser = (userData) => api.post("/auth", userData);

// --- USER ---
export const getUserDashboard = (userId) =>
  api.get(`/user/${userId}/dashboard`);
export const getUserHistory = (userId) => api.get(`/user/${userId}/history`);
export const getUserReferrals = (userId) =>
  api.get(`/user/${userId}/referrals`);
export const requestWithdrawal = (data) => api.post("/user/withdrawals", data);

// --- PACKAGES (USER) ---
export const getPackages = () => api.get("/packages");

export const selectPackage = (userId, packageId, investmentAmount) =>
  api.post("/user/packages", {
    user_id: userId,
    package_id: packageId,
    investment_amount: investmentAmount,
  });

export const cancelSelection = (userPackageId) =>
  api.delete(`/user/package/${userPackageId}`);

export const uploadPaymentProof = (userPackageId, formData) =>
  api.post(`/user/package/${userPackageId}/upload_proof`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const submitBankDetails = (userPackageId, data) =>
  api.post(`/user/package/${userPackageId}/submit_bank_details`, data);

// --- ADMIN ---
export const getPendingPayments = () => api.get("/admin/pending");
export const getAdminHistory = () => api.get("/admin/history");
export const approvePayment = (userPackageId) =>
  api.post(`/admin/approve/${userPackageId}`);
export const rejectPayment = (userPackageId, reason) =>
  api.post(`/admin/reject/${userPackageId}`, { reason });

// --- PACKAGES (ADMIN) ---
export const createPackage = (formData) =>
  api.post("/admin/packages", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const updatePackage = (packageId, formData) =>
  api.put(`/admin/packages/${packageId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deletePackage = (packageId) =>
  api.delete(`/admin/packages/${packageId}`);

// --- WITHDRAWALS (ADMIN) ---
export const getPendingWithdrawals = () => api.get("/admin/withdrawals");
export const approveWithdrawal = (withdrawalId) =>
  api.post(`/admin/withdrawals/${withdrawalId}/approve`);
