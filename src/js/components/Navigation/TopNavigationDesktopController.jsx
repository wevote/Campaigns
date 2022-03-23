import loadable from '@loadable/component';
import styled from '@mui/material/styles/styled';
import withStyles from '@mui/styles/withStyles';
import React, { Component, Suspense } from 'react';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';

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
    this.onAppObservableStoreChange();
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
  }

  componentWillUnmount () {
    this.appStateSubscription.unsubscribe();
  }

  onAppObservableStoreChange () {
    const siteConfigurationHasBeenRetrieved = AppObservableStore.siteConfigurationHasBeenRetrieved();
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

const HeaderBarWrapper = styled('div')`
  align-items: center;
  display: flex;
  height: 48px;
`;

export default withStyles(styles)(TopNavigationDesktopController);
