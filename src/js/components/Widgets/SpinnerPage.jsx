import React from 'react';
import { CircularProgress } from '@mui/material';
import PropTypes from 'prop-types';
import styled from '@mui/material/styles/styled';


const SpinnerPage = ({ topWords, bottomWords }) => (
  <PageContainer className="page-content-container">
    <TopWords>{topWords}</TopWords>
    <CircularProgress />
    <BottomWords>{bottomWords}</BottomWords>
  </PageContainer>
);

SpinnerPage.propTypes = {
  topWords: PropTypes.string,
  bottomWords: PropTypes.string,
};

const PageContainer = styled('div')`
  padding: 20px;
  text-align: center;
`;

const TopWords = styled('h2')`
  padding: 20px;
`;

const BottomWords = styled('h3')`
  padding: 20px;
`;

export default SpinnerPage;
