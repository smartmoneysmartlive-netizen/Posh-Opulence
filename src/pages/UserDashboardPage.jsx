import React, { useState, useEffect } from "react";
import { getUserDashboard, requestWithdrawal } from "../api";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { useTheme } from "../context/ThemeContext";
import Chart from "react-apexcharts";

const formatPrice = (price) =>
  `₦${Number(price).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const WelcomeHero = ({ user, hasInvestments }) => {
  return (
    <div className="welcome-hero">
      <h2>Welcome, {user.first_name}!</h2>
      {hasInvestments ? (
        <p>Here's a summary of your active investments.</p>
      ) : (
        <>
          <p>
            Put your money to work. Get a little richer each day.
            <br />
            One small step today, a giant leap for tomorrow.
          </p>
          <Link to="/packages" style={{ textDecoration: "none" }}>
            <button style={{ width: "auto", padding: "1rem 2rem" }}>
              Choose an Investment Plan
            </button>
          </Link>
        </>
      )}
    </div>
  );
};

const OtherServices = () => {
  const ADMIN_TELEGRAM_USERNAME = "Chinonohez"; // Updated Admin Username
  const services = [
    "Sell and Buy USDT",
    "Sell and Buy Bitcoin",
    "Airtime To Cash",
    "Sell and Buy Litecoin",
    "Sell and Buy Ethereum",
    "Sell and Buy Dogecoin",
    "Sell Gift card for USDT",
    "Sell Gift card for BTC",
  ];

  return (
    <div
      className="package-card"
      style={{ cursor: "default", marginTop: "2rem" }}
    >
      <div className="package-content">
        <h3 style={{ marginBottom: "1rem" }}>Other Products & Services</h3>
        <p
          style={{
            color: "var(--text-secondary)",
            marginTop: 0,
            marginBottom: "1.5rem",
          }}
        >
          Interested in any of our other services? Tap to contact an admin for
          enquiries and transactions.
        </p>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          {services.map((service, index) => (
            <a
              key={index}
              href={`https://t.me/${ADMIN_TELEGRAM_USERNAME}?text=Hello, I'm interested in the ${encodeURIComponent(
                service
              )} service.`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: "none",
                color: "var(--text-primary)",
                background: "var(--bg-surface-raised)",
                padding: "0.8rem 1rem",
                borderRadius: "12px",
                border: "1px solid var(--border-color)",
                fontWeight: "600",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                transition: "all 0.2s ease-in-out",
              }}
            >
              {service}
              <span style={{ color: "var(--primary-accent)" }}>→</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

const ActiveInvestmentMetrics = ({ pkg }) => {
  const [balance, setBalance] = useState(pkg.investment_amount);
  const [chartSeries, setChartSeries] = useState([]);
  const { theme } = useTheme();

  const formatYAxisLabel = (value) => {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + "M";
    }
    if (value >= 1000) {
      return (value / 1000).toFixed(0) + "K";
    }
    return value.toFixed(0);
  };

  const chartOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
      background: "transparent",
    },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2.5 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.5,
        opacityTo: 0.1,
        stops: [0, 100],
      },
    },
    colors: ["#22c55e"],
    tooltip: { enabled: false },
    grid: {
      show: true,
      borderColor: theme === "dark" ? "#3a3a3a" : "#dde3e9",
      strokeDashArray: 4,
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
      padding: { left: -10, right: 10 },
    },
    xaxis: {
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false },
    },
    yaxis: {
      show: true,
      labels: {
        style: {
          colors: theme === "dark" ? "#a3a3a3" : "#5a6470",
          fontSize: "11px",
          fontWeight: 600,
        },
        formatter: formatYAxisLabel,
        offsetX: 0,
      },
    },
  };

  useEffect(() => {
    if (!pkg.activation_date || !pkg.expiry_date) return;

    const principal = pkg.investment_amount;
    const totalEarning = principal * (pkg.package_dividend_percentage / 100);
    const start = new Date(pkg.activation_date).getTime();
    const end = new Date(pkg.expiry_date).getTime();
    const duration = end - start;

    if (duration <= 0) {
      setBalance(principal + totalEarning);
      const finalDataPoints = Array.from(
        { length: 50 },
        (_, i) => principal + totalEarning * (i / 49)
      );
      setChartSeries([{ name: "Balance", data: finalDataPoints }]);
      return;
    }

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const progress = Math.min(1, (now - start) / duration);
      const currentEarning = totalEarning * progress;
      setBalance(principal + currentEarning);

      const totalPoints = 50;
      const pointsToShow = Math.max(2, Math.ceil(progress * totalPoints));
      const dataPoints = Array.from(
        { length: pointsToShow },
        (_, i) => principal + totalEarning * (i / (totalPoints - 1))
      );
      setChartSeries([{ name: "Balance", data: dataPoints }]);
    }, 2000);

    return () => clearInterval(interval);
  }, [pkg]);

  return (
    <>
      <div className="countdown-timer">
        <h3>Current Balance</h3>
        <p>{formatPrice(balance)}</p>
      </div>
      <div className="investment-chart-card">
        <h4>Portfolio Growth</h4>
        {chartSeries.length > 0 && (
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="area"
            height={100}
          />
        )}
      </div>
    </>
  );
};

const Countdown = ({ expiryDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(expiryDate) - +new Date();
    let timeLeft = {};
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  const timerComponents = Object.keys(timeLeft).length ? (
    `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`
  ) : (
    <span>Investment Period Over!</span>
  );

  return (
    <div className="investment-countdown">
      <h4>Time Remaining</h4>
      <p>{timerComponents}</p>
    </div>
  );
};

const BankWithdrawalForm = ({ amount, setAmount, isSubmitting, onSubmit }) => {
  const [details, setDetails] = useState({
    account_name: "",
    account_number: "",
    bank_name: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(details);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
    >
      <input
        type="number"
        placeholder="Amount to Withdraw"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <input
        placeholder="Bank Name"
        value={details.bank_name}
        onChange={(e) => setDetails({ ...details, bank_name: e.target.value })}
        required
      />
      <input
        placeholder="Account Name"
        value={details.account_name}
        onChange={(e) =>
          setDetails({ ...details, account_name: e.target.value })
        }
        required
      />
      <input
        type="number"
        placeholder="Account Number"
        value={details.account_number}
        onChange={(e) =>
          setDetails({ ...details, account_number: e.target.value })
        }
        required
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Bank Request"}
      </button>
    </form>
  );
};

const CryptoWithdrawalForm = ({
  amount,
  setAmount,
  isSubmitting,
  onSubmit,
}) => {
  const [details, setDetails] = useState({
    wallet_address: "",
    crypto_network: "USDT TRC20",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(details);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
    >
      <input
        type="number"
        placeholder="Amount to Withdraw"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <select
        value={details.crypto_network}
        onChange={(e) =>
          setDetails({ ...details, crypto_network: e.target.value })
        }
        style={{
          borderStyle: "solid",
          borderWidth: "2px",
          padding: "0.9rem 1.1rem",
          borderRadius: "14px",
          fontSize: "0.95rem",
          width: "100%",
          borderColor: "var(--border-color)",
          backgroundColor: "var(--bg-surface-raised)",
          color: "var(--text-primary)",
          fontFamily: "inherit",
        }}
      >
        <option value="USDT TRC20">USDT (TRC20)</option>
        <option value="BTC">BTC</option>
        <option value="ETH (ERC20)">ETH (ERC20)</option>
      </select>
      <input
        placeholder="Your Wallet Address"
        value={details.wallet_address}
        onChange={(e) =>
          setDetails({ ...details, wallet_address: e.target.value })
        }
        required
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Crypto Request"}
      </button>
    </form>
  );
};

const WithdrawalModal = ({ pkg, onClose }) => {
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const maxWithdrawableAmount =
    pkg.investment_amount * (pkg.package_dividend_percentage / 100);

  const handleSubmit = async (details) => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      showToast("Please enter a valid amount.", "error");
      return;
    }
    if (numericAmount > maxWithdrawableAmount) {
      showToast("Amount cannot exceed available dividend.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...details,
        user_package_id: pkg.user_package_id,
        amount: numericAmount,
        withdrawal_method: pkg.payment_method || "bank_transfer",
      };
      const res = await requestWithdrawal(payload);
      showToast(res.data.message, "success");
      onClose();
      navigate(0);
    } catch (error) {
      showToast(error.response?.data?.message || "Request failed", "error");
      setIsSubmitting(false);
    }
  };

  const renderForm = () => {
    if (pkg.payment_method === "crypto") {
      return (
        <CryptoWithdrawalForm
          amount={amount}
          setAmount={setAmount}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
      );
    }
    return (
      <BankWithdrawalForm
        amount={amount}
        setAmount={setAmount}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
    );
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Request Dividend Withdrawal</h2>
        <p>
          Your available dividend for withdrawal is{" "}
          <strong>{formatPrice(maxWithdrawableAmount)}</strong>.
        </p>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
          Your withdrawal will be processed via{" "}
          <strong>
            {pkg.payment_method === "crypto"
              ? "Cryptocurrency"
              : "Bank Transfer"}
          </strong>
          .
        </p>
        {renderForm()}
        <button
          type="button"
          onClick={onClose}
          style={{
            backgroundColor: "var(--bg-surface-raised)",
            color: "var(--text-primary)",
            boxShadow: "none",
            marginTop: "0.5rem",
          }}
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const InvestmentCard = ({ pkg }) => {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  switch (pkg.status) {
    case "paid":
      const isExpired = new Date(pkg.expiry_date) <= new Date();
      return (
        <>
          <ActiveInvestmentMetrics pkg={pkg} />
          <div className="package-card">
            <div
              className="package-content"
              style={{
                textAlign: "left",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <h3 style={{ textAlign: "center" }}>{pkg.package_name}</h3>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Status:</span>
                <strong style={{ color: "var(--success-color)" }}>
                  Active
                </strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Invested:</span>
                <strong>{formatPrice(pkg.investment_amount)}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Expires on:</span>
                <strong>
                  {new Date(pkg.expiry_date).toLocaleDateString()}
                </strong>
              </div>
              <hr
                style={{
                  borderColor: "var(--border-color)",
                  width: "100%",
                  margin: "0.5rem 0",
                }}
              />
              <Countdown expiryDate={pkg.expiry_date} />
              <button
                disabled={!isExpired}
                onClick={() => setShowWithdrawModal(true)}
              >
                {isExpired ? "Withdraw Dividend" : "Withdrawal Pending Expiry"}
              </button>
            </div>
          </div>
          {showWithdrawModal && (
            <WithdrawalModal
              pkg={pkg}
              onClose={() => setShowWithdrawModal(false)}
            />
          )}
        </>
      );
    case "pending":
      return (
        <div className="package-card">
          <div className="package-content">
            <h3>{pkg.package_name}</h3>
            <p>
              Status:{" "}
              <strong style={{ color: "var(--warning-color)" }}>
                Pending Confirmation
              </strong>
            </p>
            <p>
              Amount: <strong>{formatPrice(pkg.investment_amount)}</strong>
            </p>
            <p style={{ color: "var(--text-secondary)" }}>
              Your payment is awaiting admin approval.
            </p>
          </div>
        </div>
      );
    case "rejected":
      return (
        <div className="package-card">
          <div className="package-content">
            <h3>{pkg.package_name}</h3>
            <p>
              Status:{" "}
              <strong style={{ color: "var(--danger-color)" }}>
                Payment Rejected
              </strong>
            </p>
            <p style={{ color: "var(--text-secondary)" }}>
              Reason: {pkg.rejection_reason}
            </p>
          </div>
        </div>
      );
    case "expired":
      return (
        <div className="package-card">
          <div className="package-content">
            <h3>{pkg.package_name}</h3>
            <p>
              Status:{" "}
              <strong style={{ color: "var(--text-secondary)" }}>
                Withdrawal Pending
              </strong>
            </p>
            <p>
              Your dividend withdrawal request for this plan is awaiting admin
              approval.
            </p>
          </div>
        </div>
      );
    default:
      return null;
  }
};

const UserDashboardPage = ({ user }) => {
  const [activePackages, setActivePackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getUserDashboard(user.id);
        setActivePackages(res.data);
      } catch (error) {
        console.error("Failed to fetch dashboard", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [user.id]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <WelcomeHero user={user} hasInvestments={activePackages.length > 0} />

      <h1 className="page-title">My Investments</h1>
      {activePackages.length > 0 ? (
        activePackages.map((pkg) => (
          <InvestmentCard key={pkg.user_package_id} pkg={pkg} />
        ))
      ) : (
        <div
          style={{
            textAlign: "center",
            color: "var(--text-secondary)",
            padding: "2rem",
          }}
        >
          You have no active investments right now.
        </div>
      )}

      <OtherServices />
    </div>
  );
};
export default UserDashboardPage;
