import React from 'react';
import PlateImageDisplay from './PlateImageDisplay/PlateImageDisplay';
import PlateInfo from './PlateInfo';
import PlateGifDisplay from './PlateGifDisplay';
import IntensityChart from './PlateChartComponent';
import SyncedChartViewer from './SyncedChartViewerComponent';

function formatISODate(isoDate: string): string {
  const date = new Date(isoDate);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };

  return new Intl.DateTimeFormat('en-US', options).format(date);
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
  // Transform the data
  const transformedData = snippets.map(({ creation_date, mean_blue_intensity, mean_green_intensity, mean_red_intensity, object_area, object_perimeter }) => ({
    timestamp_str: creation_date,
    mean_blue_intensity,
    mean_green_intensity,
    mean_red_intensity,
    object_area,
    object_perimeter
  }));

  // Function to get 50 equally spaced data points
  const getEquallySpacedData = (data: typeof transformedData, targetCount = 50) => {
    const dataLength = data.length;
    if (dataLength <= targetCount) {
      return data;
    }

    const step = Math.floor(dataLength / targetCount);
    return data.filter((_, index) => index % step === 0).slice(0, targetCount);
  };

  const transformedData50 = getEquallySpacedData(transformedData);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    border: '1px solid #ccc',
    borderRadius: '3px',
    lineHeight: 'normal',
    margin: '5px 10px',
    padding: '0px 10px',
    height: '200px',
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', margin: '0 10px' }}>
        <div style={{ margin: '0 10px 0 0' }}>
          <strong>Identifier: </strong>{plate.plate}
        </div>
      </div>

      <div style={containerStyle}>
        <PlateImageDisplay plate={plate} />
        <PlateInfo plate={plate} creation_date={creation_date} />
        <PlateGifDisplay plate={plate} />
        <IntensityChart data={transformedData50} />
        <SyncedChartViewer data={transformedData50} />
      </div>
    </div>
  );
};

export default PlatesList;
