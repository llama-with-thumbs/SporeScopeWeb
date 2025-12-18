import React from "react";
import CultureProfileContainer from "./CultureProfileContainer";
import CultureProfileInfo from "./CultureProfileInfo";

const CultureProfile: React.FC<{ plate: any }> = ({ plate }) => {
  return (
    <CultureProfileContainer>
      <CultureProfileInfo plate={plate} />
    </CultureProfileContainer>
  );
};

export default CultureProfile;
