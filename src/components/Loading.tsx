import { CircularProgress } from '@mui/material';
import { Fragment } from 'react';
import styles from './Loading.module.css';

interface LoadingProps {
  size?: number;
}

const Loading = ({ size }: LoadingProps) => {
  return (
    <div className={styles.LoadingContainer}>
      <Fragment>
        <svg width={0} height={0}>
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e01cd5" />
              <stop offset="100%" stopColor="#1CB5E0" />
            </linearGradient>
          </defs>
        </svg>
        <CircularProgress
          sx={{ 'svg circle': { stroke: 'url(#gradient)' } }}
          size={size ?? 80}
        />
      </Fragment>
    </div>
  );
};

export default Loading;
