import { useEffect, useState } from "react";
import {
  ColorPicker,
  Button,
  Typography,
  Card,
  Divider,
  Slider,
  message,
} from "antd";
import { Rnd } from "react-rnd";

const { Text, Title } = Typography;

const HATS_OPTIONS = [
  { id: "none", src: null, label: "Tanpa Topi" },
  { id: "mask", src: "/mask.svg", label: "Mask" },
  { id: "topi1", src: "/topi1.svg", label: "Topi Koboi" },
  { id: "topi2", src: "/topi2.svg", label: "Topi Badut" },
  { id: "topi3", src: "/topi3.svg", label: "Punk" },
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
  const [messageApi, contextHolder] = message.useMessage();

  const [bgColor, setBgColor] = useState("#87CEEB");
  const [selectedHat, setSelectedHat] = useState(HATS_OPTIONS[0]);
  const [hatStyle, setHatStyle] = useState({
    x: 100,
    y: 40,
    width: 100,
    height: 100,
  });
  const [hatRotation, setHatRotation] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadAvatar = async () => {
      try {
        const response = await fetch("/api/avatar/get");
        if (!response.ok) throw new Error("Gagal mengambil data avatar");

        const data = await response.json();
        setBgColor(data.color || "#87CEEB");
        setSelectedHat(
          HATS_OPTIONS.find((hat) => hat.id === data.hatId) || HATS_OPTIONS[0],
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

  const handleSave = async () => {
    setIsSaving(true);
    const finalColor =
      typeof bgColor === "string" ? bgColor : bgColor.toHexString();

    const payload = {
      color: finalColor,
      hatId: selectedHat.id,
      hatPositionX: Math.round(hatStyle.x),
      hatPositionY: Math.round(hatStyle.y),
      hatWidth: Math.round(hatStyle.width),
      hatHeight: Math.round(hatStyle.height),
      hatRotation: hatRotation,
    };

    try {
      const response = await fetch("/api/avatar/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Gagal menyimpan ke database");

      messageApi.success("Karakter berhasil disimpan ke Database! 🚀");
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
    width: "10px",
    height: "10px",
    background: "red",
    borderRadius: "50%",
    border: "2px solid white",
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        padding: "24px",
      }}
    >
      {contextHolder}

      <Card
        style={{
          maxWidth: 750,
          width: "100%",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
        styles={{ body: { padding: "32px" } }}
      >
        <Title
          level={3}
          style={{ textAlign: "center", marginTop: 0, marginBottom: "24px" }}
        >
          ✨ Sesuaikan Karaktermu
        </Title>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "40px",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              width: 300,
              height: 300,
              backgroundColor: hexColor,
              position: "relative",
              borderRadius: "16px",
              border: "4px solid #f0f0f0",
              overflow: "hidden",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src="/bemek.svg"
              alt="Bemek"
              style={{
                width: "80%",
                height: "80%",
                objectFit: "contain",
                zIndex: 1,
                pointerEvents: "none",
              }}
            />

            {selectedHat.src && (
              <Rnd
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
                <img
                  src={selectedHat.src}
                  alt={selectedHat.label}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    pointerEvents: "none",
                    transform: `rotate(${hatRotation}deg)`,
                  }}
                  draggable="false"
                />
              </Rnd>
            )}
          </div>

          <div
            style={{
              flex: 1,
              minWidth: "280px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <div>
              <Text strong style={{ display: "block", marginBottom: "8px" }}>
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

            <Divider style={{ margin: "8px 0" }} />

            <div>
              <Text strong style={{ display: "block", marginBottom: "8px" }}>
                Pilih Aksesoris Topi
              </Text>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {HATS_OPTIONS.map((hat) => (
                  <Button
                    key={hat.id}
                    type={selectedHat.id === hat.id ? "primary" : "default"}
                    onClick={() => setSelectedHat(hat)}
                    shape="round"
                  >
                    {hat.label}
                  </Button>
                ))}
              </div>
            </div>

            {selectedHat.id !== "none" && (
              <div>
                <Text strong style={{ display: "block" }}>
                  Putar Topi
                </Text>
                <Slider
                  min={0}
                  max={360}
                  value={hatRotation}
                  onChange={setHatRotation}
                  tooltip={{ formatter: (v) => `${v}°` }}
                />
              </div>
            )}

            <div style={{ marginTop: "auto", paddingTop: "16px" }}>
              <Button
                type="primary"
                size="large"
                block
                onClick={handleSave}
                loading={isSaving}
                style={{ borderRadius: "8px" }}
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
