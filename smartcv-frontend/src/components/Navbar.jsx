import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../App";
import { FaBars, FaTimes } from "react-icons/fa"; // Changed to react-icons

const Navbar = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/logout");
  };

  const navLinks = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/resume/builder", label: "Resume Builder" },
  ];

  return (
    <nav className="w-full bg-white shadow-md px-6 py-3 flex justify-between items-center">
      {/* Logo */}
      <NavLink to="/dashboard" className="text-2xl font-bold text-blue-600">
        SmartCV
      </NavLink>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-6 text-sm font-medium text-gray-700">
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              isActive ? "text-blue-600 font-semibold" : "hover:text-blue-600"
            }
          >
            {link.label}
          </NavLink>
        ))}
        <button
          onClick={handleLogout}
          className="text-red-500 hover:text-red-600"
        >
          Logout
        </button>
      </div>

      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden text-gray-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md p-4 flex flex-col space-y-4 md:hidden">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-semibold" : "hover:text-blue-600"
              }
            >
              {link.label}
            </NavLink>
          ))}
          <button
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
            className="text-red-500 hover:text-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
