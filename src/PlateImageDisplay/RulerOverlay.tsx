import React from "react";

interface MiniRulerProps {
  mm?: number; // length in mm, default 10mm
}

const MiniRuler: React.FC<MiniRulerProps> = ({ mm = 10 }) => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "10px",
        left: "10px",
        width: `${mm}mm`,        // ← preserves REAL scale
        height: "30px",
        display: "flex",
        flexDirection: "row",
        pointerEvents: "none",
      }}
    >
      {Array.from({ length: mm + 1 }).map((_, i) => {
        const isMajor = i === 0 || i === mm;
        const tickHeight = isMajor ? 20 : 10;

        return (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              width: `${1}mm`,   // each mm gets its own block = real scale
            }}
          >
            {/* tick line */}
            <div
              style={{
                width: "2px",
                height: `${tickHeight}px`,
                backgroundColor: "lime",
              }}
            />

            {/* labels: show "0" and "1" cm only */}
            {isMajor && (
              <span
                style={{
                  marginTop: "2px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: "lime",
                }}
              >
                {i === 0 ? "0" : "1"}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MiniRuler;
