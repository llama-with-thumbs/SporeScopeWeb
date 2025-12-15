import React, { useEffect, useState } from 'react';

const PerimeterPath = ({ data, frameIndex = 0 }) => {
  const [canvasId] = useState(`canvas-${Math.random().toString(36).substr(2, 9)}`);

  const sortedData = Array.isArray(data)
    ? [...data].sort((a, b) => new Date(a.timestamp_str) - new Date(b.timestamp_str))
    : [];

  const drawFallback = (ctx) => {
    if (!ctx) return;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = '#e0e0e0';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = '#555';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('perimeter path', ctx.canvas.width / 2, ctx.canvas.height / 2);
  };

  const drawPath = (ctx, perimeterPath, timestamp) => {
    try {
      if (!ctx || !perimeterPath || !perimeterPath.object_perimeter) {
        drawFallback(ctx);
        return;
      }

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      const parsedPerimeter = JSON.parse(perimeterPath.object_perimeter);
      if (!Array.isArray(parsedPerimeter) || parsedPerimeter.length < 5) {
        drawFallback(ctx);
        return;
      }

      const [topLeft, topRight, bottomRight, bottomLeft, ...polygonPoints] = parsedPerimeter;

      const canvasWidth = topRight[0] - topLeft[0];
      const canvasHeight = bottomLeft[1] - topLeft[1];

      const maxCanvasWidth = 150;
      const maxCanvasHeight = 200;
      const scaleX = maxCanvasWidth / canvasWidth;
      const scaleY = maxCanvasHeight / canvasHeight;
      const scale = Math.min(scaleX, scaleY);

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
      ctx.fillStyle = '#B3F45A';
      ctx.fill();
      ctx.strokeStyle = 'blue';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.font = '12px Arial';
      ctx.fillStyle = 'black';
      ctx.fillText(String(timestamp), 10, 20);
    } catch (e) {
      console.error('Error drawing perimeter path:', e);
      drawFallback(ctx);
    }
  };

  useEffect(() => {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (sortedData.length > 0 && sortedData[frameIndex]) {
      const { timestamp_str } = sortedData[frameIndex];
      const formattedDate = new Date(timestamp_str).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });
      drawPath(ctx, sortedData[frameIndex], formattedDate);
    } else {
      drawFallback(ctx);
    }
  }, [frameIndex, sortedData, canvasId]);

  return (
    <div
      style={{
        border: '1px solid #ccc',
        width: '200px',
        height: '200px',
        margin: '0',
        borderRadius: '3px',
      }}
    >
      <canvas id={canvasId} width={200} height={200}></canvas>
    </div>
  );
};

export default PerimeterPath;
