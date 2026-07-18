import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ColorPicker,
  Button,
  Typography,
  Card,
  Divider,
  message,
  notification,
} from "antd";
import { Rnd } from "react-rnd";
import { CheckCircleOutlined, SyncOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

const HATS_OPTIONS = [
  { id: "none", src: null, label: "Tanpa Topi" },
  { id: "rabraw", src: "/rabraw.svg", label: "Rabraw" },
  { id: "koboi", src: "/koboi.svg", label: "Koboi" },
  { id: "punk", src: "/punk.svg", label: "Punk" },
  { id: "mekdi", src: "/mekdi.svg", label: "McD" },
  { id: "rusdi", src: "/rusdi.svg", label: "Rusdi" },
  { id: "one", src: "/one.svg", label: "#1" },
  { id: "lalalala", src: "/lalalala.svg", label: "lalalala" },
  { id: "flower", src: "/flower.svg", label: "flower" },
];

const POSE_OPTIONS = [
  { id: "pose1", src: "/pose1.svg", label: "Pose 1" },
  { id: "pose2", src: "/pose2.svg", label: "Pose 2" },
  { id: "pose3", src: "/pose3.svg", label: "Pose 3" },
  { id: "pose4", src: "/pose4.svg", label: "Pose 4" },
];

const colorPresets = [
  {
    label: "Warna Basic",
    colors: [
      "#FFFFFF",
      "#000000",
      "#87CEEB",
      "#8B4513",
      "#FF0000",
      "#00FF00",
      "#1677ff",
      "#FAAD14",
    ],
  },
];

const AvatarCustomizer = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const [bgColor, setBgColor] = useState("#87CEEB");
  const [selectedHat, setSelectedHat] = useState(HATS_OPTIONS[0]);
  const [selectedPose, setSelectedPose] = useState(POSE_OPTIONS[0]);
  const [hatStyle, setHatStyle] = useState({
    x: 110,
    y: 12,
    width: 120,
    height: 120,
  });
  const [hatRotation, setHatRotation] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  // Ref untuk menghitung titik tengah elemen saat rotasi
  const hatNodeRef = useRef(null);

  useEffect(() => {
    const loadAvatar = async () => {
      const savedUser = localStorage.getItem("user");
      if (!savedUser) return;

      const parsedUser = JSON.parse(savedUser);
      setUserId(parsedUser.id || null);
      setUserEmail(parsedUser.email || null);

      const query = parsedUser.id
        ? `userId=${parsedUser.id}`
        : `email=${encodeURIComponent(parsedUser.email)}`;

      try {
        const response = await fetch(`/api/avatar/get?${query}`);
        if (!response.ok) throw new Error("Gagal mengambil data avatar");

        const data = await response.json();
        setBgColor(data.color || "#87CEEB");
        setSelectedHat(
          HATS_OPTIONS.find((hat) => hat.id === data.hatId) || HATS_OPTIONS[0],
        );
        setSelectedPose(
          POSE_OPTIONS.find((pose) => pose.id === data.poseId) ||
            POSE_OPTIONS[0],
        );
        setHatStyle({
          x: data.hatPositionX ?? 100,
          y: data.hatPositionY ?? 40,
          width: data.hatWidth ?? 100,
          height: data.hatHeight ?? 100,
        });
        setHatRotation(data.hatRotation ?? 0);
      } catch (error) {
        console.error("Error loading avatar:", error);
      }
    };

    loadAvatar();
  }, []);

  const startRotate = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!hatNodeRef.current) return;

    const rect = hatNodeRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const onMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - centerX;
      const dy = moveEvent.clientY - centerY;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      setHatRotation(Math.round(angle - 90));
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };
  // ------------------------------------------

  const handleSave = async () => {
    if (!userId && !userEmail) {
      messageApi.error(
        "Akun tidak valid. Silakan login ulang terlebih dahulu.",
      );
      return;
    }

    setIsSaving(true);
    const finalColor =
      typeof bgColor === "string" ? bgColor : bgColor.toHexString();

    const payload = {
      color: finalColor,
      hatId: selectedHat.id,
      poseId: selectedPose.id,
      hatPositionX: Math.round(hatStyle.x),
      hatPositionY: Math.round(hatStyle.y),
      hatWidth: Math.round(hatStyle.width),
      hatHeight: Math.round(hatStyle.height),
      hatRotation: Math.round(hatRotation),
    };

    try {
      const query = userId
        ? `userId=${userId}`
        : `email=${encodeURIComponent(userEmail)}`;

      const response = await fetch(`/api/avatar/save?${query}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Gagal menyimpan ke database");

      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        const updatedUser = {
          ...parsedUser,
          warnaAvatar: finalColor,
          jenisTopi: selectedHat.id,
          poseId: selectedPose.id,
          topiX: Math.round(hatStyle.x),
          topiY: Math.round(hatStyle.y),
          topiWidth: Math.round(hatStyle.width),
          topiHeight: Math.round(hatStyle.height),
          topiRotation: Math.round(hatRotation),
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        window.dispatchEvent(new CustomEvent("avatarUpdated"));
      }

      notification.open({
        message: (
          <span style={{ fontWeight: 700, color: "#0f3460" }}>
            Avatar Diperbarui!
          </span>
        ),
        description:
          "Penampilan barumu sudah berhasil disimpan. Tampil lebih kece sekarang!",
        icon: (
          <CheckCircleOutlined style={{ color: "#52c41a", fontSize: "24px" }} />
        ),
        placement: "topRight",
        style: {
          borderRadius: "12px",
          border: "1px solid #b7eb8f",
          backgroundColor: "#f6ffed",
        },
        duration: 2.5,
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Error saving avatar:", error);
      messageApi.error("Gagal terhubung ke server backend / Data tidak valid.");
    } finally {
      setIsSaving(false);
    }
  };

  const hexColor =
    typeof bgColor === "string" ? bgColor : bgColor.toHexString();

  const handleStyle = {
    width: "12px",
    height: "12px",
    background: "#0f3460",
    borderRadius: "50%",
    border: "2px solid white",
  };

  return (
    <div style={{ width: "100%" }}>
      {contextHolder}

      <Card
        style={{
          width: "100%",
          minHeight: 560,
          position: "relative",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
          border: "1px solid #f0f0f0",
          overflow: "hidden",
        }}
        bodyStyle={{ padding: "32px 40px" }}
      >
        <div style={{ marginBottom: "12px" }}>
          <Title
            level={3}
            style={{ color: "#003366", fontWeight: 800, margin: 0 }}
          >
            Edit Avatar
          </Title>
          <Text type="secondary" style={{ display: "block", marginTop: "4px" }}>
            Atur pose, topi, dan warna latar. Tarik icon di bawah topi untuk
            memutar.
          </Text>
        </div>

        <Divider style={{ marginTop: "12px", marginBottom: "32px" }} />

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "48px",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              width: 340,
              height: 380,
              backgroundColor: hexColor,
              position: "relative",
              borderRadius: "22px",
              border: "4px solid rgba(255,255,255,0.92)",
              boxShadow: "0 18px 45px rgba(15, 52, 96, 0.14)",
              overflow: "hidden",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={selectedPose.src}
              alt={selectedPose.label}
              style={{
                position: "absolute",
                left: "50%",
                top: "-18%",
                width: "auto",
                height: "150%",
                transform: "translateX(-50%)",
                objectFit: "contain",
                zIndex: 1,
                pointerEvents: "none",
              }}
            />

            {selectedHat.src && (
              <Rnd
                cancel=".rotate-handle"
                position={{ x: hatStyle.x, y: hatStyle.y }}
                size={{ width: hatStyle.width, height: hatStyle.height }}
                onDragStop={(e, d) =>
                  setHatStyle((prev) => ({ ...prev, x: d.x, y: d.y }))
                }
                onResizeStop={(e, dir, ref, delta, pos) => {
                  setHatStyle({
                    width: ref.offsetWidth,
                    height: ref.offsetHeight,
                    ...pos,
                  });
                }}
                bounds="parent"
                style={{ zIndex: 2 }}
                resizeHandleStyles={{
                  bottomRight: handleStyle,
                  bottomLeft: handleStyle,
                  topRight: handleStyle,
                  topLeft: handleStyle,
                }}
              >
                <div
                  ref={hatNodeRef}
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                  }}
                >
                  <img
                    src={selectedHat.src}
                    alt={selectedHat.label}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      pointerEvents: "none",
                      transform: `rotate(${hatRotation}deg)`,
                      transformOrigin: "center center",
                    }}
                    draggable="false"
                  />

                  <div
                    className="rotate-handle"
                    onMouseDown={startRotate}
                    style={{
                      position: "absolute",
                      bottom: "-35px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "28px",
                      height: "28px",
                      backgroundColor: "#1591dc",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "grab",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                      color: "white",
                      fontSize: "14px",
                    }}
                  >
                    <SyncOutlined />
                  </div>
                </div>
              </Rnd>
            )}
          </div>

          <div
            style={{
              flex: 1,
              minWidth: "280px",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            <div>
              <Text
                strong
                style={{
                  display: "block",
                  marginBottom: "8px",
                  color: "#334155",
                }}
              >
                Pilih Warna Latar
              </Text>
              <ColorPicker
                value={bgColor}
                onChange={setBgColor}
                showText
                presets={colorPresets}
                style={{ width: "100%" }}
              />
            </div>

            <Divider style={{ margin: "0" }} />

            <div>
              <Text
                strong
                style={{
                  display: "block",
                  marginBottom: "12px",
                  color: "#334155",
                }}
              >
                Pilih Pose
              </Text>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {POSE_OPTIONS.map((pose) => (
                  <Button
                    key={pose.id}
                    type={selectedPose.id === pose.id ? "primary" : "default"}
                    onClick={() => setSelectedPose(pose)}
                    shape="round"
                  >
                    {pose.label}
                  </Button>
                ))}
              </div>
            </div>

            <Divider style={{ margin: "0" }} />

            <div>
              <Text
                strong
                style={{
                  display: "block",
                  marginBottom: "12px",
                  color: "#334155",
                }}
              >
                Aksesori Topi
              </Text>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {HATS_OPTIONS.map((hat) => (
                  <Button
                    key={hat.id}
                    type={selectedHat.id === hat.id ? "primary" : "default"}
                    onClick={() => setSelectedHat(hat)}
                    shape="round"
                    style={{
                      minWidth: 100,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    {hat.src && (
                      <img
                        src={hat.src}
                        alt={hat.label}
                        style={{ width: 20, height: 20, objectFit: "contain" }}
                      />
                    )}
                    {hat.label}
                  </Button>
                ))}
              </div>
            </div>

            <div style={{ marginTop: "auto", paddingTop: "16px" }}>
              <Button
                type="primary"
                size="large"
                block
                onClick={handleSave}
                loading={isSaving}
                style={{
                  borderRadius: "8px",
                  height: "48px",
                  fontSize: "16px",
                  fontWeight: 600,
                }}
              >
                Simpan Karakter
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AvatarCustomizer;
