import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Avatar, Dropdown } from "antd";
import {
  LogoutOutlined,
  SettingOutlined,
  PlayCircleOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";

import bemek from "../assets/bemek.svg";
import logoSmartQuiz from "../assets/logo-smartquiz.svg";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(() => {
    const loggedInUser = localStorage.getItem("user");
    return loggedInUser ? JSON.parse(loggedInUser) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const items = [
    { key: "1", label: "Customize Avatar", icon: <SettingOutlined /> },
    {
      key: "2",
      danger: true,
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  if (location.pathname === "/login") {
    return null;
  }

  return (
    <nav className="bg-[#2c5ead] p-3 flex justify-between items-center shadow-lg px-8 sticky top-0 z-100">
      <div className="flex gap-6 items-center">
        <Link
          to="/"
          className="mr-4 flex items-center hover:scale-105 transition-transform duration-300"
        >
          <img
            src={logoSmartQuiz}
            alt="SmartQuiz Logo"
            className="h-20 object-contain drop-shadow-md"
          />
        </Link>
        <Link
          to="/dashboard"
          className={`font-semibold text-lg flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-300 ${location.pathname === "/dashboard" ? "border-2 border-[#4bb8fa] text-white bg-white/10 shadow-inner" : "border-2 border-transparent text-white hover:text-[#4bb8fa] hover:bg-white/5"}`}
        >
          <AppstoreOutlined style={{ fontWeight: "bold" }} /> Menu Games
        </Link>
        <Link
          to="/quiz"
          className={`font-semibold text-lg flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-300 ${location.pathname === "/quiz" ? "border-2 border-[#4bb8fa] text-white bg-white/10 shadow-inner" : "border-2 border-transparent text-white hover:text-[#4bb8fa] hover:bg-white/5"}`}
        >
          <PlayCircleOutlined style={{ fontWeight: "bold" }} /> Main Kuis
        </Link>
      </div>

      <div>
        {user && (
          <Dropdown menu={{ items }} placement="bottomRight" arrow>
            <div className="flex items-center gap-3 cursor-pointer bg-white/10 px-5 py-2.5 rounded-full hover:bg-white/20 hover:scale-105 transition-all duration-300 border border-transparent hover:border-[#4bb8fa]">
              <span
                className="text-white font-bold"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {user.nama}
              </span>
              <Avatar
                style={{ backgroundColor: user.warnaAvatar || "#e6f4ff" }}
                src={
                  <img
                    src={bemek}
                    alt="Avatar Bemek"
                    className="object-contain w-full h-full"
                  />
                }
                className="shadow-sm border-2 border-white/80 flex items-center justify-center bg-white"
              />
            </div>
          </Dropdown>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
