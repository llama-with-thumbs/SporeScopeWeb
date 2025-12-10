import React, { useState } from 'react';
import PerimeterPath from './PerimeterPathComponent';
import AreaChart from './AreaChartComponent';

const SyncedChartViewer = ({ data }) => {
  const [hoveredFrameIndex, setHoveredFrameIndex] = useState(0); // Default to the first frame

  const handleFrameHover = (index) => {
    setHoveredFrameIndex(index); // Update the hovered frame index based on pointer position
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 0, padding: 0, height: '200px' }}>
      <AreaChart data={data} onFrameHover={handleFrameHover} />
    </div>
  );
};

export default SyncedChartViewer;
