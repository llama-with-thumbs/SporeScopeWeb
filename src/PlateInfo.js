import React from 'react';

function formatISODate(isoDate) {
  const date = new Date(isoDate);
  const options = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Intl.DateTimeFormat('en-US', options).format(date);
}

const PlateInfo = ({ plate, creation_date }) => {
  const { plate: plateName, last_update, culture, substrate } = plate;

  const creationDate = new Date(creation_date);
  const lastUpdate = new Date(last_update);
  const timeDifferenceHours = Math.floor(
    (lastUpdate - creationDate) / (1000 * 60 * 60)
  );

  const formatted_creation_date = formatISODate(creation_date);
  const formatted_last_update = formatISODate(last_update);

  return (
    <div
      style={{
        border: '1px solid #ccc',
        height: '400px',
        width: '200px',
        borderRadius: '3px',
        margin: '0 0 0 10px',
        padding: '0px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
        fontSize: 'clamp(10px, 1.5vw, 14px)',
      }}
    >
      <div style={{ margin: '10px' }}>
        <h3
          style={{
            margin: '0 0 5px 0',
            fontSize: 'clamp(12px, 2vw, 16px)',
          }}
        >
          Parameters
        </h3>
        <div>
          <strong>Seeded culture:</strong> {culture}
          <a href={culture} target="_blank" rel="noopener noreferrer">
          </a>
        </div>
        <div>
          <strong>Substrate:</strong> {substrate}
        </div>
        <div>
          <strong>Start date:</strong> {formatted_creation_date}
        </div>
        <div>
          <strong>Elapsed Time:</strong> {timeDifferenceHours} hours
        </div>
      </div>
    </div>
  );
};

export default PlateInfo;
