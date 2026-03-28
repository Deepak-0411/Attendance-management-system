import { useState } from "react";
import { SiGoogledocs } from "react-icons/si";
import Overlay from "./Overlay/Overlay";
import Docs from "./Docs/Docs";

const Docsbtn = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className=" fixed bottom-6 right-6 z-50 bg-amber-50 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer shadow-xl/30"
      >
        <SiGoogledocs size={24} color="#9a93e9" />
      </button>
      {isOpen && (
        <Overlay onClose={() => setIsOpen(false)}>
          <Docs />
        </Overlay>
      )}
    </>
  );
};
export default Docsbtn;
