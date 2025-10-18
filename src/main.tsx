// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";  // make sure this points to your App file
import "./index.css";     // optional, remove default gradient if needed

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
