const AvatarDisplay = ({
  bgColor = "#87CEEB",
  poseSrc = "/pose1.svg",
  hatSrc = null,
  hatConfig = { x: 0, y: 0, width: 0, height: 0, rotation: 0 },
  size = 120,
}) => {
  const baseWidth = 340;
  const baseHeight = 380;
  const scale = size / baseWidth;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%", // Membuatnya bulat
        backgroundColor: bgColor,
        overflow: "hidden",
        position: "relative",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        border: "4px solid rgba(255,255,255,0.8)",
      }}
    >
      <div
        style={{
          width: baseWidth,
          height: baseHeight,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        <img
          src={poseSrc}
          alt="pose"
          style={{
            position: "absolute",
            left: "50%",
            top: "-18%",
            width: "auto",
            height: "150%",
            transform: "translateX(-50%)",
            objectFit: "contain",
            zIndex: 1,
          }}
        />

        {hatSrc && (
          <img
            src={hatSrc}
            alt="hat"
            style={{
              position: "absolute",
              left: hatConfig.x,
              top: hatConfig.y,
              width: hatConfig.width,
              height: hatConfig.height,
              transform: `rotate(${hatConfig.rotation}deg)`,
              objectFit: "contain",
              zIndex: 2,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AvatarDisplay;
