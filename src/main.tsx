import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Dashboard from "./pages/Dashboard.tsx";
import SignUp from "./pages/SignUp.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />          {/* Home / App */}
      <Route path="/signup" element={<SignUp/>} />
      <Route path="/dashboard" element={<Dashboard />} /> {/* Dashboard page */}
    </Routes>
  </BrowserRouter>
);
