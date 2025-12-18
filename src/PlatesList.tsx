// PlatesList.tsx

import React, { useState, useEffect } from 'react';
import PlateImageDisplay from './PlateImageDisplay/PlateImageDisplay';
import CultureProfile from './CultureProfile/CultureProfile';
import GPTAnalysis from './GPTAnalysis/GPTAnalysis';
import PlateGifDisplay from './PlateGifDisplay/PlateGifDisplay';
import IntensityChartDrawer from './IntensityChart/IntensityChartDrawer';
import AreaChartDrawer from './AreaChart/AreaChartDrawer';
import { calculateTimeAgo, renderTimeAgo } from "./PlateImageDisplay/imageUtils";
import PerimeterDrawer from './PerimeterDrawer/PerimeterDrawer';

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
  total_shape_area_mm2: number;
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
    shapes: any[];          // ✔ make shapes an array
  };
  creation_date: string;
}

const PlatesList: React.FC<PlatesListProps> = ({ snippets, plate, creation_date }) => {

  const computeMinutesAgo = () =>
    Math.floor((Date.now() - new Date(plate.last_update).getTime()) / 60000);

  const [minutesAgo, setMinutesAgo] = useState<number>(computeMinutesAgo());
  const olderThanOneDay = minutesAgo > 1440;
  const [isOpen, setIsOpen] = useState(!olderThanOneDay);

  useEffect(() => {
    const id = setInterval(() => setMinutesAgo(computeMinutesAgo()), 60000);
    return () => clearInterval(id);
  }, [plate.last_update]);

  const transformedData = snippets.map(s => ({
    timestamp_str: s.creation_date,
    mean_blue_intensity: s.mean_blue_intensity,
    mean_green_intensity: s.mean_green_intensity,
    mean_red_intensity: s.mean_red_intensity,
    object_area: s.object_area,
    object_perimeter: s.object_perimeter,
    total_shape_area_mm2: s.total_shape_area_mm2
  }));

  const getEquallySpacedData = (data: any[], target = 450) => {
    if (data.length <= target) return data;
    const step = Math.floor(data.length / target);
    return data.filter((_, i) => i % step === 0).slice(0, target);
  };


  const transformedData50 = getEquallySpacedData(transformedData);

  return (
    <div>

      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', margin: '0 10px' }}>
        <div
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={e => e.currentTarget.style.color = '#cc0000'}
          onMouseLeave={e => e.currentTarget.style.color = 'red'}
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
        </div>

        <div style={{ fontSize: '16px' }}>
          <strong>Plate ID:</strong> {plate.plate}
          <span style={{ marginLeft: '10px', color: minutesAgo > 30 ? 'red' : 'green' }}>
            • Last update: {renderTimeAgo(...calculateTimeAgo(minutesAgo))}
          </span>
        </div>
      </div>

      {/* DRAWER */}
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
          <CultureProfile plate={plate} />
          <GPTAnalysis plate={plate} />
          <PlateGifDisplay plate={plate} data={transformedData50} />

          {/* ✔ SHAPES GO INTO PARAMETER DRAWER */}
          <PerimeterDrawer data={plate.shapes} />
 
          <IntensityChartDrawer data={transformedData50} />
          <AreaChartDrawer data={transformedData50} />
        </div>
      </div>
    </div>
  );
};

export default PlatesList;
