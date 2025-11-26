import React, { useEffect, useState } from 'react';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

interface Flask {
  flask: string;
  last_update: string;
  culture: string;
  most_recent_snippet_path: string;
  substrate: string;
  gif_path: string;
  // Add other flask properties as needed
}

interface FlaskImageDisplayProps {
  flask: Flask;
}

const calculateTimeAgo = (differenceInMinutes: number): [string, number] => {
  if (differenceInMinutes < 60) {
    return ['minute', differenceInMinutes];
  } else if (differenceInMinutes < 1440) {
    return ['hour', Math.floor(differenceInMinutes / 60)];
  } else {
    return ['day', Math.floor(differenceInMinutes / 1440)];
  }
};

const renderTimeAgo = (unit: string, value: number) => (
  <span>
    <span style={{ fontWeight: 'bold', fontSize: '16px', color: unit !== 'minute' ? 'red' : '#00ff00' }}>
      {value}</span> {unit}{value !== 1 ? 's' : ''} ago
  </span>
);

const FlaskImageDisplay: React.FC<FlaskImageDisplayProps> = ({ flask }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [minutesAgo, setMinutesAgo] = useState<number | null>(null);

  useEffect(() => {
    const storage = getStorage();
    const imageRef = ref(storage, flask.most_recent_snippet_path);

    const updateMinutesAgo = () => {
      const lastUpdateDate = new Date(flask.last_update);
      const currentDate = new Date();
      const differenceInMinutes = Math.floor((currentDate.getTime() - lastUpdateDate.getTime()) / (1000 * 60));
      setMinutesAgo(differenceInMinutes);
    };

    // Initial update
    updateMinutesAgo();

    // Set up interval to update minutes every minute
    const intervalId = setInterval(updateMinutesAgo, 60000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [flask.most_recent_snippet_path, flask.last_update]);

  useEffect(() => {
    const storage = getStorage();
    const imageRef = ref(storage, flask.most_recent_snippet_path);

    getDownloadURL(imageRef)
      .then((url) => setImageUrl(url))
      .catch((error) => console.error('Error getting download URL:', error));
  }, [flask.most_recent_snippet_path]);

  return (
    <div style={{ position: 'relative', padding: '0', margin: '0', display: 'flex' }}>
      {imageUrl && (
        <div style={{ position: 'relative', display: 'flex' }}>
          <img
            src={imageUrl}
            alt={`Image for ${flask.flask}`}
            style={{
              height: '200px',
              margin: '0',
              padding: '0',
              border: '1px solid #ccc',
              borderRadius: '3px',
            }}
          />
          <p
            style={{
              position: 'absolute',
              top: '5px',
              left: '5px',
              backgroundColor: 'rgba(255, 0, 0, 0)',
              color: '#00ff00',
              margin: '0',
              padding: '5px',
              fontSize: '12px',
            }}
          >
            Last Update: {minutesAgo !== null ? renderTimeAgo(...calculateTimeAgo(minutesAgo)) : 'N/A'}
          </p>
        </div>
      )}
    </div>
  );
};

export default FlaskImageDisplay;
