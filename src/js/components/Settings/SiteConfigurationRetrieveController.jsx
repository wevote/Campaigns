import React, { Component } from 'react';
import AppActions from '../../actions/AppActions';
import AppStore from '../../stores/AppStore';
import initializejQuery from '../../utils/initializejQuery';
import { renderLog } from '../../utils/logging';

class SiteConfigurationRetrieveController extends Component {
  componentDidMount () {
    console.log('SiteConfigurationRetrieveController componentDidMount');
    this.siteConfigurationFirstRetrieve();
  }

  siteConfigurationFirstRetrieve = () => {
    let { hostname } = window.location;
    hostname = hostname || '';
    // campaigns.wevote.us also referenced in src/App.jsx
    if (hostname !== 'campaigns.wevote.us') {
      initializejQuery(() => {
        const siteConfigurationHasBeenRetrieved = AppStore.siteConfigurationHasBeenRetrieved();
        // console.log('SiteConfigurationRetrieveController voterFirstRetrieveInitiated: ', voterFirstRetrieveInitiated);
        if (!siteConfigurationHasBeenRetrieved) {
          AppActions.siteConfigurationRetrieve(hostname);
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
