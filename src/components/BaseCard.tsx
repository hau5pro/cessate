import { Card, CardProps } from '@mui/material';

const BaseCard = ({ children, sx, ...props }: CardProps) => {
  return (
    <Card
      {...props}
      sx={{
        background: 'rgba(17, 25, 40, 0.25)',
        borderRadius: 12,
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(25px) saturate(180%)',
        WebkitBackdropFilter: 'blur(25px) saturate(180%)',
        color: 'white',
        padding: 2,
        ...sx,
      }}
    >
      {children}
    </Card>
  );
};

export default BaseCard;
