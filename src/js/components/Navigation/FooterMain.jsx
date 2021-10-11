import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import AppStore from '../../stores/AppStore';
import FooterMainWeVote from './FooterMainWeVote';
import FooterMainPrivateLabeled from './FooterMainPrivateLabeled';


class FooterMain extends Component {
  constructor (props) {
    super(props);
    this.state = {
      inPrivateLabelMode: false,
      siteConfigurationHasBeenRetrieved: false,
    };
  }

  componentDidMount () {
    // console.log('HeaderBarLogo componentDidMount');
    this.onAppStoreChange();
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.appStoreListener.remove();
  }

  onAppStoreChange () {
    const inPrivateLabelMode = AppStore.getHideWeVoteLogo(); // Using this setting temporarily
    const siteConfigurationHasBeenRetrieved = AppStore.siteConfigurationHasBeenRetrieved();
    this.setState({
      inPrivateLabelMode,
      siteConfigurationHasBeenRetrieved,
    });
  }

  render () {
    const { displayFooter } = this.props;
    const displayFooterAdjusted = displayFooter !== undefined ? displayFooter : true;
    if (!displayFooterAdjusted) {
      return null;
    }

    const { inPrivateLabelMode, siteConfigurationHasBeenRetrieved } = this.state;
    if (!siteConfigurationHasBeenRetrieved) {
      return null;
    }

    return (
      <OuterWrapper>
        <InnerWrapper>
          {inPrivateLabelMode ? (
            <FooterMainPrivateLabeled />
          ) : (
            <FooterMainWeVote />
          )}
        </InnerWrapper>
      </OuterWrapper>
    );
  }
}
FooterMain.propTypes = {
  displayFooter: PropTypes.bool,
};

const styles = () => ({
});

const InnerWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 960px;
  padding: 30px 0 100px 0;
  @media (max-width: 1005px) {
    // Switch to 15px left/right margin when auto is too small
    margin: 0 15px;
  }
`;

const OuterWrapper = styled.div`
  background-color: #f6f4f6;
  border-top: 1px solid #ddd;
  margin-top: 90px;
  width: 100%;
`;

export default withStyles(styles)(FooterMain);
