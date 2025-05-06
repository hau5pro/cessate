import { MinusIcon, PlusIcon } from '@components/CustomIcons';

import { NumberField } from '@base-ui-components/react/number-field';
import styles from './BaseNumberField.module.css';
import { useId } from 'react';

export interface BaseNumberFieldProps {
  value: number | null;
  onChange: (value: number | null) => void;
  defaultValue?: number;
  min?: number;
  max?: number;
  id?: string;
  label?: string;
}

const BaseNumberField = ({
  value,
  onChange,
  defaultValue = 0,
  min,
  max,
  id,
  label,
}: BaseNumberFieldProps) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  const handleChange = (val: number | null) => {
    if (val === null) return;

    let clamped = val;
    if (min !== undefined) clamped = Math.max(clamped, min);
    if (max !== undefined) clamped = Math.min(clamped, max);

    onChange(clamped);
  };

  return (
    <div className={styles.Container}>
      {label && <label htmlFor={inputId}>{label}</label>}

      <NumberField.Root
        id={inputId}
        value={value}
        defaultValue={defaultValue}
        className={styles.Field}
      >
        <NumberField.Group className={styles.Group}>
          <NumberField.Decrement
            className={styles.Decrement}
            onClick={() => handleChange((value ?? 0) - 1)}
          >
            <MinusIcon />
          </NumberField.Decrement>

          <NumberField.Input
            className={styles.Input}
            value={value ?? ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange(Number(e.target.value) || 0)
            }
          />

          <NumberField.Increment
            className={styles.Increment}
            onClick={() => handleChange((value ?? 0) + 1)}
          >
            <PlusIcon />
          </NumberField.Increment>
        </NumberField.Group>
      </NumberField.Root>
    </div>
  );
};

export default BaseNumberField;
