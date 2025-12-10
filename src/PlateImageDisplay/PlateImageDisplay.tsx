// PlateImageDisplay.tsx

import React, { useEffect, useState } from 'react';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import ImageModal from './ImageModal';
import { calculateTimeAgo, renderTimeAgo } from './imageUtils';

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

const PlateImageDisplay: React.FC<PlateImageDisplayProps> = ({ plate }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [minutesAgo, setMinutesAgo] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // NEW: Hover lighting state
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Load image from Firebase
  useEffect(() => {
    if (!plate.most_recent_snippet_path) {
      setLoading(false);
      return;
    }

    const storage = getStorage();
    const imgRef = ref(storage, plate.most_recent_snippet_path);

    getDownloadURL(imgRef)
      .then((url) => {
        setImageUrl(url);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading image:', err);
        setLoading(false);
      });
  }, [plate.most_recent_snippet_path]);

  // Update time-ago label
  useEffect(() => {
    const update = () => {
      const last = new Date(plate.last_update);
      const now = new Date();
      const diff = Math.floor((now.getTime() - last.getTime()) / 60000);
      setMinutesAgo(diff);
    };

    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, [plate.last_update]);

  return (
    <div style={{ position: 'relative', padding: 0, margin: 0, display: 'flex' }}>
      {/* Loading placeholder */}
      {loading && (
        <div
          style={{
            height: '200px',
            width: '200px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: '1px solid #ccc',
            borderRadius: '3px',
            backgroundColor: '#f3f3f3',
            fontSize: '16px',
          }}
        >
          ⏳ Loading...
        </div>
      )}

      {/* Thumbnail */}
      {!loading && imageUrl && (
        <div
          style={{ position: 'relative', cursor: 'pointer' }}
          onClick={() => setIsModalOpen(true)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <img
            src={imageUrl}
            alt={plate.plate}
            style={{
              height: '200px',
              width: '200px',
              border: '1px solid #ccc',
              borderRadius: '3px',
              transition: 'filter 0.2s ease',
              filter: isHovered ? 'brightness(1.2) saturate(1.3)' : 'none',
            }}
          />

          {/* Timestamp */}
          <p
            style={{
              position: 'absolute',
              top: '5px',
              left: '5px',
              color: '#00ff00',
              margin: 0,
              fontSize: '12px',
            }}
          >
            Last Update:{' '}
            {minutesAgo !== null
              ? renderTimeAgo(...calculateTimeAgo(minutesAgo))
              : 'N/A'}
          </p>
        </div>
      )}

      {/* Full-screen modal */}
      {isModalOpen && imageUrl && (
        <ImageModal src={imageUrl} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default PlateImageDisplay;
