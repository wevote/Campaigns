import React, { Component } from 'react';
import AppActions from '../../actions/AppActions';
import AppStore from '../../stores/AppStore';
import VoterActions from '../../actions/VoterActions';
import { renderLog } from '../../utils/logging';
import SignInModal from './SignInModal';
import initializejQuery from '../../utils/initializejQuery';


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
    initializejQuery(() => {
      VoterActions.voterRetrieve();
      // console.log('SignInModalController, componentDidMount voterRetrieve fired ');
    });
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

