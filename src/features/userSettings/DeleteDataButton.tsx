import { AnimatePresence, motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';
import { CheckIcon, DeleteIcon, WarningIcon } from '@components/CustomIcons';
import { DeletionProgress, deleteAllUserData } from '@services/deletionService';

import BaseButton from '@components/BaseButton';
import globalStyles from '@themes/GlobalStyles.module.css';
import { signOut } from '@services/authService';
import styles from './DeleteDataButton.module.css';
import theme from '@themes/theme';
import { useState } from 'react';

type Props = {
  userId?: string;
};

export default function DeleteDataButton({ userId }: Props) {
  const [confirming, setConfirming] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteProgress, setDeleteProgress] = useState<DeletionProgress | null>(
    null
  );
  const [deletionDone, setDeletionDone] = useState(false);

  const handleShowDeletionConfirmation = () => {
    setConfirming(true);
  };

  const handleCancelDeletion = () => {
    setConfirming(false);
  };

  const handleConfirmDeletion = async () => {
    if (!userId) return;

    setConfirming(false);
    setShowDeleteModal(true);

    await deleteAllUserData(userId, (progress) => {
      setDeleteProgress(progress);
    });

    setDeleteProgress(null);
    setDeletionDone(true);
  };

  const handleCompleteDeletion = async () => {
    setShowDeleteModal(false);
    setDeletionDone(false);
    await signOut();
  };

  return (
    <>
      <BaseButton
        sx={{ bgcolor: theme.palette.error.main }}
        variant="outlined"
        onClick={handleShowDeletionConfirmation}
        fullWidth
      >
        <Box className={styles.Button}>
          <DeleteIcon fontSize="small" className={globalStyles.MaterialIcon} />
          <span> Delete My Data</span>
        </Box>
      </BaseButton>

      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            className={styles.ModalBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={styles.Modal}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              {!deletionDone ? (
                <>
                  <Typography variant="h5" mb={2}>
                    Deleting Your Data
                  </Typography>
                  <Typography
                    variant="body1"
                    mb={2}
                    sx={{
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word',
                      maxWidth: '100%',
                    }}
                  >
                    {deleteProgress
                      ? `${deleteProgress.deleted} / ${deleteProgress.total} deleted from ${deleteProgress.collectionPath}`
                      : 'Starting'}
                  </Typography>
                </>
              ) : (
                <>
                  <CheckIcon
                    className={globalStyles.MaterialIcon}
                    fontSize="large"
                    sx={{ color: theme.palette.success.main }}
                  />
                  <Typography variant="h5" mb={2}>
                    Deletion Complete
                  </Typography>
                  <BaseButton
                    variant="contained"
                    color="success"
                    onClick={handleCompleteDeletion}
                  >
                    OK
                  </BaseButton>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirming && (
          <motion.div
            className={styles.ConfirmBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={styles.ConfirmBox}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.3 }}
            >
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                }}
              >
                <WarningIcon
                  className={globalStyles.MaterialIcon}
                  fontSize="large"
                  sx={{ color: theme.palette.warning.main }}
                />
                <Typography variant="h5">
                  Are you sure you want to delete all your data?
                </Typography>
              </Box>

              <Box
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  gap: 5,
                  justifyContent: 'space-evenly',
                }}
              >
                <BaseButton
                  sx={{ bgcolor: theme.palette.error.main }}
                  onClick={handleConfirmDeletion}
                >
                  <Typography variant="body1">Yes</Typography>
                </BaseButton>
                <BaseButton onClick={handleCancelDeletion}>
                  <Typography variant="body1">Cancel</Typography>
                </BaseButton>
              </Box>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
