import { useState, useRef, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import styles from "../../styles/modules/public/ScanSheet.module.css";

const QRScanner = ({ closeDiv, setSheet }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [cameraFacing, setCameraFacing] = useState("environment");
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    return () => stopScanning();
  }, []);

  const startScanning = async (facingMode = cameraFacing) => {
    // Stop any existing scan before starting a new one
    await stopScanning();
    setIsScanning(true);

    setTimeout(async () => {
      const readerElement = document.getElementById("reader");
      if (!readerElement) return setIsScanning(false);

      html5QrCodeRef.current = new Html5Qrcode("reader");
      let scannedOnce = false;

      try {
        await html5QrCodeRef.current.start(
          { facingMode },
          { fps: 25, qrbox: { width: 320, height: 240 } },
          async (decodedText) => {
            if (!scannedOnce) {
              scannedOnce = true;
              await stopScanning();
              setSheet(decodedText);
              closeDiv();
            }
          }
        );
      } catch (err) {
        console.error("Error starting QR scanner:", err);
        setIsScanning(false);
      }
    }, 100); // Small delay to ensure DOM is ready
  };

  const stopScanning = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
      } catch (err) {
        console.warn("Error stopping QR scanner:", err);
      }
      html5QrCodeRef.current = null;
      setIsScanning(false);
    }
  };

  const toggleCamera = async () => {
    const newCamera = cameraFacing === "environment" ? "user" : "environment";
    setCameraFacing(newCamera);
    await stopScanning();
    startScanning(newCamera);
  };

  return (
    <div className={styles.container}>
      <div className={styles.readerContainer}>
        <div
          id="reader"
          className={`${styles.reader} ${isScanning ? "" : styles.hidden}`}
        />
        <button
          className={styles.toggleCameraBtn}
          onClick={toggleCamera}
          disabled={!isScanning}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#e3e3e3"
          >
            <path d="M480-240q79 0 136-53.5T678-426l30 28 42-42-100-100-100 100 42 42 26-26q-6 53-45 88.5T480-300q-13 0-25.5-2.5T430-310l-44 44q22 12 45.5 19t48.5 7ZM310-340l100-100-42-42-26 26q6-53 45-88.5t93-35.5q13 0 25.5 2.5T530-570l44-44q-22-12-45.5-19t-48.5-7q-79 0-136 53.5T282-454l-30-28-42 42 100 100ZM160-120q-33 0-56.5-23.5T80-200v-480q0-33 23.5-56.5T160-760h126l74-80h240l74 80h126q33 0 56.5 23.5T880-680v480q0 33-23.5 56.5T800-120H160Zm0-80h640v-480H638l-73-80H395l-73 80H160v480Zm320-240Z" />
          </svg>
        </button>
      </div>
      <button
        className={`${styles.btn} ${
          isScanning ? styles.stopBtn : styles.startBtn
        }`}
        onClick={() => (isScanning ? stopScanning() : startScanning())}
      >
        {isScanning ? "Stop Scanning" : "Start Scanning"}
      </button>
    </div>
  );
};

export default QRScanner;
