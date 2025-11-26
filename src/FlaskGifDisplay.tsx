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

interface FlaskGifDisplayProps {
    flask: Flask;
}

const FlaskGifDisplay: React.FC<FlaskGifDisplayProps> = ({ flask }) => {
    const [gifUrl, setGifUrl] = useState<string | null>(null);

    useEffect(() => {
        // Initialize Firebase Storage
        const storage = getStorage();

        // Create a reference to the most recent GIF
        const gifRef = ref(storage, flask.gif_path);

        // Get the download URL for the GIF
        getDownloadURL(gifRef)
            .then((url) => setGifUrl(url))
            .catch((error) => console.error('Error getting download URL:', error));
    }, [flask.gif_path]);

    return (
        <div style={{ padding: '10px', display: 'flex' }}>
            {gifUrl && <img src={gifUrl} alt={`GIF for ${flask.flask}`} style={{
                height: '200px', margin: '0', padding: '0', border: "1px solid #ccc",
                borderRadius: '3px'
            }} />}
        </div>
    );
};

export default FlaskGifDisplay;
