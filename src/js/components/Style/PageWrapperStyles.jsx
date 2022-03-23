import styled from '@mui/material/styles/styled';


const ContentInnerWrapperDefault = styled('div')`
`;

const ContentOuterWrapperDefault = styled('div')`
  display: flex;
  justify-content: center;
  margin: 15px 0;
`;

const PageWrapperDefault = styled('div')`
  margin: 0 auto;
  max-width: 960px;
  @media (max-width: 1005px) {
    // Switch to 15px left/right margin when auto is too small
    margin: 0 15px;
  }
`;

export {
  ContentInnerWrapperDefault,
  ContentOuterWrapperDefault,
  PageWrapperDefault,
};
