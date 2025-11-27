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

interface PlateGifDisplayProps {
    plate: Plate;
}

const PlateGifDisplay: React.FC<PlateGifDisplayProps> = ({ plate }) => {
    const [gifUrl, setGifUrl] = useState<string | null>(null);

    useEffect(() => {
        const storage = getStorage();
        const gifRef = ref(storage, plate.gif_path);

        getDownloadURL(gifRef)
            .then((url) => setGifUrl(url))
            .catch(() => setGifUrl(null)); // If fail, keep null
    }, [plate.gif_path]);

    return (
        <div style={{ padding: '10px', display: 'flex' }}>
            {gifUrl ? (
                <img
                    src={gifUrl}
                    alt={`GIF for ${plate.plate}`}
                    style={{
                        height: '200px',
                        margin: '0',
                        padding: '0',
                        border: '1px solid #ccc',
                        borderRadius: '3px',
                    }}
                />
            ) : (
                <div
                    style={{
                        height: '200px',
                        width: '150px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#e0e0e0',
                        border: '1px solid #ccc',
                        borderRadius: '3px',
                        fontSize: '20px',
                        color: '#555',
                        textTransform: 'uppercase',
                    }}
                >
                    gif
                </div>
            )}
        </div>
    );
};

export default PlateGifDisplay;
