import user from "@/Types/userinterface";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
const Profile = () => {
  const npc = {
    name: "",
    email: "",
  };
  const [loading, setLoading] = useState(true);
  const [authendicated, setAuthendicated] = useState(false);
  const [userdetails, setUserDetails] = useState<user>(npc);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    } else {
      const loggedInUser: any = jwtDecode(token);
      setUserDetails({
        name: loggedInUser.name,
        email: loggedInUser.email,
      });
      setAuthendicated(true);
    }
    setLoading(false);
  }, []);

  const Signout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  if (loading) {
    return <>Loading</>;
  }

  if (authendicated) {
    return (
      <div className="profile">
        <div className="name">{userdetails.name}</div>
        <div className="email">{userdetails.email}</div>
        <div onClick={Signout} className="signoutbtn">
          Sign Out
        </div>
      </div>
    );
  }
};

export default Profile;
