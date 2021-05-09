import styled from 'styled-components';

const CampaignImage = styled.img`
  ${({ noBorderRadius }) => (noBorderRadius ? '' : 'border-radius: 5px;')}
  max-width: 620px;
  min-height: 117px;
  width: 100%;
`;

const CampaignProcessStepIntroductionText = styled.div`
  color: #555;
  font-size: 16px;
  max-width: 620px;
  text-align: left;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 16px;
  }
`;

const CampaignProcessStepTitle = styled.div`
  font-size: 32px;
  font-weight: 600;
  margin: 20px 0 10px 0;
  max-width: 620px;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 22px;
  }
`;

export {
  CampaignImage,
  CampaignProcessStepIntroductionText,
  CampaignProcessStepTitle,
};
