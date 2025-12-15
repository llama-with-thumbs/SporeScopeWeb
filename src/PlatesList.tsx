// PlatesList.tsx

import React, { useState, useEffect } from 'react';
import PlateImageDisplay from './PlateImageDisplay/PlateImageDisplay';
import PlateInfoRow from './PlateInfoRow/PlateInfoRow';
import PlateGifDisplay from './PlateGifDisplay/PlateGifDisplay';
import IntensityChartDrawer from './IntensityChart/IntensityChartDrawer';
import SyncedChartViewer from './AreaChart/SyncedChartViewerComponent';
import { calculateTimeAgo, renderTimeAgo } from "./PlateImageDisplay/imageUtils";
import PerimeterDrawer  from './PerimeterDrawer/PerimeterDrawer'

function formatISODate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleString("en-US", {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

interface Snippet {
  chamber: string;
  creation_date: string;
  plate: string;
  mean_blue_intensity: number;
  mean_green_intensity: number;
  mean_red_intensity: number;
  path: string;
  object_area: string;
  object_perimeter: string;
}

interface PlatesListProps {
  snippets: Snippet[];
  plate: {
    plate: string;
    last_update: string;
    culture: string;
    most_recent_snippet_path: string;
    substrate: string;
    gif_path: string;
  };
  creation_date: string;
}

const PlatesList: React.FC<PlatesListProps> = ({ snippets, plate, creation_date }) => {

  // compute minutes from last update
  const computeMinutesAgo = () => {
    const last = new Date(plate.last_update).getTime();
    const now = Date.now();
    return Math.floor((now - last) / 60000);
  };

  // Live-updating minutes-ago state
  const [minutesAgo, setMinutesAgo] = useState<number>(computeMinutesAgo());

  // 🔥 Drawer default state depends on age:
  const olderThanOneDay = minutesAgo > 1440;
  const [isOpen, setIsOpen] = useState(!olderThanOneDay);

  // 🔥 Update minutes-ago every 60 seconds
  useEffect(() => {
    const update = () => setMinutesAgo(computeMinutesAgo());
    const id = setInterval(update, 60000);
    update();
    return () => clearInterval(id);
  }, [plate.last_update]);

  // Transform snippet data
  const transformedData = snippets.map(s => ({
    timestamp_str: s.creation_date,
    mean_blue_intensity: s.mean_blue_intensity,
    mean_green_intensity: s.mean_green_intensity,
    mean_red_intensity: s.mean_red_intensity,
    object_area: s.object_area,
    object_perimeter: s.object_perimeter
  }));

  const getEquallySpacedData = (data: typeof transformedData, target = 50) => {
    if (data.length <= target) return data;
    const step = Math.floor(data.length / target);
    return data.filter((_, i) => i % step === 0).slice(0, target);
  };

  const transformedData50 = getEquallySpacedData(transformedData);

  return (
    <div>
      {/* ---------- HEADER LINE ---------- */}
      <div style={{ display: 'flex', alignItems: 'center', margin: '0 10px' }}>
        <div 
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={(e) => e.currentTarget.style.color = '#cc0000'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'red'}
          style={{ 
            cursor: 'pointer', 
            userSelect: 'none', 
            color: 'red', 
            fontSize: '20px', 
            marginRight: '10px',
            width: '20px',
            height: '20px',
            lineHeight: '20px',
            transition: 'color 0.2s ease'
          }}
        >
          {isOpen ? '▼' : '▶'}
        </div>        <div style={{ fontSize: '16px' }}>
          <strong>Plate ID:</strong> {plate.plate}
          <span style={{ marginLeft: '10px', color: minutesAgo > 1440 ? 'red' : 'green' }}>
            • Last update: {renderTimeAgo(...calculateTimeAgo(minutesAgo))}
          </span>
        </div>
      </div>

      {/* ---------- EXPANDABLE CONTENT ---------- */}
      <div
        style={{
          overflow: 'hidden',
          transition: 'max-height 0.35s ease, opacity 0.35s ease',
          maxHeight: isOpen ? '220px' : '0px',
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            border: '1px solid #ccc',
            borderRadius: '3px',
            margin: '5px 10px',
            padding: '0 10px',
            height: '200px'
          }}
        >
          <PlateImageDisplay plate={plate} />
          <PlateInfoRow plate={plate} />
          <PlateGifDisplay plate={plate} data={transformedData50} />
          <PerimeterDrawer data={transformedData50} />
          <IntensityChartDrawer data={transformedData50} />
          <SyncedChartViewer data={transformedData50} />
        </div>
      </div>
    </div>
  );
};

export default PlatesList;
