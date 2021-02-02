import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import CampaignHeader from '../components/Navigation/CampaignHeader';
import CampaignPhoto from '../../img/global/photos/SamDavisFamily2020-800x450.jpg';
import { renderLog } from '../utils/logging';
import { isCordova } from '../utils/cordovaUtils';
import SupportButtonFooter from '../components/Campaign/SupportButtonFooter';


class CampaignHomePage extends Component {
  static getProps () {
    return {};
  }

  render () {
    renderLog('CampaignHomePage');  // Set LOG_RENDER_EVENTS to log all renders
    if (isCordova()) {
      console.log(`CampaignHomePage window.location.href: ${window.location.href}`);
    }
    // const { classes } = this.props;
    return (
      <div>
        <Helmet title="Campaign Home - We Vote Campaigns" />
        <Wrapper cordova={isCordova()}>
          <CampaignHeader />
          <DetailsSectionMobile className="u-show-mobile">
            <CampaignImageWrapper>
              <CampaignImage src={CampaignPhoto} alt="Campaign" />
            </CampaignImageWrapper>
            <CampaignTitleAndScoreBar>
              <CampaignTitle>Build a Stronger Wisconsin</CampaignTitle>
            </CampaignTitleAndScoreBar>
            <CampaignDescriptionWrapper>
              <CampaignDescription>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur a arcu dui. Suspendisse sagittis lacus sit amet egestas ultricies. Fusce suscipit ac nisi vel malesuada. Etiam semper placerat enim, sed sollicitudin justo condimentum sed. Proin convallis ipsum eu quam porta, ut bibendum metus rutrum. Maecenas sed felis vel erat fermentum scelerisque id et lectus. Quisque erat magna, dignissim eget metus eget, convallis commodo risus. Proin mattis ante lacus, non placerat orci aliquet eleifend. Morbi accumsan tempor placerat. Nulla suscipit velit quis congue ornare. Vestibulum ipsum ipsum, tempor eu interdum non, dapibus et ex. Sed non auctor velit, at euismod dolor. Etiam enim diam, pellentesque vitae scelerisque suscipit, pharetra id ex. Pellentesque porta hendrerit blandit.
                <br />
                <br />
                Etiam consectetur orci ac dui rhoncus sodales. Sed lectus neque, tincidunt vitae purus sit amet, malesuada dignissim augue. Nulla id gravida nisi, a convallis lectus. Etiam non erat a velit lacinia pellentesque id ut tortor. Morbi pulvinar id augue quis accumsan. Ut ut nisi in ante tristique maximus sed at nunc. Fusce faucibus eros vel ipsum sollicitudin, et consectetur elit hendrerit. Aenean venenatis eleifend eros, at mollis erat interdum a. Maecenas blandit orci sit amet mauris imperdiet, non mattis ex eleifend. Maecenas vehicula maximus est vitae tincidunt. Sed porta porttitor enim quis consequat.
              </CampaignDescription>
            </CampaignDescriptionWrapper>
            <SupportButtonFooter />
          </DetailsSectionMobile>
          <DetailsSectionDesktopTablet className="u-show-desktop-tablet">
            Hello Tablet
          </DetailsSectionDesktopTablet>
        </Wrapper>
      </div>
    );
  }
}
CampaignHomePage.propTypes = {
  // classes: PropTypes.object,
};

const Wrapper = styled.div`
  margin: 0 15px;
  @media (max-width: ${({ theme, cordova }) => (cordova ? undefined : theme.breakpoints.md)}) {
    margin: 0;
  }
`;

const DetailsSectionDesktopTablet = styled.div`
  display: flex;
  flex-flow: column;
  // 1/2/2021, invalid css: align-items: left;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
  }
`;

const DetailsSectionMobile = styled.div`
  display: flex;
  flex-flow: column;
  align-items: left;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
  }
`;

const CampaignImageWrapper = styled.div`
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
  }
`;

const CampaignImage = styled.img`
  width: 100%;
`;

const CampaignTitleAndScoreBar = styled.div`
  margin: 10px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
  }
`;

const CampaignTitle = styled.h3`
  font-size: 24px;
  text-align: center;
  margin: 0;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 18px;
    text-align: left;
  }
`;

const CampaignDescription = styled.div`
  font-size: 15px;
  text-align: left;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
  }
`;

const CampaignDescriptionWrapper = styled.div`
  margin: 10px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
  }
`;

const styles = () => ({
  buttonRoot: {
    width: 250,
  },
});

export default withStyles(styles)(CampaignHomePage);
