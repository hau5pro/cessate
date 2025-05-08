import { Box, BoxProps, keyframes } from '@mui/material';

import { ColorUtils } from '@utils/colorUtils';

const shimmer = keyframes`
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  25% {
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
  100% {
    transform: translateX(100%);
    opacity: 0;
  }
`;

interface ProgressProps extends BoxProps {
  percent: number;
  width?: string | number;
  animate?: boolean;
}

const Progress = ({
  percent,
  width = '100%',
  animate = false,
  sx,
  ...rest
}: ProgressProps) => {
  return (
    <Box
      sx={{
        position: 'relative',
        width,
        height: 5,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.1)', // unfilled bg
        ...sx,
      }}
      {...rest}
    >
      <Box
        sx={{
          width: `${percent}%`,
          height: '100%',
          backgroundColor: ColorUtils.interpolateColor(percent / 100),
          borderRadius: 5,
          transition: 'width 0.5s ease, background-color 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
          ...(animate &&
            percent !== 100 && {
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '200%',
                height: '100%',
                background:
                  'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                animation: `${shimmer} 2.5s ease-in-out infinite`,
                pointerEvents: 'none',
              },
            }),
        }}
      />
    </Box>
  );
};

export default Progress;
