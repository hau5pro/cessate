import { Button, ButtonProps } from '@mui/material';

const BaseButton = ({ children, sx, ...props }: ButtonProps) => {
  return (
    <Button
      fullWidth
      variant="outlined"
      {...props}
      sx={{
        color: 'white',
        textTransform: 'uppercase',
        fontSize: '1rem',
        fontWeight: 600,
        transition: 'all 0.3s ease-in-out',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)',
        ...sx,
      }}
    >
      {children}
    </Button>
  );
};

export default BaseButton;
