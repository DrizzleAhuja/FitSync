import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setUser } from "../../redux/userSlice";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { FiMenu, FiX, FiUser, FiEdit2, FiLogOut, FiSun, FiMoon } from "react-icons/fi";

export default function NavBar({ darkMode, toggleDarkMode }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [role, setRole] = useState("user");

  const getUserInitials = (user) => {
    if (user && user.firstName) {
      return user.lastName ? `${user.firstName[0]}${user.lastName[0]}` : `${user.firstName[0]}`;
    }
    return "";
  };

  const handleLogout = async () => {
    try {
      dispatch(setUser(null));
      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn");
      setDropdownOpen(false);
      toast.success("Logged out successfully", {
        autoClose: 2000,
        onClose: () => navigate("/"),
      });
    } catch (error) {
      console.error("Error during logout", error);
      toast.error("Logout failed", { autoClose: 2000 });
    }
  };

  const handleLoginSuccess = async (response) => {
    try {
      const { credential } = response;
      const res = await axios.post("http://localhost:8000/api/auth/login", {
        token: credential,
        role,
      });
      dispatch(setUser(res.data.user));
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("isLoggedIn", true);
      setRole(res.data.user.role);
      toast.success("Logged in successfully", {
        autoClose: 1000,
        onClose: () => navigate("/editprofile"),
      });
    } catch (error) {
      console.error("Error during login", error);
      toast.error("Login failed", { autoClose: 2000 });
    }
  };

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      dispatch(setUser(savedUser));
      setRole(savedUser.role);
    }
  }, [dispatch]);

  const navLinks = [
    { path: "/", label: "HOME" },
    ...(!user
      ? [
          { path: "/About", label: "ABOUT US" },
          { path: "/Contactus", label: "CONTACT US" },
        ]
      : [
          { path: "/Aicoach", label: "AI COACH" },
          { path: "/VirtualTA", label: "VIRTUAL TRAINING ASSISTANT" },
          { path: "/CurrentBMI", label: "CURRENT BMI" },
          { path: "/CalorieTracker", label: "CALORIE TRACKER" },
          { path: "/Workout", label: "WORKOUT" },
        ]),
  ];

  return (
    <>
      <ToastContainer position="top-center" autoClose={2000} />
      <GoogleOAuthProvider clientId="860312032073-8mfimrab6r5t9e09hj8ibl0n498tmf9g.apps.googleusercontent.com">
        <nav className={`sticky top-0 left-0 w-full z-50 ${darkMode ? "bg-gray-900" : "bg-white"} shadow-md`}>
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center">
              <button
                className="md:hidden mr-4 text-gray-600 dark:text-gray-300"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
              <NavLink
                to="/"
                className="text-2xl font-bold hover:opacity-90 transition-opacity"
              >
                <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                  Fit<span className={darkMode ? "text-white" : "text-gray-800"}>Sync</span>
                </span>
              </NavLink>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex space-x-6">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) => 
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? darkMode
                          ? "bg-gray-800 text-white"
                          : "bg-gray-100 text-gray-900"
                        : darkMode
                        ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* User Icons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-full ${darkMode ? "bg-gray-700 text-yellow-300" : "bg-gray-200 text-gray-700"}`}
                aria-label="Toggle dark mode"
              >
                {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
              </button>

              {user ? (
                <div className="relative">
                  <div
                    className="flex items-center space-x-2 cursor-pointer group"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                      darkMode ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-800"
                    }`}>
                      {getUserInitials(user)}
                    </div>
                    <span className={`hidden md:inline ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                      <b>{user.firstName} {user.lastName ? user.lastName : ''}</b>
                    </span>
                  </div>
                  {dropdownOpen && (
                    <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-50 ${
                      darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
                    }`}>
                      <NavLink
                        to="/EditProfile"
                        className="block px-4 py-2 text-sm flex items-center hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FiEdit2 className="mr-2" /> Edit Profile
                      </NavLink>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm flex items-center hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <FiLogOut className="mr-2" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <GoogleLogin
                  onSuccess={handleLoginSuccess}
                  onError={() => toast.error("Login failed", { autoClose: 2000 })}
                  theme={darkMode ? "filled_black" : "outline"}
                  shape="pill"
                  size="medium"
                  text="signin_with"
                />
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className={`md:hidden ${darkMode ? "bg-gray-800" : "bg-white"} shadow-xl`}>
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) => 
                      `block px-3 py-2 rounded-md text-base font-medium ${
                        isActive
                          ? darkMode
                            ? "bg-gray-900 text-white"
                            : "bg-gray-200 text-gray-900"
                          : darkMode
                          ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </NavLink>
                ))}
                {!user && (
                  <div className="px-3 py-2">
                    <GoogleLogin
                      onSuccess={handleLoginSuccess}
                      onError={() => toast.error("Login failed", { autoClose: 2000 })}
                      theme={darkMode ? "filled_black" : "outline"}
                      shape="pill"
                      size="large"
                      text="signin_with"
                      width="100%"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </nav>
      </GoogleOAuthProvider>
    </>
  );
}