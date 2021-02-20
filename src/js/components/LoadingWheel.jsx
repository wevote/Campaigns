import React from 'react';
import { CircularProgress } from '@material-ui/core';

const LoadingWheel = (
  <>
    <CircularProgress />
    <div className="u-loading-spinner">Loading...</div>
  </>
);

export default LoadingWheel;
