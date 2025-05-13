import { Box, Typography, TypographyProps } from '@mui/material';
import { useEffect, useState } from 'react';

import theme from '@themes/theme';

type AnimatedCounterProps = {
  value: number;
  label?: string;
  duration?: number;
  delay?: number;
  format?: (val: number) => string;
  suffix?: string;
  size?: number; // px
} & TypographyProps;

function smartFormat(val: number): string {
  if (Number.isInteger(val)) return val.toString();
  if (val % 1 >= 0.01) return val.toFixed(2);
  return val.toFixed(1);
}

export default function AnimatedCounter({
  value,
  label,
  duration = 1000,
  delay = 0,
  format = smartFormat,
  suffix,
  ...typographyProps
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let frame = 0;
    const totalFrames = Math.round((duration / 1000) * 60);
    let animationFrame: number;

    const counter = () => {
      frame++;
      const progress = Math.min(frame / totalFrames, 1);
      const currentValue = +(value * progress).toFixed(2);
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(counter);
      }
    };

    const timeoutId = window.setTimeout(() => {
      animationFrame = requestAnimationFrame(counter);
    }, delay ?? 0);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationFrame);
    };
  }, [value, duration, delay]);

  return (
    <Box
      display="flex"
      alignItems="space-between"
      justifyContent="space-between"
      sx={{ userSelect: 'none' }}
    >
      {label && (
        <Typography variant="body2" sx={{ margin: 'auto 0' }}>
          {label}
        </Typography>
      )}
      <Typography {...typographyProps} color={theme.palette.primary.main}>
        {format(displayValue)}
        {suffix && (
          <Box component="span" sx={{ fontSize: '0.75em', marginLeft: 0.5 }}>
            {suffix}
          </Box>
        )}
      </Typography>
    </Box>
  );
}
