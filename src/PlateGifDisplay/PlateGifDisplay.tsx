import React from "react";
import PlateGifRowContainer from "./PlateGifRowContainer";
import PlateGifContent from "./PlateGifContent";

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
  data?: any[];
}

const PlateGifDisplay: React.FC<PlateGifDisplayProps> = ({ plate, data }) => {
  return (
    <PlateGifRowContainer>
      <PlateGifContent plate={plate} data={data} />
    </PlateGifRowContainer>
  );
};

export default PlateGifDisplay;
