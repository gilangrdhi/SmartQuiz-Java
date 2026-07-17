import { useState } from "react";
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
  { id: "topi1", src: "/topi1.svg", label: "Topi Polisi" },
  { id: "topi2", src: "/topi2.svg", label: "Topi Koboi" },
  { id: "topi3", src: "/topi3.svg", label: "Helm" },
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

  // State ini sekarang HANYA dipakai untuk simpan data ke DB, bukan untuk render ulang Rnd (menghindari error loop)
  const [hatStyle, setHatStyle] = useState({
    x: 100,
    y: 40,
    width: 100,
    height: 100,
  });
  const [hatRotation, setHatRotation] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    const finalColor =
      typeof bgColor === "string" ? bgColor : bgColor.toHexString();

    const payload = {
      color: finalColor,
      hatId: selectedHat.id,
      hatPositionX: Math.round(hatStyle.x), // Dibulatkan biar backend gak pusing nerima angka desimal
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

  // Gaya untuk titik-titik resize biar kelihatan
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
                // MENGGUNAKAN DEFAULT MENGHINDARI ERROR MAXIMUM UPDATE DEPTH
                default={{ x: 100, y: 40, width: 100, height: 100 }}
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
                // Menambahkan titik bantu visual untuk nge-resize
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
