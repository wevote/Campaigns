import styled from '@mui/material/styles/styled';

const CampaignSupportDesktopButtonPanel = styled('div')`
  background-color: #fff;
  margin-top: 8px;
`;

const CampaignSupportDesktopButtonWrapper = styled('div')`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const CampaignSupportImageWrapper = styled('div', {
  shouldForwardProp: (prop) => !['borderRadiusOnTop'].includes(prop),
})(({ borderRadiusOnTop, theme }) => (`
  align-items: center;
  background-color: #eee;
  ${borderRadiusOnTop ? `border-radius: ${borderRadiusOnTop} ${borderRadiusOnTop} 0 0;` : 'border-radius: 5px;'}
  display: flex;
  justify-content: center;
  min-height: 324px;
  ${theme.breakpoints.down('md')} {
    min-height: 279px;
  }
  ${theme.breakpoints.down('sm')} {
    min-height: 146px;
  }
`));

const CampaignSupportImageWrapperText = styled('div')`
  color: #ccc;
`;

const CampaignSupportMobileButtonPanel = styled('div')`
  background-color: #fff;
  margin-top: 8px;
`;

const CampaignSupportMobileButtonWrapper = styled('div')`
  display: block;
  width: 100%;
`;

const CampaignSupportSection = styled('div', {
  shouldForwardProp: (prop) => !['marginBottomOff'].includes(prop),
})(({ marginBottomOff }) => (`
  ${marginBottomOff ? '' : 'margin-bottom: 20px !important;'}
  width: 100%;
`));

const CampaignSupportSectionWrapper = styled('div', {
  shouldForwardProp: (prop) => !['marginTopOff'].includes(prop),
})(({ marginTopOff }) => (`
  display: flex;
  justify-content: center;
  ${marginTopOff ? '' : 'margin-top: 20px;'}
  max-width: 620px;
`));

const SkipForNowButtonPanel = styled('div')`
  background-color: #fff;
  margin-top: 40px;
`;

const SkipForNowButtonWrapper = styled('div')`
  display: flex;
  justify-content: center;
  width: 100%;
`;

export {
  CampaignSupportDesktopButtonPanel,
  CampaignSupportDesktopButtonWrapper,
  CampaignSupportImageWrapper,
  CampaignSupportImageWrapperText,
  CampaignSupportMobileButtonPanel,
  CampaignSupportMobileButtonWrapper,
  CampaignSupportSection,
  CampaignSupportSectionWrapper,
  SkipForNowButtonPanel,
  SkipForNowButtonWrapper,
};
