import React from 'react';
function formatISODate(isoDate) {
  const date = new Date(isoDate);
  const options = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
  };

  return new Intl.DateTimeFormat('en-US', options).format(date);
}

const FlaskInfo = ({ flask, creation_date }) => {
  const { flask: flaskName, last_update, culture } = flask;

  const creationDate = new Date(creation_date);
  const lastUpdate = new Date(last_update);
  const timeDifferenceHours = Math.floor((lastUpdate - creationDate) / (1000 * 60 * 60));

  const formatted_creation_date = formatISODate(creation_date);
  const formatted_last_update = formatISODate(last_update);

    return (
    <div style={{
        border: '1px solid #ccc',
        height: '200px',
        borderRadius: '8px',
        lineHeight: 'normal',
        margin: '0 0 0 10px',
        padding: '0px 10px',
        overflow: 'hidden'
      }}>
      <h3>Parameters</h3>
      <div><strong>Seeded culture:</strong> <a href={culture} target="_blank" rel="noopener noreferrer"> P. cubensis</a></div>
      <div><strong>Substrate:</strong> {flask.substrate}</div>
      <div><strong>Start date:</strong> {formatted_creation_date}</div>
      <div><strong>Elapsed Time: </strong>{timeDifferenceHours} hours</div>
    </div>
  );
};

export default FlaskInfo;
