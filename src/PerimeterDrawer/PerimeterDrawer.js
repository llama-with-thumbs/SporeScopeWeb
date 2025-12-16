import React, { useState } from "react";
import PerimeterPath from "./PerimeterPathComponent";

const PerimeterDrawer = ({ data }) => {
  const [open, setOpen] = useState(true);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        margin: 0,
        padding: 0,
      }}>
      {/* Arrow + label container */}
      <div
        style={{
          height: "200px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          marginRight: "6px",
        }}>
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
          }}>
          {open ? "▼" : "▶"}
        </div>

        {/* Label shown only when closed */}
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
            }}>
            Detected shapes
          </div>
        )}
      </div>

      {/* Collapsible drawer */}
      <div
        style={{
          overflow: "hidden",
          transition: "width 0.35s ease, opacity 0.35s ease",
          width: open ? "220px" : "0px",
          opacity: open ? 1 : 0,
        }}>
          
        {open && (
          <div style={{ width: "220px" }}>
            <PerimeterPath shapes={data} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PerimeterDrawer;
