import { Box, BoxProps } from '@mui/material';

const getGradient = () =>
  `linear-gradient(to right,
    rgb(255, 107, 107) 0%,
    rgb(255, 179, 71) 50%,
    rgb(107, 203, 119) 100%)`;

const GradientProgress = ({
  percent,
  width = '100%',
  sx,
}: {
  percent: number;
  width?: string | number;
  sx?: BoxProps;
}) => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: { width },
        height: 5,
        borderRadius: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
        ...sx,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: `${percent}%`,
          backgroundImage: getGradient(),
          transition: 'width 0.5s ease',
        }}
      />
    </Box>
  );
};

export default GradientProgress;
