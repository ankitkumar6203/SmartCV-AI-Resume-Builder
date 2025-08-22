// src/pages/Logout.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../App";

const Logout = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();

  useEffect(() => {
    // Clear all relevant local storage/session storage
    localStorage.clear();
    sessionStorage.clear();

    // Update auth state
    setIsAuthenticated(false);

    // Redirect to login
    navigate("/", { replace: true });
  }, [navigate, setIsAuthenticated]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <p className="text-gray-600 text-lg">Logging you out...</p>
    </div>
  );
};

export default Logout;
