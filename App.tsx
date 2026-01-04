import React, { useState, useEffect, useMemo } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LandingPage from "./components/LandingPage";
import AboutUs from "./components/AboutUs";
import LoginPage from "./components/Auth/LoginPage";
import SignupPage from "./components/Auth/SignupPage";
import PatientDashboard from "./components/Dashboards/PatientDashboard";
import DoctorDashboard from "./components/Dashboards/DoctorDashboard";
import CompounderDashboard from "./components/Dashboards/CompounderDashboard";
import AdminDashboard from "./components/Dashboards/AdminDashboard";
import Navbar from "./components/Navbar";
import { User, UserRole } from "./types";
import "./index.css"; // ✅ Tailwind imports

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  console.log("app rendered");
  useEffect(() => {
    const savedUser = localStorage.getItem("swasth_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse saved user", e);
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.1 }
    );

    const refreshObserver = () => {
      document
        .querySelectorAll(".reveal")
        .forEach((el) => observer.observe(el));
    };

    refreshObserver();
    const interval = setInterval(refreshObserver, 1500);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem("swasth_user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("swasth_user");
  };

  const dashboardComponent = useMemo(() => {
    if (!user) return null;
    switch (user.role) {
      case UserRole.PATIENT:
        return <PatientDashboard user={user} />;
      case UserRole.DOCTOR:
        return <DoctorDashboard user={user} />;
      case UserRole.ADMIN:
        return <AdminDashboard user={user} />;
      case UserRole.COMPOUNDER:
        return <CompounderDashboard user={user} />;
      default:
        return <Navigate to="/login" />;
    }
  }, [user]);

  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans overflow-x-hidden">
        <Navbar user={user} onLogout={handleLogout} />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutUs />} />
            <Route
              path="/login"
              element={
                user ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <LoginPage onLogin={handleLogin} />
                )
              }
            />
            <Route
              path="/signup"
              element={
                user ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <SignupPage onLogin={handleLogin} />
                )
              }
            />
            <Route
              path="/dashboard"
              element={user ? dashboardComponent : <Navigate to="/login" />}
            />
          </Routes>
        </main>

        <footer className="bg-slate-950 text-white py-20 px-6 border-t border-white/5">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-3xl font-black font-heading mb-6 text-sky-400 tracking-tight">
                SwasthAI.
              </h3>
              <p className="text-slate-500 max-w-sm text-lg leading-relaxed font-medium">
                The world's first decentralized medical ecosystem powered by
                clinical-grade AI.
              </p>
            </div>
            <div>
              <h4 className="font-black mb-6 uppercase tracking-[0.3em] text-[10px] text-sky-500/80">
                Platform
              </h4>
              <ul className="space-y-4 text-slate-400 font-bold text-sm">
                <li>
                  <a href="/" className="hover:text-white transition-colors">
                    Portal Home
                  </a>
                </li>
                <li>
                  <a
                    href="#/about"
                    className="hover:text-white transition-colors">
                    Our Vision
                  </a>
                </li>
                <li>
                  <a
                    href="#/signup"
                    className="hover:text-white transition-colors">
                    Patient Registry
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-black mb-6 uppercase tracking-[0.3em] text-[10px] text-sky-500/80">
                Support
              </h4>
              <ul className="space-y-4 text-slate-400 font-bold text-sm">
                <li>Help Center</li>
                <li>Privacy Protocol</li>
                <li>Ethics & AI</li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 text-center text-slate-700 text-[9px] font-black uppercase tracking-[0.4em]">
            &copy; {new Date().getFullYear()} SwasthAI Technologies. Secured
            Core.
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
