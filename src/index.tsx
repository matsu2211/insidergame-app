import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GameProvider } from './context/GameContext';
import { createTheme, ThemeProvider } from '@mui/material/styles'; // Import ThemeProvider and createTheme

const theme = createTheme({
  palette: {
    primary: {
      main: '#ffab91', // Light orange
    },
    secondary: {
      main: '#ffcc80', // Light amber
    },
    background: {
      default: '#fffaf2', // Ivory
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"M PLUS Rounded 1c", "UD Shin Maru Go", "Meiryo UI", "Meiryo", sans-serif', // Set as rounded gothic font
  },
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}> {/* Wrap the entire app with ThemeProvider */}
      <GameProvider>
        <App />
      </GameProvider>
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
