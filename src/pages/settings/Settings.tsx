import { AccountCircle, Settings, Timer } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import BaseButton from '@components/BaseButton';
import BaseNumberField from '@components/BaseNumberField';
import BaseTextField from '@components/BaseTextField';
import Loading from '@components/Loading';
import { saveUserSettings } from '@services/userSettingsService';
import { signOut } from '@services/authService';
import styles from './Settings.module.css';
import theme from '@themes/theme';
import { useUserSettingsStore } from '@store/useUserSettingsStore';

function SettingsPage() {
  const MAX_HOURS = 744; // 31 days
  const MAX_MINUTES = 59;
  const settings = useUserSettingsStore((state) => state.settings);
  const updateTargetDuration = useUserSettingsStore(
    (state) => state.updateTargetDuration
  );
  const updateName = useUserSettingsStore((state) => state.updateName);

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
  const [inputName, setInputName] = useState(settings?.name || '');
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (settings !== null) {
      const total = settings.targetDuration;
      setInputHours(Math.floor(total / 3600));
      setInputMinutes(Math.floor((total % 3600) / 60));
      setInputName(settings!.name);
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

  const handleNameChange = (val: string | null) => {
    if (val === null) return;
    setInputName(val);
    setDirty(true);
  };

  const handleSave = async () => {
    updateStores();

    try {
      await saveUserSettings();
      setDirty(false);
    } catch (error) {
      console.error('Error saving user settings:', error);
    }
  };

  const updateStores = () => {
    const totalSeconds = inputHours * 3600 + inputMinutes * 60;
    updateTargetDuration(totalSeconds);
    updateName(inputName);
  };

  if (!settings) return <Loading />;

  return (
    <Box className={styles.SettingsContainer}>
      <Box className={styles.SettingsHeader}>
        <Settings className={styles.MaterialIcon} fontSize="large" />
        <Typography variant="h2">Settings</Typography>
      </Box>

      <Box className={styles.SettingsContent}>
        {/* Timer */}
        <Box className={styles.SettingsSection}>
          <Box className={styles.SectionHeader}>
            <Timer className={styles.MaterialIcon} fontSize="medium" />
            <Typography variant="h3">Timer</Typography>
          </Box>

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
        {/* Account */}
        <Box className={styles.SettingsSection}>
          <Box className={styles.SectionHeader}>
            <AccountCircle className={styles.MaterialIcon} fontSize="medium" />
            <Typography variant="h3">Account</Typography>
          </Box>

          <Box className={styles.SettingsItem}>
            <label>Email</label>
            <Typography sx={{ color: theme.palette.grey[400] }}>
              {settings.email}
            </Typography>
          </Box>

          <Box className={styles.SettingsItem}>
            <label>Name</label>
            <BaseTextField value={inputName} onChange={handleNameChange} />
          </Box>
        </Box>
        {/* Sign Out */}
        <BaseButton
          sx={{ bgcolor: theme.palette.error.main }}
          variant="contained"
          onClick={signOut}
          fullWidth
        >
          Sign Out
        </BaseButton>
      </Box>
      {/* Save */}
      <Box className={styles.ButtonContainer}>
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
    </Box>
  );
}

export default SettingsPage;
