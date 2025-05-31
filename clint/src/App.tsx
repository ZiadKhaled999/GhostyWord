import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainPage from './pages/MainPage';
import AddPlayersPage from './pages/AddPlayersPage';
import GamePage from './pages/GamePage';
import ResultsPage from './pages/ResultsPage';
import VictoryPage from './pages/VictoryPage';

function App() {
  return (
    <div className="min-h-screen ps-gradient">
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/add-players" element={<AddPlayersPage />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/victory" element={<VictoryPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
