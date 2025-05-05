import './index.css';

import { CssBaseline, ThemeProvider } from '@mui/material';

import App from './App.tsx';
import { BrowserRouter } from 'react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import theme from '@themes/theme.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
      </ThemeProvider>
      <App />
    </BrowserRouter>
  </StrictMode>
);
