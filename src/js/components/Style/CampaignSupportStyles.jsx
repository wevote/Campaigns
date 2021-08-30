import styled from 'styled-components';

const CampaignSupportDesktopButtonPanel = styled.div`
  background-color: #fff;
  margin-top: 8px;
`;

const CampaignSupportDesktopButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const CampaignSupportImageWrapper = styled.div`
  align-items: center;
  background-color: #eee;
  ${({ borderRadiusOnTop }) => (borderRadiusOnTop ? `border-radius: ${borderRadiusOnTop} ${borderRadiusOnTop} 0 0;` : 'border-radius: 5px;')}
  display: flex;
  justify-content: center;
  min-height: 324px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    min-height: 279px;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    min-height: 146px;
  }
`;

const CampaignSupportImageWrapperText = styled.div`
  color: #ccc;
`;

const CampaignSupportMobileButtonPanel = styled.div`
  background-color: #fff;
  margin-top: 8px;
`;

const CampaignSupportMobileButtonWrapper = styled.div`
  display: block;
  width: 100%;
`;

const CampaignSupportSection = styled.div`
  ${({ marginBottomOff }) => (marginBottomOff ? '' : 'margin-bottom: 20px !important;')}
  width: 100%;
`;

const CampaignSupportSectionWrapper = styled.div`
  display: flex;
  justify-content: center;
  ${({ marginTopOff }) => (marginTopOff ? '' : 'margin-top: 20px;')}
  max-width: 620px;
`;

const SkipForNowButtonPanel = styled.div`
  background-color: #fff;
  margin-top: 40px;
`;

const SkipForNowButtonWrapper = styled.div`
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
