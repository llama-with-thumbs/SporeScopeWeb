import React, { useEffect, useRef } from "react";

const PerimeterPathComponent = ({ shapes }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!shapes || shapes.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ------------------------------------------
    // GLOBAL SCALE SETTINGS
    // ------------------------------------------
    const ORIGINAL_SIZE = 500;   // image-space (your shape coordinates)
    const CANVAS_SIZE = 200;     // visible component size
    const PADDING = 10;          // small inner padding

    const drawableSize = CANVAS_SIZE - PADDING * 2;
    const scale = drawableSize / ORIGINAL_SIZE;

    const offsetX = PADDING;
    const offsetY = PADDING;

    // ------------------------------------------
    // DRAW ALL SHAPES USING GLOBAL SCALE
    // ------------------------------------------
    shapes.forEach((shape) => {
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

      ctx.fillStyle = "rgba(0,150,255,0.25)";
      ctx.strokeStyle = "rgb(0,120,255)";
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();
    });
  }, [shapes]);

  return (
    <div
      style={{
        border: "1px solid #ccc",
        width: "200px",
        height: "200px",
        borderRadius: "4px",
        padding: "0",
      }}
    >
      <canvas
        ref={canvasRef}
        width={200}
        height={200}
        style={{ background: "#f8f8f8" }}
      />
    </div>
  );
};

export default PerimeterPathComponent;
