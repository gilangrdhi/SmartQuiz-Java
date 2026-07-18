import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Dropdown } from "antd"; // Hapus import Avatar bawaan Ant Design
import {
  LogoutOutlined,
  SettingOutlined,
  PlayCircleOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";

import logoSmartQuiz from "../assets/logo-smartquiz.svg";
import AvatarDisplay from "../components/AvatarDisplay";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(() => {
    const loggedInUser = localStorage.getItem("user");
    return loggedInUser ? JSON.parse(loggedInUser) : null;
  });

  const loadCurrentUser = () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    const parsedUser = JSON.parse(storedUser);
    const query = parsedUser.id
      ? `userId=${parsedUser.id}`
      : `email=${encodeURIComponent(parsedUser.email)}`;

    fetch(`/api/avatar/get?${query}`)
      .then((response) => {
        if (!response.ok) throw new Error("Avatar fetch failed");
        return response.json();
      })
      .then((data) => {
        const merged = {
          ...parsedUser,
          warnaAvatar: data.color || parsedUser.warnaAvatar,
          jenisTopi: data.hatId || parsedUser.jenisTopi,
          poseId: data.poseId || parsedUser.poseId,
          topiX: data.hatPositionX,
          topiY: data.hatPositionY,
          topiWidth: data.hatWidth,
          topiHeight: data.hatHeight,
          topiRotation: data.hatRotation || 0,
        };
        setUser(merged);
        localStorage.setItem("user", JSON.stringify(merged));
      })
      .catch(() => {
        setUser(parsedUser);
      });
  };

  useEffect(() => {
    loadCurrentUser();

    const refreshHandler = () => {
      loadCurrentUser();
    };

    window.addEventListener("avatarUpdated", refreshHandler);
    return () => window.removeEventListener("avatarUpdated", refreshHandler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const items = [
    {
      key: "1",
      label: "Profile",
      icon: <SettingOutlined />,
      onClick: () => navigate("/profile"),
    },
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

  const hatSrc =
    user?.jenisTopi && user.jenisTopi !== "none"
      ? `/${user.jenisTopi}.svg`
      : null;

  
  const poseSrc = user?.poseId ? `/${user.poseId}.svg` : "/pose1.svg";

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
            <div className="flex items-center gap-2 cursor-pointer bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 hover:scale-105 transition-all duration-300 border border-transparent hover:border-[#4bb8fa]">
              <span
                className="text-white font-bold mr-2"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {user.nama}
              </span>

              {/* Menggunakan komponen AvatarDisplay yang baru */}
              <AvatarDisplay
                size={48} // Ukuran kecil untuk navbar
                bgColor={user.warnaAvatar || "#e6f4ff"}
                poseSrc={poseSrc}
                hatSrc={hatSrc}
                hatConfig={{
                  x: user.topiX || 0,
                  y: user.topiY || 0,
                  width: user.topiWidth || 0,
                  height: user.topiHeight || 0,
                  rotation: user.topiRotation || 0,
                }}
              />
            </div>
          </Dropdown>
        )}
      </div>
    </nav>
  );
}
