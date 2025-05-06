import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import BaseButton from '@components/BaseButton';
import BaseNumberField from '@components/BaseNumberField';
import { saveUserSettings } from '@services/userSettingsService';
import styles from './Settings.module.css';
import theme from '@themes/theme';
import { useUserSettingsStore } from '@store/useUserSettingsStore';

function SettingsPage() {
  const MAX_HOURS = 99;
  const MAX_MINUTES = 59;
  const settings = useUserSettingsStore((state) => state.settings);
  const setSettings = useUserSettingsStore((state) => state.setSettings);

  const getHours = () => {
    const hours = settings ? Math.floor(settings.targetDuration / 3600) : 0;
    return hours;
  };

  const getMinutes = () => {
    const minutes = settings
      ? Math.floor((settings.targetDuration / 60) % 60)
      : 0;
    return minutes;
  };

  const [inputHours, setInputHours] = useState(getHours());
  const [inputMinutes, setInputMinutes] = useState(getMinutes());
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (settings?.targetDuration !== undefined) {
      const total = settings.targetDuration;
      setInputHours(Math.floor(total / 3600));
      setInputMinutes(Math.floor((total % 3600) / 60));
      setDirty(false);
    }
  }, [settings]);

  const handleHoursChange = (val: number | null) => {
    if (val === null) return;
    setInputHours(Math.min(val, MAX_HOURS));
    setDirty(true);
  };

  const handleMinutesChange = (val: number | null) => {
    if (val === null) return;
    setInputMinutes(Math.min(val, MAX_MINUTES));
    setDirty(true);
  };

  const handleSave = async () => {
    const totalSeconds = inputHours * 3600 + inputMinutes * 60;
    setSettings({ targetDuration: totalSeconds });

    try {
      await saveUserSettings();
      setDirty(false);
    } catch (error) {
      console.error('Error saving user settings:', error);
    }
  };

  if (!settings) return <div>Loading...</div>;

  return (
    <Box className={styles.SettingsContainer}>
      <Typography className={styles.SettingsSection} variant="h2">
        Settings
      </Typography>
      <Box className={styles.SettingsContent}>
        <Box className={styles.SettingsSection} mb={2}>
          <Typography variant="h3">Timer</Typography>

          <Box className={styles.SettingsItem}>
            <label>Hours</label>
            <BaseNumberField
              value={inputHours}
              onChange={handleHoursChange}
              min={0}
              max={MAX_HOURS}
            />
          </Box>

          <Box className={styles.SettingsItem}>
            <label>Minutes</label>
            <BaseNumberField
              value={inputMinutes}
              onChange={handleMinutesChange}
              min={0}
              max={MAX_MINUTES}
            />
          </Box>
        </Box>
      </Box>

      <Box className={styles.SaveButtonContainer}>
        <BaseButton
          variant="contained"
          color="primary"
          disabled={!dirty}
          onClick={handleSave}
          fullWidth
        >
          Save
        </BaseButton>
      </Box>
      {/* Bottom Nav Padding */}
      <Box sx={{ paddingBottom: theme.spacing(8) }} />
    </Box>
  );
}

export default SettingsPage;
