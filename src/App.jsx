// src/App.jsx
import { Routes, Route } from "react-router-dom";
import VoiceSelectionPage from "./pages/VoiceSelectionPage";
import AmbientPlayerPage from "./pages/AmbientPlayerPage";

function App() {
  return (
    <Routes>
      {/* Homepage */}
      <Route path="/" element={<VoiceSelectionPage />} />

      {/* Ambient player page */}
      <Route path="/ambient" element={<AmbientPlayerPage />} />
    </Routes>
  );
}

export default App;
