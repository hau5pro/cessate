import { TypographyVariantsOptions } from '@mui/material';

const typography: TypographyVariantsOptions = {
  fontFamily: '"Inconsolata", "Roboto", monospace, sans-serif',

  // Headings (Chewy)
  h1: {
    fontFamily: '"Chewy", sans-serif',
    fontSize: '2.5rem',
    fontWeight: 500,
  },
  h2: {
    fontFamily: '"Roboto", sans-serif',
    fontSize: '2rem',
    fontWeight: 400,
  },
  h3: {
    fontFamily: '"Roboto", sans-serif',
    fontSize: '1.75rem',
    fontWeight: 400,
  },

  // Body text (Inconsolata)
  body1: {
    fontSize: '1rem',
    fontWeight: 400,
  },
  body2: {
    fontSize: '0.875rem',
    fontWeight: 400,
  },
};

export default typography;
