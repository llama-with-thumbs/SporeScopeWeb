import React, { useEffect, useState } from 'react';

const PerimeterPath = ({ data, frameIndex = 0 }) => {
  const [canvasId] = useState(`canvas-${Math.random().toString(36).substr(2, 9)}`); // Generate a unique canvas ID

  // Sort data by timestamp
  const sortedData = [...data].sort((a, b) => new Date(a.timestamp_str) - new Date(b.timestamp_str));

  const drawPath = (ctx, perimeterPath, timestamp) => {
    if (perimeterPath && perimeterPath.object_perimeter && ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clear previous frame

      const parsedPerimeter = JSON.parse(perimeterPath.object_perimeter);

      // Extract the first four pairs as image corners and use them to calculate canvas size
      const [topLeft, topRight, bottomRight, bottomLeft, ...polygonPoints] = parsedPerimeter;

      const canvasWidth = topRight[0] - topLeft[0];
      const canvasHeight = bottomLeft[1] - topLeft[1];

      // Scale the canvas to fit inside a 150x200 space while maintaining proportions
      const maxCanvasWidth = 150;
      const maxCanvasHeight = 200;
      const scaleX = maxCanvasWidth / canvasWidth;
      const scaleY = maxCanvasHeight / canvasHeight;
      const scale = Math.min(scaleX, scaleY); // Uniform scaling to maintain aspect ratio

      // Translate the shape to fit within the canvas, centered both horizontally and vertically
      const offsetX = (maxCanvasWidth - canvasWidth * scale) / 2;
      const offsetY = (maxCanvasHeight - canvasHeight * scale) / 2;

      ctx.beginPath();
      polygonPoints.forEach(([x, y], index) => {
        const scaledX = (x - topLeft[0]) * scale + offsetX;
        const scaledY = (y - topLeft[1]) * scale + offsetY;

        if (index === 0) {
          ctx.moveTo(scaledX, scaledY);
        } else {
          ctx.lineTo(scaledX, scaledY);
        }
      });

      ctx.closePath();
      ctx.fillStyle = '#B3F45A'; // Fill the shape with #B3F45A
      ctx.fill();
      ctx.strokeStyle = 'blue';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.font = '12px Arial';
      ctx.fillStyle = 'black';
      ctx.fillText(`${timestamp}`, 10, 20); // Display the formatted date
    }
  };

  useEffect(() => {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');

    if (sortedData.length > 0) {
      const { timestamp_str } = sortedData[frameIndex]; // Get the date from the data
      const formattedDate = new Date(timestamp_str).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      });
      drawPath(ctx, sortedData[frameIndex], formattedDate);
    }
  }, [frameIndex, sortedData, canvasId]);

  return (
    <div style={{ border: "1px solid #ccc", width: "150px", height: "200px", margin: "0", borderRadius: "8px" }}>
      <canvas id={canvasId} width={150} height={200}></canvas>
    </div>
  );
};

export default PerimeterPath;
