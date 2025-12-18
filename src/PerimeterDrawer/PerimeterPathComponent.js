import React, { useEffect, useRef, useState } from "react";

const PerimeterPathComponent = ({ shapes }) => {
  const canvasRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // ------------------------------------------
  // SCALE / REAL-WORLD SETTINGS
  // ------------------------------------------
  const ORIGINAL_SIZE = 500;
  const CANVAS_SIZE = 200;
  const PADDING = 0;

  // If your plate is 6 cm diameter:
  const PLATE_DIAMETER_MM = 58;

  // Shoelace formula: returns area in "coordinate units^2"
  const polygonArea = (coords) => {
    if (!coords || coords.length < 3) return 0;

    let sum = 0;
    for (let i = 0; i < coords.length; i++) {
      const p1 = coords[i];
      const p2 = coords[(i + 1) % coords.length];
      sum += p1.x * p2.y - p2.x * p1.y;
    }
    return Math.abs(sum) / 2;
  };

  // Convert polygon area into mm² using ORIGINAL_SIZE and CANVAS_SIZE
  const calculateAreaMm2 = (coords) => {
    const areaOriginalUnits2 = polygonArea(coords);

    // convert original-units area -> canvas-px area
    const scale = (CANVAS_SIZE - PADDING * 2) / ORIGINAL_SIZE;
    const areaCanvasPx2 = areaOriginalUnits2 * scale * scale;

    // convert canvas pixels -> mm
    const mmPerCanvasPx = PLATE_DIAMETER_MM / CANVAS_SIZE;
    const areaMm2 = areaCanvasPx2 * mmPerCanvasPx * mmPerCanvasPx;

    return areaMm2;
  };

  useEffect(() => {
    if (!shapes || shapes.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const drawableSize = CANVAS_SIZE - PADDING * 2;
    const scale = drawableSize / ORIGINAL_SIZE;

    const offsetX = PADDING;
    const offsetY = PADDING;

    shapes.forEach((shape, index) => {
      const coords = shape.coordinates;
      if (!coords || coords.length === 0) return;

      ctx.beginPath();

      coords.forEach((p, i) => {
        const x = p.x * scale + offsetX;
        const y = p.y * scale + offsetY;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });

      ctx.closePath();

      const isHovered = index === hoveredIndex;

      ctx.fillStyle = isHovered
        ? "rgba(0,180,0,0.3)"
        : "rgba(0,150,255,0.25)";

      ctx.strokeStyle = isHovered
        ? "rgb(0,140,0)"
        : "rgb(0,120,255)";

      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();
    });

    const originalRadius = ORIGINAL_SIZE / 2;
    const scaledRadius = originalRadius * scale;

    const centerX = offsetX + scaledRadius;
    const centerY = offsetY + scaledRadius;

    ctx.beginPath();
    ctx.arc(centerX, centerY, scaledRadius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(0, 60, 255, 0.9)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }, [shapes, hoveredIndex]);

  const handleMouseMove = (e) => {
    if (!shapes || shapes.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({ x, y });

    const scale = (CANVAS_SIZE - PADDING * 2) / ORIGINAL_SIZE;
    let found = null;

    shapes.forEach((shape, index) => {
      const coords = shape.coordinates;
      if (!coords || coords.length === 0) return;

      ctx.beginPath();

      coords.forEach((p, i) => {
        const px = p.x * scale + PADDING;
        const py = p.y * scale + PADDING;

        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });

      ctx.closePath();

      if (ctx.isPointInPath(x, y)) {
        found = index;
      }
    });

    setHoveredIndex(found);
  };

  const hasData = shapes && shapes.length > 0;
  const hoveredShape = hoveredIndex != null ? shapes[hoveredIndex] : null;

  // Compute area if missing
  let displayAreaText = null;
  if (hoveredShape) {
    if (hoveredShape.area_mm2 != null) {
      displayAreaText = `Area: ${hoveredShape.area_mm2} mm²`;
    } else if (hoveredShape.coordinates && hoveredShape.coordinates.length >= 3) {
      const computed = calculateAreaMm2(hoveredShape.coordinates);
      displayAreaText = `Area: ${computed.toFixed(2)} mm²`;
    } else {
      displayAreaText = "Area: unknown";
    }
  }

  return (
    <div
      style={{
        border: "1px solid #ccc",
        width: "200px",
        height: "200px",
        borderRadius: "4px",
        position: "relative",
      }}
    >
      <canvas
        ref={canvasRef}
        width={200}
        height={200}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredIndex(null)}
        style={{ background: "#f8f8f8" }}
      />

      {!hasData && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#777",
            fontSize: "12px",
            pointerEvents: "none",
          }}
        >
          no shapes recognized
        </div>
      )}

      {hoveredShape && (
        <div
          style={{
            position: "absolute",
            left: mousePos.x + 10,
            top: mousePos.y - 10,
            background: "#fff",
            border: "1px solid #aaa",
            borderRadius: "4px",
            padding: "6px 8px",
            fontSize: "11px",
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          <div>{`Shape: ${hoveredIndex + 1}`}</div>
          <div>{displayAreaText}</div>

          <div
            style={{
              position: "absolute",
              left: "-6px",
              top: "10px",
              width: 0,
              height: 0,
              borderTop: "6px solid transparent",
              borderBottom: "6px solid transparent",
              borderRight: "6px solid #aaa",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default PerimeterPathComponent;
