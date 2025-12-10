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
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    useEffect(() => {
        if (!plate.gif_path) {
            console.log('No gif_path for plate', plate.plate);
            setGifUrl(null);
            return;
        }

        console.log('gif_path from Firestore:', plate.gif_path);

        const storage = getStorage();

        // If gif_path is like "gs://bio-chart.appspot.com/CHA-.../Gifs/A.gif"
        // convert it to a path inside the bucket
        let storagePath = plate.gif_path;
        if (storagePath.startsWith('gs://bio-chart.appspot.com/')) {
            storagePath = storagePath.replace('gs://bio-chart.appspot.com/', '');
        }

        const gifRef = ref(storage, storagePath);

        getDownloadURL(gifRef)
            .then((url) => {
                console.log('Resolved GIF URL:', url);
                setGifUrl(url);
            })
            .catch((err) => {
                console.error('Error loading GIF for plate', plate.plate, err);
                setGifUrl(null);
            });
    }, [plate.gif_path, plate.plate]);

    return (
        <div style={{ padding: '0', margin: '0', display: 'flex' }}>
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

                    {/* Modal for full-size GIF */}
                    {isModalOpen && (
                        <div
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                width: '100vw',
                                height: '100vh',
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                zIndex: 1000,
                                cursor: 'pointer',
                            }}
                            onClick={() => setIsModalOpen(false)}
                        >
                            <img
                                src={gifUrl}
                                alt={`Full size GIF for ${plate.plate}`}
                                style={{
                                    maxWidth: '90vw',
                                    maxHeight: '90vh',
                                }}
                            />
                        </div>
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

export default PlateGifDisplay;
