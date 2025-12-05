import React from "react";
import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";

const Layout = ({ user }) => {
  return (
    <>
      <main className="app-container">
        <Outlet />
      </main>
      <BottomNav isAdmin={user.is_admin} />
    </>
  );
};

export default Layout;
