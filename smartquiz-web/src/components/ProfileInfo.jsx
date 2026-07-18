import { useState } from "react";
import {
  Card,
  Button,
  Input,
  Typography,
  Space,
  Row,
  Col,
  Statistic,
  Divider,
} from "antd";
import {
  EditOutlined,
  SaveOutlined,
  TrophyOutlined,
  FireOutlined,
  StarOutlined,
} from "@ant-design/icons";

import AvatarDisplay from "./AvatarDisplay";

const { Title, Text } = Typography;

const ProfileInfo = () => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error(error);
      return null;
    }
  });

  const [isEditingName, setIsEditingName] = useState(false);

  const [tempName, setTempName] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored).nama || "" : "";
    } catch (error) {
      console.error(error);
      return "";
    }
  });

  const handleSaveName = () => {
    if (!user) return;
    const updatedUser = { ...user, nama: tempName };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setIsEditingName(false);

    window.dispatchEvent(new CustomEvent("avatarUpdated"));
  };

  if (!user) return null;

  const hatSrc =
    user.jenisTopi && user.jenisTopi !== "none"
      ? `/${user.jenisTopi}.svg`
      : null;

  const poseSrc = user.poseId ? `/${user.poseId}.svg` : "/pose1.svg";

  return (
    <Card
      style={{
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
        border: "1px solid #f0f0f0",
      }}
      bodyStyle={{ padding: "32px 40px" }}
    >
      {/* --- HEADER --- */}
      <div style={{ marginBottom: "12px" }}>
        <Title
          level={3}
          style={{ color: "#003366", fontWeight: 800, margin: 0 }}
        >
          Informasi Akun
        </Title>
        <Text type="secondary" style={{ display: "block", marginTop: "4px" }}>
          Lihat detail profil dan statistik pencapaian kuis kamu.
        </Text>
      </div>

      <Divider style={{ marginTop: "12px", marginBottom: "32px" }} />
      <Row gutter={[48, 32]} align="middle">
        <Col
          xs={24}
          md={10}
          style={{ textAlign: "center", borderRight: "1px solid #f0f0f0" }}
        >
          <div
            style={{
              position: "relative",
              display: "inline-block",
              marginBottom: "24px",
            }}
          >
            <AvatarDisplay
              size={120}
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

          <Space
            direction="vertical"
            size="middle"
            style={{ display: "flex", width: "100%", padding: "0 24px" }}
          >
            {isEditingName ? (
              <Space.Compact style={{ width: "100%" }}>
                <Input
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onPressEnter={handleSaveName}
                  autoFocus
                />
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={handleSaveName}
                >
                  Simpan
                </Button>
              </Space.Compact>
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Title level={4} style={{ margin: 0, color: "#1f2937" }}>
                  {user.nama}
                </Title>
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => {
                    setTempName(user.nama);
                    setIsEditingName(true);
                  }}
                />
              </div>
            )}

            <div
              style={{
                backgroundColor: "#f8fafc",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
              }}
            >
              <Text
                type="secondary"
                style={{ display: "block", fontSize: "12px" }}
              >
                Email Terdaftar
              </Text>
              <Text strong style={{ color: "#334155" }}>
                {user.email}
              </Text>
            </div>
          </Space>
        </Col>

        {/* KOLOM KANAN: STATISTIK */}
        <Col xs={24} md={14} style={{ paddingLeft: "24px" }}>
          <Title
            level={5}
            style={{ color: "#64748b", marginBottom: "24px", fontWeight: 600 }}
          >
            PENCAPAIAN BERMAIN
          </Title>
          <Row gutter={[24, 32]}>
            <Col span={12}>
              <div
                style={{
                  padding: "16px",
                  backgroundColor: "#fff1f0",
                  borderRadius: "12px",
                  border: "1px solid #ffccc7",
                }}
              >
                <Statistic
                  title="Total Kuis"
                  value={42}
                  prefix={<FireOutlined style={{ color: "#ff4d4f" }} />}
                />
              </div>
            </Col>
            <Col span={12}>
              <div
                style={{
                  padding: "16px",
                  backgroundColor: "#fffbe6",
                  borderRadius: "12px",
                  border: "1px solid #ffe58f",
                }}
              >
                <Statistic
                  title="Total Poin"
                  value={15200}
                  prefix={<StarOutlined style={{ color: "#faad14" }} />}
                />
              </div>
            </Col>
            <Col span={24}>
              <div
                style={{
                  padding: "16px",
                  backgroundColor: "#f6ffed",
                  borderRadius: "12px",
                  border: "1px solid #b7eb8f",
                }}
              >
                <Statistic
                  title="Tingkat Kemenangan"
                  value={78}
                  suffix="% (Win Rate)"
                  prefix={<TrophyOutlined style={{ color: "#52c41a" }} />}
                />
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default ProfileInfo;
