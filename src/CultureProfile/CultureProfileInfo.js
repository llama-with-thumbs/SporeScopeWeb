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

const CultureProfileInfo = ({ plate }) => {
  const { 
    plate: plateName, 
    last_update, 
    culture, 
    substrate, 
    plate_start_time,
    total_shape_area_mm2       // ✅ NEW FIELD
  } = plate;

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
        width: '290px',
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
          Culture Profile
        </h3>
        <div>
          <strong>Seeded culture:</strong> {culture}
          <a href={culture} target="_blank" rel="noopener noreferrer"></a>
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

        {/* ✅ NEW FIELD */}
        <div>
          <strong>Total Shape Area:</strong> {total_shape_area_mm2 ?? "—"} mm²
        </div>
      </div>
    </div>
  );
};

export default CultureProfileInfo;
