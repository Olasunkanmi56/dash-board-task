import React, { useContext } from "react";
import { AuthContext } from "../authContext";

const LogoutButton = () => {
  const { dispatch } = useContext(AuthContext);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    window.location.href = "/admin/login"; // Update the URL as needed
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;