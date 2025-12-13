import React from "react";

interface RulerOverlayProps {
  mm?: number;        // physical width the ruler represents
  height?: number;    // total height of the ruler in px
  color?: string;     // tick + text color
  offset?: number;    // distance from bottom in px
}

const RulerOverlay: React.FC<RulerOverlayProps> = ({
  mm = 58,
  height = 24,
  color = "lime",
  offset = 4,
}) => {
  // Create array [0, 1, 2, ..., mm-1]
  const ticks = Array.from({ length: mm + 1 }, (_, i) => i);

  return (
    <div
      style={{
        position: "absolute",
        bottom: `${offset}px`,
        left: "50%",
        transform: "translateX(-50%)",
        width: `${mm}mm`,
        height: `${height}px`,
        display: "flex",
        justifyContent: "space-between",
        pointerEvents: "none",
        opacity: 0.95,
      }}
    >
      {ticks.map((i) => {
        const isMajor = i % 10 === 0;
        const isMedium = i % 5 === 0;

        const tickHeight = isMajor ? height : isMedium ? height * 0.6 : height * 0.35;
        const showNumber = isMajor && i !== 0 && i !== mm;

        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "flex-end",
              flexDirection: "column",
              width: "1px",
            }}
          >
            {/* TICK */}
            <div
              style={{
                width: "2px",
                height: `${tickHeight}px`,
                backgroundColor: color,
              }}
            />

            {/* NUMBER (below the tick) */}
            {showNumber && (
              <span
                style={{
                  fontSize: "9px",
                  marginTop: "2px",
                  color: color,
                  transform: "translateX(-3px)",
                }}
              >
                {i}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default RulerOverlay;
