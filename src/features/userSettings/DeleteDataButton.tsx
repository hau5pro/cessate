import { Box, Typography } from '@mui/material';
import { DeletionProgress, deleteAllUserData } from '@services/deletionService';

import BaseButton from '@components/BaseButton';
import { Warning } from '@mui/icons-material';
import globalStyles from '@themes/GlobalStyles.module.css';
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

    setShowDeleteModal(false);
    setDeleteProgress(null);
  };

  return (
    <>
      <BaseButton
        sx={{ bgcolor: theme.palette.error.main }}
        variant="outlined"
        onClick={handleShowDeletionConfirmation}
        fullWidth
      >
        Delete My Data
      </BaseButton>

      {showDeleteModal && (
        <Box className={styles.ModalBackdrop}>
          <Box className={styles.Modal}>
            <Typography variant="h4" mb={2}>
              Deleting Your Data...
            </Typography>
            <Typography variant="body1" mb={2}>
              {deleteProgress
                ? `${deleteProgress.deleted} / ${deleteProgress.total} deleted from ${deleteProgress.collectionPath}`
                : 'Starting...'}
            </Typography>
          </Box>
        </Box>
      )}

      {confirming && (
        <Box className={styles.ConfirmBackdrop}>
          <Box className={styles.ConfirmBox}>
            <Warning className={globalStyles.MaterialIcon} fontSize="large" />
            <Typography variant="h5" mb={2}>
              Are you sure you want to delete all your data?
            </Typography>
            <BaseButton
              sx={{ bgcolor: theme.palette.error.main }}
              onClick={handleConfirmDeletion}
            >
              Yes, Delete Everything
            </BaseButton>
            <BaseButton onClick={handleCancelDeletion}>Cancel</BaseButton>
          </Box>
        </Box>
      )}
    </>
  );
}
