import ReactDOM from "react-dom";
import styles from "./Overlay.module.css";

const Overlay = ({ children, onClose }) => {
  const handleClick = (e) => {
    e.stopPropagation();
    const isOverlayClick = e.target.classList.contains(styles.overlay);
    console.log("clicked",isOverlayClick);
    
    if (isOverlayClick) {
      onClose();
    }
  };

  const overlayContent = (
    <div className={styles.overlay} onClick={handleClick}>
      {children}
      <button
        className={styles.closeBtn}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#e3e3e3"
        >
          <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
        </svg>
      </button>
    </div>
  );
  return ReactDOM.createPortal(
    overlayContent,
    document.getElementById("portal-root")
  );
};

export default Overlay;
