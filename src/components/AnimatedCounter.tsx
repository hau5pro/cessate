import { Box, Typography, TypographyProps, alpha } from '@mui/material';
import { useEffect, useState } from 'react';

import theme from '@themes/theme';

type AnimatedCounterProps = {
  value: number;
  label?: string;
  duration?: number;
  format?: (val: number) => string;
  size?: number; // px
} & TypographyProps;

export default function AnimatedCounter({
  value,
  label,
  duration = 1000,
  format = (v) => v.toString(),
  size = 75,
  ...typographyProps
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let frame = 0;
    const totalFrames = Math.round((duration / 1000) * 60);

    const counter = () => {
      frame++;
      const progress = Math.min(frame / totalFrames, 1);
      const currentValue = Math.round(value * progress);
      setDisplayValue(currentValue);

      if (progress < 1) requestAnimationFrame(counter);
    };

    counter();
  }, [value, duration]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box
        width={size}
        height={size}
        borderRadius="50%"
        border={1}
        borderColor={alpha(theme.palette.secondary.main, 0.2)}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        margin={'0.5rem auto'}
        sx={{
          userSelect: 'none',
        }}
      >
        <Typography {...typographyProps}>{format(displayValue)}</Typography>
      </Box>
      {label && (
        <Typography variant="body2" color={theme.palette.secondary.main}>
          {label}
        </Typography>
      )}
    </Box>
  );
}
