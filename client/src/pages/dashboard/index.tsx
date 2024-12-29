import axios from "axios";
import React, { useEffect, useState } from "react";
import Profile from "../reusablecomponents/Profile";
const jwt = require("jwt-decode");

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [authendicated, setAuthendicated] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    } else {
      setAuthendicated(true);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <>Loading</>;
  }

  if (authendicated) {
    return (
      <>
        <Profile />
        <div>Dashboard</div>
      </>
    );
  }
};

export default Dashboard;
