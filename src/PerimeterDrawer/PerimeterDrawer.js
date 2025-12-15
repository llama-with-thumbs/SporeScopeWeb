// PerimeterDrawer.tsx

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
      }}
    >
      {/* Arrow container with FIXED height */}
      <div
        style={{
          height: "200px",
          display: "flex",
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
      </div>

      {/* Collapsible drawer */}
      <div
        style={{
          overflow: "hidden",
          transition: "width 0.35s ease, opacity 0.35s ease",
          width: open ? "200px" : "0px",  // Same as GIF drawer
          opacity: open ? 1 : 0,
        }}
      >
        {open && (
          <div style={{ width: "200px" }}>
            {/* The actual perimeter component */}
            <PerimeterPath data={data} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PerimeterDrawer;
