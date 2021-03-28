import React, { Component } from 'react';
import AppActions from '../../actions/AppActions';
import AppStore from '../../stores/AppStore';
import initializejQuery from '../../utils/initializejQuery';
import { renderLog } from '../../utils/logging';


class SiteConfigurationRetrieveController extends Component {
  componentDidMount () {
    this.siteConfigurationFirstRetrieve();
  }

  siteConfigurationFirstRetrieve = () => {
    initializejQuery(() => {
      const siteConfigurationHasBeenRetrieved = AppStore.siteConfigurationHasBeenRetrieved();
      // console.log('SiteConfigurationRetrieveController voterFirstRetrieveInitiated: ', voterFirstRetrieveInitiated);
      if (!siteConfigurationHasBeenRetrieved) {
        let { hostname } = window.location;
        hostname = hostname || '';
        AppActions.siteConfigurationRetrieve(hostname);
      }
    });
  }

  render () {
    renderLog('SiteConfigurationRetrieveController');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('SiteConfigurationRetrieveController');

    return (
      <span />
    );
  }
}

export default SiteConfigurationRetrieveController;
