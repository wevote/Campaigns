import React, { Component, Suspense } from 'react';
import loadable from '@loadable/component';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import AppStore from '../../stores/AppStore';

const TopNavigationDesktop = loadable(() => import('./TopNavigationDesktop'));


class TopNavigationDesktopController extends Component {
  constructor (props) {
    super(props);
    this.state = {
      siteConfigurationHasBeenRetrieved: false,
    };
  }

  componentDidMount () {
    // console.log('TopNavigationDesktopController componentDidMount');
    this.onAppStoreChange();
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.appStoreListener.remove();
  }

  onAppStoreChange () {
    const siteConfigurationHasBeenRetrieved = AppStore.siteConfigurationHasBeenRetrieved();
    this.setState({
      siteConfigurationHasBeenRetrieved,
    });
  }

  render () {
    const { siteConfigurationHasBeenRetrieved } = this.state;

    return (
      <HeaderBarWrapper>
        {siteConfigurationHasBeenRetrieved && (
          <Suspense fallback={<span>&nbsp;</span>}>
            <TopNavigationDesktop />
          </Suspense>
        )}
      </HeaderBarWrapper>
    );
  }
}

const styles = () => ({
  logoLinkRoot: {
    height: 0,
    fontSize: 0,
  },
});

const HeaderBarWrapper = styled.div`
  align-items: center;
  display: flex;
  height: 42px;
`;

export default withStyles(styles)(TopNavigationDesktopController);
