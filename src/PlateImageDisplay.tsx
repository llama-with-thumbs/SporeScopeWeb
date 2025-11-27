import React, { useEffect, useState } from 'react';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

interface Plate {
  plate: string;
  last_update: string;
  culture: string;
  most_recent_snippet_path: string;
  substrate: string;
  gif_path: string;
}

interface PlateImageDisplayProps {
  plate: Plate;
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

const PlateImageDisplay: React.FC<PlateImageDisplayProps> = ({ plate }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [minutesAgo, setMinutesAgo] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // spinner state

  useEffect(() => {
    const storage = getStorage();
    const imageRef = ref(storage, plate.most_recent_snippet_path);

    getDownloadURL(imageRef)
      .then((url) => {
        setImageUrl(url);
        setLoading(false); // stop spinner
      })
      .catch((error) => {
        console.error('Error getting download URL:', error);
        setLoading(false); // stop spinner even on failure
      });
  }, [plate.most_recent_snippet_path]);

  useEffect(() => {
    const updateMinutesAgo = () => {
      const lastUpdateDate = new Date(plate.last_update);
      const currentDate = new Date();
      const differenceInMinutes = Math.floor((currentDate.getTime() - lastUpdateDate.getTime()) / (1000 * 60));
      setMinutesAgo(differenceInMinutes);
    };

    updateMinutesAgo();
    const intervalId = setInterval(updateMinutesAgo, 60000);
    return () => clearInterval(intervalId);
  }, [plate.last_update]);

  return (
    <div style={{ position: 'relative', padding: '0', margin: '0', display: 'flex' }}>
      {loading && (
        <div style={{
          height: '200px',
          width: '200px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: '1px solid #ccc',
          borderRadius: '3px',
          fontSize: '16px',
          backgroundColor: '#f3f3f3',
        }}>
          ⏳ Loading...
        </div>
      )}

      {!loading && imageUrl && (
        <div style={{ position: 'relative', display: 'flex' }}>
          <img
            src={imageUrl}
            alt={`Image for ${plate.plate}`}
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

export default PlateImageDisplay;
