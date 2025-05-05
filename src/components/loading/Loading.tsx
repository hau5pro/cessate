import './Loading.css';

import { CircularProgress } from '@mui/material';

const Loading = () => {
  return (
    <div className="loading-container">
      <CircularProgress size={60} />
    </div>
  );
};

export default Loading;
