import { Typography, Tabs, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import CustomAvatar from "../components/AvatarCustomizer";
import ProfileInfo from "../components/ProfileInfo";

const { Title } = Typography;

const ProfilePage = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#e0f2fe",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "32px",
          }}
        >
          <Button
            type="text"
            icon={
              <ArrowLeftOutlined
                style={{ fontSize: "20px", color: "#0f3460" }}
              />
            }
            onClick={() => navigate("/")}
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: "#ffffff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          />
          <Title
            level={2}
            style={{ margin: 0, fontWeight: 800, color: "#0f3460" }}
          >
            Pengaturan Akun
          </Title>
        </div>

        <Tabs
          defaultActiveKey="1"
          size="large"
          tabBarStyle={{
            marginBottom: "24px",
            borderBottom: "2px solid #bae6fd",
          }}
          items={[
            {
              key: "1",
              label: (
                <span
                  style={{
                    fontWeight: 600,
                    fontSize: "16px",
                    padding: "8px 4px",
                  }}
                >
                  Profil & Statistik
                </span>
              ),
              children: <ProfileInfo />,
            },
            {
              key: "2",
              label: (
                <span
                  style={{
                    fontWeight: 600,
                    fontSize: "16px",
                    padding: "8px 4px",
                  }}
                >
                  Ubah Avatar
                </span>
              ),
              children: <CustomAvatar />,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
