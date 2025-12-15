import React, { useState } from "react";
import AreaChart from "./AreaChartComponent";

const SyncedChartViewer = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [hoveredFrameIndex, setHoveredFrameIndex] = useState(0);

  const handleFrameHover = (index) => {
    setHoveredFrameIndex(index);
  };

  return (
    <div style={{ display: "flex", alignItems: "flex-start", margin: 0, padding: 0 }}>
      
      {/* Arrow + label */}
      <div
        style={{
          height: "200px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          marginRight: "6px",
        }}
      >
        <div
          onClick={() => setOpen(!open)}
          style={{
            width: "20px",
            height: "20px",
            cursor: "pointer",
            userSelect: "none",
            color: "red",
            fontSize: "20px",
            lineHeight: "20px",
          }}
        >
          {open ? "▼" : "▶"}
        </div>

        {!open && (
          <div
            style={{
              marginTop: "4px",
              fontSize: "12px",
              color: "#333",
              fontWeight: "bold",
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
              opacity: 0.85,
              pointerEvents: "none",
            }}
          >
            Area Chart
          </div>
        )}
      </div>

      {/* Drawer */}
      <div
        style={{
          overflow: "hidden",
          transition: "width 0.35s ease, opacity 0.35s ease",
          width: open ? "400px" : "0px",
          opacity: open ? 1 : 0,
        }}
      >
        {open && (
          <div style={{ width: "400px", height: "200px" }}>
            <AreaChart data={data} onFrameHover={handleFrameHover} />
          </div>
        )}
      </div>

    </div>
  );
};

export default SyncedChartViewer;
