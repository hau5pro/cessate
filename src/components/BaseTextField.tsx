import { TextField } from '@mui/material';
import { useId } from 'react';

export interface BaseTextFieldProps {
  value: string | number | null;
  onChange: (value: string | null) => void;
  defaultValue?: string | number;
  id?: string;
  label?: string;
  sx?: object;
}

const BaseTextField = ({
  value,
  onChange,
  defaultValue,
  id,
  label,
  sx,
}: BaseTextFieldProps) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <TextField
      variant="outlined"
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      defaultValue={defaultValue}
      id={inputId}
      sx={{
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderWidth: '1px',
          },
          '&.Mui-focused fieldset': {
            borderWidth: '1px',
            borderColor: 'secondary.main',
          },
        },
        ...sx,
      }}
    />
  );
};

export default BaseTextField;
