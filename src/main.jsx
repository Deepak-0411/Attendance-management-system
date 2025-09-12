import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./main.css";
import App from "./App.jsx";
import PWAUpdater from "./PWAUpdater.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
    <PWAUpdater />
  </BrowserRouter>
);
