import React, { useEffect, useState } from 'react';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import GifModal from './GifModal';

interface Plate {
    plate: string;
    last_update: string;
    culture: string;
    most_recent_snippet_path: string;
    substrate: string;
    gif_path: string;
}

interface PlateGifContentProps {
    plate: Plate;
    data?: any[];  // kept but unused, safe to remove later
}

const PlateGifContent: React.FC<PlateGifContentProps> = ({ plate }) => {
    const [gifUrl, setGifUrl] = useState<string | null>(null);
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    useEffect(() => {
        if (!plate.gif_path) {
            console.log('No gif_path for plate', plate.plate);
            setGifUrl(null);
            return;
        }

        const storage = getStorage();

        // Convert gs:// URL if needed
        let storagePath = plate.gif_path;
        if (storagePath.startsWith('gs://bio-chart.appspot.com/')) {
            storagePath = storagePath.replace('gs://bio-chart.appspot.com/', '');
        }

        const gifRef = ref(storage, storagePath);

        getDownloadURL(gifRef)
            .then((url) => {
                setGifUrl(url);
            })
            .catch((err) => {
                console.error('Error loading GIF for plate', plate.plate, err);
                setGifUrl(null);
            });
    }, [plate.gif_path, plate.plate]);

    return (
        <div style={{ padding: '0', margin: '0', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            {gifUrl ? (
                <>
                    <div
                        style={{ position: 'relative', display: 'flex', cursor: 'pointer' }}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onClick={() => setIsModalOpen(true)}
                    >
                        <img
                            src={gifUrl}
                            alt={`GIF for ${plate.plate}`}
                            style={{
                                height: '200px',
                                width: '200px',
                                margin: '0',
                                padding: '0',
                                border: '1px solid #ccc',
                                borderRadius: '3px',
                                filter: isHovered ? 'brightness(1.2) saturate(1.3)' : 'none',
                                transition: 'filter 0.2s ease',
                            }}
                        />
                    </div>

                    {/* Full-screen GIF modal */}
                    {isModalOpen && (
                        <GifModal src={gifUrl} onClose={() => setIsModalOpen(false)} />
                    )}
                </>
            ) : (
                <div
                    style={{
                        height: '200px',
                        width: '200px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#e0e0e0',
                        border: '1px solid #ccc',
                        borderRadius: '3px',
                        fontSize: '12px',
                        color: '#555',
                        wordBreak: 'break-all',
                        textAlign: 'center',
                    }}
                >
                    {plate.gif_path || 'no gif_path'}
                </div>
            )}
        </div>
    );
};

export default PlateGifContent;
