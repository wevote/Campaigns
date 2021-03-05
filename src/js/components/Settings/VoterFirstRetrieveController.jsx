import React, { Component } from 'react';
import AppActions from '../../actions/AppActions';
import AppStore from '../../stores/AppStore';
import initializejQuery from '../../utils/initializejQuery';
import { renderLog } from '../../utils/logging';
import VoterActions from '../../actions/VoterActions';


class VoterFirstRetrieveController extends Component {
  componentDidMount () {
    this.voterFirstRetrieve();
  }

  voterFirstRetrieve = () => {
    initializejQuery(() => {
      const voterFirstRetrieveInitiated = AppStore.voterFirstRetrieveInitiated();
      // console.log('VoterFirstRetrieveController voterFirstRetrieveInitiated: ', voterFirstRetrieveInitiated);
      if (!voterFirstRetrieveInitiated) {
        AppActions.setVoterFirstRetrieveInitiated(true);
        VoterActions.voterRetrieve();
      }
    });
  }

  render () {
    renderLog('VoterFirstRetrieveController');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('VoterFirstRetrieveController');

    return (
      <span>&nbsp;</span>
    );
  }
}

export default VoterFirstRetrieveController;
