import React, { Component } from 'react';
import AppActions from '../../actions/AppActions';
import AppStore from '../../stores/AppStore';
import initializejQuery from '../../utils/initializejQuery';
import { renderLog } from '../../utils/logging';
import SignInModal from './SignInModal';
import VoterActions from '../../actions/VoterActions';


class SignInModalController extends Component {
  constructor (props) {
    super(props);
    this.state = {
      showSignInModal: false,
    };
  }

  componentDidMount () {
    const showSignInModal = AppStore.showSignInModal();
    this.appStoreListener = AppStore.addListener(this.onAppStoreChange.bind(this));
    this.voterFirstRetrieve();
    // this.start = window.performance.now();
    this.setState({ showSignInModal });
  }

  componentWillUnmount () {
    this.appStoreListener.remove();
  }

  onAppStoreChange () {
    const showSignInModal = AppStore.showSignInModal();
    // console.log('SignInModalController onAppStoreChange, showSignInModal:', showSignInModal);
    this.setState({ showSignInModal });
  }

  closeSignInModal = () => {
    AppActions.setShowSignInModal(false);
    // console.log('closeSignInModal');
    this.setState({ showSignInModal: false });
  };

  voterFirstRetrieve = () => {
    initializejQuery(() => {
      const voterFirstRetrieveInitiated = AppStore.voterFirstRetrieveInitiated();
      // console.log('SignInModalController voterFirstRetrieveInitiated: ', voterFirstRetrieveInitiated);
      if (!voterFirstRetrieveInitiated) {
        AppActions.setVoterFirstRetrieveInitiated(true);
        VoterActions.voterRetrieve();
      }
    });
  }

  render () {
    renderLog('SignInModalController');  // Set LOG_RENDER_EVENTS to log all renders
    const { showSignInModal } = this.state;
    // console.log('SignInModalController showSignInModal at render: ', showSignInModal);

    return (
      <div>
        {showSignInModal ? <SignInModal show={showSignInModal} closeFunction={this.closeSignInModal} /> : null}
      </div>
    );
  }
}

export default SignInModalController;

