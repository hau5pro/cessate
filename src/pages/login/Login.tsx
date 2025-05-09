import BaseButton from '@components/BaseButton';
import Box from '@mui/material/Box';
import { GoogleIcon } from '@components/CustomIcons';
import { motion } from 'framer-motion';
import { signInWithGoogle } from '@services/authService';

const containerVariants = {
  hidden: { scale: 0.9, y: -50, opacity: 0 },
  visible: {
    scale: 1,
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 400, damping: 15 },
  },
};

function LoginPage() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        overflow: 'hidden',
        flexGrow: 1,
        padding: '1rem',
        height: '100%',
      }}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <BaseButton
          startIcon={<GoogleIcon />}
          sx={{ padding: '1rem' }}
          onClick={signInWithGoogle}
        >
          Sign In With Google
        </BaseButton>
      </motion.div>
    </Box>
  );
}

export default LoginPage;
