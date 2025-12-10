import React from "react";

interface ReloadChamberButtonProps {
  onReload: () => void;
  loading?: boolean;
}

const ReloadChamberButton: React.FC<ReloadChamberButtonProps> = ({ onReload, loading }) => {
  return (
    <button
      onClick={onReload}
      disabled={loading}
      style={{
        padding: "8px 12px",
        borderRadius: "5px",
        backgroundColor: loading ? "#888" : "#cc0000",
        color: "white",
        border: "none",
        cursor: loading ? "default" : "pointer",
        fontSize: "14px",
        fontWeight: 600,
        marginBottom: "12px",
        display: "flex",
        alignItems: "center",
        gap: "6px",
      }}
    >
      {loading ? "⏳ Reloading..." : "🔄 Reload Chamber"}
    </button>
  );
};

export default ReloadChamberButton;
