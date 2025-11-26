import React from 'react';
import FlaskImageDisplay from './FlaskImageDisplay';
import FlaskInfo from './FlaskInfo';
import FlaskGifDisplay from './FlaskGifDisplay';
import IntensityChart from './FlaskChartComponent';
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
  flask: string;
  mean_blue_intensity: number;
  mean_green_intensity: number;
  mean_red_intensity: number;
  path: string;
  object_area: string;
  object_perimeter: string;
}

interface FlasksListProps {
  snippets: Snippet[];
  flask: {
    flask: string;
    last_update: string;
    culture: string;
    most_recent_snippet_path: string;
    substrate: string;
    gif_path: string;
  };
  creation_date: string;
}

const FlasksList: React.FC<FlasksListProps> = ({ snippets, flask, creation_date }) => {
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
      // If the dataset contains fewer than or equal to 50 elements, return the entire dataset
      return data;
    }

    // Calculate the step to select 50 equally spaced elements
    const step = Math.floor(dataLength / targetCount);

    // Filter the data by taking every nth element based on the step
    return data.filter((_, index) => index % step === 0).slice(0, targetCount);
  };

  const transformedData50 = getEquallySpacedData(transformedData);

  // Styling for the container
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    border: '1px solid #ccc',
    borderRadius: '8px',
    lineHeight: 'normal',
    margin: '5px 10px',
    padding: '0px 10px',
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', margin: '0 10px' }}>
        <div style={{ margin: '0 10px 0 0' }}>
          <strong>Identifier: </strong>{flask.flask}
        </div>
        <div>
          <strong>Last Update: </strong>{formatISODate(flask.last_update)}
        </div>
      </div>

      <div style={containerStyle}>
        <FlaskImageDisplay flask={flask} />
        <FlaskInfo flask={flask} creation_date={creation_date} />
        <FlaskGifDisplay flask={flask} />
        <SyncedChartViewer data={transformedData50} />
        <IntensityChart data={transformedData50} />
      </div>
    </div>
  );
};

export default FlasksList;
