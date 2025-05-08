import { AccountCircle, Settings, Timer } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import BaseButton from '@components/BaseButton';
import BaseNumberField from '@components/BaseNumberField';
import BaseTextField from '@components/BaseTextField';
import Loading from '@components/Loading';
import globalStyles from '@/App.module.css';
import { motion } from 'framer-motion';
import { saveUserSettings } from '@services/userSettingsService';
import { signOut } from '@services/authService';
import styles from './Settings.module.css';
import theme from '@themes/theme';
import { useUserSettingsStore } from '@store/useUserSettingsStore';

const sectionVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: 'easeOut' },
  }),
};

const MotionSection = ({
  children,
  index,
  className,
}: {
  children: React.ReactNode;
  index: number;
  className?: string;
}) => (
  <motion.div
    className={className}
    variants={sectionVariants}
    initial="hidden"
    animate="visible"
    custom={index}
  >
    {children}
  </motion.div>
);

function SettingsPage() {
  const MAX_HOURS = 744; // 31 days
  const MAX_MINUTES = 59;
  const settings = useUserSettingsStore((state) => state.settings);
  const updateTargetDuration = useUserSettingsStore(
    (state) => state.updateTargetDuration
  );
  const updateName = useUserSettingsStore((state) => state.updateName);

  const getHours = () => {
    return settings ? Math.floor(settings.targetDuration / 3600) : 0;
  };

  const getMinutes = () => {
    return settings ? Math.floor((settings.targetDuration / 60) % 60) : 0;
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

  if (!settings)
    return (
      <Box className={styles.LoadingContainer}>
        <Loading />
      </Box>
    );

  return (
    <Box className={styles.SettingsContainer}>
      {/* Animated Header */}
      <MotionSection className={globalStyles.Header} index={0}>
        <Settings className={globalStyles.MaterialIcon} fontSize="large" />
        <Typography variant="h2">Settings</Typography>
      </MotionSection>

      <Box className={styles.SettingsContent}>
        <MotionSection index={1} className={styles.SettingsSection}>
          <Box className={styles.SectionHeader}>
            <Timer className={globalStyles.MaterialIcon} fontSize="medium" />
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
        </MotionSection>

        <MotionSection index={2} className={styles.SettingsSection}>
          <Box className={styles.SectionHeader}>
            <AccountCircle
              className={globalStyles.MaterialIcon}
              fontSize="medium"
            />
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
        </MotionSection>

        <MotionSection index={3}>
          <BaseButton
            sx={{ bgcolor: theme.palette.error.main }}
            variant="contained"
            onClick={signOut}
            fullWidth
          >
            Sign Out
          </BaseButton>
        </MotionSection>
      </Box>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className={styles.ButtonContainer}
      >
        <BaseButton
          variant="contained"
          color="primary"
          disabled={!dirty}
          onClick={handleSave}
          fullWidth
        >
          Save
        </BaseButton>
      </motion.div>
    </Box>
  );
}

export default SettingsPage;
