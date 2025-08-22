// src/App.jsx
import React, { useEffect, useState, createContext, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ResumeBuilder from "./pages/ResumeBuilder";
import ResumePreview from "./pages/ResumePreview";
import Logout from "./pages/Logout";
import ResumeView from "./pages/ResumeView";
import SavedResumes from "./pages/SavedResumes";
import ResumeList from "./components/ResumeList";
import UpdateResume from "./pages/UpdateResume";
import ResumeDetail from "./pages/ResumeDetail";
import EditResume from "./pages/EditResume";

// Auth context
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  return isAuthenticated ? children : <Navigate to="/" state={{ from: location }} replace />;
};

const App = () => {
  const token = localStorage.getItem("token");
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };
    window.addEventListener("storage", handleStorageChange);

    // Clear token when tab/window is closed
    const handleBeforeUnload = () => {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />}
          />
          <Route path="/logout" element={<Logout />} />

          {/* Private Routes */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/resume/builder" element={<PrivateRoute><ResumeBuilder /></PrivateRoute>} />
          <Route path="/preview" element={<PrivateRoute><ResumePreview /></PrivateRoute>} />
          <Route path="/resumes" element={<PrivateRoute><ResumeList /></PrivateRoute>} />
          <Route path="/resume/view/:id" element={<PrivateRoute><ResumeView /></PrivateRoute>} />
          <Route path="/saved-resumes" element={<PrivateRoute><SavedResumes/></PrivateRoute>} />
          <Route path="/resume/edit/:id" element={<PrivateRoute><UpdateResume/></PrivateRoute>} />
          <Route path="/resume/:id" element={<PrivateRoute><ResumeDetail/></PrivateRoute>} />
          <Route path="/resume/edit" element={<EditResume />} />

          {/* Fallback Route */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center text-center px-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Page not found
                  </h2>
                  <Link to="/" className="text-blue-600 underline hover:text-blue-800">
                    Go to Home
                  </Link>
                </div>
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
