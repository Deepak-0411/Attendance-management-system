import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./main.css";
import App from "./App.jsx";
import PWAUpdater from "./PWAUpdater.jsx";
import { OfflineProvider } from "./context/OfflineContext";
import GlobalOffline from "./components/GlobalOffline.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <OfflineProvider>
      <App />
      <PWAUpdater />
      <GlobalOffline />
    </OfflineProvider>
  </BrowserRouter>
);
