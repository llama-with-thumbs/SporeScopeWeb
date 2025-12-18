import React, { useState } from "react";

interface Props {
  children: React.ReactNode;
  label?: string;   // NEW: allows naming the component (e.g., "Culture Profile")
}

const CultureProfileContainer: React.FC<Props> = ({ children, label = "Culture Profile" }) => {
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

      {/* Arrow + label container */}
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
          onMouseEnter={(e) => e.currentTarget.style.color = "#cc0000"}
          onMouseLeave={(e) => e.currentTarget.style.color = "red"}
          style={{
            width: "20px",
            height: "20px",
            cursor: "pointer",
            userSelect: "none",
            color: "red",
            fontSize: "20px",
            lineHeight: "20px",
            transition: "color 0.2s ease",
          }}
        >
          {open ? "▼" : "▶"}
        </div>

        {/* --- LABEL appears only when closed --- */}
        {!open && (
          <div
            style={{
              marginTop: "4px",
              fontSize: "12px",
              color: "#333",
              fontWeight: "bold",
              writingMode: "vertical-rl", // keeps height small & fits under arrow
              transform: "rotate(180deg)",
              opacity: 0.85,
            }}
          >
            {label}
          </div>
        )}
      </div>

      {/* Collapsible drawer */}
      <div
        style={{
          overflow: "hidden",
          transition: "width 0.35s ease, opacity 0.35s ease",
          width: open ? "290px" : "0px",
          opacity: open ? 1 : 0,
        }}
      >
        {open && (
          <div style={{ width: "290px" }}>
            {children}
          </div>
        )}
      </div>

    </div>
  );
};

export default CultureProfileContainer;
