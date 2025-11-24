import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Login from "../Auth/Login";
import Register from "../Auth/Register";
import { GiGreekTemple } from "react-icons/gi";
import { HiUser } from "react-icons/hi";

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <>
      <header className="bg-gradient-to-r from-teal-700 to-blue-900 text-white shadow-lg">
        <div className="container mx-auto px-3 sm:px-6 py-3 sm:py-5">
          <div className="flex items-center justify-between gap-2">
            <div className="animate-fadeIn flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight flex items-center gap-2 sm:gap-3">
                <GiGreekTemple className="text-2xl sm:text-3xl lg:text-4xl" />
                <span className="hidden sm:inline">Vancouver Heritage</span>
                <span className="sm:hidden">VanHeritage</span>
              </h1>
              <p className="text-xs sm:text-sm text-white/90 mt-1 font-medium hidden sm:block">
                Explore & Share Historic Stories
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              {isAuthenticated ? (
                <>
                  <div className="bg-white/20 backdrop-blur-sm px-2 sm:px-4 py-1.5 sm:py-2 rounded-full hidden md:flex items-center gap-2">
                    <HiUser className="text-sm sm:text-base" />
                    <span className="text-xs sm:text-sm font-medium">
                      {user.username}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="bg-white text-teal-700 px-3 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm sm:text-base font-semibold hover:bg-teal-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowLogin(true)}
                    className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-3 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm sm:text-base font-semibold hover:bg-white/20 transition-all duration-300"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setShowRegister(true)}
                    className="bg-white text-teal-700 px-3 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm sm:text-base font-semibold hover:bg-teal-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <span className="hidden sm:inline">Register</span>
                    <span className="sm:hidden">Sign Up</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          onSwitchToRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      )}

      {showRegister && (
        <Register
          onClose={() => setShowRegister(false)}
          onSwitchToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      )}
    </>
  );
};

export default Header;
