import { useState, useRef, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import styles from "./CSS/ScanSheet.module.css";

const QRScanner = ({closeDiv,setSheet}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [cameraFacing, setCameraFacing] = useState("environment");
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    checkCameraPermissions();
    return () => stopScanning();
  }, []);

  const checkCameraPermissions = async () => {
    try {
      const permissions = await navigator.permissions.query({ name: "camera" });
      if (permissions.state === "denied") {
        if (
          window.confirm(
            "Camera access is blocked. Enable it in browser settings."
          )
        ) {
          window.open("chrome://settings/content/camera", "_blank");
        }
        return false;
      }
      if (permissions.state === "prompt") {
        await navigator.mediaDevices.getUserMedia({ video: true });
      }
      return true;
    } catch (error) {
      console.error("Permission check failed:", error);
      return false;
    }
  };

  const startScanning = async (facingMode = cameraFacing) => {
    if (!(await checkCameraPermissions())) return;
    stopScanning();
    setIsScanning(true);

    setTimeout(async () => {
      if (!document.getElementById("reader")) return setIsScanning(false);

      html5QrCodeRef.current = new Html5Qrcode("reader");
      let scannedOnce = false;

      await html5QrCodeRef.current.start(
        { facingMode },
        { fps: 25, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          if (!scannedOnce) {
            scannedOnce = true;
            await stopScanning();
            setSheet(decodedText);
            closeDiv();
          }
        }
      );
    }, 100);
  };

  const stopScanning = async () => {
    if (html5QrCodeRef.current) {
      await html5QrCodeRef.current.stop();
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
        <div className={styles.close}>
            <button className={styles.closeBtn}
            onClick={closeDiv}
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
