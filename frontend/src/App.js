import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Builder from "@/pages/Builder";
import Playground from "@/pages/Playground";
import Templates from "@/pages/Templates";
import Integrations from "@/pages/Integrations";
import Settings from "@/pages/Settings";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />
          <Route path="/app/dashboard" element={<Dashboard />} />
          <Route path="/app/builder" element={<Builder />} />
          <Route path="/app/playground" element={<Playground />} />
          <Route path="/app/templates" element={<Templates />} />
          <Route path="/app/integrations" element={<Integrations />} />
          <Route path="/app/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
