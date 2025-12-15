import React, { useState } from "react";
import IntensityChartComponent from "./IntensityChartComponent";

const IntensityChartDrawer = ({ data }) => {
  const [open, setOpen] = useState(false); // closed by default

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        margin: 0,
        padding: 0,
      }}
    >

      {/* Arrow + vertical label */}
      <div
        style={{
          height: "200px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          marginRight: "6px",
        }}
      >
        {/* Arrow button */}
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

        {/* Vertical label when closed */}
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
            Intensity Chart
          </div>
        )}
      </div>

      {/* Horizontal drawer */}
      <div
        style={{
          overflow: "hidden",
          transition: "width 0.35s ease, opacity 0.35s ease",
          width: open ? "420px" : "0px",
          opacity: open ? 1 : 0,
        }}
      >
        {open && (
          <div style={{ width: "420px", height: "200px" }}>
            <IntensityChartComponent data={data} />
          </div>
        )}
      </div>

    </div>
  );
};

export default IntensityChartDrawer;
