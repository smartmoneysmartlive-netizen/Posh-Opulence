import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaBox,
  FaTasks,
  FaPlusCircle,
  FaHistory,
  FaUsers,
  FaMoneyBillWave,
  FaHeadset,
} from "react-icons/fa";

const BottomNav = ({ isAdmin }) => {
  if (isAdmin) {
    const adminNav = [
      { path: "/admin/dashboard", icon: <FaTasks />, label: "Deposits" },
      {
        path: "/admin/withdrawals",
        icon: <FaMoneyBillWave />,
        label: "Withdraw",
      },
      { path: "/admin/packages", icon: <FaPlusCircle />, label: "Packages" },
      { path: "/admin/history", icon: <FaHistory />, label: "History" },
    ];
    return (
      <nav className="bottom-nav">
        <div className="nav-item-group">
          {adminNav.map((item) => (
            <NavLink key={item.path} to={item.path} className="nav-item">
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    );
  }

  // User Navigation Layout
  const leftNav = [
    { path: "/dashboard", icon: <FaHome />, label: "Home" },
    { path: "/history", icon: <FaHistory />, label: "History" },
  ];
  const rightNav = [
    { path: "/referrals", icon: <FaUsers />, label: "Referrals" },
    { path: "/support", icon: <FaHeadset />, label: "Support" },
  ];

  return (
    <nav className="bottom-nav">
      <div className="nav-item-group">
        {leftNav.map((item) => (
          <NavLink key={item.path} to={item.path} className="nav-item">
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      <NavLink to="/packages" className="nav-item-center">
        <FaBox />
      </NavLink>

      <div className="nav-item-group">
        {rightNav.map((item) => (
          <NavLink key={item.path} to={item.path} className="nav-item">
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
export default BottomNav;
