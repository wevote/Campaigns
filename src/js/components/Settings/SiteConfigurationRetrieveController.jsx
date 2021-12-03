import React, { Component } from 'react';
import AppObservableStore from '../../stores/AppObservableStore';
import initializejQuery from '../../utils/initializejQuery';
import { renderLog } from '../../common/utils/logging';

class SiteConfigurationRetrieveController extends Component {
  componentDidMount () {
    // console.log('SiteConfigurationRetrieveController componentDidMount');
    this.siteConfigurationFirstRetrieve();
  }

  siteConfigurationFirstRetrieve = () => {
    let { hostname } = window.location;
    hostname = hostname || '';
    // campaigns.wevote.us also referenced in src/App.jsx
    if (hostname !== 'campaigns.wevote.us') {
      initializejQuery(() => {
        const siteConfigurationHasBeenRetrieved = AppObservableStore.siteConfigurationHasBeenRetrieved();
        // console.log('SiteConfigurationRetrieveController siteConfigurationHasBeenRetrieved: ', siteConfigurationHasBeenRetrieved);
        if (!siteConfigurationHasBeenRetrieved) {
          AppObservableStore.siteConfigurationRetrieve(hostname);
        }
      });
    }
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
