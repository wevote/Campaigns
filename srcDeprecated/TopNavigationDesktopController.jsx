import loadable from '@loadable/component';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import React, { Component, Suspense } from 'react';
import { renderLog } from '../src/js/common/utils/logging';
import AppObservableStore, { messageService } from '../src/js/common/stores/AppObservableStore';

const TopNavigationDesktop = loadable(() => import('../src/js/components/Navigation/TopNavigationAppBar'));


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
    renderLog('TopNavigationDesktopController');
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

const HeaderBarWrapper = styled('div')(({ theme }) => (`
  align-items: center;
  display: flex;
  height: 48px;
  ${theme.breakpoints.down('md')} { {
    display: none
  }
`));

export default withStyles(styles)(TopNavigationDesktopController);
