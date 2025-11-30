import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

// Function to smooth the area data over a moving average window
const calculateMovingAverage = (data, windowSize) => {
  const smoothedData = [];

  for (let i = 0; i < data.length; i++) {
    let sumArea = 0;
    let count = 0;

    for (let j = Math.max(0, i - windowSize); j <= i; j++) {
      sumArea += data[j].object_area;
      count++;
    }

    smoothedData.push({
      ...data[i],
      object_area: (sumArea / count).toFixed(2),
    });
  }

  return smoothedData;
};

// Custom tooltip for displaying time and area information
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const formattedDate = new Date(label).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    return (
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "2px",
          margin: "0, 5px",
          padding: "0, 5px",
          lineHeight: "0.2",
        }}>
        <p>{`Timestamp: ${formattedDate}`}</p>
        <p>{`Object Area: ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

const AreaChart = ({ data, onFrameHover }) => {
  // Filter out data points where object_area is NaN
  const filteredData = data.filter((item) => !isNaN(item.object_area));

  // Sort data by timestamp
  const sortedData = [...filteredData].sort((a, b) => new Date(a.timestamp_str) - new Date(b.timestamp_str));

  // Smooth data using a moving average with a window size of 5
  const smoothedData = calculateMovingAverage(sortedData, 5);

  // Get min and max from smoothedData for Y-axis range, and slightly increase the range
  const objectAreas = smoothedData.map((d) => parseFloat(d.object_area));
  let minArea = Math.min(...objectAreas);
  let maxArea = Math.max(...objectAreas);

  // Slightly increase the range and round to nearest whole number
  minArea = Math.floor(minArea - 0.05 * minArea); // Reduce min by 5%
  maxArea = Math.ceil(maxArea + 0.05 * maxArea); // Increase max by 5%

  // Handle mouse movement over the chart
  const handleMouseMove = (state) => {
    if (state && state.activeTooltipIndex != null) {
      onFrameHover(state.activeTooltipIndex); // Notify parent component about the hovered frame
    }
  };

  return (
    <div
      className="chart-box"
      style={{
        border: "1px solid #ccc",
        borderRadius: "3px",
        margin: "10px",
        padding: "0 10px",
      }}>
      <LineChart
        width={400}
        height={200}
        data={smoothedData}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => onFrameHover(0)} // Reset to the first frame when mouse leaves
      >
        <XAxis
          dataKey="timestamp_str"
          tickFormatter={(timestamp) => {
            const formattedDate = new Date(timestamp).toLocaleString("en-GB", {
              day: "numeric",
              month: "short", // Show abbreviated month name (e.g., "Jan", "Feb")
            });
            return formattedDate;
          }}
        />
        <YAxis
          domain={[minArea, maxArea]}
          label={{ value: "Area", angle: -90, position: "insideLeft" }}
          tickFormatter={(value) => {
            // Format value for thousands with "k" and round it
            if (value >= 1000) {
              return `${(value / 1000).toFixed(1)}k`; // Display thousands with 1 decimal point and "k"
            }
            return Math.round(value).toLocaleString(); // Round other values
          }}
        />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line type="monotone" dataKey="object_area" name="Object Area" stroke="#8884d8" strokeWidth={2} dot={false} />
      </LineChart>
    </div>
  );
};

export default AreaChart;
