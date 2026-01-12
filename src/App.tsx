import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import RoleCheck from './pages/RoleCheck';
import QuestionPhase from './pages/QuestionPhase';
import GuessTopic from './pages/GuessTopic';
import InsiderGuess from './pages/InsiderGuess';
import Result from './pages/Result';
import Rules from './pages/Rules';

import { CssBaseline, Container, Typography, Box } from '@mui/material';

const App: React.FC = () => {
  return (
    <HashRouter>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            インサイダーゲーム
          </Typography>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/role-check" element={<RoleCheck />} />
            <Route path="/question-phase" element={<QuestionPhase />} />
            <Route path="/guess-topic" element={<GuessTopic />} />
            <Route path="/insider-guess" element={<InsiderGuess />} />
            <Route path="/result" element={<Result />} />
            <Route path="/rules" element={<Rules />} />
          </Routes>
        </Box>
      </Container>
    </HashRouter>
  );
};

export default App;



