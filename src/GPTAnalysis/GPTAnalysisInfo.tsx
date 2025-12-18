import React from 'react';

interface GPTAnalysisInfoProps {
  plate: any;
}

const GPTAnalysisInfo: React.FC<GPTAnalysisInfoProps> = ({ plate }) => {
  const { gpt_analysis } = plate;

  return (
    <div
      style={{
        borderLeft: '1px solid #ccc',
        borderRight: '1px solid #ccc',
        height: '200px',
        width: '200px',
        borderRadius: '3px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
        fontSize: 'clamp(10px, 1.5vw, 12px)',
      }}
    >
      <h3
        style={{
          margin: '10px',
          fontSize: 'clamp(12px, 2vw, 14px)',
        }}
      >
        GPT Analysis
      </h3>
      
      {gpt_analysis ? (
        <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: '1.4', margin: '0 10px' }}>
          {gpt_analysis}
        </div>
      ) : (
        <div style={{ color: '#999', fontStyle: 'italic', alignSelf: 'center', marginTop: 'auto', marginBottom: 'auto' }}>
          No analysis available
        </div>
      )}
    </div>
  );
};

export default GPTAnalysisInfo;
