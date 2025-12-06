import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { authenticateUser } from "./api";

// Import Layout and Page Components
import Layout from "./components/Layout";
import Preloader from "./components/Preloader";
import WelcomePage from "./pages/WelcomePage";
import UserDashboardPage from "./pages/UserDashboardPage";
import PackagesPage from "./pages/PackagesPage";
import PaymentPage from "./pages/PaymentPage";
import UserHistoryPage from "./pages/UserHistoryPage";
import ReferralsPage from "./pages/ReferralsPage";
import SupportPage from "./pages/SupportPage";
import AboutPage from "./pages/AboutPage"; // Import the new About page
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminPackagesPage from "./pages/AdminPackagesPage";
import AdminHistoryPage from "./pages/AdminHistoryPage";
import AdminWithdrawalsPage from "./pages/AdminWithdrawalsPage";

// This is the object Telegram injects into the window
const tg = window.Telegram.WebApp;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        let userData;
        const startParam = tg.initDataUnsafe?.start_param;

        if (!tg.initDataUnsafe?.user) {
          console.warn("Telegram data not found. Running in MOCK MODE.");
          const MOCK_USER_ID_TO_TEST = 987654321;
          // const MOCK_USER_ID_TO_TEST = 123456789;
          userData = { id: MOCK_USER_ID_TO_TEST, first_name: "Test User" };
        } else {
          tg.ready();
          tg.expand();
          userData = tg.initDataUnsafe.user;
        }

        const response = await authenticateUser({
          user: userData,
          referral_code: startParam,
        });
        setUser(response.data);

        const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
        if (response.data.is_new_user && !hasSeenWelcome) {
          setShowWelcome(true);
        }
      } catch (err) {
        console.error("Authentication failed!", err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const handleWelcomeComplete = () => {
    localStorage.setItem("hasSeenWelcome", "true");
    setShowWelcome(false);
  };

  if (loading) {
    return <Preloader />;
  }

  if (showWelcome) {
    return <WelcomePage onComplete={handleWelcomeComplete} />;
  }

  if (!user) {
    return (
      <div style={{ padding: "1rem", textAlign: "center", color: "#f85149" }}>
        Authentication Failed. Please try again later.
      </div>
    );
  }

  return (
    <Routes>
      {user.is_admin ? (
        <Route path="/" element={<Layout user={user} />}>
          <Route index element={<Navigate to="/admin/dashboard" />} />
          <Route path="admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="admin/withdrawals" element={<AdminWithdrawalsPage />} />
          <Route path="admin/packages" element={<AdminPackagesPage />} />
          <Route path="admin/history" element={<AdminHistoryPage />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" />} />
        </Route>
      ) : (
        <Route path="/" element={<Layout user={user} />}>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<UserDashboardPage user={user} />} />
          <Route path="packages" element={<PackagesPage user={user} />} />
          <Route path="payment/:userPackageId" element={<PaymentPage />} />
          <Route path="history" element={<UserHistoryPage user={user} />} />
          <Route path="referrals" element={<ReferralsPage user={user} />} />
          <Route path="support" element={<SupportPage />} />
          <Route path="about" element={<AboutPage />} />{" "}
          {/* Add the new route */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Route>
      )}
    </Routes>
  );
}

export default App;
