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

const PlateInfo = ({ plate }) => {
  const { plate: plateName, last_update, culture, substrate, plate_start_time } = plate;

  const plateStartDate = new Date(plate_start_time);
  const currentDate = new Date();
  const timeDifferenceHours = Math.floor(
    (currentDate - plateStartDate) / (1000 * 60 * 60)
  );

  const formatted_creation_date = formatISODate(plate_start_time);
  const formatted_last_update = formatISODate(last_update);

  return (
    <div
      style={{
        borderLeft: '1px solid #ccc',
        borderRight: '1px solid #ccc',
        height: '200px',
        width: '310px',
        borderRadius: '3px',
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
          <strong>Last Update:</strong> {formatted_last_update}
        </div>
        <div>
          <strong>Elapsed Time:</strong> {timeDifferenceHours} hours
        </div>
      </div>
    </div>
  );
};

export default PlateInfo;
