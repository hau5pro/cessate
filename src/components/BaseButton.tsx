import { Button, ButtonProps } from '@mui/material';

import { motion } from 'framer-motion';

const BaseButton = ({ children, sx, ...props }: ButtonProps) => {
  return (
    <motion.div whileTap={{ scale: 0.95 }}>
      <Button
        fullWidth
        variant="outlined"
        {...props}
        sx={{
          color: 'white',
          textTransform: 'uppercase',
          fontSize: '1.2rem',
          fontWeight: 600,
          transition: 'all 0.3s ease-in-out',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)',
          '&:focus': {
            outline: 'none',
          },
          '&:focus-visible': {
            outline: 'none',
          },
          '&:active': {
            outline: 'none',
          },
          ...sx,
        }}
      >
        {children}
      </Button>
    </motion.div>
  );
};

export default BaseButton;
