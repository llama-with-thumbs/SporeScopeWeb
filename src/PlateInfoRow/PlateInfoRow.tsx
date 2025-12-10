import React from "react";
import PlateRowContainer from "./PlateRowContainer";
import PlateInfo from "./PlateInfo";

const PlateInfoRow: React.FC<{ plate: any }> = ({ plate }) => {
  return (
    <PlateRowContainer>
      <PlateInfo plate={plate} />
    </PlateRowContainer>
  );
};

export default PlateInfoRow;
