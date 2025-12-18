import React from "react";
import GPTAnalysisContainer from "./GPTAnalysisContainer";
import GPTAnalysisInfo from "./GPTAnalysisInfo";

const GPTAnalysis: React.FC<{ plate: any }> = ({ plate }) => {
  return (
    <GPTAnalysisContainer>
      <GPTAnalysisInfo plate={plate} />
    </GPTAnalysisContainer>
  );
};

export default GPTAnalysis;
