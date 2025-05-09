import { ToggleButtonGroup, ToggleButtonGroupProps } from '@mui/material';

export default function BaseToggleButtonGroup(props: ToggleButtonGroupProps) {
  return (
    <ToggleButtonGroup
      exclusive
      size="small"
      color="primary"
      {...props}
      sx={{
        borderRadius: 2,
        ...props.sx,
      }}
    />
  );
}
