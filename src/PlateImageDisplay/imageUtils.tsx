// imageUtils.tsx

import React from 'react';

export const calculateTimeAgo = (differenceInMinutes: number): [string, number] => {
  if (differenceInMinutes < 60) {
    return ['minute', differenceInMinutes];
  } else if (differenceInMinutes < 1440) {
    return ['hour', Math.floor(differenceInMinutes / 60)];
  } else {
    return ['day', Math.floor(differenceInMinutes / 1440)];
  }
};

export const renderTimeAgo = (unit: string, value: number) => (
  <span>
    <span style={{ fontWeight: 'bold', fontSize: '16px', color: unit !== 'minute' ? 'red' : '#00ff00' }}>
      {value}
    </span>{' '}
    {unit}
    {value !== 1 ? 's' : ''} ago
  </span>
);
