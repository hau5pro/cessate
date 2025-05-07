import { TypographyVariantsOptions } from '@mui/material';

const typography: TypographyVariantsOptions = {
  fontFamily: '"Roboto", monospace, sans-serif',

  // Headings (Chewy)
  h1: {
    fontFamily: '"Chewy", sans-serif',
    fontSize: '3rem',
    fontWeight: 500,
  },
  // Headings (Roboto)
  h2: {
    fontFamily: '"Roboto", sans-serif',
    fontSize: '2rem',
    fontWeight: 400,
  },
  h3: {
    fontFamily: '"Roboto", sans-serif',
    fontSize: '1.5rem',
    fontWeight: 400,
  },

  // Body text (Roboto)
  body1: {
    fontSize: '1.25rem',
    fontWeight: 400,
  },
  body2: {
    fontSize: '0.875rem',
    fontWeight: 400,
  },

  subtitle1: {
    fontFamily: '"Inconsolata", monospace',
    fontSize: '2rem',
    lineHeight: 1.5,
    fontWeight: 400,
  },
  subtitle2: {
    fontFamily: '"Inconsolata", monospace',
    fontSize: '0.875rem',
    fontWeight: 400,
  },
};

export default typography;
