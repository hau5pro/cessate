import BaseButton from '@components/BaseButton';
import { GoogleIcon } from '@components/CustomIcons';
import { signInWithGoogle } from '@services/authService';

function LoginPage() {
  return (
    <div
      style={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'end',
        padding: '1rem',
        height: '100%',
      }}
    >
      <BaseButton
        startIcon={<GoogleIcon />}
        sx={{ padding: '1rem' }}
        onClick={signInWithGoogle}
      >
        Sign In With Google
      </BaseButton>
    </div>
  );
}

export default LoginPage;
