import Overlay from "./Overlay/Overlay";
import SkippedData from "./SkippedData/SkippedData";
import { useData } from "../context/DataContext";

const GlobalSkippedDataOverlay = () => {
  const { skippedData, showOverlay, hideSkippedData , overylayParent } = useData();

  if (!showOverlay) return null;

  return (
    <Overlay onClose={hideSkippedData}>
      <SkippedData data={skippedData} parent={overylayParent} />
    </Overlay>
  );
};

export default GlobalSkippedDataOverlay;
