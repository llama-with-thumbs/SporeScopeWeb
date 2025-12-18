import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

// Smooth area values using moving average
const calculateMovingAverage = (data, windowSize) => {
  const smoothedData = [];

  for (let i = 0; i < data.length; i++) {
    let sum = 0;
    let count = 0;

    for (let j = Math.max(0, i - windowSize + 1); j <= i; j++) {
      const val = data[j].total_shape_area_mm2 ?? 0;
      sum += Number(val) || 0;
      count++;
    }

    smoothedData.push({
      ...data[i],
      display_area: Number((sum / count).toFixed(2)),
    });
  }

  return smoothedData;
};

// Tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  const date = new Date(label);
  const rawValue = payload[0].payload.total_shape_area_mm2;

  return (
    <div style={{ border: "1px solid #ccc", padding: "4px" }}>
      <p>{date.toLocaleString()}</p>
      {rawValue == null ? (
        <p>no data for this period</p>
      ) : (
        <p>{`Total shape area: ${rawValue} mm²`}</p>
      )}
    </div>
  );
};

const AreaChart = ({ data, onFrameHover }) => {
  if (!data || !data.length) return null;

  const sorted = [...data]
    .filter((d) => !isNaN(Number(d.total_shape_area_mm2 ?? 0)))
    .sort((a, b) => new Date(a.timestamp_str) - new Date(b.timestamp_str));

  const smoothed = calculateMovingAverage(sorted, 5);
  if (!smoothed.length) return null;

  const values = smoothed.map((d) => d.display_area);
  let minArea = Math.min(...values);
  let maxArea = Math.max(...values);

  minArea = Math.floor(minArea - minArea * 0.1);
  maxArea = Math.ceil(maxArea + maxArea * 0.1);

  const handleMouseMove = (state) => {
    if (state?.activeTooltipIndex != null) {
      onFrameHover(state.activeTooltipIndex);
    }
  };

  return (
    <LineChart
      width={400}
      height={200}
      data={smoothed}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => onFrameHover(null)}
    >
      <XAxis
        dataKey="timestamp_str"
        tickFormatter={(ts) =>
          new Date(ts).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
          })
        }
      />

      <YAxis
        domain={[minArea, maxArea]}
        tickFormatter={(v) =>
          v >= 1000 ? `${(v / 1000).toFixed(1)}k` : Math.round(v)
        }
      />

      <CartesianGrid strokeDasharray="5 5" />
      <Tooltip content={<CustomTooltip />} />

      <Line
        type="monotone"
        dataKey="display_area"
        stroke="#8884d8"
        strokeWidth={2}
        dot={false}
      />
    </LineChart>
  );
};

export default AreaChart;
