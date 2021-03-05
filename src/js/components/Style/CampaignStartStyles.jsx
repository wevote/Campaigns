import styled from 'styled-components';

const CampaignStartDesktopButtonPanel = styled.div`
  background-color: #fff;
  padding: 10px 0;
  // width: 100%;
`;

const CampaignStartDesktopButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 20px 0 0 0;
  width: 100%;
`;

const CampaignStartMobileButtonPanel = styled.div`
  background-color: #fff;
  border-top: 1px solid #ddd;
  padding: 10px;
`;

const CampaignStartMobileButtonWrapper = styled.div`
  position: fixed;
  width: 100%;
  bottom: 0;
  display: block;
`;

const CampaignStartSection = styled.div`
  margin-bottom: 60px !important;
  max-width: 620px;
  width: 100%;
`;

const CampaignStartSectionWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

export {
  CampaignStartDesktopButtonPanel,
  CampaignStartDesktopButtonWrapper,
  CampaignStartMobileButtonPanel,
  CampaignStartMobileButtonWrapper,
  CampaignStartSection,
  CampaignStartSectionWrapper,
};
