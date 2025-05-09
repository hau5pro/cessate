import { ToggleButton, ToggleButtonProps } from '@mui/material';

export default function BaseToggleButton(props: ToggleButtonProps) {
  return (
    <ToggleButton
      {...props}
      sx={{
        border: `1px solid rgba(255, 255, 255, 0.1)`,

        borderRadius: 5,
        px: 2,
        outline: 'none',

        '&.Mui-selected': {
          backgroundColor: 'secondary.main',
          color: 'common.white',
          outline: 'none',
          '&:hover': {
            backgroundColor: 'secondary.dark',
          },
        },

        '&.Mui-focusVisible': {
          outline: 'none',
        },

        '&:focus': {
          outline: 'none',
        },

        '&:focus-visible': {
          outline: 'none',
        },

        ...props.sx,
      }}
    />
  );
}
